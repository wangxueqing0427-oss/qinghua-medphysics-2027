'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const prior=require('../product-2028-v15-additive/build-receipt.json'),from=path.join(__dirname,'../product-2028-v15-additive/.build'),out=path.join(__dirname,'.build');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs'),{validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),unit=require('./unit.json').units[0],old=JSON.parse(fs.readFileSync(path.join(from,'representative-courses.json'))),oldHash=hash(Buffer.from(JSON.stringify(old.units)));
assert.equal(old.units.length,56);assert.equal(prior.questions,632);assert.equal(unit.mapping[0],'PH03');assert(unit.prerequisites.every(id=>old.units.some(u=>u.id===id)));assert(!old.units.some(u=>u.id===unit.id));
const pack={...old,contentVersion:'qh2028-v15-ph03-57-internal-draft',units:[...old.units,unit]},edition='qh2028-v15-ph03-57',db='qh2028_v15_ph03_57_local',journal='qh2028_v15_ph03_57_pending:',cache='qh2028-v15-ph03-57';
assert.deepEqual(E.validate(pack),[]);assert.deepEqual(validateObjectives(pack),[]);assert(E.validate(pack,true).includes('release-blocked'));
assert.deepEqual(pack.units.slice(0,56),old.units);assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),644);
function once(s,a,b){assert.equal(s.split(a).length,2,'PH03 unique patch anchor: '+a);return s.replace(a,b);}
const files=[];fs.mkdirSync(out,{recursive:true});if(fs.readdirSync(out).length)assert.deepEqual(fs.readdirSync(out).sort(),prior.files.map(f=>f.path).sort());
for(const f of prior.files){const raw=fs.readFileSync(path.join(from,f.path));assert.equal(hash(raw),f.sha256,'V15 asset changed: '+f.path);let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(f.path==='profile-repository.js'){
  s=once(s,"const DRAFT_DB='"+prior.db+"';","const DRAFT_DB='"+db+"';");
  s=once(s,'async function restoreAsNewProfile(newId,backup){valid(newId);',"async function restoreAsNewProfile(newId,backup){valid(newId);if(backup?.profile?.settings?.candidateEdition!=='"+edition+"')throw Error('仅恢复PH03同版备份，旧版档案保留');");
 }
 if(f.path==='pilot-ui.js'){
  s=once(s,"const EDITION='"+prior.edition+"';","const EDITION='"+edition+"';");s=once(s,"const JOURNAL='"+prior.journal+"';","const JOURNAL='"+journal+"';");
  s=s.replaceAll('56课632题手机学习台 · 循证Meta V15','57课644题手机学习台 · V15接续PH03独立草稿').replaceAll('恢复V15同版备份到新档案','恢复PH03同版备份到新档案').replaceAll('qinghua-2028-evidence-meta-v15-backup.json','qinghua-2028-ph03-backup.json');
  s=once(s,"const text=document.getElementById('answer').value.trim();if(!text)","const text=document.getElementById('answer').value;if(!text.trim())");
  const match=s.match(/<section class="card"><h2>从V14导入学习进度[\s\S]*?<\/div><\/section>/g);assert.equal(match?.length,1);
  s=s.replace(match[0],'<section class="card"><h2>跨版本迁移暂不启用</h2><p>本候选使用全新独立档案；原V15及更早版记录保留，不自动导入。</p><label>旧版迁移暂不启用<input id="migrate-v14" type="file" disabled data-stay-disabled accept="application/json,.json"></label><div id="migration-preview">仅可恢复PH03同版备份。</div></section>');
 }
 if(f.path==='migration-bridge.js')s="'use strict';\nconst MigrationBridge=Object.freeze({inspect:async()=>{throw Error('PH03草稿暂不启用跨版导入，旧数据保留');},prepare:async()=>{throw Error('PH03草稿暂不启用跨版导入，旧数据保留');}});\nif(typeof module!=='undefined')module.exports=MigrationBridge;else window.MigrationBridge=MigrationBridge;\n";
 if(f.path==='mock-engine.js')s=once(s,'pack?.units?.length===56','pack?.units?.length===57').replaceAll('frozen 56-course internal draft','frozen 57-course internal draft').replaceAll('v15-internal-only','ph03-internal-only');
 if(f.path==='mock-ui.js')s=s.replaceAll('56课','57课');
 if(f.path==='index.html')s=s.replaceAll('56课632题循证Meta内测 V15','57课644题PH03独立内测');
 if(f.path==='manifest.json'){const m=JSON.parse(s);Object.assign(m,{name:'清华2028｜V15接续PH03独立草稿',short_name:'PH03草稿',id:'./?edition='+edition});s=JSON.stringify(m);}
 if(f.path==='sw.js')s=once(s,"const CACHE='"+prior.cache+"';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s);fs.writeFileSync(path.join(out,f.path),bytes);files.push({path:f.path,sha256:hash(bytes),priorSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.equal(hash(Buffer.from(JSON.stringify(JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'))).units.slice(0,56)))),oldHash);
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify({sourceBaseline:'2cbeee7961f3682ce5ab2bb593f1dec77f9ecc94',edition,db,journal,cache,courses:57,questions:644,addedUnitId:unit.id,newCourses:1,newQuestions:12,original56UnitsSHA256:oldHash,priorContentHash:prior.newContentHash,newContentHash:hash(fs.readFileSync(path.join(out,'representative-courses.json'))),legacy56CourseContentIdentical:true,unitContentHash:hash(Buffer.from(JSON.stringify(unit))),files,automaticMigration:false,crossVersionImportEnabled:false,independentProfessionalApprovals:0,fullOfficial2028SyllabusVerified:false,formalReleaseApproved:false,deployed:false},null,2));
console.log(JSON.stringify({courses:57,questions:644,old56Unchanged:true,automaticMigration:false,expertApprovals:0,formalRelease:false}));
