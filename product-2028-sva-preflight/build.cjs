'use strict';
// Builds an INTERNAL research-only two-course UI from the *already isolated* SVO candidate.
// Cloudflare's current Pages build command does NOT run this file.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,root=path.resolve(dir,'..');
const source=path.join(root,'product-2028-svo-subjective-candidate/.build');
const out=path.join(dir,'.build');
const prior=require('../product-2028-svo-subjective-candidate/build-receipt.json');
const sPack=require('../product-2028-svo-subjective-candidate/course.json');
const vPack=require('../product-2028-draft/course-drafts/en-subject-verb-agreement/unit.json');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,from,to)=>{assert.equal(s.split(from).length,2,'Patch anchor differs: '+from);return s.replace(from,to);};
const pack={schemaVersion:1,contentVersion:'svo-sva-preflight-v1-unapproved',units:[...sPack.units,...vPack.units]};
assert.equal(pack.units.length,2);
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert.equal(pack.units[0].id,'en-foundation-svo');
assert.equal(pack.units[1].id,'en-subject-verb-agreement');
assert.deepEqual(pack.units[1].prerequisites,[pack.units[0].id]);
assert.equal(pack.units[1].distribution,'held-pending-review');
assert.equal(pack.units[1].reviewRecord.expertApproved,false);
assert.equal(prior.courses,1);
assert.equal(prior.questions,6);
const names=prior.files.map(e=>e.path);
assert.equal(names.length,10);
const edition='qh2028-svo-sva-preflight-v1';
const db='qh2028_svo_sva_preflight_v1',journal='qh2028_svo_sva_preflight_v1_pending:';
const worker='svo-sva-preflight-v1',cache='qh2028-svo-sva-preflight-v1';
assert.notEqual(db,prior.database);
const files=[];
const expected=[...names,'sva-prerequisite.js'];
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Build output differs; refuse overwrite');
fs.mkdirSync(out,{recursive:true});
for(const entry of prior.files){
  const b=fs.readFileSync(path.join(source,entry.path));
  assert.equal(hash(b),entry.sha256,'Original isolated SVO output changed: '+entry.path);
  let s=b.toString('utf8');
  if(entry.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
  if(entry.path==='profile-repository.js')
    s=once(s,"const DRAFT_DB='qh2028_svo_subjective_local1';","const DRAFT_DB='"+db+"';");
  if(entry.path==='pilot-ui.js'){
    s=once(s,"const EDITION='qh2028-svo-subjective-local1';","const EDITION='"+edition+"';");
    s=once(s,"const JOURNAL='qh2028_svo_subjective_local1_pending:';","const JOURNAL='"+journal+"';");
    s=s.replaceAll('1课6题','2课18题').replaceAll('SVO主观延迟题独立候选','SVO与主谓一致内部候选');
    s=s.replaceAll('qinghua-2028-svo-subjective-local1-backup.json','qinghua-2028-svo-sva-preflight-backup.json');
  }
  if(entry.path==='index.html'){
    s=s.replaceAll('SVO主观题独立本地候选 · 非正式版','两课内部预检 · 未经专业审定 · 非正式版');
    s=s.replaceAll('SVO主观候选','两课内部预检');
    s=once(s,"'svo-subjective-local1'","'"+worker+"'");
    s=once(s,'<script src="learning-controller.js"></script>','<script src="sva-prerequisite.js"></script><script src="learning-controller.js"></script>');
  }
  if(entry.path==='manifest.json'){
    const m=JSON.parse(s);Object.assign(m,{name:'2028英语两课内部预检',short_name:'SVO+主谓一致',id:'./?edition='+edition});s=JSON.stringify(m);
  }
  if(entry.path==='sw.js'){
    s=once(s,"const VERSION='svo-subjective-local1',CACHE='qh2028-svo-subjective-local1';","const VERSION='"+worker+"',CACHE='"+cache+"';");
    s=once(s,"'profile-repository.js','learning-controller.js'","'profile-repository.js','sva-prerequisite.js','learning-controller.js'");
  }
  if(entry.path==='learning-controller.js'){
    const anchor="function prerequisiteStatus(unit,backup){const missing=";
    const supplement="const SVA_PREFLIGHT_SVO="+JSON.stringify(pack.units[0])+";\n"+
      "function prerequisiteStatus(unit,backup){if(unit.id==='en-subject-verb-agreement'){"+
      "const g=SvaPrerequisite.checkSvaPrerequisite(backup,SVA_PREFLIGHT_SVO,unit);"+
      "return {ready:g.ready,missing:g.ready?[]:['en-foundation-svo'],preflightReason:g.reason,mastered:false};}const missing=";
    s=once(s,anchor,supplement);
  }
  const output=Buffer.from(s);
  const target=path.join(out,entry.path);
  if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(output),'Refuse altered output overwrite');
  else fs.writeFileSync(target,output,{flag:'wx'});
  files.push({path:entry.path,sha256:hash(output),sourceSha256:entry.sha256,changed:hash(output)!==entry.sha256});
}
const g=fs.readFileSync(path.join(dir,'guard.cjs'),'utf8');
const buf=Buffer.from(g),target=path.join(out,'sva-prerequisite.js');
if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(buf),'Guard output changed');
else fs.writeFileSync(target,buf,{flag:'wx'});
files.push({path:'sva-prerequisite.js',sha256:hash(buf),changed:true});
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const receipt={candidate:'SVO-SVA-RESEARCH-LOCAL1',edition,db,journal,worker,cache,courses:2,questions:18,professionalReviews:0,distribution:'internal-only',deployed:false,originalR2Changed:false,originalActiveSVOChanged:false,files};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({candidate:receipt.candidate,files:files.length,courses:2,questions:18,deployed:false,originalActiveSVOChanged:false}));
