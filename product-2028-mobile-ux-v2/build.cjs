'use strict';
// Isolated mobile UX candidate. Reuses the verified 47-course/524-question output
// without modifying any original build, learning data, or production branches.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,up=path.join(dir,'../product-2028-integration-47-upgraded'),source=path.join(up,'.build'),out=path.join(dir,'.build');
const prior=require('../product-2028-integration-47-upgraded/build-receipt.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function once(s,oldText,newText){assert.equal(s.split(oldText).length,2,'Patch anchor differs: '+oldText);return s.replace(oldText,newText);}
assert.equal(prior.courses,47);assert.equal(prior.questions,524);
assert.equal(prior.professionalApprovals,0);assert.equal(prior.releaseApproved,false);
const edition='qh2028-mobile-ux-v2',db='qh2028_mobile_ux_v2_local',journal='qh2028_mobile_ux_v2_pending:',
  cache='qh2028-mobile-ux-v2';
assert.notEqual(db,prior.db);
const additions=['mobile-ux.js'],base=prior.files.map(f=>f.path);
const expected=[...base,...additions];
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected build output, refusing overwrite');
fs.mkdirSync(out,{recursive:true});
const built=[];
for(const file of prior.files){
 const input=fs.readFileSync(path.join(source,file.path));
 assert.equal(hash(input),file.sha256,'Source protected build changed: '+file.path);
 let s=input.toString('utf8');
 if(file.path==='profile-repository.js'){
   s=once(s,"const DRAFT_DB='qh2028_set47_svo6_research_v1';","const DRAFT_DB='"+db+"';");
 }
 if(file.path==='pilot-ui.js'){
   s=once(s,"const EDITION='qh2028-set47-svo6-research-1';","const EDITION='"+edition+"';");
   s=once(s,"const JOURNAL='qh2028_set47_svo6_pending_v1:';","const JOURNAL='"+journal+"';");
   s=once(s,"'qinghua-2028-set47-svo6-backup.json'","'qinghua-2028-mobile-ux-v2-backup.json'");
   s=once(s,"bind('plan',async()=>{await profile.updateSettings({dailyMinutes:Number(document.getElementById('minutes').value)||90,learningMode:document.getElementById('mode').value||'normal'});await overview();});}",
     "bind('plan',async()=>{await profile.updateSettings({dailyMinutes:Number(document.getElementById('minutes').value)||90,learningMode:document.getElementById('mode').value||'normal'});await overview();});MobileUX.enhance({app,pack,plan,act,openUnit});}");
   s=once(s,'47课524题内部整合 SET47-SVO6','47课524题手机学习台 · UX V2');
 }
 if(file.path==='app.css'){
   s+='\n'+fs.readFileSync(path.join(dir,'mobile-ux.css'),'utf8')+'\n';
 }
 if(file.path==='index.html'){
   s=once(s,'<script src="pilot-ui.js"></script>','<script src="mobile-ux.js"></script><script src="pilot-ui.js"></script>');
   s=s.replaceAll('47课524题整合预检 SET47-SVO6','47课524题手机交互内测 UX V2');
 }
 if(file.path==='manifest.json'){
   const m=JSON.parse(s);
   Object.assign(m,{name:'清华2028三科手机学习台 · 内部测试',short_name:'2028手机内测',id:'./?edition='+edition});
   s=JSON.stringify(m);
 }
 if(file.path==='sw.js'){
   s=once(s,"const CACHE='qh2028-set47-svo6-research-v1';","const CACHE='"+cache+"';");
   s=once(s,"'./pilot-ui.js'","'./mobile-ux.js','./pilot-ui.js'");
 }
 const bytes=Buffer.from(s),target=path.join(out,file.path);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(bytes),'Refuse to overwrite differing output: '+file.path);
 else fs.writeFileSync(target,bytes,{flag:'wx'});
 built.push({path:file.path,sha256:hash(bytes),sourceSha256:file.sha256,changed:hash(bytes)!==file.sha256});
}
for(const extra of additions){
 const buf=fs.readFileSync(path.join(dir,extra)),target=path.join(out,extra);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(buf));
 else fs.writeFileSync(target,buf,{flag:'wx'});
 built.push({path:extra,sha256:hash(buf),changed:true});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const pack=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
const q=pack.units.flatMap(u=>u.basicQuestions.concat(u.applicationQuestions,u.delayedQuestions));
assert.equal(pack.units.length,47);assert.equal(q.length,524);
assert(!pack.units.some(u=>u.reviewRecord?.expertApproved===true));
const receipt={edition,courses:47,questions:524,db,journal,cache,priorEdition:prior.edition,
  newExpertApprovals:0,sourceCourseDigest:hash(fs.readFileSync(path.join(out,'representative-courses.json'))),
  deployed:false,formalReleaseApproved:false,realIPhoneTest:false,files:built};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({candidate:edition,courses:47,questions:524,assets:built.length,noProductionWrites:true,deployed:false}));
