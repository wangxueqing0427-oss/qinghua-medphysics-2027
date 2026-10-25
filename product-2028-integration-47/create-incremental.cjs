// One-time NEW isolated harness derivation; refuses to overwrite an existing harness.
const fs=require('fs'),path=require('path');
const here=__dirname,old=path.join(here,'../product-2028-integration-38');
function write(name,s){const p=path.join(here,name);if(fs.existsSync(p))throw Error('Existing file; do not overwrite '+p);fs.writeFileSync(p,s);}
for(const name of ['build.cjs','server.cjs','playwright.config.cjs','summarize.cjs','browser.spec.cjs']){
 let s=fs.readFileSync(path.join(old,name),'utf8').replaceAll('SET38','SET47').replaceAll('set38','set47').replaceAll('5298','5307').replaceAll('integration-38','integration-47');
 if(name==='build.cjs')s=s.replaceAll('course-development-2026-10-25-third','course-development-2026-10-25-fourth').replaceAll('combined38','combined47').replaceAll('38课','47课').replaceAll('CI38-course','CI47-course');
 if(name==='playwright.config.cjs')s=s.replace('timeout:120000','timeout:240000').replace('globalTimeout:840000','globalTimeout:1500000').replace("trace:'off',screenshot:'off'","trace:'retain-on-failure',screenshot:'only-on-failure'");
 if(name==='browser.spec.cjs'){
  s=s.replaceAll('thirdIds','fourthIds').replaceAll('course-development-2026-10-25-third','course-development-2026-10-25-fourth').replace("const representative=pack.units.find(u=>u.id==='en-present-continuous-foundation');","const representative=pack.units.find(u=>u.id==='en-present-perfect-foundation');");
  s=s.replaceAll('HaveCount(38)','HaveCount(47)').replaceAll('HaveLength(415)','HaveLength(523)').replaceAll('isolated38-course','isolated47-course').replaceAll('415-question','523-question').replaceAll('cached38-course','cached47-course');
  s=s.replace("['en-present-continuous-foundation','pol-social-being-consciousness','353-probability-binomial-foundation']","['en-vocabulary-retrieval-foundation','pol-modern-history-entry','353-normal-distribution-foundation']");
  s=s.replaceAll('old29','old38').replaceAll('旧29','旧38').replaceAll('HaveCount(29)','HaveCount(38)').replaceAll('reopen in38','reopen in47').replace("require('../product-2028-draft/course-development-2026-10-25/load-batch.cjs').combined()","require('../product-2028-draft/course-development-2026-10-25-third/load-batch.cjs').combined()");
 }
 write(name,s);
}
console.log('Created SET47 incremental harness from unchanged SET38 originals.');
