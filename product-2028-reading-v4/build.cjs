'use strict';
// Separate research-only V4 build. Exact 47 course/524 question data preserved.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,src=path.join(dir,'../product-2028-mobile-reading-v3/.build'),out=path.join(dir,'.build');
const prior=require('../product-2028-mobile-reading-v3/build-receipt.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Expected one patch anchor: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-mobile-reading-v3');
assert.equal(prior.courses,47);
assert.equal(prior.questions,524);
assert.equal(prior.independentProfessionalApproved,0);
const edition='qh2028-reading-fullpassage-v4',db='qh2028_reading_fullpassage_v4',
  journal='qh2028_reading_fullpassage_v4_pending:',cache='qh2028-reading-fullpassage-v4';
assert.notEqual(db,prior.db);
const extra=['reading-passage.js'],expected=prior.files.map(x=>x.path).concat(extra);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected existing build output');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const item of prior.files){
 const b=fs.readFileSync(path.join(src,item.path));
 assert.equal(hash(b),item.sha256,'Frozen V3 asset changed: '+item.path);
 let s=b.toString('utf8');
 if(item.path==='profile-repository.js')s=once(s,
   "const DRAFT_DB='qh2028_mobile_reading_v3_local';",
   "const DRAFT_DB='"+db+"';");
 if(item.path==='pilot-ui.js'){
   s=once(s,"const EDITION='qh2028-mobile-reading-v3';","const EDITION='"+edition+"';");
   s=once(s,"const JOURNAL='qh2028_mobile_reading_v3_pending:';","const JOURNAL='"+journal+"';");
   s=once(s,"'qinghua-2028-mobile-reading-v3-backup.json'",
     "'qinghua-2028-reading-fullpassage-v4-backup.json'");
   const old="MobileReading.enhance({app,unit:u,session,questionTotal:session.stage==='practice'||session.stage==='feedback'?controller.questions(session).length:undefined});";
   s=once(s,old,old+"ReadingPassage.enhance({app,unit:u,session,question:session.stage==='practice'?controller.questions(session)[session.index]:session.stage==='feedback'?session.feedback?.questionSnapshot:undefined});");
   s=once(s,'47课524题手机学习台 · 阅读 V3','47课524题手机学习台 · 阅读 V4');
 }
 if(item.path==='app.css')s+='\n'+fs.readFileSync(path.join(dir,'reading-passage.css'),'utf8')+'\n';
 if(item.path==='index.html'){
   s=once(s,'<script src="pilot-ui.js"></script>','<script src="reading-passage.js"></script><script src="pilot-ui.js"></script>');
   s=s.replaceAll('47课524题手机阅读内测 V3','47课524题英文全文朗读内测 V4');
 }
 if(item.path==='manifest.json'){
   const m=JSON.parse(s);
   Object.assign(m,{name:'清华2028三科手机阅读内测V4',short_name:'2028阅读V4',id:'./?edition='+edition});
   s=JSON.stringify(m);
 }
 if(item.path==='sw.js'){
   s=once(s,"const CACHE='qh2028-mobile-reading-v3';","const CACHE='"+cache+"';");
   s=once(s,"'./mobile-reading.js','./pilot-ui.js'","'./mobile-reading.js','./reading-passage.js','./pilot-ui.js'");
 }
 const bytes=Buffer.from(s),target=path.join(out,item.path);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(bytes),'Conflicting existing build content: '+item.path);
 else fs.writeFileSync(target,bytes,{flag:'wx'});
 files.push({path:item.path,sha256:hash(bytes),priorSha256:item.sha256,changed:hash(bytes)!==item.sha256});
}
for(const name of extra){
 const b=fs.readFileSync(path.join(dir,name)),target=path.join(out,name);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(b));
 else fs.writeFileSync(target,b,{flag:'wx'});
 files.push({path:name,sha256:hash(b),changed:true});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const content=fs.readFileSync(path.join(out,'representative-courses.json'));
assert.equal(hash(content),prior.sourceCourseDigest,'Course content unexpectedly changed');
const pack=JSON.parse(content.toString('utf8'));
assert.equal(pack.units.length,47);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
assert(!pack.units.some(u=>u.reviewRecord?.expertApproved===true));
const receipt={edition,db,journal,cache,courses:47,questions:524,
  sourceCourseDigest:hash(content),professionalApprovals:0,
  formalReleaseApproved:false,realIPhoneTest:false,deployed:false,files};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:47,questions:524,contentUnchanged:true,deployed:false,files:files.length}));
