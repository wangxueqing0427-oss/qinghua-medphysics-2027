const assert=require('assert'),fs=require('fs'),e=require('../product-2028-draft/course-engine.cjs');const results=[];function test(name,fn){try{fn();results.push({name,pass:true})}catch(x){results.push({name,pass:false,error:x.message})}}
test('incomplete unit is rejected',()=>assert.ok(e.validate({schemaVersion:1,units:[{id:'empty'}]}).length));
test('unreviewed content blocked from public release',()=>assert.ok(e.validate({schemaVersion:1,units:[{id:'draft'}]},true).includes('release-blocked')));
test('single answer does not coerce strings',()=>assert.equal(e.grade({type:'single',answer:1},'1').correct,false));
test('multiselect exact unordered set',()=>assert.equal(e.grade({type:'multi',answer:[0,2]},[2,0]).correct,true));
test('duplicate multiselect rejected',()=>assert.equal(e.grade({type:'multi',answer:[0,2]},[0,0]).correct,false));
test('calculation requires correct units',()=>assert.equal(e.grade({type:'number',answer:10,tolerance:0.01,unit:'%'},{value:10,unit:'Gy'}).correct,false));
test('subjective feedback never manufactures a score',()=>assert.equal(e.grade({type:'subjective',answer:'reference',rubric:['point']},'mine').score,null));
test('cannot skip learning to grading',()=>assert.throws(()=>e.advance({stage:'learn'},'answered')));
test('recall cannot expose answers',()=>assert.throws(()=>e.advance({stage:'recall'},'recalled',{answer:'mine',answerVisible:true})));
test('actual recall is saved without mutating previous session',()=>{const s={stage:'recall',events:[]},n=e.advance(s,'recalled',{answer:'mine'});assert.equal(n.events[0].payload.answer,'mine');assert.equal(s.events.length,0)});
test('question version required',()=>assert.throws(()=>e.advance({stage:'practice'},'answered',{answer:1,questionId:'q'})));
const row={correct:true,method:'objective',at:'2026-10-09T12:00:00Z',type:'single',questionId:'q1'};
test('same day repetition is not stable mastery',()=>assert.equal(e.evidence([row,row,row],row.at).state,'initial-understanding'));
test('self rating cannot prove mastery',()=>assert.equal(e.evidence([{...row,method:'self'}],row.at).state,'needs-review'));
test('score prediction stays unknown',()=>assert.equal(e.evidence([row],row.at).scoreEstimate,null));
test('failed review resets next day',()=>assert.equal(e.evidence([{...row,correct:false}],row.at).due,'2026-10-10T12:00:00.000Z'));
fs.writeFileSync('audit-2028/course-engine-results.json',JSON.stringify({scope:'Pure logic, not browser or iPhone; engine not integrated into old app',results},null,2));console.log(JSON.stringify({passed:results.filter(x=>x.pass).length,total:results.length,failed:results.filter(x=>!x.pass)}));if(results.some(x=>!x.pass))process.exitCode=1;
