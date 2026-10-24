// Re-run one existing caller to verify optional pack injection is backward-compatible.
const fs=require('fs'),path=require('path');process.chdir(path.resolve(__dirname,'../..'));const write=fs.writeFileSync;
fs.writeFileSync=function(p,...args){if(p==='audit-2028/english-agreement-results.json')p=path.join(__dirname,'legacy-english-agreement-results.json');return write.call(fs,p,...args);};
require('../../audit-2028/english-agreement-test.cjs');
