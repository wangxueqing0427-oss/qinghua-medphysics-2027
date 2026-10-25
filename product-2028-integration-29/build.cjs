// Isolated preview: never invoke the existing R5 builder or modify its output.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),{combined}=require('../product-2028-draft/course-development-2026-10-25/load-batch.cjs');
const root=path.resolve(__dirname,'..'),src=path.join(root,'product-2028-draft'),out=path.join(__dirname,'.build');fs.mkdirSync(out,{recursive:true});
const pack=combined(),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),entries=[];
for(const name of ['index.html','app.css','icon.svg','manifest.json','course-engine.cjs','profile-repository.cjs','learning-controller.cjs','pilot-ui.js','representative-courses.json','sw.js']){
 let text=name==='representative-courses.json'?JSON.stringify(pack,null,2):fs.readFileSync(path.join(src,name),'utf8');
 if(name==='index.html'||name==='sw.js')for(const file of ['course-engine','profile-repository','learning-controller'])text=text.replaceAll(file+'.cjs',file+'.js');
 if(name==='index.html')text=text.replaceAll('2028备考测试版 R5','2028备考29课隔离验证 SET29');
 if(name==='pilot-ui.js')text=text.replace('qh2028_product_pending_v1:','qh2028_set29_pending_v1:').replaceAll('独立测试构建 R5','29课隔离验证 SET29');
 if(name==='profile-repository.cjs')text=text.replace("const DRAFT_DB='qh2028_product_draft_v1';","const DRAFT_DB='qh2028_isolated_set29_v1';");
 if(name==='manifest.json'){const m=JSON.parse(text);m.name='2028备考29课隔离验证';m.short_name='SET29验证';text=JSON.stringify(m);}
 if(name==='sw.js')text=text.replace('qh2028-product-pilot-r5','qh2028-isolated-set29-'+hash(JSON.stringify(entries)).slice(0,12));
 const target=name.replace(/\.cjs$/,'.js');fs.writeFileSync(path.join(out,target),text);entries.push({path:target,sha256:hash(Buffer.from(text)),source:name==='representative-courses.json'?'existing combined29 loader':('product-2028-draft/'+name)});
}
const report={scope:'Local/CI29-course isolated preview only; no remote site or release',units:pack.units.length,questions:pack.units.flatMap(u=>['basicQuestions','applicationQuestions','delayedQuestions'].flatMap(k=>u[k])).length,port:5289,database:'qh2028_isolated_set29_v1',journal:'qh2028_set29_pending_v1:',expertApproved:0,files:entries};
fs.writeFileSync(path.join(__dirname,'build-manifest.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({units:report.units,questions:report.questions,output:out,deployed:false}));
