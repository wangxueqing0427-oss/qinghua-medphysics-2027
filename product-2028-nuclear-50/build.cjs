'use strict';
// V8 isolated research preview; all existing 49 lesson bytes and learning stores remain unchanged.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const source=path.join(__dirname,'../product-2028-radiation-49/.build'),
 out=path.join(__dirname,'.build');
const prior=require('../product-2028-radiation-49/build-receipt.json');
const addition=require('../product-2028-nuclear-imaging-foundation/unit.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function one(s,oldPart,newPart){assert.equal(s.split(oldPart).length,2,'Expected one anchor: '+oldPart);return s.replace(oldPart,newPart);}
assert.equal(prior.edition,'qh2028-radiation-49-v7');
assert.equal(prior.courses,49);
assert.equal(prior.questions,548);
assert.equal(prior.independentProfessionalApprovals,0);
assert.equal(prior.formalReleaseApproved,false);
assert.equal(addition.units.length,1);
const newUnit=addition.units[0];
assert.equal(newUnit.id,'353-nuclear-imaging-foundation');
assert.equal(newUnit.reviewRecord.expertApproved,false);
assert.equal(newUnit.reviewRecord.publicRelease,false);
assert.equal(newUnit.distribution,'held-pending-review');
const baseBytes=fs.readFileSync(path.join(source,'representative-courses.json'));
assert.equal(sha(baseBytes),prior.finalContentHash,'Previous 49-course source unexpectedly changed');
const original=JSON.parse(baseBytes.toString('utf8'));
assert.equal(original.units.length,49);
const merged={...original,contentVersion:'qh2028-nuclear-imaging-50-v8-internal-draft',
  units:[...original.units,newUnit]};
assert.deepEqual(E.validate(merged),[]);
assert.deepEqual(validateObjectives(merged),[]);
assert(E.validate(merged,true).includes('release-blocked'));
assert.equal(merged.units.length,50);
assert.equal(merged.units.filter(u=>u.subject==='353').length,21);
assert.equal(merged.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),560);
assert(!merged.units.some(u=>u.reviewRecord?.expertApproved===true));
const edition='qh2028-nuclear-50-v8',db='qh2028_nuclear_50_v8_local',
 journal='qh2028_nuclear_50_v8_pending:',cache='qh2028-nuclear-50-v8';
assert.notEqual(db,prior.db);
const expected=prior.files.map(f=>f.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected previous output state');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(source,f.path));
 assert.equal(sha(raw),f.sha256,'Frozen previous candidate file drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(merged,null,2);
 if(f.path==='profile-repository.js')
  s=one(s,"const DRAFT_DB='qh2028_radiation_49_v7_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=one(s,"const EDITION='qh2028-radiation-49-v7';","const EDITION='"+edition+"';");
  s=one(s,"const JOURNAL='qh2028_radiation_49_v7_pending:';","const JOURNAL='"+journal+"';");
  s=one(s,"'qinghua-2028-radiation-49-v7-backup.json'","'qinghua-2028-nuclear-50-v8-backup.json'");
  s=one(s,'49课548题手机学习台 · 辐射防护 V7','50课560题手机学习台 · 核医学影像 V8');
 }
 if(f.path==='mock-engine.js'){
  s=one(s,'pack?.units?.length===49','pack?.units?.length===50');
  s=one(s,'frozen 49-course internal draft','frozen 50-course internal draft');
  s=s.replaceAll("'v7-internal-only'","'v8-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('49课','50课');
 if(f.path==='index.html')s=s.replaceAll('49课548题辐射防护内测 V7','50课560题核医学影像内测 V8');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科备考｜核医学影像V8独立内测',short_name:'2028核医V8',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=one(s,"const CACHE='qh2028-radiation-49-v7';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),sha(bytes),'Unmatched V8 preexisting output: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:sha(bytes),priorSha256:f.sha256,changed:sha(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const finalBytes=fs.readFileSync(path.join(out,'representative-courses.json'));
const receipt={edition,courses:50,questions:560,subjects:{en:15,pol:14,'353':21},
 addedUnit:newUnit.id,previousCourseCount:49,previousQuestionCount:548,
 previousContentHash:prior.finalContentHash,finalContentHash:sha(finalBytes),
 db,journal,cache,files,independentProfessionalApprovals:0,
 fullOfficial2028SyllabusVerified:false,formalReleaseApproved:false,deployed:false,realIPhoneTest:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:50,questions:560,newUnit:newUnit.id,oldContentUnchanged:true,release:false}));
