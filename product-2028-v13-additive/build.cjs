'use strict';
// V13 isolated internal preview: add 1 EPI09 outbreak lesson, preserve 53 V12 courses,
// and allow opt-in migration ONLY from an exact source V12 backup.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const from=path.join(__dirname,'../product-2028-v12-additive/.build'),out=path.join(__dirname,'.build');
const prior=require('../product-2028-v12-additive/build-receipt.json');
const unit=require('../product-2028-outbreak-foundation/unit.json').units[0];
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const one=(s,a,b)=>{assert.equal(s.split(a).length,2,'Expected one V12 anchor: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-t-additive-v12');
assert.equal(prior.courses,53);assert.equal(prior.questions,596);
assert.equal(prior.independentProfessionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
assert.equal(prior.legacy52CourseContentIdentical,true);
const oldBytes=fs.readFileSync(path.join(from,'representative-courses.json'));
assert.equal(sha(oldBytes),prior.newContentHash,'Protected V12 content drift');
const old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(old.units.length,53);
assert.equal(unit.id,'353-outbreak-investigation-foundation');
assert.equal(unit.reviewRecord.expertApproved,false);
assert.equal(unit.reviewRecord.publicRelease,false);
assert.equal(unit.distribution,'held-pending-review');
assert(unit.prerequisites.every(id=>old.units.some(u=>u.id===id)));
const pack={...old,contentVersion:'qh2028-outbreak-54-v13-internal-draft',units:[...old.units,unit]};
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'));
assert.equal(pack.units.length,54);
assert.equal(pack.units.filter(u=>u.subject==='353').length,25);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),608);
assert.deepEqual(pack.units.slice(0,53),old.units,'V12 lessons must be copied unchanged');
const old53Hash=sha(Buffer.from(JSON.stringify(old.units)));
const completePack=Buffer.from(JSON.stringify(pack,null,2));
const fullHash=sha(completePack);
const edition='qh2028-outbreak-54-v13',db='qh2028_outbreak_54_v13_local',
 journal='qh2028_outbreak_54_v13_pending:',cache='qh2028-outbreak-54-v13';
assert.notEqual(db,prior.db);
const expected=prior.files.map(f=>f.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'V13 unexpected existing output');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(from,f.path));
 assert.equal(sha(raw),f.sha256,'Protected V12 asset drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=completePack.toString('utf8');
 if(f.path==='profile-repository.js')
  s=one(s,"const DRAFT_DB='qh2028_t_additive_v12_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=one(s,"const EDITION='qh2028-t-additive-v12';","const EDITION='"+edition+"';");
  s=one(s,"const JOURNAL='qh2028_t_additive_v12_pending:';","const JOURNAL='"+journal+"';");
  s=one(s,"'qinghua-2028-t-additive-v12-backup.json'","'qinghua-2028-outbreak-v13-backup.json'");
  s=one(s,'53课596题手机学习台 · 增量迁移 V12','54课608题手机学习台 · 暴发调查 V13');
  s=one(s,'恢复V12同版备份到新档案','恢复V13同版备份到新档案');
  s=one(s,'从V11导入学习进度','从V12导入学习进度');
  s=one(s,'先回V11导出','先回V12导出');
  s=one(s,'V11原档案不会删除','V12原档案不会删除');
  s=one(s,'选择V11备份JSON文件','选择V12备份JSON文件');
  s=one(s,'仅接受V11上一版','仅接受V12上一版');
  s=s.replaceAll('migrate-v11','migrate-v12');
  s=one(s,'已核验：V11学习事件','已核验：V12学习事件');
  s=one(s,'仅允许复制到新的V12本机档案','仅允许复制到新的V13本机档案');
  s=one(s,'原V11学习记录不会同步更新','原V12学习记录不会同步更新');
  s=one(s,'创建V12新档案并保留V11原始记录','创建V13新档案并保留V12原始记录');
  s=one(s,'原52课内容完全一致，并新增1课12题；只复制原52课历史记录',
        '原53课内容完全一致，并新增1课12题；只复制原53课历史记录');
 }
 if(f.path==='migration-bridge.js'){
  const template=fs.readFileSync(path.join(__dirname,'migration-bridge.js'),'utf8');
  s=one(one(template,'__OLD_53_UNITS_SHA256__',old53Hash),'__V13_PACK_SHA256__',fullHash);
 }
 if(f.path==='mock-engine.js'){
  s=one(s,'pack?.units?.length===53','pack?.units?.length===54');
  s=one(s,'frozen 53-course internal draft','frozen 54-course internal draft');
  s=s.replaceAll("'v12-internal-only'","'v13-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('53课','54课');
 if(f.path==='index.html')s=s.replaceAll('53课596题增量迁移内测 V12','54课608题暴发调查内测 V13');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科｜暴发调查V13独立学习测试',short_name:'2028流调V13',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=one(s,"const CACHE='qh2028-t-additive-v12';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),sha(bytes),'V13 output unexpected prior bytes: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:sha(bytes),priorSha256:f.sha256,changed:sha(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const built=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
assert.deepEqual(built.units.slice(0,53),old.units);
assert.equal(built.units[53].id,unit.id);
assert.equal(sha(fs.readFileSync(path.join(out,'representative-courses.json'))),fullHash);
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(old53Hash));
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(fullHash));
assert(fs.readFileSync(path.join(out,'pilot-ui.js'),'utf8').includes('migrate-v12'));
assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes(cache));
const receipt={edition,courses:54,questions:608,subjects:{en:15,pol:14,'353':25},
 addedUnitId:unit.id,previousCourseCount:53,previousQuestionCount:596,
 priorContentHash:prior.newContentHash,original53UnitsSHA256:old53Hash,newContentHash:fullHash,
 db,journal,cache,files,fullOfficial2028SyllabusVerified:false,independentProfessionalApprovals:0,
 formalReleaseApproved:false,realIPhoneTest:false,deployed:false,legacy53CourseContentIdentical:true,
 newCourses:1,migrationOptIn:true,automaticMigration:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:54,questions:608,newUnit:unit.id,
 old53ByteIdentical:true,migrationOptIn:true,expertApprovals:0,formalRelease:false}));
