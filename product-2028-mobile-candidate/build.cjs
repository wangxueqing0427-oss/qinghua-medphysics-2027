// Dedicated2028 candidate; reuse existing UI/engine/repository without modifying their source or SET47 output.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{combined}=require('../product-2028-draft/course-development-2026-10-25-fourth/load-batch.cjs');
const root=path.resolve(__dirname,'..'),src=path.join(root,'product-2028-draft'),out=path.join(__dirname,'.build'),EDITION='qh2028-mobile-candidate-c1',DB='qh2028_mobile_candidate_v1',JOURNAL='qh2028_mobile_candidate_pending_v1:',LABEL='2028新版手机候选 MOBILE-C1';
function once(s,from,to){if(s.split(from).length!==2)throw Error('Source anchor changed: '+from);return s.replace(from,to);}
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),pack=combined(),files=[];fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','app.css','icon.svg','manifest.json','course-engine.cjs','profile-repository.cjs','learning-controller.cjs','pilot-ui.js','representative-courses.json','sw.js']){
 let s=name==='representative-courses.json'?JSON.stringify(pack,null,2):fs.readFileSync(path.join(src,name),'utf8');
 if(name==='index.html'||name==='sw.js')for(const file of ['course-engine','profile-repository','learning-controller'])s=s.replaceAll(file+'.cjs',file+'.js');
 if(name==='index.html')s=s.replaceAll('2028备考测试版 R5',LABEL);
 if(name==='profile-repository.cjs')s=once(s,"const DRAFT_DB='qh2028_product_draft_v1';","const DRAFT_DB='"+DB+"';");
 if(name==='pilot-ui.js'){
  s=once(s,"'use strict';","'use strict';\nconst EDITION='"+EDITION+"';");
  s=once(s,'qh2028_product_pending_v1:',JOURNAL).replaceAll('独立测试构建 R5',LABEL).replaceAll(' · iPhone反馈集中修复 · 非正式课程版',' · 从零学习 · 47课523题 · 内容待审校');
  s=once(s,'新档案从零开始；原V59数据不会导入或修改。','新档案从零开始，无需旧版进度。仅恢复本候选新学习数据的备份。');
  s=once(s,"app.innerHTML='<h1>现在只做一项</h1>","app.innerHTML='<h1>现在只做一项</h1><p>新版档案独立保存，无需旧版进度；已有新版记录会继续保留。</p>");
  s=once(s,"{displayName:document.getElementById('name').value","{candidateEdition:EDITION,displayName:document.getElementById('name').value");
  s=once(s,'profile=await repository.restoreAsNewProfile(crypto.randomUUID(),JSON.parse(await file.text()));',"const backup=JSON.parse(await file.text());if(backup.profile?.settings?.candidateEdition!==EDITION)throw Error('仅支持本候选导出的新学习档案备份；旧版无需迁移，原文件未修改');profile=await repository.restoreAsNewProfile(crypto.randomUUID(),backup);");
  s=s.replaceAll('qinghua-2028-local-backup.json','qinghua-2028-mobile-c1-backup.json');
  s=once(s,"+pack.units.map(u=>","+'<label>课程科目<select id=\"course-subject\"><option value=\"all\">全部课程</option><option value=\"en\">英语</option><option value=\"pol\">政治</option><option value=\"353\">353卫生综合</option></select></label>'+pack.units.map(u=>");
  s=once(s,"return '<section class=\"card\"><h2>'+esc(u.title)","return '<section class=\"card\" data-course-subject=\"'+esc(u.subject)+'\"><h2>'+esc(u.title)");
  s=once(s,"app.querySelectorAll('[data-unit]').forEach","document.getElementById('course-subject').onchange=e=>{for(const card of app.querySelectorAll('[data-course-subject]'))card.hidden=e.target.value!=='all'&&card.dataset.courseSubject!==e.target.value;};app.querySelectorAll('[data-unit]').forEach");
 }
 if(name==='manifest.json'){const m=JSON.parse(s);m.name='清华医学物理2028 · 独立手机候选';m.short_name='2028候选C1';m.id='./?edition=mobile-c1';m.start_url='./';m.scope='./';s=JSON.stringify(m);}
 if(name==='sw.js')s=once(s,'qh2028-product-pilot-r5','qh2028-mobile-candidate-c1-'+hash(JSON.stringify(files)).slice(0,12));
 const target=name.replace(/\.cjs$/,'.js');fs.writeFileSync(path.join(out,target),s);files.push({path:target,sha256:hash(Buffer.from(s)),source:name==='representative-courses.json'?'unchanged combined47 loader':'product-2028-draft/'+name});
}
const report={scope:'Local/CI dedicated mobile candidate only; not deployed or full curriculum acceptance',edition:EDITION,label:LABEL,courses:pack.units.length,questions:pack.units.flatMap(u=>[...u.basicQuestions,...u.applicationQuestions,...u.delayedQuestions]).length,database:DB,journal:JOURNAL,port:5308,startsAtZero:true,oldProgressMigration:false,backupBoundary:'UI rejects foreign/missing edition marker; local safety guard, not authentication or cryptographic origin proof',expertApproved:0,files};fs.writeFileSync(path.join(__dirname,'build-manifest.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({courses:report.courses,questions:report.questions,edition:EDITION,deployed:false}));
