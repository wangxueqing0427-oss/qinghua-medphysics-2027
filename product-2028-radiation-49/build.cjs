'use strict';
// New isolated 49-course prototype; original V6, V59, R2, main and learner stores are untouched.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const dir=__dirname,source=path.join(dir,'../product-2028-screening-48/.build'),out=path.join(dir,'.build');
const prior=require('../product-2028-screening-48/build-receipt.json');
const additions=require('../product-2028-radiation-foundation/unit.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function once(s,oldPart,newPart){
 assert.equal(s.split(oldPart).length,2,'Expected exactly one patch anchor: '+oldPart);
 return s.replace(oldPart,newPart);
}
assert.equal(prior.edition,'qh2028-screening-48-v6');
assert.equal(prior.courses,48);
assert.equal(prior.questions,536);
assert.equal(prior.formalReleaseApproved,false);
assert.equal(prior.independentProfessionalApprovals,0);
assert.equal(additions.units.length,1);
const novel=additions.units[0];
assert.equal(novel.id,'353-radiation-protection-foundation');
assert.equal(novel.distribution,'held-pending-review');
assert.equal(novel.reviewRecord.expertApproved,false);
assert.equal(novel.reviewRecord.publicRelease,false);
const oldBytes=fs.readFileSync(path.join(source,'representative-courses.json'));
assert.equal(sha(oldBytes),prior.totalContentDigest,'Original 48-course study content changed');
const pack=JSON.parse(oldBytes.toString('utf8'));
assert.equal(pack.units.length,48);
const expanded={...pack,contentVersion:'qh2028-radiation-protection-v7-internal-draft',
 units:[...pack.units,novel]};
assert.deepEqual(E.validate(expanded),[]);
assert.deepEqual(validateObjectives(expanded),[]);
assert(E.validate(expanded,true).includes('release-blocked'),'Formal release still blocked');
assert.equal(expanded.units.length,49);
assert.equal(expanded.units.filter(u=>u.subject==='353').length,20);
assert.equal(expanded.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),548);
assert(expanded.units.every(u=>u.reviewRecord?.expertApproved!==true));
const edition='qh2028-radiation-49-v7',db='qh2028_radiation_49_v7_local',
 journal='qh2028_radiation_49_v7_pending:',cache='qh2028-radiation-49-v7';
assert.notEqual(db,prior.db);
const expected=prior.files.map(f=>f.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Conflicting old generated output');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const file of prior.files){
 const raw=fs.readFileSync(path.join(source,file.path));
 assert.equal(sha(raw),file.sha256,'Protected V6 file drift: '+file.path);
 let s=raw.toString('utf8');
 if(file.path==='representative-courses.json')s=JSON.stringify(expanded,null,2);
 if(file.path==='profile-repository.js')
  s=once(s,"const DRAFT_DB='qh2028_screening_48_v6_local';","const DRAFT_DB='"+db+"';");
 if(file.path==='pilot-ui.js'){
  s=once(s,"const EDITION='qh2028-screening-48-v6';","const EDITION='"+edition+"';");
  s=once(s,"const JOURNAL='qh2028_screening_48_v6_pending:';","const JOURNAL='"+journal+"';");
  s=once(s,"'qinghua-2028-screening-48-v6-backup.json'","'qinghua-2028-radiation-49-v7-backup.json'");
  s=once(s,"48课536题手机学习台 · 筛检 V6","49课548题手机学习台 · 辐射防护 V7");
 }
 if(file.path==='mock-engine.js'){
  s=once(s,"pack?.units?.length===48","pack?.units?.length===49");
  s=once(s,"frozen 48-course internal draft","frozen 49-course internal draft");
  s=s.replaceAll("'v6-internal-only'","'v7-internal-only'");
 }
 if(file.path==='mock-ui.js')s=s.replaceAll('48课','49课');
 if(file.path==='index.html')s=s.replaceAll('48课536题筛检补课内测 V6','49课548题辐射防护内测 V7');
 if(file.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科手机学习台｜辐射防护V7内部预览',
   short_name:'2028辐射V7',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(file.path==='sw.js')s=once(s,"const CACHE='qh2028-screening-48-v6';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),target=path.join(out,file.path);
 if(fs.existsSync(target))assert.equal(sha(fs.readFileSync(target)),sha(bytes),'Existing output drift: '+file.path);
 else fs.writeFileSync(target,bytes,{flag:'wx'});
 files.push({path:file.path,sha256:sha(bytes),priorSha256:file.sha256,changed:sha(bytes)!==file.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const finalBytes=fs.readFileSync(path.join(out,'representative-courses.json'));
const receipt={edition,courses:49,questions:548,subjects:{en:15,pol:14,'353':20},
 addedUnit:novel.id,previousCourseCount:48,previousQuestionCount:536,
 previousContentHash:prior.totalContentDigest,finalContentHash:sha(finalBytes),
 db,journal,cache,independentProfessionalApprovals:0,fullOfficial2028SyllabusVerified:false,
 formalReleaseApproved:false,deployed:false,realIPhoneTest:false,files};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:49,questions:548,addedUnit:novel.id,priorCoursesUnchanged:true,fullRelease:false}));
