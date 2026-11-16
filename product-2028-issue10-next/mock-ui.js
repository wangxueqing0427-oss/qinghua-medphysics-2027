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

'use strict';
// UI for a *non-official*, non-full-length diagnostic mini-test.
// Persists to the current isolated learner profile settings (included in regular backup).
(function(global){
  const M=global.MockExamEngine;
  const KEY='issue10ExamLoopV2';
  const name=M.SUBJECT_NAMES;
  const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const choiceName=i=>String.fromCharCode(65+i);
  let lifecycleCleanup=null;
  function answerText(q,answer){
    if(answer===null||answer===undefined)return '未作答';
    if(q.type==='single'||q.type==='multi'){
      const ids=Array.isArray(answer)?answer:[answer];
      return ids.map(i=>choiceName(i)+'．'+q.options[i]).join('；');
    }
    if(q.type==='number')return String(answer.value)+' '+q.unit;
    return String(answer);
  }
  function mount({app,pack,profile,act,overview}){
    let store=null,current=null,ticker=null;
    const label=name;
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
    lifecycleCleanup=()=>{global.removeEventListener('pagehide',leave);document.removeEventListener('visibilitychange',hide);saver.dispose();stopTicker();};
    function stopTicker(){if(ticker!==null){clearInterval(ticker);ticker=null;}}
    async function reload(){
      const backup=await profile.exportBackup();
      store=backup.profile?.settings?.[KEY]||{history:[],current:null};
      if(!Array.isArray(store.history)||typeof store!=='object')throw Error('测评档案结构不正确，已停止以避免覆盖');
      current=store.current||null;
      if(current)M.check(current,pack);
      return store;
    }
    async function persist(next,newHistory,draftRevision){
      M.check(next,pack);
      const history=newHistory===undefined?store.history:newHistory;
      if(!Array.isArray(history))throw Error('测评历史无效');
      next={...next,draftRevision:draftRevision??saver.nextRevision(current?.draftRevision||0)};
      // Full committed answers are included in the existing profile backup.
      // The scoped journal is emergency recovery only, never a cross-version migration.
      const reviewQueue=next.submittedAt?M.reviewQueue(next,pack,global.CourseEngine,store.reviewQueue||[],new Date().toISOString()):store.reviewQueue||[];await profile.updateSettings({[KEY]:{history,current:next,reviewQueue}});
      store={history,current:next,reviewQueue};current=next;saver.markFormal(next.draftRevision);
    }
    function remaining(state){
      return Math.max(0,Math.ceil((Date.parse(state.deadlineAt)-Date.now())/1000));
    }
    function clockText(seconds){
      const mins=Math.floor(seconds/60),secs=seconds%60;
      return String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
    }
    async function finish(reason){
      stopTicker();
      if(!current||current.submittedAt)return;
      await saver.flush();
      await persist(M.submit(current,pack,new Date().toISOString(),reason));
      renderResult();
    }
    async function openSaved(){
      await reload();
      if(!current)return;
      saver.resume(current);try{await saver.flush();}catch(e){status({state:'error',detail:e.message+'；草稿保留，请在本页重试'});}
      if(!current.submittedAt&&remaining(current)===0)await finish('timeout');
      else if(current.submittedAt)renderResult();
      else renderExam();
    }
    function mountButton(){
      const slot=document.createElement('section');
      slot.className='exam-start-card';
      slot.setAttribute('aria-label','三科暂定长时训练');
      slot.innerHTML='<div class="exam-kicker">阶段诊断 · 内部题库</div>'+
        '<h2>手机暂定长时训练</h2>'+
        '<p>用已有71课草稿中的题目练习答题与交卷，支持计时、断点续答、客观题核对和主观题待核对。<strong>不是全真模拟考试，不换算考研分数。</strong></p>'+
        '<label>选择测评范围<select id="exam-subject">' +
        Object.entries(name).map(([code,title])=>'<option value="'+code+'">'+title+'</option>').join('')+
        '</select></label>'+
        '<p class="exam-notice">单科24题；三科混合36题，均为180分钟暂定耐力训练。题量、题型和时长是内部设定，不是官方全真试卷；三科混合不对应实际单场考试。答案保存在当前本机学习档案及其备份中。</p>'+
        '<button class="btn block exam-launch" id="exam-launch" type="button">开始暂定长时训练</button>'+
        '<div id="exam-history" class="exam-history"></div>';
      const anchor=app.querySelector('.mobile-next-task');
      if(anchor)anchor.after(slot);
      else app.querySelector('h1')?.after(slot);
      return slot;
    }
    const slot=mountButton();
    reload().then(async()=>{
      if(current){saver.resume(current);try{await saver.flush();}catch(e){status({state:'error',detail:e.message+'；草稿仍保留，请进入小测重试'});}}
      const launch=slot.querySelector('#exam-launch'),hist=slot.querySelector('#exam-history');
      if(!slot.isConnected)return;
      if(current&&!current.submittedAt){
        launch.textContent='继续未交卷的小测';
        slot.querySelector('#exam-subject').disabled=true;
      } else if(current?.submittedAt){
        launch.textContent='开始下一次暂定长时训练';
        const view=document.createElement('button');
        view.className='btn ghost block exam-view-result';
        view.type='button';
        view.textContent='查看上一次训练核对';
        view.onclick=()=>act(async()=>{await reload();renderResult();});
        hist.append(view);
      }
      renderReviewLinks(slot);const count=store.history?.length||0;
      if(count){
        const p=document.createElement('p');p.className='exam-notice';
        p.textContent='本档案已保存 '+count+' 次更早的长时训练；旧结果保留在完整本机备份中。';
        hist.append(p);
      }
      launch.addEventListener('click',()=>act(async()=>{
        await reload();
        if(current&&!current.submittedAt){await openSaved();return;}
        const subject=slot.querySelector('#exam-subject').value;
        const next=M.create(pack,subject,new Date().toISOString(),global.crypto.randomUUID());
        const history=current?.submittedAt?[...store.history,current]:store.history;
        await persist(next,history);
        renderExam();
      }));
      launch.dataset.ready='true';
    }).catch(e=>{if(slot.isConnected)slot.querySelector('#exam-history').textContent='无法读取测评进度：'+e.message;});
    function currentQuestion(){
      const ref=current.questions[current.currentIndex];
      const found=M.lookup(pack,ref);
      return {ref,...found};
    }
    function readForm(question){
      if(question.type==='single'){
        const pick=app.querySelector('input[name="exam-choice"]:checked');
        return pick?Number(pick.value):null;
      }
      if(question.type==='multi'){
        const picks=[...app.querySelectorAll('input[name="exam-choice"]:checked')].map(x=>Number(x.value));
        return picks.length?picks:null;
      }
      const field=app.querySelector('#exam-answer');
      if(!field||!field.value.trim())return null;
      if(question.type==='number'){
        const value=Number(field.value.trim());
        if(!Number.isFinite(value))throw Error('请填写有效数字；不确定时可以留空');
        return {value,unit:question.unit};
      }
      return field.value;
    }
    async function saveAndGo(index){
      stopTicker();
      await saver.flush();
      if(remaining(current)<=0){await finish('timeout');return;}
      const {question}=currentQuestion();
      let next=M.setAnswer(current,pack,current.currentIndex,readForm(question),new Date().toISOString());
      if(index!==null)next=M.setCursor(next,pack,index);
      await persist(next);
      renderExam();
    }
    function renderExam(){
      stopTicker();
      if(!current){return;}
      if(current.submittedAt){renderResult();return;}
      if(remaining(current)<=0){
        // Do not accept late answers when returning from an inactive browser tab.
        act(()=>finish('timeout'));return;
      }
      const {question:q,unit,ref}=currentQuestion();
      const answer=Object.hasOwn(current.answers,ref.questionId)?current.answers[ref.questionId]:null;
      const count=current.questions.length,i=current.currentIndex,saved=Object.keys(current.answers).length;
      let form;
      if(q.type==='single'||q.type==='multi'){
        const type=q.type==='single'?'radio':'checkbox';
        const selected=answer===null?[]:Array.isArray(answer)?answer:[answer];
        form='<fieldset class="exam-choices"><legend>选择答案（未交卷前不展示正确选项）</legend>'+
          q.options.map((op,n)=>'<label class="exam-choice">'+
            '<input type="'+type+'" name="exam-choice" value="'+n+'" '+(selected.includes(n)?'checked':'')+'>'+
            '<span><b>'+choiceName(n)+'．</b>'+escape(op)+'</span></label>').join('')+'</fieldset>';
      } else if(q.type==='number'){
        form='<label class="exam-text-label">请输入数字（单位：'+escape(q.unit)+'）'+
          '<input id="exam-answer" type="text" inputmode="decimal" maxlength="40" value="'+escape(answer?.value??'')+'" placeholder="可留空跳过"></label>';
      } else{
        form='<label class="exam-text-label">独立作答（主观题不自动给分）'+
          '<textarea id="exam-answer" rows="7" maxlength="10000" placeholder="在这里写下你的答案。可留空跳过。">'+escape(answer||'')+'</textarea></label>';
      }
      app.innerHTML='<section class="exam-screen"><header class="exam-screen-head">'+
        '<button class="btn ghost exam-back" id="exam-back" type="button">返回学习首页</button>'+
        '<div class="exam-kicker">内部暂定长时训练 · 非全真、非正式评分</div>'+
        '<h1>'+escape(name[current.subject])+' · 第 '+(i+1)+' / '+count+' 题</h1>'+
        '<p>倒计时 <strong id="exam-clock" aria-live="off">'+clockText(remaining(current))+'</strong> · 已保存 '+saved+' 题</p>'+
        '<div class="exam-progress" role="progressbar" aria-label="本轮题目位置" aria-valuemin="0" aria-valuemax="'+count+'" aria-valuenow="'+(i+1)+'">'+
        '<div style="width:'+Math.round((i+1)/count*100)+'%"></div></div>'+
        '</header><section class="card exam-question">'+
        '<p class="exam-unit">科目：'+escape(name[ref.subject])+' · 课程：'+escape(unit.title)+'</p>'+
        '<h2 class="exam-stem">'+escape(q.stem)+'</h2>'+form+
        '<p class="exam-notice">主观文字输入后自动保存。请确认保存状态；强制终止或本机存储故障仍可能影响最后一次写入。未交卷不公开答案。</p>'+
        '</section><div class="exam-nav">'+
        '<button class="btn ghost" id="exam-prev" type="button" '+(i===0?'disabled data-stay-disabled="true"':'')+'>上一题并保存</button>'+
        '<button class="btn" id="exam-next" type="button" '+(i===count-1?'disabled data-stay-disabled="true"':'')+'>下一题并保存</button>'+
        '<button class="btn ghost" id="exam-skip" type="button">跳过本题</button>'+
        '<button class="btn exam-submit" id="exam-submit" type="button">交卷并查看结果</button>'+
        '</div><p id="exam-save-status" class="exam-notice" role="status">'+escape(latestStatus)+'</p><button class="btn ghost" id="exam-retry-save" type="button" hidden>重试保存草稿</button><p id="exam-tip" class="exam-notice" role="status"></p></section>';
      const field=app.querySelector('textarea#exam-answer');
      const recovered=saver.peek();if(field&&recovered?.examId===current.id&&recovered.questionId===ref.questionId)field.value=recovered.text;
      if(field)field.addEventListener('input',()=>{try{saver.stage({examId:current.id,index:i,questionId:ref.questionId,text:field.value,at:new Date().toISOString(),baseRevision:current.draftRevision||0});}catch(e){status({state:'error',detail:e.message+'；请保留页面中的原文'});}});
      app.querySelector('#exam-retry-save').onclick=()=>act(()=>saver.flush());
      const timer=app.querySelector('#exam-clock');
      ticker=setInterval(()=>{
        if(!timer.isConnected){stopTicker();return;}
        const left=remaining(current);timer.textContent=clockText(left);
        if(left===0){stopTicker();act(()=>finish('timeout'));}
      },1000);
      app.querySelector('#exam-back').addEventListener('click',()=>act(async()=>{
        await saveAndGo(null);
        stopTicker();
        await overview();
      }));
      if(i>0)app.querySelector('#exam-prev').addEventListener('click',()=>act(()=>saveAndGo(i-1)));
      if(i<count-1)app.querySelector('#exam-next').addEventListener('click',()=>act(()=>saveAndGo(i+1)));
      app.querySelector('#exam-skip').addEventListener('click',()=>act(async()=>{
        stopTicker();
        await saver.flush();
        if(remaining(current)<=0){await finish('timeout');return;}
        const next=M.setAnswer(current,pack,i,null,new Date().toISOString());
        await persist(M.setCursor(next,pack,Math.min(i+1,count-1)));
        renderExam();
      }));
      app.querySelector('#exam-submit').addEventListener('click',()=>{
        const button=app.querySelector('#exam-submit');
        if(button.dataset.confirm!=='yes'){
          button.dataset.confirm='yes';
          button.textContent='确认交卷（不能修改）';
          app.querySelector('#exam-tip').textContent='交卷后才能查看解析。未作答的题会记录为未作答，主观题不会自动计分。再点一次确认交卷。';
          return;
        }
        act(async()=>{
          stopTicker();
          await saver.flush();
          if(remaining(current)>0){
            const updated=M.setAnswer(current,pack,i,readForm(q),new Date().toISOString());
            await persist(updated);
          }
          await finish('manual');
        });
      });
    }
    function renderSelfReview(){
      const el=app.querySelector('#exam-self-review');if(!el)return;
      const questions=current.questions.filter(r=>r.type==='subjective'&&Object.hasOwn(current.answers,r.questionId));
      el.innerHTML=questions.map(ref=>{const q=M.lookup(pack,ref).question,saved=current.selfAssessments?.[q.id];return '<fieldset class="card" data-self-question="'+escape(q.id)+'"><legend>'+escape(q.stem)+'</legend>'+q.rubric.map((r,i)=>'<label class="choice"><input type="checkbox" value="'+i+'" '+(saved?.points.includes(i)?'checked':'')+'>'+escape(r)+'</label>').join('')+'<label>自评说明（不是专业评分）<textarea class="self-note">'+escape(saved?.note||'')+'</textarea></label><button class="btn" data-self-save="'+escape(q.id)+'">保存要点自评</button><p role="status">'+(saved?'已保存自评，仍不生成专业分数':'未自评；不计为答错')+'</p></fieldset>';}).join('');
      el.querySelectorAll('[data-self-save]').forEach(button=>button.onclick=()=>act(async()=>{const field=button.closest('fieldset'),points=[...field.querySelectorAll('input:checked')].map(i=>Number(i.value));await persist(M.selfAssess(current,pack,button.dataset.selfSave,points,field.querySelector('textarea').value,new Date().toISOString()));renderResult();}));
    }
    function renderReviewLinks(slot){
      const q=store.reviewQueue||[],due=q.filter(x=>Date.parse(x.due)<=Date.now());const box=document.createElement('section');box.className='card';box.id='exam-review-queue';
      box.innerHTML='<h3>考试关联复习</h3><p>'+due.length+'项到期 · 共'+q.length+'项；主观待核对单独记录。</p>'+due.slice(0,10).map(x=>'<button class="btn block" data-exam-review="'+escape(x.id)+'">'+escape(M.lookup(pack,x.ref).unit.title)+' · '+(x.kind==='subjective-pending'?'待核对重答':'到期独立重答')+'</button>').join('')+'<h3>历次训练记录</h3>'+[...store.history,...(current?.submittedAt?[current]:[])].slice().reverse().map(e=>{try{const r=M.report(e,pack,global.CourseEngine);return '<p>'+escape(new Date(e.submittedAt).toLocaleString())+' · '+escape(name[e.subject])+' · 客观'+r.objectiveCorrect+'/'+r.objectiveTotal+' · 主观待核对'+r.subjectivePending+'</p>';}catch{return '<p>旧版本训练已保留在备份，当前不重新评分。</p>';}}).join('')+'<p>不同范围或重复试题不可直接作为分数提升趋势；不换算350分。</p>';
      slot.append(box);box.querySelectorAll('[data-exam-review]').forEach(b=>b.onclick=()=>act(()=>renderReviewQuestion(b.dataset.examReview)));
    }
    async function renderReviewQuestion(id){
      await reload();const row=store.reviewQueue.find(x=>x.id===id),{question:q}=M.lookup(pack,row.ref);app.innerHTML='<section class="card"><h1>考试错题与待核对重答</h1><p>'+escape(q.stem)+'</p>'+(q.options?q.options.map((x,i)=>'<label class="choice"><input type="'+(q.type==='multi'?'checkbox':'radio')+'" name="review-pick" value="'+i+'">'+escape(x)+'</label>').join(''):'<textarea id="review-answer" maxlength="10000"></textarea>')+'<label>错因<select id="review-cause"><option value="concept">概念混淆</option><option value="calculation">计算或单位</option><option value="incomplete">遗漏条件</option><option value="unclassified">尚未确定</option></select></label><button class="btn" id="save-exam-review">提交独立回答</button></section>';
      app.querySelector('#save-exam-review').onclick=()=>act(async()=>{const picks=[...app.querySelectorAll('[name="review-pick"]:checked')].map(i=>Number(i.value)),text=app.querySelector('#review-answer')?.value,answer=q.type==='single'?picks[0]:q.type==='multi'?picks:q.type==='number'?{value:Number(text),unit:q.unit}:text;const queue=M.answerReview(store.reviewQueue,id,pack,global.CourseEngine,answer,new Date().toISOString(),app.querySelector('#review-cause').value);await profile.updateSettings({[KEY]:{...store,reviewQueue:queue}});store.reviewQueue=queue;const latest=queue.find(x=>x.id===id).history.at(-1);app.innerHTML='<section class="card"><h1>'+(latest.grade.correct===null?'主观题已保存，待核对':latest.grade.correct?'本次重答正确':'仍需复习')+'</h1><p>我的回答：'+escape(answerText(q,answer))+'</p><p>参考答案：'+escape(answerText(q,q.answer))+'</p><p>'+escape(q.explanation)+'</p><p>下次：'+escape(queue.find(x=>x.id===id).due)+'</p><button class="btn" id="review-home">返回今日任务</button></section>';app.querySelector('#review-home').onclick=()=>act(overview);});
    }

    function renderResult(){
      stopTicker();
      const report=M.report(current,pack,global.CourseEngine);const diagnosis=M.diagnose(current,pack,global.CourseEngine);
      const rows=report.rows.map((row,i)=>{
        const {question:q}=M.lookup(pack,row.ref);
        const status=row.answer===null?'未作答':row.grade?.correct===null?'主观题待人工核对':row.grade?.correct?'客观题答对':'客观题答错';
        const rubric=row.rubric.length?'<p><b>参考核对点：</b></p><ul>'+row.rubric.map(s=>'<li>'+escape(s)+'</li>').join('')+'</ul>':'';
        return '<details class="exam-review"><summary>第 '+(i+1)+' 题 · '+escape(name[row.ref.subject])+' · '+status+'</summary>'+
          '<div class="exam-review-body"><h3>'+escape(q.stem)+'</h3>'+
          '<p><b>我的作答：</b>'+escape(answerText(q,row.answer))+'</p>'+
          '<p><b>参考答案：</b>'+escape(answerText(q,row.reference))+'</p>'+rubric+
          '<p><b>解析：</b>'+escape(row.explanation)+'</p>'+
          (q.type==='subjective'?'<p class="exam-review-warning">主观题只提供参考要点，不生成自动得分或自动正确结论。</p>':'')+
          '</div></details>';
      }).join('');
      app.innerHTML='<section class="exam-screen"><div class="exam-kicker">已交卷 · 内部暂定长时训练</div>'+
        '<h1>本轮训练核对</h1>'+
        '<p>'+escape(name[current.subject])+' · '+report.questionCount+'题 · '+
        (current.endReason==='timeout'?'时间结束自动交卷':'手动交卷')+'</p>'+
        '<div class="exam-result-grid">'+
        '<div><b>'+report.objectiveCorrect+' / '+report.objectiveTotal+'</b><span>客观题答对／客观题总数</span></div>'+
        '<div><b>'+report.objectiveAnswered+'</b><span>已作答客观题</span></div>'+
        '<div><b>'+report.subjectivePending+'</b><span>主观题待核对</span></div>'+
        '<div><b>'+report.unanswered+'</b><span>未作答题</span></div></div>'+
        '<p class="exam-result-warning">这是71课内部草稿训练核对，非正式模考、非考研成绩。主观题不自动评分，不能推断350+、录取概率或考纲覆盖率。</p>'+
        '<p>严格计时：退出、后台或关闭页面均不暂停；到期后恢复时自动交卷。</p><h2>薄弱模块与下一步</h2>'+diagnosis.map(x=>'<p>'+escape(x.title)+'：客观题'+x.correct+'/'+x.objective+'；待核对'+x.pending+'。'+escape(x.next)+'</p>').join('')+'<h2>逐题核对</h2>'+rows+'<h2>主观题人工自评</h2><div id="exam-self-review"></div>'+
        '<div class="exam-nav"><button class="btn block" id="exam-to-home">返回学习首页</button></div></section>';
      renderSelfReview();app.querySelector('#exam-to-home').addEventListener('click',()=>act(overview));
    }
  }
  // Reserved for shared UI helpers; runtime behaviour lives inside mount below.

  global.MockExamUI=Object.freeze({mount});
})(window);
