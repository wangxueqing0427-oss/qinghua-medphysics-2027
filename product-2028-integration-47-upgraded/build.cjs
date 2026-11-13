'use strict';
// ENGINEERING ONLY: package existing 47 drafts plus the six-question SVO update.
// No modifications to SET47, active SVO, R2, V59 or real learner data.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),src=path.join(root,'product-2028-integration-47/.build'),out=path.join(__dirname,'.build');
const baseline=require('../product-2028-integration-47/build-manifest.json');
const original=require('../product-2028-integration-47/.build/representative-courses.json');
const nextSvo=require('../product-2028-svo-subjective-candidate/course.json').units[0];
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
function once(s,a,b){assert.equal(s.split(a).length,2,'Required unique patch anchor missing: '+a);return s.replace(a,b);}
assert.equal(baseline.units,47);
assert.equal(baseline.questions,523);
assert.equal(original.units.length,47);
const prev=original.units.find(u=>u.id===nextSvo.id);
assert(prev&&prev.version!==nextSvo.version,'Require a different SVO course version');
assert.equal(prev.basicQuestions.length+prev.applicationQuestions.length+prev.delayedQuestions.length,5);
assert.equal(nextSvo.basicQuestions.length+nextSvo.applicationQuestions.length+nextSvo.delayedQuestions.length,6);
assert.deepEqual(nextSvo.basicQuestions,prev.basicQuestions);
assert.deepEqual(nextSvo.applicationQuestions.map(q=>({id:q.id,type:q.type,stem:q.stem})),prev.applicationQuestions.map(q=>({id:q.id,type:q.type,stem:q.stem})),'Preserve the original application question identity and prompt; documented clarification of its reference answer and rubric belongs to the new version');
assert.deepEqual(nextSvo.delayedQuestions.slice(0,2),prev.delayedQuestions);
assert.equal(nextSvo.delayedQuestions[2].id,'en-svo-delay-3');
const pack={...original,contentVersion:'set47-plus-svo6-2026-11-12-internal-draft',units:original.units.map(u=>u.id===nextSvo.id?nextSvo:u)};
assert.equal(pack.units.length,47);
assert.equal(pack.units.filter(u=>u.id===nextSvo.id).length,1);
const questions=pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0);
assert.equal(questions,524);
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'),'Formal release must remain blocked');
assert(pack.units.every(u=>u.distribution==='held-pending-review'&&u.reviewRecord?.expertApproved!==true),'Do not release unreviewed drafts');
assert.deepEqual(pack.units.filter(u=>u.id!==nextSvo.id),original.units.filter(u=>u.id!==nextSvo.id),'All original 46 units must remain byte-equivalent as JSON');
const sva=pack.units.find(u=>u.id==='en-subject-verb-agreement');
assert.deepEqual(sva.prerequisites,['en-foundation-svo']);
const edition='qh2028-set47-svo6-research-1',db='qh2028_set47_svo6_research_v1',
 journal='qh2028_set47_svo6_pending_v1:',cache='qh2028-set47-svo6-research-v1';
