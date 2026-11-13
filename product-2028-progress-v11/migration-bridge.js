(function(){
'use strict';
// Opt-in one-hop compatibility bridge V10 -> V11 for IDENTICAL 52-course content.
// Does not edit the source backup, old IndexedDB, existing target profiles or course assessments.
const SOURCE='qh2028-stat-inference-52-v10';
const TARGET='qh2028-progress-safe-v11';
const CONTRACT='qh2028-stat-inference-52-v10-internal-draft';
const EXPECTED_CONTENT_SHA256='__V10_CONTENT_SHA256__';
const GROUPS=['basicQuestions','applicationQuestions','delayedQuestions'];
const Engine=typeof module!=='undefined'&&module.exports ? (globalThis.CourseEngine||require('../product-2028-svo-subjective-candidate/course-engine.cjs')) : CourseEngine;
const validId=x=>typeof x==='string'&&/^[-a-zA-Z0-9_:]{1,160}$/.test(x);
const own=(o,k)=>o!==null&&typeof o==='object'&&Object.prototype.hasOwnProperty.call(o,k);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fail=(what)=>{throw Error('跨版本迁移已安全停止：'+what+'。原V10记录和备份未被修改');};
async function inspect(backup,pack){
 if(!pack||pack.contentVersion!==CONTRACT||!Array.isArray(pack.units)||pack.units.length!==52)
  fail('当前课程包不符合V10的已冻结版本');
 if(pack.units.reduce((n,u)=>n+GROUPS.reduce((a,k)=>a+(u[k]?.length||0),0),0)!==584)
  fail('当前题目数并非584');
 const bytes=new TextEncoder().encode(JSON.stringify(pack,null,2));
 const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
 if(actual!==EXPECTED_CONTENT_SHA256)fail('冻结的52课584题内容指纹不一致');
 if(!backup||backup.schemaVersion!==1||backup.scope!=='local-draft'||
    !validId(backup.profileId)||!backup.profile||backup.profile.id!==backup.profileId||
    !backup.profile.settings||typeof backup.profile.settings!=='object')
  fail('备份格式或档案身份无效');
 if(backup.profile.settings.candidateEdition!==SOURCE)
  fail('只支持上一版V10导出的学习备份，不接受其他版本');
 if(!Array.isArray(backup.events)||!Array.isArray(backup.sessions)||
    backup.events.length>20000||backup.sessions.length>10000)
  fail('学习历史结构或数量异常');
 const units=new Map(pack.units.map(u=>[u.id,u]));
 if(units.size!==52)fail('课程ID重复');
 const questions=new Map();
 for(const u of pack.units){
  for(const group of GROUPS)for(const q of u[group]||[]){
   if(questions.has(q.id))fail('题目ID重复');
   questions.set(q.id,{q,u});
  }
 }
 const seenEvents=new Set(),seenSessions=new Set();
 const stats={events:backup.events.length,sessions:backup.sessions.length,answered:0,recalls:0,
  preservedOriginalCourses:52,sourceEdition:SOURCE,targetEdition:TARGET,newProfileOnly:true,
  createsProfile:false,rewritesExisting:false,fullCourseContentIdenticalRequired:true};
 for(const e of backup.events){
  if(!e||!validId(e.id)||seenEvents.has(e.id)||e.profileId!==backup.profileId)
   fail('学习事件ID重复或来自其他档案');
  seenEvents.add(e.id);
  if(e.unitId!==undefined){
   const u=units.get(e.unitId);
   if(!u||e.unitVersion!==u.version)fail('学习事件指向不存在或已改变的课程');
   if(e.action==='answered'){
    const data=e.payload,found=questions.get(data?.questionId);
    if(!found||found.u.id!==e.unitId||data.questionVersion!==u.version||
       !same(data.questionSnapshot,found.q)||data.answerVisible!==false)
      fail('已答题目、题干或答案版本发生变化');
    const scored=Engine.grade(found.q,data.answer);
    if(!same(scored,data.grade))fail('原客观或主观评分记录与冻结题目不一致');
    stats.answered++;
   }else if(e.action==='recalled'){
    if(typeof e.payload?.answer!=='string'||!e.payload.answer.trim()||
       e.payload.answerVisible!==false)fail('闭卷回忆证据缺失或可见答案');
    stats.recalls++;
   }else if(!['learned','feedback-read','scheduled','review-start'].includes(e.action))
    fail('存在尚未支持的课程事件类型');
  }else if(e.kind==='attempt'){
   const found=questions.get(e.questionId);
   if(!found||e.questionVersion!==found.u.version||typeof e.correct!=='boolean'||
      Engine.grade(found.q,e.answer).correct!==e.correct)
    fail('独立题目作答证据与当前题库不一致');
  }else fail('发现未知类型的历史事件');
 }
 for(const s of backup.sessions){
  if(!s||!validId(s.id)||seenSessions.has(s.id)||s.profileId!==backup.profileId)
   fail('学习会话ID重复或来自其他档案');
  seenSessions.add(s.id);
  if(s.id.startsWith('unit:')){
   const u=units.get(s.unitId);
   if(!u||s.id!=='unit:'+u.id||s.unitVersion!==u.version)
    fail('原课程学习进度指向不存在的课程');
   const contract=JSON.stringify({version:u.version,explanation:u.explanation,recall:u.recall,
     questions:[...u.basicQuestions,...u.applicationQuestions,...(u.delayedQuestions||[])]});
   if(s.contentContract!==contract)fail('课程讲解、题干或答案版本不匹配');
   if(!['learn','recall','practice','feedback','scheduled'].includes(s.stage)||
      !Number.isInteger(s.index)||s.index<0||s.index>12)
    fail('会话阶段或题目索引异常');
   if(s.feedback?.questionSnapshot){
    const found=questions.get(s.feedback.questionId);
    if(!found||found.u.id!==u.id||!same(found.q,s.feedback.questionSnapshot))
      fail('反馈页面题目快照与旧版不一致');
   }
  }else if(s.id.startsWith('review:')){
   const unitId=s.id.slice('review:'.length);
   if(units.has(unitId)){
    if(s.unitId!==unitId)fail('课程复习会话归属错误');
   }else if(!questions.has(unitId))fail('复习记录指向不存在的题目');
  }else fail('未知学习会话种类');
 }
 return stats;
}
async function prepare(backup,pack){
 const preview=await inspect(backup,pack);
 const safe=structuredClone(backup);
 safe.profile.settings={...safe.profile.settings,
  candidateEdition:TARGET,
  optInMigration:{sourceEdition:SOURCE,targetEdition:TARGET,sourceProfileId:backup.profileId,
   contentIdentical:true,oldSourcePreserved:true}};
 // Validate the copied object is structurally intact before repository's atomic create-new-profile.
 if(safe.profile.settings.candidateEdition!==TARGET||safe.events.length!==preview.events||
    safe.sessions.length!==preview.sessions)fail('迁移副本构造失败');
 return safe;
}
const MigrationBridge=Object.freeze({SOURCE,TARGET,inspect,prepare});
if(typeof module!=='undefined')module.exports=MigrationBridge;else window.MigrationBridge=MigrationBridge;

})();
