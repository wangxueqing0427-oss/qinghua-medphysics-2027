'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const files=['index.html','app.css','icon.svg','manifest.json','course-engine.js','profile-repository.js','learning-controller.js','pilot-ui.js','representative-courses.json','sw.js'];
const pinned=require('./pinned-assets.json');
assert.deepEqual([...pinned.files.map(f=>f.path)].sort(),[...files].sort());assert.equal(pinned.files.length,10);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function verify(dir){assert(fs.lstatSync(dir).isDirectory()&&!fs.lstatSync(dir).isSymbolicLink(),'Output must be a real directory');const names=fs.readdirSync(dir);assert.deepEqual([...names].sort(),[...files].sort(),'Exact 10 file allowlist, no nested/extra paths');return files.map(name=>{assert.equal(path.basename(name),name);const p=path.join(dir,name),stat=fs.lstatSync(p);assert(stat.isFile()&&!stat.isSymbolicLink(),'No symlinks or directories: '+name);const hash=sha(fs.readFileSync(p)),expected=pinned.files.find(f=>f.path===name).sha256;assert.equal(hash,expected,'Pinned SHA256 mismatch: '+name);return {path:name,sha256:hash,bytes:stat.size};});}
module.exports={files,pinned,sha,verify};
if(require.main===module)console.log(JSON.stringify({verified:verify(process.argv[2]||path.resolve(__dirname,'../../product-2028-svo-offline-r2/.build'))}));
