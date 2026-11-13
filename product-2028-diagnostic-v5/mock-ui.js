'use strict';
// UI for a *non-official*, non-full-length diagnostic mini-test.
// Persists to the current isolated learner profile settings (included in regular backup).
(function(global){
  const M=global.MockExamEngine;
  const KEY='diagnosticExamV5';
  const name=M.SUBJECT_NAMES;
  const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const choiceName=i=>String.fromCharCode(65+i);
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
    function stopTicker(){if(ticker!==null){clearInterval(ticker);ticker=null;}}
    async function reload(){
      const backup=await profile.exportBackup();
      store=backup.profile?.settings?.[KEY]||{history:[],current:null};
      if(!Array.isArray(store.history)||typeof store!=='object')throw Error('测评档案结构不正确，已停止以避免覆盖');
      current=store.current||null;
      if(current)M.check(current,pack);
      return store;
    }
    async function persist(next,newHistory){
      M.check(next,pack);
      const history=newHistory===undefined?store.history:newHistory;
      if(!Array.isArray(history))throw Error('测评历史无效');
      // Preserve history within existing full profile backup; no separate localStorage.
      await profile.updateSettings({[KEY]:{history,current:next}});
      store={history,current:next};current=next;
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
      await persist(M.submit(current,pack,new Date().toISOString(),reason));
      renderResult();
    }
    async function openSaved(){
      await reload();
      if(!current)return;
      if(!current.submittedAt&&remaining(current)===0)await finish('timeout');
      else if(current.submittedAt)renderResult();
      else renderExam();
    }
    function mountButton(){
      const slot=document.createElement('section');
      slot.className='exam-start-card';
      slot.setAttribute('aria-label','三科诊断小测');
      slot.innerHTML='<div class="exam-kicker">阶段诊断 · 内部题库</div>'+
        '<h2>手机诊断小测</h2>'+
        '<p>用已有47课草稿中的题目练习答题与交卷，支持计时、断点续答、客观题核对和主观题待核对。<strong>不是全真模拟考试，不换算考研分数。</strong></p>'+
        '<label>选择测评范围<select id="exam-subject">' +
        Object.entries(name).map(([code,title])=>'<option value="'+code+'">'+title+'</option>').join('')+
        '</select></label>'+
        '<p class="exam-notice">单科8题／20分钟；三科混合12题／30分钟。时间是练习设定，不是正式考试时间。答案保存在当前本机学习档案及其备份中。</p>'+
        '<button class="btn block exam-launch" id="exam-launch" type="button">开始诊断小测</button>'+
        '<div id="exam-history" class="exam-history"></div>';
      const anchor=app.querySelector('.mobile-next-task');
      if(anchor)anchor.after(slot);
      else app.querySelector('h1')?.after(slot);
      return slot;
    }
    const slot=mountButton();
    reload().then(()=>{
      const launch=slot.querySelector('#exam-launch'),hist=slot.querySelector('#exam-history');
      if(!slot.isConnected)return;
      if(current&&!current.submittedAt){
        launch.textContent='继续未交卷的小测';
        slot.querySelector('#exam-subject').disabled=true;
      } else if(current?.submittedAt){
        launch.textContent='开始下一次诊断小测';
        const view=document.createElement('button');
        view.className='btn ghost block exam-view-result';
        view.type='button';
        view.textContent='查看上一次诊断结果';
        view.onclick=()=>act(async()=>{await reload();renderResult();});
        hist.append(view);
      }
      const count=store.history?.length||0;
      if(count){
        const p=document.createElement('p');p.className='exam-notice';
        p.textContent='本档案已保存 '+count+' 次更早的诊断练习；旧结果保留在完整本机备份中。';
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
        '<div class="exam-kicker">内部诊断小测 · 非全真、非正式评分</div>'+
        '<h1>'+escape(name[current.subject])+' · 第 '+(i+1)+' / '+count+' 题</h1>'+
        '<p>倒计时 <strong id="exam-clock" aria-live="off">'+clockText(remaining(current))+'</strong> · 已保存 '+saved+' 题</p>'+
        '<div class="exam-progress" role="progressbar" aria-label="本轮题目位置" aria-valuemin="0" aria-valuemax="'+count+'" aria-valuenow="'+(i+1)+'">'+
        '<div style="width:'+Math.round((i+1)/count*100)+'%"></div></div>'+
        '</header><section class="card exam-question">'+
        '<p class="exam-unit">科目：'+escape(name[ref.subject])+' · 课程：'+escape(unit.title)+'</p>'+
        '<h2 class="exam-stem">'+escape(q.stem)+'</h2>'+form+
        '<p class="exam-notice">点击下方导航后保存本题；未提交前不公开答案。离开或刷新后可从本机档案继续。</p>'+
        '</section><div class="exam-nav">'+
        '<button class="btn ghost" id="exam-prev" type="button" '+(i===0?'disabled data-stay-disabled="true"':'')+'>上一题并保存</button>'+
        '<button class="btn" id="exam-next" type="button" '+(i===count-1?'disabled data-stay-disabled="true"':'')+'>下一题并保存</button>'+
        '<button class="btn ghost" id="exam-skip" type="button">跳过本题</button>'+
        '<button class="btn exam-submit" id="exam-submit" type="button">交卷并查看结果</button>'+
        '</div><p id="exam-tip" class="exam-notice" role="status"></p></section>';
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
          if(remaining(current)>0){
            const updated=M.setAnswer(current,pack,i,readForm(q),new Date().toISOString());
            await persist(updated);
          }
          await finish('manual');
        });
      });
    }
    function renderResult(){
      stopTicker();
      const report=M.report(current,pack,global.CourseEngine);
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
      app.innerHTML='<section class="exam-screen"><div class="exam-kicker">已交卷 · 内部诊断小测</div>'+
        '<h1>本轮诊断结果</h1>'+
        '<p>'+escape(name[current.subject])+' · '+report.questionCount+'题 · '+
        (current.endReason==='timeout'?'时间结束自动交卷':'手动交卷')+'</p>'+
        '<div class="exam-result-grid">'+
        '<div><b>'+report.objectiveCorrect+' / '+report.objectiveTotal+'</b><span>客观题答对／客观题总数</span></div>'+
        '<div><b>'+report.objectiveAnswered+'</b><span>已作答客观题</span></div>'+
        '<div><b>'+report.subjectivePending+'</b><span>主观题待核对</span></div>'+
        '<div><b>'+report.unanswered+'</b><span>未作答题</span></div></div>'+
        '<p class="exam-result-warning">这是47课内部草稿诊断结果，非正式模考、非考研成绩。主观题不自动评分，不能推断350+、录取概率或考纲覆盖率。</p>'+
        '<h2>逐题核对</h2>'+rows+
        '<div class="exam-nav"><button class="btn block" id="exam-to-home">返回学习首页</button></div></section>';
      app.querySelector('#exam-to-home').addEventListener('click',()=>act(overview));
    }
  }
  global.MockExamUI=Object.freeze({mount});
})(window);
