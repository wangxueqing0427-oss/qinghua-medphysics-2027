'use strict';
// V15 isolated 56-course EPI11 candidate, with exactly the previous 55 course units preserved.
// V14 -> V15 backup is manual opt-in; does not update older DB, main or formal release.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const from=path.join(__dirname,'../product-2028-v14-additive/.build'),out=path.join(__dirname,'.build');
const prior=require('../product-2028-v14-additive/build-receipt.json');
const unit=require('../product-2028-evidence-meta-foundation/unit.json').units[0];
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'V15 unique patch anchor missing: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-stat03-55-v14');
assert.equal(prior.courses,55);assert.equal(prior.questions,620);
assert.equal(prior.independentProfessionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
assert.equal(prior.legacy54CourseContentIdentical,true);
const oldBytes=fs.readFileSync(path.join(from,'representative-courses.json'));
assert.equal(sha(oldBytes),prior.newContentHash,'V14 frozen course content changed');
const old=JSON.parse(oldBytes.toString('utf8'));
assert.equal(old.units.length,55);
assert.equal(unit.id,'353-evidence-systematic-review-meta-foundation');
assert.equal(unit.reviewRecord.expertApproved,false);
assert.equal(unit.reviewRecord.publicRelease,false);
assert.equal(unit.distribution,'held-pending-review');
assert(unit.prerequisites.every(id=>old.units.some(x=>x.id===id)),'Missing EPI11 prerequisites');
const pack={...old,contentVersion:'qh2028-evidence-meta-56-v15-internal-draft',units:[...old.units,unit]};
assert.deepEqual(E.validate(pack),[]);
assert.deepEqual(validateObjectives(pack),[]);
assert(E.validate(pack,true).includes('release-blocked'));
assert.equal(pack.units.length,56);
assert.equal(pack.units.filter(x=>x.subject==='353').length,27);
assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),632);
assert.deepEqual(pack.units.slice(0,55),old.units);
const old55Hash=sha(Buffer.from(JSON.stringify(old.units)));
const packBytes=Buffer.from(JSON.stringify(pack,null,2)),packHash=sha(packBytes);
const edition='qh2028-evidence-meta-56-v15',db='qh2028_evidence_meta_56_v15_local',
 journal='qh2028_evidence_meta_56_v15_pending:',cache='qh2028-evidence-meta-56-v15';
assert.notEqual(db,prior.db);
const expected=prior.files.map(f=>f.path);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'V15 unexpected existing output');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(from,f.path));
 assert.equal(sha(raw),f.sha256,'Protected V14 asset drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=packBytes.toString('utf8');
 if(f.path==='profile-repository.js')
  s=once(s,"const DRAFT_DB='qh2028_stat03_55_v14_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=once(s,"const EDITION='qh2028-stat03-55-v14';","const EDITION='"+edition+"';");
  s=once(s,"const JOURNAL='qh2028_stat03_55_v14_pending:';","const JOURNAL='"+journal+"';");
  s=once(s,"'qinghua-2028-stat03-v14-backup.json'","'qinghua-2028-evidence-meta-v15-backup.json'");
  s=once(s,'55课620题手机学习台 · 方差与回归 V14','56课632题手机学习台 · 循证Meta V15');
  s=once(s,'恢复V14同版备份到新档案','恢复V15同版备份到新档案');
  s=once(s,'从V13导入学习进度','从V14导入学习进度');
  s=once(s,'先回V13导出','先回V14导出');
  s=once(s,'V13原档案不会删除','V14原档案不会删除');
  s=once(s,'选择V13备份JSON文件','选择V14备份JSON文件');
  s=once(s,'仅接受V13上一版','仅接受V14上一版');
  s=s.replaceAll('migrate-v13','migrate-v14');
  s=once(s,'已核验：V13学习事件','已核验：V14学习事件');
  s=once(s,'仅允许复制到新的V14本机档案','仅允许复制到新的V15本机档案');
  s=once(s,'原V13学习记录不会同步更新','原V14学习记录不会同步更新');
  s=once(s,'创建V14新档案并保留V13原始记录','创建V15新档案并保留V14原始记录');
  s=once(s,'原54课内容完全一致，并新增1课12题；只复制原54课历史记录',
   '原55课内容完全一致，并新增1课12题；只复制原55课历史记录');
 }
 if(f.path==='migration-bridge.js'){
  const template=fs.readFileSync(path.join(__dirname,'migration-bridge.js'),'utf8');
  s=once(once(template,'__OLD_55_UNITS_SHA256__',old55Hash),'__V15_PACK_SHA256__',packHash);
 }
 if(f.path==='mock-engine.js'){
  s=once(s,'pack?.units?.length===55','pack?.units?.length===56');
  s=once(s,'frozen 55-course internal draft','frozen 56-course internal draft');
  s=s.replaceAll("'v14-internal-only'","'v15-internal-only'");
 }
 if(f.path==='mock-ui.js')s=s.replaceAll('55课','56课');
 if(f.path==='index.html')s=s.replaceAll('55课620题方差回归内测 V14','56课632题循证Meta内测 V15');
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科备考｜循证Meta分析V15独立内测',
   short_name:'2028循证V15',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js')s=once(s,"const CACHE='qh2028-stat03-55-v14';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),sha(bytes),'Existing V15 asset conflict: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:sha(bytes),priorSha256:f.sha256,changed:sha(bytes)!==f.sha256});
}
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
const built=JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'),'utf8'));
assert.deepEqual(built.units.slice(0,55),old.units);
assert.equal(built.units[55].id,unit.id);
assert.equal(sha(fs.readFileSync(path.join(out,'representative-courses.json'))),packHash);
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(old55Hash));
assert(fs.readFileSync(path.join(out,'migration-bridge.js'),'utf8').includes(packHash));
assert(fs.readFileSync(path.join(out,'pilot-ui.js'),'utf8').includes('migrate-v14'));
assert(fs.readFileSync(path.join(out,'sw.js'),'utf8').includes(cache));
const receipt={edition,courses:56,questions:632,subjects:{en:15,pol:14,'353':27},
 addedUnitId:unit.id,previousCourseCount:55,previousQuestionCount:620,
 priorContentHash:prior.newContentHash,original55UnitsSHA256:old55Hash,newContentHash:packHash,
 db,journal,cache,files,fullOfficial2028SyllabusVerified:false,independentProfessionalApprovals:0,
 formalReleaseApproved:false,realIPhoneTest:false,deployed:false,legacy55CourseContentIdentical:true,
 newCourses:1,migrationOptIn:true,automaticMigration:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:56,questions:632,newUnit:unit.id,
 old55Unchanged:true,consentMigrationOnly:true,expertApprovals:0,formalRelease:false}));
