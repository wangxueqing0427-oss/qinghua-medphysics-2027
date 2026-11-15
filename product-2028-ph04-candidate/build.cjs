'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const prior=require('../product-2028-ph03-candidate/build-receipt.json'),from=path.join(__dirname,'../product-2028-ph03-candidate/.build'),out=path.join(__dirname,'.build');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs'),{validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),unit=require('./unit.json').units[0],old=JSON.parse(fs.readFileSync(path.join(from,'representative-courses.json'))),oldHash=hash(Buffer.from(JSON.stringify(old.units)));
assert.equal(old.units.length,57);assert.equal(prior.questions,644);assert.equal(unit.mapping[0],'PH04');assert(unit.prerequisites.every(id=>old.units.some(u=>u.id===id)));assert(!old.units.some(u=>u.id===unit.id));
const pack={...old,contentVersion:'qh2028-ph04-58-internal-draft',units:[...old.units,unit]},edition='qh2028-ph04-58',db='qh2028_ph04_58_local',journal='qh2028_ph04_58_pending:',cache='qh2028-ph04-58';
assert.deepEqual(E.validate(pack),[]);assert.deepEqual(validateObjectives(pack),[]);assert(E.validate(pack,true).includes('release-blocked'));assert.deepEqual(pack.units.slice(0,57),old.units);assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),656);
function once(s,a,b){assert.equal(s.split(a).length,2,'PH04 unique patch anchor: '+a);return s.replace(a,b);}
const files=[];fs.mkdirSync(out,{recursive:true});if(fs.readdirSync(out).length)assert.deepEqual(fs.readdirSync(out).sort(),prior.files.map(f=>f.path).sort());
for(const f of prior.files){const raw=fs.readFileSync(path.join(from,f.path));assert.equal(hash(raw),f.sha256,'PH03 asset changed: '+f.path);let s=raw.toString('utf8');
 if(f.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
 if(f.path==='profile-repository.js'){s=once(s,"const DRAFT_DB='"+prior.db+"';","const DRAFT_DB='"+db+"';");s=once(s,"backup?.profile?.settings?.candidateEdition!=='"+prior.edition+"'","backup?.profile?.settings?.candidateEdition!=='"+edition+"'");s=s.replaceAll('仅恢复PH03同版备份','仅恢复PH04同版备份');}
 if(f.path==='pilot-ui.js'){s=once(s,"const EDITION='"+prior.edition+"';","const EDITION='"+edition+"';");s=once(s,"const JOURNAL='"+prior.journal+"';","const JOURNAL='"+journal+"';");s=s.replaceAll('57课644题手机学习台 · V15接续PH03独立草稿','58课656题手机学习台 · PH04独立草稿').replaceAll('恢复PH03同版备份','恢复PH04同版备份').replaceAll('qinghua-2028-ph03-backup.json','qinghua-2028-ph04-backup.json').replaceAll('仅可恢复PH03同版备份','仅可恢复PH04同版备份').replaceAll('原V15及更早版记录保留','原PH03、V15及更早版记录保留');}
 if(f.path==='migration-bridge.js')s=s.replaceAll('PH03草稿','PH04草稿');
 if(f.path==='mock-engine.js')s=once(s,'pack?.units?.length===57','pack?.units?.length===58').replaceAll('frozen 57-course internal draft','frozen 58-course internal draft').replaceAll('ph03-internal-only','ph04-internal-only');
 if(f.path==='mock-ui.js')s=s.replaceAll('57课','58课');
 if(f.path==='index.html')s=s.replaceAll('57课644题PH03独立内测','58课656题PH04独立内测');
 if(f.path==='manifest.json'){const m=JSON.parse(s);Object.assign(m,{name:'清华2028｜PH04公共卫生应急独立草稿',short_name:'PH04草稿',id:'./?edition='+edition});s=JSON.stringify(m);}
 if(f.path==='sw.js')s=once(s,"const CACHE='"+prior.cache+"';","const CACHE='"+cache+"';");
 const bytes=Buffer.from(s);fs.writeFileSync(path.join(out,f.path),bytes);files.push({path:f.path,sha256:hash(bytes),priorSha256:f.sha256,changed:hash(bytes)!==f.sha256});
}
assert.equal(hash(Buffer.from(JSON.stringify(JSON.parse(fs.readFileSync(path.join(out,'representative-courses.json'))).units.slice(0,57)))),oldHash);
fs.writeFileSync(path.join(__dirname,'build-receipt.json'),JSON.stringify({sourceBaseline:'ab6722925216de8bbdb944d9ffe12b5ae0dc88cf',edition,db,journal,cache,courses:58,questions:656,addedUnitId:unit.id,newCourses:1,newQuestions:12,original57UnitsSHA256:oldHash,priorContentHash:prior.newContentHash,newContentHash:hash(fs.readFileSync(path.join(out,'representative-courses.json'))),legacy57CourseContentIdentical:true,unitContentHash:hash(Buffer.from(JSON.stringify(unit))),files,automaticMigration:false,crossVersionImportEnabled:false,independentProfessionalApprovals:0,fullOfficial2028SyllabusVerified:false,formalReleaseApproved:false,deployed:false},null,2));
console.log(JSON.stringify({courses:58,questions:656,old57Unchanged:true,automaticMigration:false,expertApprovals:0,formalRelease:false}));
