'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const pw=require('../product-2028-ci/node_modules/playwright');
const receipt=require('./build-receipt.json');
const root=path.join(__dirname,'.build'),files=new Set(receipt.files.map(f=>f.path));
const mime=f=>f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':f.endsWith('.json')?'application/json':f.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';
const results=[];
async function testBrowser(browserName){
 let server,browser,ctx,page;
 const row={browser:browserName,pass:false,syntheticOnly:true,realIPhone:false,professionalApproval:false};
 try{
  server=http.createServer((req,res)=>{
   const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!files.has(name)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(name),'Cache-Control':'no-cache'});
   res.end(fs.readFileSync(path.join(root,name)));
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  browser=await pw[browserName].launch();
  ctx=await browser.newContext({...pw.devices['iPhone 13']});
  page=await ctx.newPage();
  const base='http://127.0.0.1:'+server.address().port+'/';
  const jsErrors=[];
  page.on('pageerror',error=>jsErrors.push(error.message));
  await page.goto(base);
  await page.locator('#name').waitFor({timeout:15000});
  assert.match(await page.locator('body').innerText(),/V4/);
  await page.locator('#name').fill('英语全文朗读-合成验收');
  await page.locator('#create').click();
  await page.locator('#mobile-resume').waitFor({timeout:15000});
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),47);
  assert.equal(await page.locator('#course-catalog [data-subject]:visible').count(),8);
  assert.equal(await page.evaluate(()=>ProfileRepository.DRAFT_DB),'qh2028_reading_fullpassage_v4');
  const pack=await (await page.request.get(base+'representative-courses.json')).json();
  assert.equal(pack.units.length,47);
  assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
  assert(pack.units.every(u=>u.reviewRecord?.expertApproved!==true));
  const read=pack.units.find(u=>u.id==='en-reading-evidence-foundation');
  assert(read&&read.basicQuestions.length>0&&read.delayedQuestions.length>0);
  const originalA=read.basicQuestions[0].stem.split('\n\n')[0].split('\n');
  const originalB=read.delayedQuestions[0].stem.split('\n\n')[0].split('\n');
  assert.equal(originalA.length,7);assert.equal(originalB.length,6);
  const backupBefore=await page.evaluate(()=>profile.exportBackup());
  const start=await page.evaluate(()=>{
   const unit=pack.units.find(u=>u.id==='en-reading-evidence-foundation');
   const lesson=document.createElement('section');
   lesson.id='v4-lesson-fixture';lesson.innerHTML='<section class="card"><button id="learned">开始闭卷</button></section>';
   document.querySelector('#app').append(lesson);
   ReadingPassage.enhance({app:lesson,unit,session:{stage:'learn'}});
   return ReadingPassage.extractPassage(unit.basicQuestions[0].stem);
  });
  assert.equal(start.length,7);
  assert.deepEqual(start.map(x=>x.id),['A1','A2','A3','A4','A5','A6','A7']);
  assert.deepEqual(start.map(x=>x.id+' '+x.text),originalA,'must preserve original numbered English text');
  assert.equal(await page.locator('#v4-lesson-fixture [data-passage-id]').count(),7);
  assert.equal(await page.locator('#v4-lesson-fixture details').getAttribute('open'),'');
  assert.match(await page.locator('#v4-lesson-fixture').innerText(),/原创内部教学短文，不是考研真题/);
  const available=await page.evaluate(()=>{
   window.__spoken=[];
   try{
    Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(t){this.text=t;}});
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
      cancel(){window.__spoken.push({action:'cancel'});},
      speak(utterance){window.__spoken.push({action:'speak',text:utterance.text,rate:utterance.rate,lang:utterance.lang});}
    }});
    return true;
   }catch(e){return String(e);}
  });
  assert.equal(available,true);
  await page.locator('#v4-lesson-fixture .passage-rate').selectOption('1');
  await page.locator('#v4-lesson-fixture [data-passage-id="A3"] .passage-play-line').click();
  const single=await page.evaluate(()=>window.__spoken.filter(x=>x.action==='speak').at(-1));
  assert.deepEqual(single,{action:'speak',text:start[2].text,rate:1,lang:'en-US'});
  await page.locator('#v4-lesson-fixture .passage-rate').selectOption('0.75');
  await page.locator('#v4-lesson-fixture .passage-play-all').click();
  const full=await page.evaluate(()=>window.__spoken.filter(x=>x.action==='speak').at(-1));
  assert.deepEqual(full,{action:'speak',text:start.map(x=>x.text).join(' '),rate:0.75,lang:'en-US'});
  assert.equal(await page.locator('#v4-lesson-fixture .passage-lines.passage-speaking').count(),1);
  await page.locator('#v4-lesson-fixture .passage-stop').click();
  assert.equal(await page.locator('#v4-lesson-fixture .passage-lines.passage-speaking').count(),0);
  assert.match(await page.locator('#v4-lesson-fixture .passage-audio-status').innerText(),/停止/);
  await page.evaluate(()=>{
   const unit=pack.units.find(u=>u.id==='en-reading-evidence-foundation');
   const exercise=document.createElement('section');
   exercise.id='v4-exercise-fixture';
   exercise.innerHTML='<section class="card"><label>答题<input id="test-answer" value="保存我输入的答案"></label></section>';
   document.querySelector('#app').append(exercise);
   ReadingPassage.enhance({app:exercise,unit,session:{stage:'practice',mode:'review'},question:unit.delayedQuestions[0]});
  });
  assert.equal(await page.locator('#v4-exercise-fixture details').getAttribute('open'),null);
  await page.locator('#v4-exercise-fixture summary').click();
  assert.equal(await page.locator('#v4-exercise-fixture [data-passage-id]').count(),6);
  const b=await page.locator('#v4-exercise-fixture [data-passage-id]').evaluateAll(nodes=>nodes.map(node=>node.querySelector('.passage-line-id').textContent+' '+node.querySelector('.passage-line-text').textContent));
  assert.deepEqual(b,originalB,'delayed review must use the distinct B original passage');
  assert.equal(await page.locator('#test-answer').inputValue(),'保存我输入的答案');
  await page.evaluate(()=>{
    const root=document.getElementById('v4-exercise-fixture');
    root.remove();
    const unit=pack.units.find(u=>u.id==='en-reading-evidence-foundation');
    const feedback=document.createElement('section');
    feedback.id='v4-feedback-fixture';
    feedback.innerHTML='<section class="card"><input id="already-saved" value="不要覆盖"></section>';
    document.querySelector('#app').append(feedback);
    ReadingPassage.enhance({app:feedback,unit,session:{stage:'feedback',feedback:{questionSnapshot:unit.delayedQuestions[0]}}});
    const nonReader=document.createElement('section');nonReader.id='v4-unrelated-fixture';
    nonReader.innerHTML='<section class="card"><input value="unchanged"></section>';
    document.querySelector('#app').append(nonReader);
    ReadingPassage.enhance({app:nonReader,unit:pack.units.find(u=>u.id==='pol-practice-verification'),session:{stage:'learn'}});
  });
  assert.equal(await page.locator('#v4-feedback-fixture [data-passage-id]').count(),6);
  assert.equal(await page.locator('#already-saved').inputValue(),'不要覆盖');
  assert.equal(await page.locator('#v4-unrelated-fixture .english-passage-reader').count(),0);
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),backupBefore,'passage controls cannot mutate learner profile');
  assert.deepEqual(jsErrors,[]);
  row.pass=true;row.courses=47;row.questions=524;row.aLines=7;row.bLines=6;
  row.speechSentence=true;row.speechFull=true;row.speechSpeed=true;row.feedbackSnapshot=true;row.dataUnchanged=true;
 }catch(e){row.error=e.stack||String(e);}
 finally{
  results.push(row);
  await ctx?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
 }
}
(async()=>{
 for(const name of ['chromium','webkit'])await testBrowser(name);
 const result={pass:results.every(x=>x.pass),results,realIPhone:false,formalRelease:false,expertApprovals:0};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 if(!result.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