assert.notEqual(db,baseline.database);
const names=baseline.files.map(f=>f.path),targetFiles=[...names,'sva-prerequisite.js'];
assert.equal(names.length,10);
assert.deepEqual(names,['index.html','app.css','icon.svg','manifest.json','course-engine.js','profile-repository.js','learning-controller.js','pilot-ui.js','representative-courses.json','sw.js']);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),targetFiles.slice().sort(),'Refuse unexpected output-file overwrite');
fs.mkdirSync(out,{recursive:true});
const built=[];
for(const item of baseline.files){
 const input=fs.readFileSync(path.join(src,item.path));
 assert.equal(digest(input),item.sha256,'SET47 baseline not frozen: '+item.path);
 let s=input.toString('utf8');
 if(item.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(item.path==='course-engine.js')s=fs.readFileSync(path.join(root,'product-2028-svo-subjective-candidate/course-engine.cjs'),'utf8');
 if(item.path==='profile-repository.js')s=once(s,"const DRAFT_DB='qh2028_isolated_set47_v1';","const DRAFT_DB='"+db+"';");
 if(item.path==='learning-controller.js'){
   const a="function prerequisiteStatus(unit,backup){const missing=";
   const b="const SVA_PREFLIGHT_SVO="+JSON.stringify(nextSvo)+";\nfunction prerequisiteStatus(unit,backup){if(unit.id==='en-subject-verb-agreement'){const g=SvaPrerequisite.checkSvaPrerequisite(backup,SVA_PREFLIGHT_SVO,unit);return {ready:g.ready,missing:g.ready?[]:['en-foundation-svo'],preflightReason:g.reason,mastered:false};}const missing=";
   s=once(s,a,b);
 }
 if(item.path==='pilot-ui.js'){
   s=once(s,"'use strict';\n","'use strict';\nconst EDITION='"+edition+"';\n");
   s=once(s,"const JOURNAL='qh2028_set47_pending_v1:';","const JOURNAL='"+journal+"';");
   s=once(s,"await repository.createProfile(crypto.randomUUID(),{displayName:document.getElementById('name').value||'新学习档案'})",
     "await repository.createProfile(crypto.randomUUID(),{candidateEdition:EDITION,displayName:document.getElementById('name').value||'新学习档案'})");
   s=once(s,"profile=await repository.restoreAsNewProfile(crypto.randomUUID(),JSON.parse(await file.text()));await enter();",
     "const backup=JSON.parse(await file.text());if(backup.profile?.settings?.candidateEdition!==EDITION)throw Error('只能恢复本隔离候选的备份；原有旧数据应留在原版本');profile=await repository.restoreAsNewProfile(crypto.randomUUID(),backup);await enter();");
   s=once(s,"47课隔离验证 SET47","47课524题内部整合 SET47-SVO6");
   s=once(s,"'needs-review':'需要复习'","'needs-review':'客观题需要复习','subjective-pending':'主观题待核对'");
   s=once(s,"'qinghua-2028-local-backup.json'","'qinghua-2028-set47-svo6-backup.json'");
   s=once(s,"+'</p></details>'+pack.units.map(u=>{const s=",
     "+'</p></details>'+'<label>按科目筛选<select id=\"subject-filter\"><option value=\"all\">全部课程</option><option value=\"en\">英语</option><option value=\"pol\">政治</option><option value=\"353\">353卫生综合</option></select></label>'+pack.units.map(u=>{const s=");
   s=once(s,"return '<section class=\"card\"><h2>'+esc(u.title)","return '<section class=\"card\" data-subject=\"'+esc(u.subject)+'\"><h2>'+esc(u.title)");
   s=once(s,"app.querySelectorAll('[data-unit]').forEach(b=>b.onclick=",
     "document.getElementById('subject-filter').onchange=e=>{for(const card of app.querySelectorAll('[data-subject]'))card.hidden=e.target.value!=='all'&&card.dataset.subject!==e.target.value;};app.querySelectorAll('[data-unit]').forEach(b=>b.onclick=");
 }
 if(item.path==='index.html'){
   s=s.replaceAll('2028备考47课隔离验证 SET47','47课524题整合预检 SET47-SVO6 · 非正式课程版');
   s=once(s,'<script src="learning-controller.js"></script>','<script src="sva-prerequisite.js"></script><script src="learning-controller.js"></script>');
 }
 if(item.path==='manifest.json'){
   const m=JSON.parse(s);Object.assign(m,{name:'清华2028 · 47课524题内部整合测试',short_name:'SET47-SVO6',id:'./?edition='+edition});
   s=JSON.stringify(m);
 }
 if(item.path==='sw.js'){
   assert(/qh2028-isolated-set47-[a-f0-9]{12}/.test(s),'Unexpected SET47 SW baseline');
   s=s.replace(/qh2028-isolated-set47-[a-f0-9]{12}/,cache);
   s=once(s,"'./learning-controller.js'","'./sva-prerequisite.js','./learning-controller.js'");
 }
 const target=path.join(out,item.path),bytes=Buffer.from(s);
 if(fs.existsSync(target))assert.equal(digest(fs.readFileSync(target)),digest(bytes),'Refuse altered build file: '+item.path);
 else fs.writeFileSync(target,bytes,{flag:'wx'});
 built.push({path:item.path,sha256:digest(bytes),priorSha256:item.sha256,changed:digest(bytes)!==item.sha256});
}
const guardFile=fs.readFileSync(path.join(root,'product-2028-sva-preflight/guard.cjs'));
assert(guardFile.toString('utf8').includes('window.SvaPrerequisite'));
const guardTarget=path.join(out,'sva-prerequisite.js');
if(fs.existsSync(guardTarget))assert.equal(digest(fs.readFileSync(guardTarget)),digest(guardFile));
else fs.writeFileSync(guardTarget,guardFile,{flag:'wx'});
built.push({path:'sva-prerequisite.js',sha256:digest(guardFile),changed:true});
assert.deepEqual(fs.readdirSync(out).sort(),targetFiles.slice().sort());
const receipt={purpose:'47-course engineering integration; no publication approval',courses:47,questions:524,addedSvoDelayedSubjective:1,unchangedOriginalUnits:46,edition,db,journal,cache,professionalApprovals:0,releaseApproved:false,usesRealLearningData:false,deployed:false,files:built};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({built:true,courses:47,questions:524,changedAssets:built.filter(f=>f.changed).map(f=>f.path),released:false,deployed:false}));


