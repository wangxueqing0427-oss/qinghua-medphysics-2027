'use strict';
// Scoped emergency journal + one ordered writer. A timeout reports a slow write;
// it never starts a competing writer or discards the pending text.
(function(global){
function create({storage,key,persist,onStatus=()=>{},debounceMs=200,timeoutMs=4000}){
 let pending=null,worker=null,timer=null,sequence=0;
 const notify=(state,detail)=>onStatus({state,detail,pending:!!pending});
 const valid=p=>p&&typeof p.examId==='string'&&typeof p.questionId==='string'&&Number.isInteger(p.index)&&p.index>=0&&Number.isSafeInteger(p.revision)&&p.revision>0&&typeof p.text==='string'&&p.text.length<=10000&&Number.isFinite(Date.parse(p.at));
 function journal(){try{storage.setItem(key,JSON.stringify(pending));notify('journaled','应急草稿已写入本机，正在保存学习档案');}catch(e){notify('journal-error','应急草稿写入失败：'+e.message+'；请勿关闭页面，等待档案保存或重试');}}
 function nextRevision(base=0){sequence=Math.max(sequence,base)+1;return sequence;}
 function stage(payload){if(typeof payload.text!=='string'||payload.text.length>10000)throw Error('草稿超出10000字限制');pending={...payload,revision:nextRevision(payload.baseRevision||0)};if(!valid(pending))throw Error('草稿标识或时间无效');journal();clearTimeout(timer);timer=setTimeout(()=>flush().catch(()=>{}),debounceMs);return {...pending};}
 function clearOnly(record){try{const text=storage.getItem(key);if(text&&JSON.parse(text).revision===record.revision)storage.removeItem(key);}catch(e){notify('journal-cleanup-error','答案已保存，临时草稿清理失败；恢复时不会覆盖较新答案');}}
 function resume(current){try{const text=storage.getItem(key);if(!text)return null;const r=JSON.parse(text);if(!valid(r))throw Error('临时草稿格式无效，已保留原件');sequence=Math.max(sequence,r.revision,current?.draftRevision||0);if(r.examId!==current?.id)return null;if(current.submittedAt||r.revision<=(current.draftRevision||0)){if(pending?.examId===r.examId&&pending.revision<=Math.max(r.revision,current.draftRevision||0))pending=null;clearOnly(r);return null;}pending=r;notify('recovered','发现本机未完成草稿，正在恢复');return {...r};}catch(e){notify('recovery-error',e.message);return null;}}
 function markFormal(revision){sequence=Math.max(sequence,revision||0);}
 function start(){if(worker)return worker;worker=(async()=>{while(pending){const r=pending;try{await persist({...r});if(pending===r){pending=null;clearOnly(r);notify('saved','已保存到本机学习档案');}}catch(e){notify('error','保存失败，草稿仍保留：'+e.message+'；请点重试');throw e;}}})().finally(()=>{worker=null;});worker.catch(()=>{});return worker;}
 async function flush(){clearTimeout(timer);timer=null;if(!pending&&!worker)return;const job=start();let timeout;try{return await Promise.race([job,new Promise((_,reject)=>{timeout=setTimeout(()=>{notify('slow','本机写入等待超时，草稿仍保留；重试不会启动并行旧写入');reject(Error('本机写入等待超时，请重试'));},timeoutMs);})]);}finally{clearTimeout(timeout);}}
 function dispose(){clearTimeout(timer);timer=null;}
 return Object.freeze({stage,resume,flush,markFormal,nextRevision,peek:()=>pending?{...pending}:null,dispose});
}
const api=Object.freeze({create});if(typeof module!=='undefined'&&module.exports)module.exports=api;else global.ExamDraftQueue=api;
})(typeof window!=='undefined'?window:undefined);
