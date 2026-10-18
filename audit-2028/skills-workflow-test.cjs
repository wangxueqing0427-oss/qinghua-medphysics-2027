const assert=require('assert'),fs=require('fs');const {assemble}=require('../product-2028-draft/content/assemble-catalog.cjs');const W=require('./skill-workflow.cjs');const pack=assemble(),results=[];
function test(name,f){try{f();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
test('Existing seven units and answer texts inspected',()=>{const r=W.inspect(pack);assert.equal(r.rows.length,43);assert.equal(r.errors.length,0);assert.equal(r.rows.find(q=>q.id==='en-svo-1').answerText,'water');});
test('Invalid objective index rejected',()=>{const p=structuredClone(pack);p.units[0].basicQuestions[0].answer=99;assert(W.inspect(p).errors.length);});
test('Duplicate stem flagged without deleting questions',()=>{const p=structuredClone(pack);p.units[0].basicQuestions[1].stem=p.units[0].basicQuestions[0].stem;assert(W.inspect(p).errors.length);assert.equal(W.inspect(p).rows.length,43);});
const b={kind:'self-authored-training',minutes:8,totalPoints:5,questions:[{id:'en-svo-1',points:2},{id:'en-svo-3',points:3}]};
test('Subjective training remains pending without predicted exam score',()=>{const r=W.blueprint(b,pack);assert.deepEqual(r.errors,[]);assert.deepEqual(r.subjectivePending,['en-svo-3']);assert.equal(r.predictedScore,null);assert.equal(r.appExamImplemented,false);});
test('Wrong total rejected',()=>assert(W.blueprint({...b,totalPoints:100},pack).errors.length));
test('Duplicate questions rejected',()=>assert(W.blueprint({...b,questions:[b.questions[0],b.questions[0]],totalPoints:4},pack).errors.length));
test('Unknown questions rejected',()=>assert(W.blueprint({...b,questions:[{id:'missing',points:5}]},pack).errors.length));
test('Unsupported official exam claim rejected',()=>assert(W.blueprint({...b,kind:'official'},pack).errors.length));
fs.writeFileSync('audit-2028/skills-workflow-test-results.json',JSON.stringify({scope:'Node workflow validation, not browser or expert review',results},null,2));console.log(JSON.stringify(results));if(results.some(r=>!r.pass))process.exitCode=1;
