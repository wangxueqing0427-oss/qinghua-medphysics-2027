'use strict';
// Isolated V5 mini-assessment build: preserve 47-course, 524-question authored content.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname,source=path.join(dir,'../product-2028-reading-v4/.build'),out=path.join(dir,'.build');
const prior=require('../product-2028-reading-v4/build-receipt.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Expected unique build patch anchor: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-reading-fullpassage-v4');
assert.equal(prior.courses,47);assert.equal(prior.questions,524);
assert.equal(prior.professionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
const edition='qh2028-diagnostic-mini-v5',db='qh2028_diagnostic_mini_v5',
  journal='qh2028_diagnostic_mini_v5_pending:',cache='qh2028-diagnostic-mini-v5';
assert.notEqual(db,prior.db);
const additions=['mock-engine.js','mock-ui.js'];
const expected=prior.files.map(x=>x.path).concat(additions);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected output files: refuse overwrite');
fs.mkdirSync(out,{recursive:true});
const built=[];
for(const item of prior.files){
  const input=fs.readFileSync(path.join(source,item.path));
  assert.equal(hash(input),item.sha256,'Frozen V4 asset drift: '+item.path);
  let s=input.toString('utf8');
  if(item.path==='profile-repository.js')
    s=once(s,"const DRAFT_DB='qh2028_reading_fullpassage_v4';","const DRAFT_DB='"+db+"';");
  if(item.path==='pilot-ui.js'){
    s=once(s,"const EDITION='qh2028-reading-fullpassage-v4';","const EDITION='"+edition+"';");
    s=once(s,"const JOURNAL='qh2028_reading_fullpassage_v4_pending:';","const JOURNAL='"+journal+"';");
    s=once(s,"'qinghua-2028-reading-fullpassage-v4-backup.json'",
      "'qinghua-2028-diagnostic-mini-v5-backup.json'");
    s=once(s,"x.disabled=x.hasAttribute?.('data-prerequisite-blocked')||false)","x.disabled=x.hasAttribute?.('data-prerequisite-blocked')||x.hasAttribute?.('data-stay-disabled'))");
    s=once(s,"MobileUX.enhance({app,pack,plan,act,openUnit});}",
      "MobileUX.enhance({app,pack,plan,act,openUnit});MockExamUI.mount({app,pack,profile,act,overview});}");
    s=once(s,'47课524题手机学习台 · 阅读 V4','47课524题手机学习台 · 诊断 V5');
  }
  if(item.path==='app.css')s+='\n'+fs.readFileSync(path.join(dir,'mock.css'),'utf8')+'\n';
  if(item.path==='index.html'){
    s=once(s,'<script src="pilot-ui.js"></script>',
      '<script src="mock-engine.js"></script><script src="mock-ui.js"></script><script src="pilot-ui.js"></script>');
    s=s.replaceAll('47课524题英文全文朗读内测 V4','47课524题诊断小测内测 V5');
  }
  if(item.path==='manifest.json'){
    const m=JSON.parse(s);
    Object.assign(m,{name:'清华2028三科诊断学习台V5 · 内部测试',short_name:'2028诊断V5',id:'./?edition='+edition});
    s=JSON.stringify(m);
  }
  if(item.path==='sw.js'){
    s=once(s,"const CACHE='qh2028-reading-fullpassage-v4';","const CACHE='"+cache+"';");
    s=once(s,"'./reading-passage.js','./pilot-ui.js'",
      "'./reading-passage.js','./mock-engine.js','./mock-ui.js','./pilot-ui.js'");
  }
  const bytes=Buffer.from(s),target=path.join(out,item.path);
  if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(bytes),'Conflicting output: '+item.path);
  else fs.writeFileSync(target,bytes,{flag:'wx'});
  built.push({path:item.path,sha256:hash(bytes),priorSha256:item.sha256,changed:hash(bytes)!==item.sha256});
}
const map={'mock-engine.js':'mock-engine.cjs','mock-ui.js':'mock-ui.js'};
for(const targetName of additions){
  const buf=fs.readFileSync(path.join(dir,map[targetName])),target=path.join(out,targetName);
  if(fs.existsSync(target))assert.equal(hash(fs.readFileSync(target)),hash(buf));
  else fs.writeFileSync(target,buf,{flag:'wx'});
  built.push({path:targetName,sha256:hash(buf),changed:true});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const content=fs.readFileSync(path.join(out,'representative-courses.json'));
assert.equal(hash(content),prior.sourceCourseDigest,'47 course content must remain identical to prior V4');
const pack=JSON.parse(content.toString('utf8'));
assert.equal(pack.units.length,47);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
assert(!pack.units.some(u=>u.reviewRecord?.expertApproved===true));
const receipt={edition,db,journal,cache,courses:47,questions:524,
  contentHash:hash(content),expertApprovals:0,formalReleaseApproved:false,
  simulatedIPhoneOnly:true,fullLengthExam:false,deployed:false,files:built};
fs.writeFileSync(path.join(dir,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courseCount:47,questionCount:524,assets:built.length,contentUnchanged:true,
  privateDraft:true,fullLengthExam:false,deployed:false}));
