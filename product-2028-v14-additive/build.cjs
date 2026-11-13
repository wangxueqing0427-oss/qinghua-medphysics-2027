'use strict';
// Independent V14 candidate: one authored STAT03 lesson appended, all V13 units unchanged.
// V13 -> V14 import requires manual opt-in; no production/main, old app or real profile mutation.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const from=path.join(__dirname,'../product-2028-v13-additive/.build'),out=path.join(__dirname,'.build');
const prior=require('../product-2028-v13-additive/build-receipt.json');
const unit=require('../product-2028-anova-regression-foundation/unit.json').units[0];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const one=(s,a,b)=>{assert.equal(s.split(a).length,2,'Unique V13 patch anchor missing: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-outbreak-54-v13');
assert.equal(prior.courses,54);assert.equal(prior.questions,608);
assert.equal(prior.independentProfessionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
assert.equal(prior.legacy53CourseContentIdentical,true);
const oldBytes=fs.readFileSync(path.join(from,'representative-courses.json'));
assert.equal(sha(oldBytes),prior.newContentHash,'V13 old curriculum content drift');
const old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(old.units.length,54);
assert.equal(unit.id,'353-anova-chi-regression-foundation');
assert.equal(unit.reviewRecord.expertApproved,false);
assert.equal(unit.reviewRecord.publicRelease,false);
assert.equal(unit.distribution,'held-pending-review');
assert(unit.prerequisites.every(id=>old.units.some(x=>x.id===id)));
const pack={...old,contentVersion:'qh2028-stat03-55-v14-internal-draft',units:[...old.units,unit]};
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'));
assert.equal(pack.units.length,55);
assert.equal(pack.units.filter(x=>x.subject==='353').length,26);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),620);
assert.deepEqual(pack.units.slice(0,54),old.units,'Earlier 54 units must be unchanged');
const old54Hash=sha(Buffer.from(JSON.stringify(old.units)));
const packBytes=Buffer.from(JSON.stringify(pack,null,2)),packHash=sha(packBytes);
const edition='qh2028-stat03-55-v14',db='qh2028_stat03_55_v14_local',
 journal='qh2028_stat03_55_v14_pending:',cache='qh2028-stat03-55-v14';
assert.notEqual(db,prior.db);
const expected=prior.files.map(x=>x.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected V14 build output');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(from,f.path));
 assert.equal(sha(raw),f.sha256,'Protected V13 asset drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=packBytes.toString('utf8');
 if(f.path==='profile-repository.js')
  s=one(s,"const DRAFT_DB='qh2028_outbreak_54_v13_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=one(s,"const EDITION='qh2028-outbreak-54-v13';","const EDITION='"+edition+"';");
  s=one(s,"const JOURNAL='qh2028_outbreak_54_v13_pending:';","const JOURNAL='"+journal+"';");
  s=one(s,"'qinghua-2028-outbreak-v13-backup.json'","'qinghua-2028-stat03-v14-backup.json'");
  s=one(s,'54课608题手机学习台 · 暴发调查 V13','55课620题手机学习台 · 方差与回归 V14');
  s=one(s,'恢复V13同版备份到新档案','恢复V14同版备份到新档案');
  s=one(s,'从V12导入学习进度','从V13导入学习进度');
  s=one(s,'先回V12导出','先回V13导出');
  s=one(s,'V12原档案不会删除','V13原档案不会删除');
  s=one(s,'选择V12备份JSON文件','选择V13备份JSON文件');
  s=one(s,'仅接受V12上一版','仅接受V13上一版');
  s=s.replaceAll('migrate-v12','migrate-v13');
  s=one(s,'已核验：V12学习事件','已核验：V13学习事件');
  s=one(s,'仅允许复制到新的V13本机档案','仅允许复制到新的V14本机档案');
  s=one(s,'原V12学习记录不会同步更新','原V13学习记录不会同步更新');
  s=one(s,'创建V13新档案并保留V12原始记录','创建V14新档案并保留V13原始记录');
  s=one(s,'原53课内容完全一致，并新增1课12题；只复制原53课历史记录',
    '原54课内容完全一致，并新增1课12题；只复制原54课历史记录');
 }
 if(f.path==='migration-bridge.js'){
  const template=fs.readFileSync(path.join(__dirname,'migration-bridge.js'),'utf8');
  s=one(one(template,'__OLD_54_UNITS_SHA256__',old54Hash),'__V14_PACK_SHA256__',packHash);
 }
 if(f.path==='mock-engine.js'){
  s=one(s,'pack?.units?.length===54','pack?.units?.length===55');
  s=one(s,'frozen 54-course internal draft','frozen 55-course internal draft');
  s=s.replaceAll("'v13-internal-only'","'v14-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('54课','55课');
 if(f.path==='index.html')s=s.replaceAll('54课608题暴发调查内测 V13','55课620题方差回归内测 V14');
 if(f.path==='manifest.json'){
  const manifest=JSON.parse(s);
  Object.assign(manifest,{name:'清华2028三科｜方差分析与回归V14独立内测',
    short_name:'2028统计V14',id:'./?edition='+edition});
  s=JSON.stringify(manifest);
 }
 if(f.path==='sw.js')s=one(s,"const CACHE='qh2028-outbreak-54-v13';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),sha(bytes),'Existing V14 output conflict: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:sha(bytes),priorSha256:f.sha256,changed:sha(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const built=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
assert.deepEqual(built.units.slice(0,54),old.units);
assert.equal(built.units[54].id,unit.id);
assert.equal(sha(fs.readFileSync(path.join(out,'representative-courses.json'))),packHash);
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(old54Hash));
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(packHash));
assert(fs.readFileSync(path.join(out,'pilot-ui.js'),'utf8').includes('migrate-v13'));
assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes(cache));
const receipt={edition,courses:55,questions:620,subjects:{en:15,pol:14,'353':26},
 addedUnitId:unit.id,previousCourseCount:54,previousQuestionCount:608,
 priorContentHash:prior.newContentHash,original54UnitsSHA256:old54Hash,newContentHash:packHash,
 db,journal,cache,files,fullOfficial2028SyllabusVerified:false,independentProfessionalApprovals:0,
 formalReleaseApproved:false,realIPhoneTest:false,deployed:false,legacy54CourseContentIdentical:true,
 newCourses:1,migrationOptIn:true,automaticMigration:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:55,questions:620,newUnit:unit.id,
 old54Unchanged:true,consentMigrationOnly:true,professionalApprovals:0,formalRelease:false}));
