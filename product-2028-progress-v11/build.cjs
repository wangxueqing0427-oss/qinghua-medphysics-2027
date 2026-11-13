'use strict';
// One-hop, opt-in V10 -> V11 migration-only preview; course content and prior data unchanged.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const from=path.join(__dirname,'../product-2028-stat-inference-52/.build'),out=path.join(__dirname,'.build');
const prior=require('../product-2028-stat-inference-52/build-receipt.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const once=(s,a,b)=>{assert.equal(s.split(a).length,2,'Unique V10 patch anchor missing: '+a);return s.replace(a,b);};
assert.equal(prior.edition,'qh2028-stat-inference-52-v10');
assert.equal(prior.courses,52);assert.equal(prior.questions,584);
assert.equal(prior.independentProfessionalApprovals,0);assert.equal(prior.formalReleaseApproved,false);
const sourceBytes=fs.readFileSync(path.join(from,'representative-courses.json'));
assert.equal(sha(sourceBytes),prior.finalContentHash,'V10 source content changed');
const source=JSON.parse(sourceBytes.toString('utf8'));
assert.equal(source.units.length,52);
assert.equal(source.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),584);
const edition='qh2028-progress-safe-v11',db='qh2028_progress_safe_v11_local',
 journal='qh2028_progress_safe_v11_pending:',cache='qh2028-progress-safe-v11';
assert.notEqual(db,prior.db);
const extra='migration-bridge.js',expected=prior.files.map(f=>f.path).concat(extra);
if(fs.existsSync(out))assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort(),'Unexpected V11 output files');
fs.mkdirSync(out,{recursive:true});
const files=[];
for(const f of prior.files){
 const raw=fs.readFileSync(path.join(from,f.path));
 assert.equal(sha(raw),f.sha256,'Frozen V10 file drift: '+f.path);
 let s=raw.toString('utf8');
 if(f.path==='profile-repository.js')
  s=once(s,"const DRAFT_DB='qh2028_stat_inference_52_v10_local';","const DRAFT_DB='"+db+"';");
 if(f.path==='pilot-ui.js'){
  s=once(s,"const EDITION='qh2028-stat-inference-52-v10';","const EDITION='"+edition+"';");
  s=once(s,"const JOURNAL='qh2028_stat_inference_52_v10_pending:';","const JOURNAL='"+journal+"';");
  s=once(s,"'qinghua-2028-stat-inference-52-v10-backup.json'","'qinghua-2028-progress-v11-backup.json'");
  s=once(s,"52课584题手机学习台 · 统计推断 V10","52课584题手机学习台 · 安全迁移 V11");
  s=once(s,'async function home(){const profiles=await repository.listProfiles();pendingDraft=null;',
           'let stagedMigration=null;\nasync function home(){const profiles=await repository.listProfiles();pendingDraft=null;stagedMigration=null;');
  s=once(s,'<label>恢复备份到新档案<input id="restore" type="file" accept="application/json,.json"></label>',
           '<label>恢复V11同版备份到新档案<input id="restore" type="file" accept="application/json,.json"></label>'+
           '<section class="card"><h2>从V10导入学习进度（须本人确认）</h2><p>先回V10导出完整本机备份；未提交的临时文字请先保存。仅复制完全一致的课程记录；V10原档案不会删除、覆盖或自动迁移。</p>'+
           '<label>选择V10备份JSON文件<input id="migrate-v10" type="file" accept="application/json,.json"></label>'+
           '<div id="migration-preview" aria-live="polite">仅接受V10上一版；其他版本和不兼容题目将被拒绝。</div></section>');
  const anchor='profile=await repository.restoreAsNewProfile(crypto.randomUUID(),backup);await enter();});}';
  const snippet=fs.readFileSync(path.join(__dirname,'home-migrate.snippet.js'),'utf8');
  s=once(s,anchor,'profile=await repository.restoreAsNewProfile(crypto.randomUUID(),backup);await enter();});'+snippet+'}');
 }
 if(f.path==='index.html'){
  s=once(s,'<script src="pilot-ui.js"></script>',
   '<script src="migration-bridge.js"></script><script src="pilot-ui.js"></script>');
  s=s.replaceAll('52课584题统计推断内测 V10','52课584题进度迁移内测 V11');
 }
 if(f.path==='manifest.json'){
  const m=JSON.parse(s);
  Object.assign(m,{name:'清华2028三科学习｜V11安全迁移内测',short_name:'2028迁移V11',id:'./?edition='+edition});
  s=JSON.stringify(m);
 }
 if(f.path==='sw.js'){
  s=once(s,"const CACHE='qh2028-stat-inference-52-v10';","const CACHE='"+cache+"';");
  s=once(s,"'./pilot-ui.js'","'./migration-bridge.js','./pilot-ui.js'");
 }
 const bytes=Buffer.from(s),dest=path.join(out,f.path);
 if(fs.existsSync(dest))assert.equal(sha(fs.readFileSync(dest)),sha(bytes),'Existing V11 output conflict: '+f.path);
 else fs.writeFileSync(dest,bytes,{flag:'wx'});
 files.push({path:f.path,sha256:sha(bytes),previousSha256:f.sha256,changed:sha(bytes)!==f.sha256});
}
const bridge=fs.readFileSync(path.join(__dirname,extra)),bridgeTarget=path.join(out,extra);
if(fs.existsSync(bridgeTarget))assert.equal(sha(fs.readFileSync(bridgeTarget)),sha(bridge));
else fs.writeFileSync(bridgeTarget,bridge,{flag:'wx'});
files.push({path:extra,sha256:sha(bridge),changed:true});
assert.deepEqual(fs.readdirSync(out).sort(),expected.slice().sort());
assert.equal(sha(fs.readFileSync(path.join(out,'representative-courses.json'))),prior.finalContentHash,
 'V11 must not modify one byte of V10 lesson or answer content');
const receipt={edition,courses:52,questions:584,subjects:{en:15,pol:14,'353':23},
 contentHash:prior.finalContentHash,sourceEdition:prior.edition,db,journal,cache,files,
 noCurriculumChanges:true,crossVersionMigrationOneHopOnly:true,automaticMigration:false,
 independentProfessionalApprovals:0,formalReleaseApproved:false,realIPhoneTest:false,deployed:false};
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({edition,courses:52,questions:584,curriculumByteIdentical:true,
 previousRecordsNotModified:true,oneHopOptInOnly:true,formalRelease:false}));
