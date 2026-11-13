'use strict';
// Isolated V9: new original radiotherapy foundation appended to V8, never rewriting prior data.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const from=path.join(__dirname,'../product-2028-nuclear-50/.build'),out=path.join(__dirname,'.build');
const prior=require('../product-2028-nuclear-50/build-receipt.json');
const draft=require('../product-2028-radiotherapy-foundation/unit.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function one(s,a,b){assert.equal(s.split(a).length,2,'Wrong patch anchor: '+a);return s.replace(a,b);}
assert.equal(prior.edition,'qh2028-nuclear-50-v8');
assert.equal(prior.courses,50);assert.equal(prior.questions,560);
assert.equal(prior.independentProfessionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
assert.equal(draft.units.length,1);
const novel=draft.units[0];
assert.equal(novel.id,'353-radiotherapy-physics-foundation');
assert.equal(novel.reviewRecord.expertApproved,false);
assert.equal(novel.distribution,'held-pending-review');
const oldBytes=fs.readFileSync(path.join(from,'representative-courses.json'));
assert.equal(hash(oldBytes),prior.finalContentHash,'V8 50-course content drift');
const old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(old.units.length,50);
const pack={...old,contentVersion:'qh2028-radiotherapy-51-v9-internal-draft',units:[...old.units,novel]};
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'));
assert.equal(pack.units.length,51);
assert.equal(pack.units.filter(u=>u.subject==='353').length,22);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),572);
assert(pack.units.every(u=>u.reviewRecord?.expertApproved!==true));
const edition='qh2028-radiotherapy-51-v9',db='qh2028_radiotherapy_51_v9_local',
 journal='qh2028_radiotherapy_51_v9_pending:',cache='qh2028-radiotherapy-51-v9';
assert.notEqual(db,prior.db);
const expected=prior.files.map(f=>f.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Existing V9 output differs');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(from,f.path));
 assert.equal(hash(raw),f.sha256,'Original V8 file changed: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(f.path==='profile-repository.js')
  s=one(s,"const DRAFT_DB='qh2028_nuclear_50_v8_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=one(s,"const EDITION='qh2028-nuclear-50-v8';","const EDITION='"+edition+"';");
  s=one(s,"const JOURNAL='qh2028_nuclear_50_v8_pending:';","const JOURNAL='"+journal+"';");
  s=one(s,"'qinghua-2028-nuclear-50-v8-backup.json'","'qinghua-2028-radiotherapy-51-v9-backup.json'");
  s=one(s,'50课560题手机学习台 · 核医学影像 V8','51课572题手机学习台 · 放疗物理 V9');
 }
 if(f.path==='mock-engine.js'){
  s=one(s,'pack?.units?.length===50','pack?.units?.length===51');
  s=one(s,'frozen 50-course internal draft','frozen 51-course internal draft');
  s=s.replaceAll("'v8-internal-only'","'v9-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('50课','51课');
 if(f.path==='index.html')s=s.replaceAll('50课560题核医学影像内测 V8','51课572题放疗物理内测 V9');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科备考｜放疗物理V9独立内测',short_name:'2028放疗V9',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=one(s,"const CACHE='qh2028-nuclear-50-v8';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(hash(fs.readFileSync(dest)),hash(bytes),'Unexpected V9 asset: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:hash(bytes),priorSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const finalBytes=fs.readFileSync(path.join(out,'representative-courses.json'));
const receipt={edition,courses:51,questions:572,subjects:{en:15,pol:14,'353':22},
 addedUnit:novel.id,previousCourseCount:50,previousQuestionCount:560,
 previousContentHash:prior.finalContentHash,finalContentHash:hash(finalBytes),
 db,journal,cache,files,independentProfessionalApprovals:0,
 fullOfficial2028SyllabusVerified:false,formalReleaseApproved:false,deployed:false,realIPhoneTest:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:51,questions:572,added:novel.id,priorContentUnchanged:true,formalRelease:false}));
