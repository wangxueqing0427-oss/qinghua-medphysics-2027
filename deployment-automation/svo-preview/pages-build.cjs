'use strict';
const path=require('path'),fs=require('fs'),{wait}=require('./ci-gate.cjs'),{build}=require('./build.cjs');
async function release({sha,branch,out=path.join(__dirname,'public'),gate=wait,builder=build}){const proof=await gate({sha,branch});if(!proof.ready)throw Error('No successful CI proof');const files=builder(out);return {sha,branch,proof,files};}
module.exports={release};
if(require.main===module)release({sha:process.env.CF_PAGES_COMMIT_SHA,branch:process.env.CF_PAGES_BRANCH}).then(r=>{fs.mkdirSync(path.join(__dirname,'evidence'),{recursive:true});fs.writeFileSync(path.join(__dirname,'evidence/pages-build.json'),JSON.stringify(r,null,2));console.log(JSON.stringify(r));}).catch(e=>{console.error(e.message);process.exitCode=1;});
