'use strict';const fs=require('fs'),path=require('path'),assert=require('assert/strict');
module.exports=function(source){function once(a,b){assert.equal(source.split(a).length,2,'diagnostic patch anchor: '+a);source=source.replace(a,b);}
once('  const choiceName=i=>String.fromCharCode(65+i);','  const choiceName=i=>String.fromCharCode(65+i);\n  let lifecycleCleanup=null;');
once('    const label=name;',`    const label=name;
    if(lifecycleCleanup)lifecycleCleanup();
    let latestStatus='主观题输入后自动保存；本机异常时保留应急草稿';
    function status(s){latestStatus=s.detail;const el=app.querySelector('#exam-save-status');if(el)el.textContent=latestStatus;const retry=app.querySelector('#exam-retry-save');if(retry)retry.hidden=!['error','slow','journal-error','recovery-error'].includes(s.state);}
    const saver=global.ExamDraftQueue.create({storage:global.localStorage,key:'exam-draft:'+global.ProfileRepository.DRAFT_DB+':'+profile.id,onStatus:status,persist:async work=>{
      await reload();
      if(!current||current.id!==work.examId||current.submittedAt||work.revision<=(current.draftRevision||0))return;
      const ref=current.questions[work.index];if(!ref||ref.questionId!==work.questionId||M.lookup(pack,ref).question.type!=='subjective')throw Error('草稿与题目不符，未恢复');
      if(Date.parse(work.at)<Date.parse(current.startedAt)||Date.parse(work.at)>=Date.parse(current.deadlineAt))throw Error('草稿时间超出本次诊断范围，请保留原文并核对');
      const next=M.setAnswer(current,pack,work.index,work.text.trim()?work.text:null,work.at);
      await persist(next,undefined,work.revision);
    }});
    const leave=()=>{saver.flush().catch(()=>{});};const hide=()=>{if(document.visibilityState==='hidden')leave();};
    global.addEventListener('pagehide',leave);document.addEventListener('visibilitychange',hide);
    lifecycleCleanup=()=>{global.removeEventListener('pagehide',leave);document.removeEventListener('visibilitychange',hide);saver.dispose();stopTicker();};`);
once('    async function persist(next,newHistory){','    async function persist(next,newHistory,draftRevision){');
once('      // Preserve history within existing full profile backup; no separate localStorage.',`      next={...next,draftRevision:draftRevision??saver.nextRevision(current?.draftRevision||0)};
      // Full committed answers are included in the existing profile backup.
      // The scoped journal is emergency recovery only, never a cross-version migration.`);
once('      store={history,current:next};current=next;','      store={history,current:next};current=next;saver.markFormal(next.draftRevision);');
once("      if(!current||current.submittedAt)return;\n      await persist(M.submit", "      if(!current||current.submittedAt)return;\n      await saver.flush();\n      await persist(M.submit");
once('      if(!current)return;\n      if(!current.submittedAt', "      if(!current)return;\n      saver.resume(current);try{await saver.flush();}catch(e){status({state:'error',detail:e.message+'；草稿保留，请在本页重试'});}\n      if(!current.submittedAt");
once('    reload().then(()=>{',`    reload().then(async()=>{
      if(current){saver.resume(current);try{await saver.flush();}catch(e){status({state:'error',detail:e.message+'；草稿仍保留，请进入小测重试'});}}`);
once('    async function saveAndGo(index){\n      stopTicker();','    async function saveAndGo(index){\n      stopTicker();\n      await saver.flush();');
once("        '<p class=\"exam-notice\">点击下方导航后保存本题；未提交前不公开答案。离开或刷新后可从本机档案继续。</p>'+",`        '<p class="exam-notice">主观文字输入后自动保存。请确认保存状态；强制终止或本机存储故障仍可能影响最后一次写入。未交卷不公开答案。</p>'+`);
once("        '</div><p id=\"exam-tip\" class=\"exam-notice\" role=\"status\"></p></section>';",`        '</div><p id="exam-save-status" class="exam-notice" role="status">'+escape(latestStatus)+'</p><button class="btn ghost" id="exam-retry-save" type="button" hidden>重试保存草稿</button><p id="exam-tip" class="exam-notice" role="status"></p></section>';
      const field=app.querySelector('textarea#exam-answer');
      const recovered=saver.peek();if(field&&recovered?.examId===current.id&&recovered.questionId===ref.questionId)field.value=recovered.text;
      if(field)field.addEventListener('input',()=>{try{saver.stage({examId:current.id,index:i,questionId:ref.questionId,text:field.value,at:new Date().toISOString(),baseRevision:current.draftRevision||0});}catch(e){status({state:'error',detail:e.message+'；请保留页面中的原文'});}});
      app.querySelector('#exam-retry-save').onclick=()=>act(()=>saver.flush());`);
once("        stopTicker();\n        if(remaining(current)<=0){await finish('timeout');return;}\n        const next=M.setAnswer(current,pack,i,null", "        stopTicker();\n        await saver.flush();\n        if(remaining(current)<=0){await finish('timeout');return;}\n        const next=M.setAnswer(current,pack,i,null");
once("          stopTicker();\n          if(remaining(current)>0){", "          stopTicker();\n          await saver.flush();\n          if(remaining(current)>0){");
return fs.readFileSync(path.join(__dirname,'exam-draft-queue.cjs'),'utf8')+'\n'+source;};
