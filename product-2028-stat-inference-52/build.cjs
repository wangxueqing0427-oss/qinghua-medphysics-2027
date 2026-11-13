'use strict';
// V10 independent nonproduction candidate: add statistics-inference foundations to exact frozen V9.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const source=path.join(__dirname,'../product-2028-radiotherapy-51/.build'),out=path.join(__dirname,'.build');
const oldReceipt=require('../product-2028-radiotherapy-51/build-receipt.json');
const draft=require('../product-2028-stat-inference-foundation/unit.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Expected unique V9 anchor: '+a);return s.replace(a,b);};
assert.equal(oldReceipt.edition,'qh2028-radiotherapy-51-v9');
assert.equal(oldReceipt.courses,51);
assert.equal(oldReceipt.questions,572);
assert.equal(oldReceipt.independentProfessionalApprovals,0);
assert.equal(oldReceipt.formalReleaseApproved,false);
assert.equal(draft.units.length,1);
const novel=draft.units[0];
assert.equal(novel.id,'353-inference-ci-hypothesis-foundation');
assert.equal(novel.distribution,'held-pending-review');
assert.equal(novel.reviewRecord.expertApproved,false);
assert.equal(novel.reviewRecord.publicRelease,false);
const oldBytes=fs.readFileSync(path.join(source,'representative-courses.json'));
assert.equal(hash(oldBytes),oldReceipt.finalContentHash,'Frozen V9 51-course content drift');
const old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(old.units.length,51);
const pack={...old,contentVersion:'qh2028-stat-inference-52-v10-internal-draft',units:[...old.units,novel]};
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'),'Formal release must stay blocked');
assert.equal(pack.units.length,52);
assert.equal(pack.units.filter(u=>u.subject==='353').length,23);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),584);
assert(!pack.units.some(u=>u.reviewRecord?.expertApproved===true));
const edition='qh2028-stat-inference-52-v10',
 db='qh2028_stat_inference_52_v10_local',journal='qh2028_stat_inference_52_v10_pending:',
 cache='qh2028-stat-inference-52-v10';
assert.notEqual(db,oldReceipt.db);
const expected=oldReceipt.files.map(x=>x.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected V10 output directory');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of oldReceipt.files){
 const raw=fs.readFileSync(path.join(source,f.path));
 assert.equal(hash(raw),f.sha256,'Protected V9 asset drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(f.path==='profile-repository.js')
  s=once(s,"const DRAFT_DB='qh2028_radiotherapy_51_v9_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=once(s,"const EDITION='qh2028-radiotherapy-51-v9';","const EDITION='"+edition+"';");
  s=once(s,"const JOURNAL='qh2028_radiotherapy_51_v9_pending:';","const JOURNAL='"+journal+"';");
  s=once(s,"'qinghua-2028-radiotherapy-51-v9-backup.json'","'qinghua-2028-stat-inference-52-v10-backup.json'");
  s=once(s,'51课572题手机学习台 · 放疗物理 V9','52课584题手机学习台 · 统计推断 V10');
 }
 if(f.path==='mock-engine.js'){
  s=once(s,'pack?.units?.length===51','pack?.units?.length===52');
  s=once(s,'frozen 51-course internal draft','frozen 52-course internal draft');
  s=s.replaceAll("'v9-internal-only'","'v10-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('51课','52课');
 if(f.path==='index.html')s=s.replaceAll('51课572题放疗物理内测 V9','52课584题统计推断内测 V10');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科备考｜统计推断V10独立内测',short_name:'2028统计V10',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=once(s,"const CACHE='qh2028-radiotherapy-51-v9';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),target=path.join(out,f.path);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(bytes),'V10 existing asset conflict: '+f.path);
 else fs.writeFileSync(target,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:hash(bytes),priorSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const finalBytes=fs.readFileSync(path.join(out,'representative-courses.json'));
const receipt={edition,courses:52,questions:584,subjects:{en:15,pol:14,'353':23},
 addedUnit:novel.id,previousCourseCount:51,previousQuestionCount:572,
 previousContentHash:oldReceipt.finalContentHash,finalContentHash:hash(finalBytes),
 db,journal,cache,files,independentProfessionalApprovals:0,
 fullOfficial2028SyllabusVerified:false,formalReleaseApproved:false,deployed:false,realIPhoneTest:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:52,questions:584,addedUnit:novel.id,priorCoursesUnchanged:true,formalRelease:false}));
