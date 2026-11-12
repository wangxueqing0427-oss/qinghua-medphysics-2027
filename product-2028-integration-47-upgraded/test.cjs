'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const dir=__dirname;
const receipt=require('./build-receipt.json');
const pack=require('./.build/representative-courses.json');
const source=require('../product-2028-integration-47/.build/representative-courses.json');
const svo=require('../product-2028-svo-subjective-candidate/course.json').units[0];
const E=require('./.build/course-engine.js');
const R=require('./.build/profile-repository.js');
const L=require('./.build/learning-controller.js');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const {checkSvaPrerequisite}=require('../product-2028-sva-preflight/guard.cjs');
const fake=require('../audit-2028/test-indexeddb.cjs');
global.SvaPrerequisite=require('../product-2028-sva-preflight/guard.cjs');
const q=u=>[...u.basicQuestions,...u.applicationQuestions,...u.delayedQuestions];
test('47 unique courses, 524 unique questions, only updated SVO course differs',()=>{
 assert.equal(pack.units.length,47);
 assert.equal(pack.units.flatMap(q).length,524);
 assert.equal(new Set(pack.units.flatMap(q).map(x=>x.id)).size,524);
 assert.deepEqual(E.validate(pack),[]);
 assert.deepEqual(validateObjectives(pack),[]);
 assert.deepEqual(pack.units.filter(u=>u.id!==svo.id),source.units.filter(u=>u.id!==svo.id));
 assert.deepEqual(pack.units.find(u=>u.id===svo.id),svo);
 assert.equal(pack.units.filter(u=>u.subject==='en').length,15);
 assert.equal(pack.units.filter(u=>u.subject==='pol').length,14);
 assert.equal(pack.units.filter(u=>u.subject==='353').length,18);
});
test('candidate edition and file manifest protect old data and make release fail closed',()=>{
 assert.equal(receipt.courses,47);assert.equal(receipt.questions,524);
 assert.equal(receipt.deployed,false);
 assert.equal(receipt.professionalApprovals,0);
 assert.equal(R.DRAFT_DB,'qh2028_set47_svo6_research_v1');
 assert.notEqual(R.DRAFT_DB,'qh2028_isolated_set47_v1');
 assert.notEqual(R.DRAFT_DB,'qh2028_svo_sva_preflight_v1');
 assert(E.validate(pack,true).includes('release-blocked'));
 assert(pack.units.every(u=>u.distribution==='held-pending-review'&&u.reviewRecord?.expertApproved!==true));
 const html=fs.readFileSync(path.join(dir,'.build/index.html'),'utf8');
 assert(html.indexOf('sva-prerequisite.js')<html.indexOf('learning-controller.js'));
 assert(html.includes('SET47-SVO6'));
 const sw=fs.readFileSync(path.join(dir,'.build/sw.js'),'utf8');
 assert(sw.includes('qh2028-set47-svo6-research-v1'));
 assert(sw.includes("'./sva-prerequisite.js'"));
 const ui=fs.readFileSync(path.join(dir,'.build/pilot-ui.js'),'utf8');
 assert(ui.includes('candidateEdition:EDITION'));
 assert(ui.includes('backup.profile?.settings?.candidateEdition!==EDITION'));
 assert(ui.includes('id="subject-filter"'));
 assert(ui.includes('qh2028_set47_svo6_pending_v1:'));
 const manifest=require('./.build/manifest.json');
 assert(manifest.id.includes('set47-svo6'));
});
test('sixth SVO subjective is reference-only and cannot become fake evidence score',()=>{
 const u=pack.units.find(u=>u.id===svo.id),last=u.delayedQuestions.at(-1),grade=E.grade(last,'nurses check records');
 assert.equal(last.id,'en-svo-delay-3');
 assert.equal(grade.method,'reference-only');
 assert.equal(grade.score,null);
 assert.equal(grade.correct,null);
 const now='2026-11-12T08:00:00.000Z';
 const ev=E.evidence([
  {at:now,questionId:'en-svo-delay-1',type:'single',method:'objective',correct:true,answerVisible:false},
  {at:now,questionId:last.id,type:'subjective',method:'reference-only',correct:null,answerVisible:false}
 ],now);
 assert.equal(ev.state,'subjective-pending');
 assert.equal(ev.scoreEstimate,null);
 assert.equal(ev.subjectivePending,true);
});
test('new 47-course synthetic profiles cannot shortcut SVO prerequisite',async()=>{
 const db=R.createRepository(new fake.IDBFactory(),fake.IDBKeyRange);
 const p=await db.createProfile('set47-svo6-synthetic');
 let seq=0;
 const c=L.createLearningController(E,p,pack.units,()=>new Date('2026-11-12T08:00:00Z').toISOString(),()=> 'set47-test-'+(++seq));
 const sva=pack.units.find(u=>u.id==='en-subject-verb-agreement');
 const initial=await p.exportBackup();
 assert.equal(L.prerequisiteStatus(sva,initial).ready,false);
 assert.equal(checkSvaPrerequisite(initial,svo,sva).ready,false);
 await assert.rejects(c.load(sva.id),/先修/);
 assert.deepEqual(await p.exportBackup(),initial);
 const s=await c.load(svo.id);
 assert.equal(s.stage,'learn');
 for(const subject of ['pol','353']){
   const first=pack.units.find(u=>u.subject===subject&&!(u.prerequisites||[]).length);
   assert(first,'missing root '+subject);
   assert.equal((await c.load(first.id)).stage,'learn');
 }
 await db.close();
});
