// Exact allowlist: no silently skipped tests. Historical unpublished V60 assets
// are deliberately not uploaded merely to make their legacy VM tests run in CI.
const fs=require('fs'),{spawnSync}=require('child_process');
const scripts=['catalog-integration-test','course-batch1-integration-test','course-engine-test','profile-repository-test','learning-integration-test','pilot-ui-simulation-test','content-contract-test','pilot-offline-test','pilot-http-test','round4-reliability-test','r5-profile-rubric-test','r4-r5-compatibility-test'];
const reports=[];
for(const name of scripts){
 const start=Date.now(),r=spawnSync(process.execPath,['audit-2028/'+name+'.cjs'],{encoding:'utf8',timeout:60000});
 const file='audit-2028/'+(name.endsWith('-test')?name.slice(0,-5):name)+'-results.json';
 try{if(r.status!==0)throw Error((r.stderr||r.stdout||r.error?.message||'failed').slice(-2400));if(fs.statSync(file).mtimeMs<start-1000)throw Error('stale result');const v=JSON.parse(fs.readFileSync(file,'utf8'));if(!v.results.length||v.results.some(x=>x.pass!==true))throw Error('failed assertions');reports.push({suite:name,passed:v.results.length,total:v.results.length,pass:true});}
 catch(e){reports.push({suite:name,passed:0,total:0,pass:false,error:e.message});}
}
const report={scope:'Committed isolated engine/controller/synthetic IndexedDB/VM/offline/localhost HTTP tests, not real browser or physical iPhone; content and browser tests run separately',passed:reports.every(r=>r.pass),reports,excludedHistoricalSuites:[{suite:'regression.cjs',reason:'Requires unpublished deploy-v60-candidate historical assets; local gate only'},{suite:'material-backup.cjs',reason:'Requires unpublished deploy-v60-candidate assets; synthetic local gate only'},{suite:'mobile-build-test.cjs',reason:'Requires local historical build manifest; local gate only'},{suite:'round4-build-safety-test.cjs',reason:'Local static candidate boundary check; browser CI independently validates committed build'}]};
report.total=reports.reduce((n,r)=>n+r.total,0);report.testPassed=reports.reduce((n,r)=>n+r.passed,0);fs.writeFileSync('audit-2028/ci-engine-gate-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
