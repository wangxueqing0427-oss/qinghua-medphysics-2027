'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
(async()=>{assert.equal(process.env.CF_PAGES,'1');assert.equal(process.env.CF_PAGES_BRANCH,'candidate/2026-11-16-issue10-q0-content-fix');
const proof=await require('./ci-gate.cjs').wait({sha:process.env.CF_PAGES_COMMIT_SHA,branch:process.env.CF_PAGES_BRANCH,timeoutMs:1080000,pollMs:60000});assert(proof.ready);
const receipt=require('./build-receipt.json'),out=path.join(__dirname,'../product-2028-integration-47-upgraded/.build');
assert.equal(receipt.files.length,17);assert(!fs.existsSync(out)||fs.readdirSync(out).length===0,'Refuse overwriting existing output');fs.mkdirSync(out,{recursive:true});
for(const f of receipt.files){assert(!f.path.includes('/')&&!f.path.includes('..'));const bytes=fs.readFileSync(path.join(__dirname,'.build',f.path));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256);fs.writeFileSync(path.join(out,f.path),bytes);}
assert.deepEqual(fs.readdirSync(out).sort(),receipt.files.map(f=>f.path).sort());console.log(JSON.stringify({sha:process.env.CF_PAGES_COMMIT_SHA,proof,assets:17,production:false,rollback:'https://ddb5c5f1.qh2028-core47-preview.pages.dev/'}));
})().catch(e=>{console.error('Issue10 preview refused:',e);process.exitCode=1;});
