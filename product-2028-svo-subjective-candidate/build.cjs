'use strict';
// Build ONLY the isolated SVO subjective candidate. The original deployed R2 is read-only.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const sourceDir=path.join(root,'product-2028-svo-offline-r2/.build');
const out=path.join(__dirname,'.build');
const baseline=require('../product-2028-svo-offline-r2/build-manifest.json');
const pack=require('./course.json');
const original=require('../product-2028-svo-c1/course.json');
const engine=require('./course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function once(s,old,add){assert.equal(s.split(old).length,2,'Unsafe or missing patch anchor: '+old);return s.replace(old,add);}
assert.equal(out,path.join(__dirname,'.build'));
assert.deepEqual(engine.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert.equal(pack.units.length,1);
const old=original.units[0],now=pack.units[0];
assert.notEqual(old.version,now.version,'Changing content without version is unsafe');
assert.deepEqual(now.basicQuestions,old.basicQuestions,'Original basic questions must remain unchanged');
assert.deepEqual(now.applicationQuestions,old.applicationQuestions,'Original subjective answer must remain unchanged');
assert.deepEqual(now.delayedQuestions.slice(0,2),old.delayedQuestions,'Original delayed questions must remain unchanged');
assert.equal(now.delayedQuestions.length,3);
assert.equal(now.delayedQuestions[2].type,'subjective');
assert.equal(now.delayedQuestions[2].id,'en-svo-delay-3');
assert(now.learningObjectives[1].questionIds.includes('en-svo-delay-3'));
assert.equal(now.distribution,'held-pending-review');
assert.equal(now.reviewRecord.expertApproved,false);
const allowed=['index.html','app.css','icon.svg','manifest.json','course-engine.js','profile-repository.js','learning-controller.js','pilot-ui.js','representative-courses.json','sw.js'];
assert.deepEqual(baseline.files.map(f=>f.path),allowed);
const files=[];
const editions={edition:'qh2028-svo-subjective-local1',db:'qh2028_svo_subjective_local1',journal:'qh2028_svo_subjective_local1_pending:',cache:'qh2028-svo-subjective-local1',worker:'svo-subjective-local1'};
assert.notEqual(editions.db,baseline.database);
assert(!fs.existsSync(out)||fs.statSync(out).isDirectory());
for(const entry of fs.existsSync(out)?fs.readdirSync(out):[])assert(allowed.includes(entry),'Unexpected existing candidate build file: '+entry);
fs.mkdirSync(out,{recursive:true});
for(const entry of baseline.files){
  const source=path.join(sourceDir,entry.path);
  assert.equal(sha(fs.readFileSync(source)),entry.sha256,'R2 baseline corrupted: '+entry.path);
  let s=fs.readFileSync(source,'utf8');
  switch(entry.path){
    case 'representative-courses.json':s=JSON.stringify(pack,null,2);break;
    case 'course-engine.js':s=fs.readFileSync(path.join(__dirname,'course-engine.cjs'),'utf8');break;
    case 'profile-repository.js':
      s=once(s,"const DRAFT_DB='qh2028_svo_first_lesson_v1';","const DRAFT_DB='"+editions.db+"';");
      break;
    case 'pilot-ui.js':
      s=once(s,"const EDITION='qh2028-svo-first-lesson-v1';","const EDITION='"+editions.edition+"';");
      s=once(s,"const JOURNAL='qh2028_svo_first_lesson_pending_v1:';","const JOURNAL='"+editions.journal+"';");
      s=s.replaceAll('1课5题','1课6题');
      s=s.replaceAll('2028首课试运行 MOBILE-C1-SVO','SVO主观延迟题独立候选');
      s=once(s,"'needs-review':'需要复习'","'needs-review':'客观题需复习','subjective-pending':'主观题待核对，继续安排复习'");
      s=once(s,'qinghua-2028-svo-backup.json','qinghua-2028-svo-subjective-local1-backup.json');
      break;
    case 'index.html':
      s=s.replaceAll('2028首课试运行 MOBILE-C1-SVO','SVO主观题独立本地候选 · 非正式版');
      s=s.replaceAll("'svo-offline-r2'","'"+editions.worker+"'");
      s=s.replaceAll('R2','SVO主观候选');
      break;
    case 'manifest.json':
      const m=JSON.parse(s);
      Object.assign(m,{name:'清华2028 SVO主观延迟题隔离候选',short_name:'SVO延迟候选',id:'./?edition='+editions.edition});
      s=JSON.stringify(m);
      break;
    case 'sw.js':
      s=once(s,"const VERSION='svo-offline-r2',CACHE='qh2028-svo-first-lesson-offline-r2';","const VERSION='"+editions.worker+"',CACHE='"+editions.cache+"';");
      break;
  }
  const buf=Buffer.from(s),dest=path.join(out,entry.path);
  if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),sha(buf),'Refuse to overwrite differing candidate build file: '+entry.path);
  else fs.writeFileSync(dest,buf,{flag:'wx'});
  files.push({path:entry.path,sha256:sha(buf),baselineSha256:entry.sha256,changed:sha(buf)!==entry.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),allowed.slice().sort());
assert.deepEqual(files.filter(f=>f.changed).map(f=>f.path),
  ['index.html','manifest.json','course-engine.js','profile-repository.js','pilot-ui.js','representative-courses.json','sw.js']);
const receipt={candidate:'SVO-DELAY-SUBJECTIVE-LOCAL1',sourceBaseline:'MOBILE-C1-SVO-OFFLINE-R2',edition:editions.edition,database:editions.db,journal:editions.journal,cache:editions.cache,worker:editions.worker,courseVersion:now.version,courses:1,questions:6,originalQuestionsPreserved:5,expertApprovals:0,deployed:false,actualUserDataTouched:false,files};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({built:true,candidate:receipt.candidate,courses:receipt.courses,questions:receipt.questions,assets:files.length,originalR2Unchanged:true,deployed:false}));
