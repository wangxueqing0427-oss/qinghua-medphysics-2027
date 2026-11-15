'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const prior=require('../product-2028-ph05-candidate/build-receipt.json'),from=path.join(__dirname,'../product-2028-ph05-candidate/.build'),out=path.join(__dirname,'.build');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs'),{validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),added=require('./units.json').units,old=JSON.parse(fs.readFileSync(path.join(from,'representative-courses.json'))),oldHash=hash(Buffer.from(JSON.stringify(old.units)));
assert.equal(old.units.length,60);assert.equal(prior.questions,683);for(const unit of added){assert(unit.prerequisites.every(id=>old.units.some(u=>u.id===id)));assert(!old.units.some(u=>u.id===unit.id));}
const pack={...old,contentVersion:'qh2028-issue8-a-62-internal-draft',units:[...old.units,...added]},edition='qh2028-issue8-a-62',db='qh2028_issue8_a_local',journal='qh2028_issue8_a_pending:',cache='qh2028-issue8-a-62';
assert.deepEqual(E.validate(pack),[]);assert.deepEqual(validateObjectives(pack),[]);assert(E.validate(pack,true).includes('release-blocked'));assert.deepEqual(pack.units.slice(0,60),old.units);assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),701);
function once(s,a,b){assert.equal(s.split(a).length,2,'PH05 unique patch anchor: '+a);return s.replace(a,b);}
const files=[];fs.mkdirSync(out,{recursive:true});if(fs.readdirSync(out).length)assert.deepEqual(fs.readdirSync(out).sort(),prior.files.map(f=>f.path).sort());
for(const f of prior.files){const raw=fs.readFileSync(path.join(from,f.path));assert.equal(hash(raw),f.sha256,'PH04 asset changed: '+f.path);let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(f.path==='profile-repository.js'){s=once(s,"const DRAFT_DB='"+prior.db+"';","const DRAFT_DB='"+db+"';");s=once(s,"backup?.profile?.settings?.candidateEdition!=='"+prior.edition+"'","backup?.profile?.settings?.candidateEdition!=='"+edition+"'");s=s.replaceAll('仅恢复PH05同版备份','仅恢复批次A同版备份');}
 if(f.path==='pilot-ui.js'){s=once(s,"const EDITION='"+prior.edition+"';","const EDITION='"+edition+"';");s=once(s,"const JOURNAL='"+prior.journal+"';","const JOURNAL='"+journal+"';");s=s.replaceAll('60课683题手机学习台 · PH05独立草稿','62课701题手机学习台 · 批次A独立草稿').replaceAll('恢复PH05同版备份','恢复批次A同版备份').replaceAll('qinghua-2028-ph05-backup.json','qinghua-2028-issue8-a-backup.json').replaceAll('仅可恢复PH05同版备份','仅可恢复批次A同版备份').replaceAll('原PH04、PH03、V15及更早版记录保留','原CROSS01、PH04、PH03、V15及更早版记录保留');}
 if(f.path==='migration-bridge.js')s=s.replaceAll('PH05草稿','批次A草稿');
 if(f.path==='mock-engine.js')s=once(s,'pack?.units?.length===60','pack?.units?.length===62').replaceAll('frozen 60-course internal draft','frozen 62-course internal draft').replaceAll('ph05-internal-only','issue8-a-internal-only');
 if(f.path==='mock-ui.js')s=s.replaceAll('60课','62课');
 if(f.path==='index.html')s=s.replaceAll('60课683题PH05独立内测','62课701题批次A独立内测');
 if(f.path==='manifest.json'){const m=JSON.parse(s);Object.assign(m,{name:'清华2028｜批次A医工环境独立草稿',short_name:'批次A草稿',id:'./?edition='+edition});s=JSON.stringify(m);}
 if(f.path==='sw.js')s=once(s,"const CACHE='"+prior.cache+"';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s);fs.writeFileSync(path.join(out,f.path),bytes);files.push({path:f.path,sha256:hash(bytes),priorSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.equal(hash(Buffer.from(JSON.stringify(JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'))).units.slice(0,60)))),oldHash);
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify({sourceBaseline:'f276e1e7690f15be022ea2e282411d8f3bbc7367',edition,db,journal,cache,courses:62,questions:701,addedUnitIds:added.map(u=>u.id),newCourses:2,newQuestions:18,original60UnitsSHA256:oldHash,priorContentHash:prior.newContentHash,newContentHash:hash(fs.readFileSync(path.join(out,'representative-courses.json'))),legacy60CourseContentIdentical:true,unitContentHashes:added.map(unit=>({id:unit.id,hash:hash(Buffer.from(JSON.stringify(unit)))})),files,automaticMigration:false,crossVersionImportEnabled:false,independentProfessionalApprovals:0,fullOfficial2028SyllabusVerified:false,formalReleaseApproved:false,deployed:false},null,2));
console.log(JSON.stringify({courses:62,questions:701,old60Unchanged:true,automaticMigration:false,expertApprovals:0,formalRelease:false}));
