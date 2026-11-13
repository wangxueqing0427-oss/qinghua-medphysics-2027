'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const playwright=require('../product-2028-ci/node_modules/playwright');
const receipt=require('./build-receipt.json');
const root=path.join(__dirname,'.build'),allowed=new Set(receipt.files.map(x=>x.path));
const mime=s=>s.endsWith('.js')?'application/javascript':s.endsWith('.json')?'application/json':s.endsWith('.css')?'text/css':s.endsWith('.svg')?'image/svg+xml':'text/html;charset=utf-8';
const results=[];
async function one(name){
 let server,browser,context,page;const row={browser:name,pass:false,syntheticOnly:true,realIPhone:false};
 try{
  server=http.createServer((req,res)=>{
   const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!allowed.has(file)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(root,file)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await playwright[name].launch();
  context=await browser.newContext({...playwright.devices['iPhone 13']});
  page=await context.newPage();
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base);
  await page.locator('#name').waitFor({timeout:15000});
  await page.locator('#name').fill('阅读V3合成学员');
  await page.locator('#create').click();
  await page.locator('#mobile-resume').waitFor({timeout:15000});
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),47);
  assert.equal(await page.locator('#course-catalog [data-subject]:visible').count(),8);
  assert.equal(await page.evaluate(()=>ProfileRepository.DRAFT_DB),'qh2028_mobile_reading_v3_local');
  const pack=await (await page.request.get(base+'representative-courses.json')).json();
  const svo=pack.units.find(u=>u.id==='en-foundation-svo');
  assert.equal(pack.units.length,47);
  assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
  assert(pack.units.every(u=>u.reviewRecord?.expertApproved!==true));
  const oldBackup=await page.evaluate(()=>profile.exportBackup());
  await page.locator('#mobile-resume').click();
  await page.locator('.mobile-reading').waitFor();
  assert.equal(await page.locator('.mobile-reading').textContent(),svo.explanation,'new paragraph rendering must preserve every character');
  assert(await page.locator('.reading-paragraph').count()>=3,'long text not split into readable paragraphs');
  await page.locator('[data-reading-size="large"]').click();
  assert.equal(await page.locator('.mobile-reading').getAttribute('data-reader-size'),'large');
  assert.equal(await page.locator('[data-reading-size="large"]').getAttribute('aria-pressed'),'true');
  const expected=await page.evaluate(()=>MobileReading.firstEnglishSentence(pack.units.find(u=>u.id==='en-foundation-svo').example));
  assert(expected.includes('Children water the flowers.'));
  assert.equal((await page.locator('.speech-phrase').textContent()).trim(),expected);
  assert((await page.locator('.speech-hint').innerText()).includes('本机'));
  const speakerAvailable=await page.evaluate(()=>{
    window.__spoken=[];
    try{
      Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(text){this.text=text;}});
      Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
        cancel(){window.__spoken.push({type:'cancel'});},
        speak(u){window.__spoken.push({type:'speak',text:u.text,lang:u.lang,rate:u.rate});}
      }});
      return true;
    }catch(e){return String(e);}
  });
  assert.equal(speakerAvailable,true,'Browser TTS test stub not installed');
  await page.locator('.speech-play').click();
  const tts=await page.evaluate(()=>window.__spoken.find(x=>x.type==='speak'));
  assert.deepEqual(tts,{type:'speak',text:expected,lang:'en-US',rate:0.85});
  await page.locator('.speech-stop').click();
  assert((await page.locator('.speech-hint').innerText()).includes('停止'));
  assert((await page.evaluate(()=>window.__spoken)).filter(x=>x.type==='cancel').length>=2);
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),oldBackup,'reading and sound controls must not modify progress');
  await page.locator('#learned').click();
  await page.waitForFunction(()=>document.querySelector('.current-stage')?.textContent==='现在：闭卷');
  assert.equal(await page.locator('.mobile-reading').count(),0);
  await page.locator('#answer').fill('S主语 V谓语 O宾语。');
  await page.locator('#recall').click();
  await page.locator('[role="progressbar"]').waitFor({timeout:12000});
  assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'0');
  assert((await page.locator('.practice-progress').innerText()).includes('0 / 3'));
  const before=await page.evaluate(()=>profile.exportBackup());
  await page.locator('input[name="pick"][value="1"]').check();
  await page.locator('#submit').click();
  await page.waitForFunction(()=>document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')==='1');
  assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'1');
  assert((await page.locator('.practice-progress').innerText()).includes('1 / 3'));
  await page.locator('#next').click();
  await page.waitForFunction(()=>document.querySelector('.current-stage')?.textContent==='现在：练题'&&document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')==='1');
  assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'1');
  const saved=await page.evaluate(()=>profile.exportBackup());
  assert(saved.events.length>before.events.length);
  await page.locator('#back').click();
  await page.locator('#mobile-resume').waitFor({timeout:12000});
  await page.reload();
  await page.getByRole('button',{name:/^继续 阅读V3合成学员/}).click();
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),saved,'V3 reload changed original answer records');
  await page.locator('#mobile-resume').click();
  assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'1');
  assert.deepEqual(pageErrors,[],'JavaScript errors');
  row.pass=true;row.courses=47;row.questions=524;row.textIntegrity=true;row.fontControl=true;row.speechApiDelegation=true;row.practiceProgress=true;row.reloadPreservesData=true;
 }catch(e){row.error=e.stack||String(e);}
 finally{
  results.push(row);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 }
}
(async()=>{
 for(const name of ['chromium','webkit'])await one(name);
 const result={pass:results.every(x=>x.pass),results,realIPhone:false,expertApproved:0,formalRelease:false};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 if(!result.pass)process.exitCode=1;
})().catch(err=>{console.error(err);process.exitCode=1;});
