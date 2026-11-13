'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const playwright=require('../product-2028-ci/node_modules/playwright');
const receipt=require('./build-receipt.json');
const dir=path.join(__dirname,'.build'),allowed=new Set(receipt.files.map(x=>x.path));
const type=name=>name.endsWith('.js')?'application/javascript':name.endsWith('.json')?'application/json':name.endsWith('.css')?'text/css':name.endsWith('.svg')?'image/svg+xml':'text/html;charset=utf-8';
const results=[];
async function testBrowser(name){
 let server,browser,context,page;
 const report={browser:name,pass:false,syntheticOnly:true,realIPhone:false,productionRelease:false};
 try{
  server=http.createServer((req,res)=>{
   const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!allowed.has(file)){res.writeHead(403);return res.end('Forbidden');}
   res.writeHead(200,{'Content-Type':type(file),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(dir,file)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await playwright[name].launch();
  context=await browser.newContext({...playwright.devices['iPhone 13']});
  page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);
  await page.locator('#name').waitFor({timeout:12000});
  await page.locator('#name').fill('手机UX自动测试');
  await page.locator('#create').click();
  await page.locator('#mobile-resume').waitFor({timeout:12000});
  const all=page.locator('#course-catalog [data-subject]');
  assert.equal(await all.count(),47);
  assert.equal(await all.filter({visible:true}).count(),8);
  assert.equal(await page.locator('#mobile-subject-tabs').count(),0);
  assert.match(await page.locator('.mobile-next-task').innerText(),/只安排一项/);
  const tab=subject=>page.locator('.mobile-subject-tabs [data-filter="'+subject+'"]');
  await tab('en').click();
  assert.equal(await tab('en').getAttribute('aria-pressed'),'true');
  assert.match(await page.locator('#mobile-course-count').innerText(),/8 \/ 15 门/);
  await page.locator('#mobile-toggle-all').click();
  assert.equal(await all.filter({visible:true}).count(),15);
  assert.match(await page.locator('#mobile-toggle-all').innerText(),/收起/);
  await tab('pol').click();
  assert.match(await page.locator('#mobile-course-count').innerText(),/8 \/ 14 门/);
  await tab('353').click();
  assert.match(await page.locator('#mobile-course-count').innerText(),/8 \/ 18 门/);
  await page.locator('#course-search').fill('正态分布');
  assert.equal(await all.filter({visible:true}).count(),1);
  assert.match(await page.locator('#mobile-course-count').innerText(),/1 \/ 1 门/);
  await page.locator('#course-search').fill('完全不存在的知识点');
  assert.equal(await all.filter({visible:true}).count(),0);
  assert.match(await page.locator('#mobile-course-count').innerText(),/没有找到匹配课程/);
  await page.locator('#course-search').fill('');
  await tab('all').click();
  await page.locator('#subject-filter').selectOption('en');
  assert.equal(await tab('en').getAttribute('aria-pressed'),'true');
  await tab('all').click();
  for(const v of ['en','pol','353','all']){
   const b=tab(v);
   const box=await b.boundingBox();
   assert(box&&box.height>=44&&box.width>=40,'touch target too small: '+v);
  }
  // Public site must never imply official syllabus coverage or approved teaching.
  const raw=await page.request.get(base+'representative-courses.json');
  const pack=await raw.json();
  assert.equal(pack.units.length,47);
  assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
  assert(pack.units.every(u=>u.reviewRecord?.expertApproved!==true));
  assert.equal((await page.evaluate(()=>ProfileRepository.DRAFT_DB)),'qh2028_mobile_ux_v2_local');
  await page.locator('#mobile-resume').click();
  await page.locator('.current-stage').waitFor();
  assert.match(await page.locator('.current-stage').innerText(),/现在：学习/);
  assert.match(await page.locator('#app').innerText(),/先找句子骨架/);
  await page.locator('#learned').click();
  await page.locator('#answer').fill('自动测试闭卷：S主语，V谓语，O宾语');
  await page.locator('#recall').click();
  const saved=await page.evaluate(()=>profile.exportBackup());
  assert(saved.events.some(x=>x.action==='recalled'));
  await page.locator('#back').click();
  assert.match(await page.locator('.mobile-next-task').innerText(),/继续上次进度/);
  await page.reload();
  await page.getByRole('button',{name:/^继续 手机UX自动测试/}).click();
  const after=await page.evaluate(()=>profile.exportBackup());
  assert.deepEqual(after,saved,'home reopen must not change learner backup');
  await page.locator('#mobile-resume').click();
  assert.match(await page.locator('.current-stage').innerText(),/现在：练题/);
  assert.equal(errors.length,0,'JS errors: '+errors.join(','));
  report.pass=true;report.courseCount=47;report.questionCount=524;report.subjectFilter=true;report.search=true;report.touchTargets=true;report.resume=true;report.dataRetention=true;
 }catch(e){report.error=e.stack||String(e);}
 finally{
  results.push(report);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 }
}
(async()=>{
 for(const name of ['chromium','webkit'])await testBrowser(name);
 const output={pass:results.every(x=>x.pass),results,realIPhone:false,expertApproved:0,formalRelease:false};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(output,null,2));
 console.log(JSON.stringify(output));
 if(!output.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