// Only for the explicitly isolated UX V2 branch preview. This project is NOT a
// formal release: keep source/base outputs byte-for-byte unchanged on all
// other branches (including the existing core47 production branch and main).
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-mobile-ux-v2'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  const sourceV2=path.join(__dirname,'../product-2028-mobile-ux-v2/.build');
  const newReceipt=require('../product-2028-mobile-ux-v2/build-receipt.json');
  assert.equal(newReceipt.edition,'qh2028-mobile-ux-v2');
  assert.equal(newReceipt.courses,47);
  assert.equal(newReceipt.questions,524);
  for(const file of newReceipt.files){
    const content=fs.readFileSync(path.join(sourceV2,file.path));
    assert.equal(digest(content),file.sha256,'V2 source file changed after QA: '+file.path);
    fs.writeFileSync(path.join(out,file.path),content);
  }
  assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('mobile-ux.js'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('mobile-ux.js'));
  console.log('Isolated Pages preview uses mobile UX V2 assets; original branches unaffected');
}


// Select V3 only for its own independent Cloudflare Pages preview branch.
// The Pages production branch, main and previously deployed V2 remain unchanged.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-mobile-reading-v3'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  const dirV3=path.join(__dirname,'../product-2028-mobile-reading-v3/.build');
  const v3=require('../product-2028-mobile-reading-v3/build-receipt.json');
  assert.equal(v3.edition,'qh2028-mobile-reading-v3');
  assert.equal(v3.courses,47);
  assert.equal(v3.questions,524);
  assert.equal(v3.formalReleaseApproved,false);
  for(const file of v3.files){
    assert(!file.path.includes('..')&&!path.isAbsolute(file.path));
    const input=fs.readFileSync(path.join(dirV3,file.path));
    assert.equal(digest(input),file.sha256,'V3 output digest mismatch: '+file.path);
    fs.writeFileSync(path.join(out,file.path),input);
  }
  assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('mobile-reading.js'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('mobile-reading.js'));
  console.log('Cloudflare Pages preview branch uses V3 reading and English speech assets; other branches unchanged');
}


// Publish ONLY the private-to-this-branch unapproved V4 Pages preview.
// main, R2, V59, the production core47 and prior V2/V3 branches retain their outputs.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-reading-fullpassage-v4'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  const v4Source=path.join(__dirname,'../product-2028-reading-v4/.build');
  const v4=require('../product-2028-reading-v4/build-receipt.json');
  assert.equal(v4.edition,'qh2028-reading-fullpassage-v4');
  assert.equal(v4.courses,47);
  assert.equal(v4.questions,524);
  assert.equal(v4.professionalApprovals,0);
  assert.equal(v4.formalReleaseApproved,false);
  for(const item of v4.files){
    assert(!item.path.includes('..')&&!path.isAbsolute(item.path));
    const input=fs.readFileSync(path.join(v4Source,item.path));
    assert.equal(digest(input),item.sha256,'V4 output integrity failure: '+item.path);
    fs.writeFileSync(path.join(out,item.path),input);
  }
  assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('reading-passage.js'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('reading-passage.js'));
  console.log('Cloudflare Pages V4 full passage branch preview assets ready; all previous branches unchanged');
}


