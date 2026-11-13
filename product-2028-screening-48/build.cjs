'use strict';
// Isolated 48-course internal PREVIEW: adds only the original source-linked screening draft.
// All 47 inherited courses, question keys and learning databases stay untouched.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const dir=__dirname,source=path.join(dir,'../product-2028-diagnostic-v5/.build'),out=path.join(dir,'.build');
const prior=require('../product-2028-diagnostic-v5/build-receipt.json');
const novel=require('../product-2028-screening-foundation/unit.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Expected unique patch anchor: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-diagnostic-mini-v5');
assert.equal(prior.courses,47);assert.equal(prior.questions,524);
assert.equal(prior.expertApprovals,0);assert.equal(prior.formalReleaseApproved,false);
assert.equal(novel.units.length,1);
const newUnit=novel.units[0];
assert.equal(newUnit.id,'353-screening-test-foundation');
assert.equal(newUnit.reviewRecord.expertApproved,false);
assert.equal(newUnit.distribution,'held-pending-review');
const original=fs.readFileSync(path.join(source,'representative-courses.json'));
assert.equal(hash(original),prior.contentHash,'Original 47-course catalog was modified');
const originalPack=JSON.parse(original.toString('utf8'));
assert.equal(originalPack.units.length,47);
const merged={...originalPack,contentVersion:'qh2028-screening-48-internal-draft',
  units:[...originalPack.units,newUnit]};
assert.deepEqual(E.validate(merged),[]);
assert.deepEqual(validateObjectives(merged),[]);
assert(E.validate(merged,true).includes('release-blocked'),'Formal release must remain blocked');
assert.equal(merged.units.length,48);
assert.equal(merged.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),536);
assert.equal(merged.units.filter(u=>u.subject==='353').length,19);
assert(!merged.units.some(u=>u.reviewRecord?.expertApproved===true));
const edition='qh2028-screening-48-v6',db='qh2028_screening_48_v6_local',
 journal='qh2028_screening_48_v6_pending:',cache='qh2028-screening-48-v6';
assert.notEqual(db,prior.db);
const expected=prior.files.map(f=>f.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected old output directory');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const content=fs.readFileSync(path.join(source,f.path));
 assert.equal(hash(content),f.sha256,'Protected source bytes changed: '+f.path);
 let s=content.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(merged,null,2);
 if(f.path==='profile-repository.js')s=once(s,
  "const DRAFT_DB='qh2028_diagnostic_mini_v5';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=once(s,"const EDITION='qh2028-diagnostic-mini-v5';","const EDITION='"+edition+"';");
  s=once(s,"const JOURNAL='qh2028_diagnostic_mini_v5_pending:';","const JOURNAL='"+journal+"';");
  s=once(s,"'qinghua-2028-diagnostic-mini-v5-backup.json'","'qinghua-2028-screening-48-v6-backup.json'");
  s=once(s,"47课524题手机学习台 · 诊断 V5","48课536题手机学习台 · 筛检 V6");
 }
 if(f.path==='mock-engine.js'){
  s=once(s,"pack?.units?.length===47","pack?.units?.length===48");
  s=once(s,"frozen 47-course draft","frozen 48-course internal draft");
  s=s.replaceAll("'v5-internal-only'","'v6-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('47课','48课');
 if(f.path==='index.html')s=s.replaceAll('47课524题诊断小测内测 V5','48课536题筛检补课内测 V6');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);Object.assign(m,{name:'清华2028三科学习台｜筛检补课内测V6',short_name:'2028筛检V6',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=once(s,"const CACHE='qh2028-diagnostic-mini-v5';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),target=path.join(out,f.path);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(bytes),'Unsafe preexisting output drift: '+f.path);
 else fs.writeFileSync(target,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:hash(bytes),priorSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const receipt={edition,courses:48,questions:536,subjects:{en:15,pol:14,'353':19},
  newDraftId:newUnit.id,previousCourseCount:47,previousQuestionCount:524,previousCourseDigest:prior.contentHash,
  totalContentDigest:hash(Buffer.from(JSON.stringify(merged,null,2))),db,journal,cache,files,
  independentProfessionalApprovals:0,fullOfficial2028SyllabusVerified:false,
  formalReleaseApproved:false,deployed:false,realIPhoneTest:false};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courseCount:48,questions:536,newUnit:newUnit.id,
 unchangedPriorCourseCount:47,formalReleaseApproved:false,deployed:false}));
