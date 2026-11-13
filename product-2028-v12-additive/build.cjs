'use strict';
// Independent V12 adds ONE t-test lesson and supports explicitly consented V11 backups.
// No edits to V59, main, V5-V11 or any real local data.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const from=path.join(__dirname,'../product-2028-progress-v11/.build'),out=path.join(__dirname,'.build');
const prior=require('../product-2028-progress-v11/build-receipt.json');
const lesson=require('../product-2028-t-tests-foundation/unit.json').units[0];
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'V12 unique patch anchor missing: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-progress-safe-v11');
assert.equal(prior.courses,52);assert.equal(prior.questions,584);
assert.equal(prior.independentProfessionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
const oldBytes=fs.readFileSync(path.join(from,'representative-courses.json'));
assert.equal(hash(oldBytes),prior.contentHash,'Frozen V11 course content drift');
const old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(old.units.length,52);
assert.equal(lesson.id,'353-t-tests-paired-independent-foundation');
assert.equal(lesson.reviewRecord.expertApproved,false);
assert.equal(lesson.reviewRecord.publicRelease,false);
assert.equal(lesson.distribution,'held-pending-review');
assert(lesson.prerequisites.every(id=>old.units.some(x=>x.id===id)));
const pack={...old,contentVersion:'qh2028-t-tests-53-v12-internal-draft',units:[...old.units,lesson]};
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'));
assert.equal(pack.units.length,53);
assert.equal(pack.units.filter(x=>x.subject==='353').length,24);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),596);
assert.deepEqual(pack.units.slice(0,52),old.units,'Previous 52 units must remain identical');
const old52Hash=hash(Buffer.from(JSON.stringify(old.units)));
const edition='qh2028-t-additive-v12',db='qh2028_t_additive_v12_local',
 journal='qh2028_t_additive_v12_pending:',cache='qh2028-t-additive-v12';
assert.notEqual(db,prior.db);
const expected=prior.files.map(x=>x.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected V12 build output');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(from,f.path));
 assert.equal(hash(raw),f.sha256,'V11 protected file drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(f.path==='profile-repository.js')
  s=once(s,"const DRAFT_DB='qh2028_progress_safe_v11_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=once(s,"const EDITION='qh2028-progress-safe-v11';","const EDITION='"+edition+"';");
  s=once(s,"const JOURNAL='qh2028_progress_safe_v11_pending:';","const JOURNAL='"+journal+"';");
  s=once(s,"'qinghua-2028-progress-v11-backup.json'","'qinghua-2028-t-additive-v12-backup.json'");
  s=once(s,'52课584题手机学习台 · 安全迁移 V11','53课596题手机学习台 · 增量迁移 V12');
  s=once(s,'恢复V11同版备份到新档案','恢复V12同版备份到新档案');
  s=once(s,'从V10导入学习进度','从V11导入学习进度');
  s=once(s,'先回V10导出','先回V11导出');
  s=once(s,'V10原档案不会删除','V11原档案不会删除');
  s=once(s,'选择V10备份JSON文件','选择V11备份JSON文件');
  s=once(s,'仅接受V10上一版','仅接受V11上一版');
  s=s.replaceAll('migrate-v10','migrate-v11');
  s=once(s,'已核验：V10学习事件','已核验：V11学习事件');
  s=once(s,'仅允许复制到新的V11本机档案','仅允许复制到新的V12本机档案');
  s=once(s,'原V10学习记录不会同步更新','原V11学习记录不会同步更新');
  s=once(s,'创建V11新档案并保留V10原始记录','创建V12新档案并保留V11原始记录');
  s=once(s,'仅复制完全一致的课程记录','原52课内容完全一致，并新增1课12题；只复制原52课历史记录');
 }
 if(f.path==='migration-bridge.js'){
  const template=fs.readFileSync(path.join(__dirname,'migration-bridge.js'),'utf8');
  s=once(template,'__OLD_52_UNITS_SHA256__',old52Hash);
 }
 if(f.path==='mock-engine.js'){
  s=once(s,'pack?.units?.length===52','pack?.units?.length===53');
  s=once(s,'frozen 52-course internal draft','frozen 53-course internal draft');
  s=s.replaceAll("'v10-internal-only'","'v12-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('52课','53课');
 if(f.path==='index.html')s=s.replaceAll('52课584题进度迁移内测 V11','53课596题增量迁移内测 V12');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科学习｜V12增量进度迁移测试',short_name:'2028增量V12',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=once(s,"const CACHE='qh2028-progress-safe-v11';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(hash(fs.readFileSync(dest)),hash(bytes),'Existing V12 asset differs: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:hash(bytes),previousSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const built=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
assert.deepEqual(built.units.slice(0,52),old.units);
assert.equal(built.units.length,53);
assert(fs.readFileSync(path.join(out,'pilot-ui.js'),'utf8').includes('migrate-v11'));
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(old52Hash));
assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes(cache));
const receipt={edition,courses:53,questions:596,subjects:{en:15,pol:14,'353':24},
 addedUnitId:lesson.id,previousCourseCount:52,previousQuestionCount:584,
 previousContentHash:prior.contentHash,original52UnitsSHA256:old52Hash,
 newContentHash:hash(fs.readFileSync(path.join(out,'representative-courses.json'))),
 db,journal,cache,files,approved2028OfficialSyllabus:false,independentProfessionalApprovals:0,
 formalReleaseApproved:false,realIPhoneTest:false,deployed:false,
 legacy52CourseContentIdentical:true,newCourses:1,migrationOptIn:true,automaticMigration:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:53,questions:596,newUnit:lesson.id,
 legacy52Unchanged:true,legacyProgressOptInOnly:true,formalRelease:false}));