// Isolated V5 diagnostic mini-test Pages preview only.
// Never change the core47 production branch, earlier previews, main or real learner data.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-diagnostic-exam-v5'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  const v5Dir=path.join(__dirname,'../product-2028-diagnostic-v5/.build');
  const v5=require('../product-2028-diagnostic-v5/build-receipt.json');
  assert.equal(v5.edition,'qh2028-diagnostic-mini-v5');
  assert.equal(v5.courses,47);
  assert.equal(v5.questions,524);
  assert.equal(v5.formalReleaseApproved,false);
  assert.equal(v5.expertApprovals,0);
  for(const file of v5.files){
    assert(!file.path.includes('..')&&!path.isAbsolute(file.path),'Unsafe candidate asset path');
    const bytes=fs.readFileSync(path.join(v5Dir,file.path));
    assert.equal(digest(bytes),file.sha256,'V5 candidate asset mismatch: '+file.path);
    fs.writeFileSync(path.join(out,file.path),bytes);
  }
  const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
  const serviceWorker=fs.readFileSync(path.join(out,'sw.js'),'utf8');
  assert(html.includes('mock-engine.js')&&html.includes('mock-ui.js'));
  assert(serviceWorker.includes('mock-engine.js')&&serviceWorker.includes('mock-ui.js'));
  console.log('Cloudflare Pages V5 internal diagnostic preview configured; all previous branches unchanged');
}


// New independent 48-course screening PREVIEW branch only. No production release.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-353-screening-foundation'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  const v6=require('../product-2028-screening-48/build-receipt.json');
  const from=path.join(__dirname,'../product-2028-screening-48/.build');
  assert.equal(v6.edition,'qh2028-screening-48-v6');
  assert.equal(v6.courses,48);
  assert.equal(v6.questions,536);
  assert.equal(v6.independentProfessionalApprovals,0);
  assert.equal(v6.formalReleaseApproved,false);
  for(const item of v6.files){
    assert(!item.path.includes('..')&&!path.isAbsolute(item.path));
    const bytes=fs.readFileSync(path.join(from,item.path));
    assert.equal(digest(bytes),item.sha256,'V6 byte mismatch: '+item.path);
    fs.writeFileSync(path.join(out,item.path),bytes);
  }
  const p=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(p.units.length,48);
  assert.equal(p.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),536);
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-screening-48-v6'));
  console.log('Independent V6 screening branch preview ready; all earlier branches and real profiles unchanged');
}


