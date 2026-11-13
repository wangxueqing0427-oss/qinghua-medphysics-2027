'use strict';
// Isolated reading candidate. Source 47-course content is byte-identical to UX V2.
// Never touches R2, V59, main, prior Pages production, or real learner profiles.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,src=path.join(__dirname,'../product-2028-mobile-ux-v2/.build'),out=path.join(dir,'.build');
const prior=require('../product-2028-mobile-ux-v2/build-receipt.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Expected unique patch anchor: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-mobile-ux-v2');
assert.equal(prior.courses,47);assert.equal(prior.questions,524);
assert.equal(prior.newExpertApprovals,0);assert.equal(prior.formalReleaseApproved,false);
const edition='qh2028-mobile-reading-v3',db='qh2028_mobile_reading_v3_local',
  journal='qh2028_mobile_reading_v3_pending:',cache='qh2028-mobile-reading-v3';
assert.notEqual(db,prior.db);
const extra=['mobile-reading.js'];
const expected=prior.files.map(x=>x.path).concat(extra);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected build assets; refusing overwrite');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const prev of prior.files){
 const source=fs.readFileSync(path.join(src,prev.path));
 assert.equal(hash(source),prev.sha256,'Protected UX V2 asset changed: '+prev.path);
 let s=source.toString('utf8');
 if(prev.path==='profile-repository.js')
   s=once(s,"const DRAFT_DB='qh2028_mobile_ux_v2_local';","const DRAFT_DB='"+db+"';");
 if(prev.path==='pilot-ui.js'){
   s=once(s,"const EDITION='qh2028-mobile-ux-v2';","const EDITION='"+edition+"';");
   s=once(s,"const JOURNAL='qh2028_mobile_ux_v2_pending:';","const JOURNAL='"+journal+"';");
   s=once(s,"'qinghua-2028-mobile-ux-v2-backup.json'","'qinghua-2028-mobile-reading-v3-backup.json'");
   s=once(s,"app.innerHTML=html;if(typeof window.scrollTo==='function')",
      "app.innerHTML=html;MobileReading.enhance({app,unit:u,session,questionTotal:session.stage==='practice'||session.stage==='feedback'?controller.questions(session).length:undefined});if(typeof window.scrollTo==='function')");
   s=once(s,"47课524题手机学习台 · UX V2","47课524题手机学习台 · 阅读 V3");
 }
 if(prev.path==='app.css')s+='\n'+fs.readFileSync(path.join(dir,'mobile-reading.css'),'utf8')+'\n';
 if(prev.path==='index.html'){
   s=once(s,'<script src="pilot-ui.js"></script>','<script src="mobile-reading.js"></script><script src="pilot-ui.js"></script>');
   s=s.replaceAll('47课524题手机交互内测 UX V2','47课524题手机阅读内测 V3');
 }
 if(prev.path==='manifest.json'){
   const manifest=JSON.parse(s);
   Object.assign(manifest,{name:'清华2028三科手机阅读内测',short_name:'2028阅读V3',id:'./?edition='+edition});
   s=JSON.stringify(manifest);
 }
 if(prev.path==='sw.js'){
   s=once(s,"const CACHE='qh2028-mobile-ux-v2';","const CACHE='"+cache+"';");
   s=once(s,"'./mobile-ux.js','./pilot-ui.js'","'./mobile-ux.js','./mobile-reading.js','./pilot-ui.js'");
 }
 const content=Buffer.from(s),target=path.join(out,prev.path);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(content),'Refuse conflicting build output: '+prev.path);
 else fs.writeFileSync(target,content,{flag:'wx'});
 files.push({path:prev.path,sha256:hash(content),priorSha256:prev.sha256,changed:hash(content)!==prev.sha256});
}
for(const name of extra){
 const content=fs.readFileSync(path.join(dir,name)),target=path.join(out,name);
 if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(content));
 else fs.writeFileSync(target,content,{flag:'wx'});
 files.push({path:name,sha256:hash(content),changed:true});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const pack=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
assert.equal(pack.units.length,47);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
assert(!pack.units.some(u=>u.reviewRecord?.expertApproved===true));
const courseHash=hash(fs.readFileSync(path.join(out,'representative-courses.json')));
assert.equal(courseHash,prior.sourceCourseDigest,'Course questions must be byte-identical to UX V2');
const receipt={edition,db,journal,cache,courses:47,questions:524,sourceCourseDigest:courseHash,
  independentProfessionalApproved:0,formalReleaseApproved:false,
  deployed:false,realIPhoneTest:false,files};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,contentUnchanged:true,courses:47,questions:524,files:files.length,deployed:false}));
