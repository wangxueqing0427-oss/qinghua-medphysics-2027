'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),A=require('../product-2028-draft/content/review-ledger.cjs');
const pack=require('./course.json'),frozen=require('./freeze.json'),src=path.join(__dirname,'../product-2028-mobile-candidate/.build'),out=path.join(__dirname,'.build'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(pack.units.length,1);assert.equal(A.contentHash(pack.units[0]),frozen.contentHash,'Frozen content changed: new explicit revision required');assert.deepEqual(require('../product-2028-draft/course-engine.cjs').validate(pack),[]);
function once(s,a,b){assert.equal(s.split(a).length,2,'Anchor changed: '+a);return s.replace(a,b);}
const files=[];fs.mkdirSync(out,{recursive:true});for(const entry of require('../product-2028-mobile-candidate/build-manifest.json').files){let s=fs.readFileSync(path.join(src,entry.path),'utf8');assert.equal(hash(Buffer.from(s)),entry.sha256,'Original C1 build changed');
if(entry.path==='representative-courses.json')s=JSON.stringify(pack,null,2);
if(entry.path==='profile-repository.js')s=once(s,'qh2028_mobile_candidate_v1','qh2028_svo_first_lesson_v1');
if(entry.path==='pilot-ui.js'){
s=s.replaceAll('qh2028-mobile-candidate-c1','qh2028-svo-first-lesson-v1').replaceAll('qh2028_mobile_candidate_pending_v1:','qh2028_svo_first_lesson_pending_v1:').replaceAll('2028新版手机候选 MOBILE-C1','2028首课试运行 MOBILE-C1-SVO').replaceAll('47课523题','1课5题').replaceAll('内容待审校','首课内部核查通过 · 非专家审定');
s=once(s,"const text=document.getElementById('answer').value.trim();if(!text)","const text=document.getElementById('answer').value;if(!text.trim())");
s=s.replaceAll('qinghua-2028-mobile-c1-backup.json','qinghua-2028-svo-backup.json');}
if(entry.path==='index.html')s=s.replaceAll('2028新版手机候选 MOBILE-C1','2028首课试运行 MOBILE-C1-SVO');
if(entry.path==='manifest.json'){const m=JSON.parse(s);Object.assign(m,{name:'清华2028 · SVO首课试运行',short_name:'SVO首课',id:'./?edition=svo-first-lesson-v1'});s=JSON.stringify(m);}
if(entry.path==='sw.js')s=once(s,s.match(/const CACHE='([^']+)'/)[1],'qh2028-svo-first-lesson-'+hash(JSON.stringify(files)).slice(0,12));
fs.writeFileSync(path.join(out,entry.path),s);files.push({path:entry.path,sha256:hash(Buffer.from(s))});}
fs.writeFileSync(path.join(__dirname,'build-manifest.json'),JSON.stringify({candidate:'MOBILE-C1-SVO',upstream:frozen.upstream,testedOriginalC1:frozen.browserTestedC1,localOnly:true,deployed:false,courses:1,questions:5,courseId:frozen.id,version:frozen.version,contentHash:frozen.contentHash,edition:'qh2028-svo-first-lesson-v1',database:'qh2028_svo_first_lesson_v1',expertApproved:false,files},null,2));console.log('Built isolated SVO candidate: 10 static assets');