// V7 49-course radiation protection prototype: branch preview only.
// This is a separately named Cloudflare Pages branch, never the 47-course default,
// V5/V6 preview, R2/V59 or user learning database.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-353-radiation-protection-v7'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  const receipt=require('../product-2028-radiation-49/build-receipt.json');
  const origin=path.join(__dirname,'../product-2028-radiation-49/.build');
  assert.equal(receipt.edition,'qh2028-radiation-49-v7');
  assert.equal(receipt.courses,49);
  assert.equal(receipt.questions,548);
  assert.equal(receipt.independentProfessionalApprovals,0);
  assert.equal(receipt.formalReleaseApproved,false);
  for(const file of receipt.files){
    assert(!file.path.includes('..')&&!path.isAbsolute(file.path),'Unsafe output path');
    const bytes=fs.readFileSync(path.join(origin,file.path));
    assert.equal(digest(bytes),file.sha256,'V7 candidate asset changed: '+file.path);
    fs.writeFileSync(path.join(out,file.path),bytes);
  }
  const pack=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(pack.units.length,49);
  assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),548);
  assert(pack.units.some(u=>u.id==='353-radiation-protection-foundation'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-radiation-49-v7'));
  console.log('Independent V7 radiation branch preview ready; no existing course, prior branch or user data modified');
}


// Independent V8 nuclear imaging branch preview only, with separate learner data.
// No change to main, default 47-course preview, older V5-V7 branches, or V59/R2.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-353-nuclear-imaging-v8'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  require('../product-2028-nuclear-50/build.cjs');
  const receipt=require('../product-2028-nuclear-50/build-receipt.json');
  const v8Dir=path.join(__dirname,'../product-2028-nuclear-50/.build');
  assert.equal(receipt.edition,'qh2028-nuclear-50-v8');
  assert.equal(receipt.courses,50);
  assert.equal(receipt.questions,560);
  assert.equal(receipt.independentProfessionalApprovals,0);
  assert.equal(receipt.formalReleaseApproved,false);
  for(const f of receipt.files){
    assert(!f.path.includes('..')&&!path.isAbsolute(f.path),'Unsafe V8 file path');
    const bytes=fs.readFileSync(path.join(v8Dir,f.path));
    assert.equal(digest(bytes),f.sha256,'V8 asset integrity mismatch: '+f.path);
    fs.writeFileSync(path.join(out,f.path),bytes);
  }
  const p=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(p.units.length,50);
  assert.equal(p.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),560);
  assert(p.units.some(u=>u.id==='353-nuclear-imaging-foundation'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-nuclear-50-v8'));
  console.log('Independent V8 nuclear imaging branch preview ready; no existing app, content branch or learner data modified');
}


// Independent 51-course RT V9 PREVIEW only; previous versions and local profiles untouched.
// This branch is not main and has no relation to formal 2028 syllabus or expert sign-off.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-353-radiotherapy-v9'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  require('../product-2028-nuclear-50/build.cjs');
  require('../product-2028-radiotherapy-51/build.cjs');
  const receipt=require('../product-2028-radiotherapy-51/build-receipt.json');
  const v9Dir=path.join(__dirname,'../product-2028-radiotherapy-51/.build');
  assert.equal(receipt.edition,'qh2028-radiotherapy-51-v9');
  assert.equal(receipt.courses,51);
  assert.equal(receipt.questions,572);
  assert.equal(receipt.independentProfessionalApprovals,0);
  assert.equal(receipt.formalReleaseApproved,false);
  for(const item of receipt.files){
    assert(!item.path.includes('..')&&!path.isAbsolute(item.path));
    const input=fs.readFileSync(path.join(v9Dir,item.path));
    assert.equal(digest(input),item.sha256,'V9 asset checksum mismatch: '+item.path);
    fs.writeFileSync(path.join(out,item.path),input);
  }
  const p=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(p.units.length,51);
  assert.equal(p.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),572);
  assert(p.units.some(u=>u.id==='353-radiotherapy-physics-foundation'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-radiotherapy-51-v9'));
  console.log('Independent V9 radiotherapy branch preview ready; no previous site, official app or user data changed');
}


// Independent V10 statistics inference PREVIEW only: 52 courses, separate learner records.
// Does not modify main, V5-V9 branches, V59/R2, official release or prior local data.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-353-stat-inference-v10'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  require('../product-2028-nuclear-50/build.cjs');
  require('../product-2028-radiotherapy-51/build.cjs');
  require('../product-2028-stat-inference-52/build.cjs');
  const receipt=require('../product-2028-stat-inference-52/build-receipt.json');
  const folder=path.join(__dirname,'../product-2028-stat-inference-52/.build');
  assert.equal(receipt.edition,'qh2028-stat-inference-52-v10');
  assert.equal(receipt.courses,52);
  assert.equal(receipt.questions,584);
  assert.equal(receipt.independentProfessionalApprovals,0);
  assert.equal(receipt.formalReleaseApproved,false);
  for(const f of receipt.files){
    assert(!f.path.includes('..')&&!path.isAbsolute(f.path),'Unsafe V10 output path');
    const bytes=fs.readFileSync(path.join(folder,f.path));
    assert.equal(digest(bytes),f.sha256,'V10 asset drift: '+f.path);
    fs.writeFileSync(path.join(out,f.path),bytes);
  }
  const p=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(p.units.length,52);
  assert.equal(p.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),584);
  assert(p.units.some(u=>u.id==='353-inference-ci-hypothesis-foundation'));
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-stat-inference-52-v10'));
  console.log('Independent V10 statistics inference branch preview ready; no prior app, branch or data modified');
}


// Independent V11 explicit progress migration branch preview: NO curriculum changes.
// V10 source profile, V5–V9 previews, V59/R2 and main remain untouched.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-v11-safe-progress-migration'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  require('../product-2028-nuclear-50/build.cjs');
  require('../product-2028-radiotherapy-51/build.cjs');
  require('../product-2028-stat-inference-52/build.cjs');
  require('../product-2028-progress-v11/build.cjs');
  const receipt=require('../product-2028-progress-v11/build-receipt.json');
  const source=path.join(__dirname,'../product-2028-progress-v11/.build');
  assert.equal(receipt.edition,'qh2028-progress-safe-v11');
  assert.equal(receipt.courses,52);
  assert.equal(receipt.questions,584);
  assert.equal(receipt.noCurriculumChanges,true);
  assert.equal(receipt.crossVersionMigrationOneHopOnly,true);
  assert.equal(receipt.formalReleaseApproved,false);
  for(const file of receipt.files){
    assert(!file.path.includes('..')&&!path.isAbsolute(file.path),'Unsafe migration file path');
    const bytes=fs.readFileSync(path.join(source,file.path));
    assert.equal(digest(bytes),file.sha256,'V11 preview asset checksum mismatch: '+file.path);
    fs.writeFileSync(path.join(out,file.path),bytes);
  }
  const pack=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(pack.units.length,52);
  assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),584);
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-progress-safe-v11'));
  assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('migration-bridge.js'));
  console.log('Independent V11 explicit migration branch preview ready; V10 old learner data and all existing versions untouched');
}


