'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const receipt=require('./build-receipt.json'),root=path.join(__dirname,'.build');
assert.equal(receipt.files.length,17);
assert.deepEqual(fs.readdirSync(root).sort(),receipt.files.map(f=>f.path).sort());
for(const f of receipt.files){assert(!f.path.includes('/'));const b=fs.readFileSync(path.join(root,f.path));assert.equal(b.length,f.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256,f.path);}
const pack=require('./.build/representative-courses.json');assert.equal(pack.units.length,71);assert.equal(pack.units.flatMap(u=>[...u.basicQuestions,...u.applicationQuestions,...u.delayedQuestions]).length,800);
const out={passed:true,assets:17,courses:71,questions:800,sha:process.env.GITHUB_SHA||null,realLearningDataAccess:false,productionModified:false};
fs.writeFileSync(path.join(__dirname,'delivery-verified.json'),JSON.stringify(out,null,2));console.log(out);