// Independent V12 additive progress migration branch preview, never the production app.
// The 52 inherited lessons are cryptographically pinned; one original draft t-test unit is added.
// No old V11 learner profile is automatically imported, no prior site data is overwritten.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-v12-additive-progress-t'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  require('../product-2028-nuclear-50/build.cjs');
  require('../product-2028-radiotherapy-51/build.cjs');
  require('../product-2028-stat-inference-52/build.cjs');
  require('../product-2028-progress-v11/build.cjs');
  require('../product-2028-v12-additive/build.cjs');
  const r=require('../product-2028-v12-additive/build-receipt.json');
  const folder=path.join(__dirname,'../product-2028-v12-additive/.build');
  assert.equal(r.edition,'qh2028-t-additive-v12');
  assert.equal(r.courses,53);
  assert.equal(r.questions,596);
  assert.equal(r.legacy52CourseContentIdentical,true);
  assert.equal(r.newCourses,1);
  assert.equal(r.migrationOptIn,true);
  assert.equal(r.independentProfessionalApprovals,0);
  assert.equal(r.formalReleaseApproved,false);
  for(const file of r.files){
    assert(!file.path.includes('..')&&!path.isAbsolute(file.path),'Unsafe V12 preview path');
    const data=fs.readFileSync(path.join(folder,file.path));
    assert.equal(digest(data),file.sha256,'V12 preview file checksum mismatch: '+file.path);
    fs.writeFileSync(path.join(out,file.path),data);
  }
  const lessons=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(lessons.units.length,53);
  assert.equal(lessons.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),596);
  assert.equal(lessons.units[52].id,'353-t-tests-paired-independent-foundation');
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-t-additive-v12'));
  assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('migration-bridge.js'));
  console.log('V12 isolated 53-course additive migration preview ready; no historical V11 or main data changed');
}


// Independent V13 outbreak additive branch preview: 54 courses, consent-only V12 history.
// No merges into main, no edits to original V59/R2, previous previews or learner records.
if(process.env.CF_PAGES_BRANCH==='candidate/2026-11-13-v13-outbreak-additive'){
  require('../product-2028-mobile-ux-v2/build.cjs');
  require('../product-2028-mobile-reading-v3/build.cjs');
  require('../product-2028-reading-v4/build.cjs');
  require('../product-2028-diagnostic-v5/build.cjs');
  require('../product-2028-screening-48/build.cjs');
  require('../product-2028-radiation-49/build.cjs');
  require('../product-2028-nuclear-50/build.cjs');
  require('../product-2028-radiotherapy-51/build.cjs');
  require('../product-2028-stat-inference-52/build.cjs');
  require('../product-2028-progress-v11/build.cjs');
  require('../product-2028-v12-additive/build.cjs');
  require('../product-2028-v13-additive/build.cjs');
  const receipt=require('../product-2028-v13-additive/build-receipt.json');
  const origin=path.join(__dirname,'../product-2028-v13-additive/.build');
  assert.equal(receipt.edition,'qh2028-outbreak-54-v13');
  assert.equal(receipt.courses,54);
  assert.equal(receipt.questions,608);
  assert.equal(receipt.legacy53CourseContentIdentical,true);
  assert.equal(receipt.newCourses,1);
  assert.equal(receipt.migrationOptIn,true);
  assert.equal(receipt.independentProfessionalApprovals,0);
  assert.equal(receipt.formalReleaseApproved,false);
  for(const f of receipt.files){
    assert(!f.path.includes('..')&&!path.isAbsolute(f.path),'Unsafe V13 candidate path');
    const bytes=fs.readFileSync(path.join(origin,f.path));
    assert.equal(digest(bytes),f.sha256,'V13 output integrity failed: '+f.path);
    fs.writeFileSync(path.join(out,f.path),bytes);
  }
  const all=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
  assert.equal(all.units.length,54);
  assert.equal(all.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),608);
  assert.equal(all.units[53].id,'353-outbreak-investigation-foundation');
  assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes('qh2028-outbreak-54-v13'));
  assert(fs.readFileSync(path.join(out,'index.html'),'utf8').includes('migration-bridge.js'));
  console.log('Independent V13 outbreak 54-course preview ready; old V12 progress and official main unchanged');
}
