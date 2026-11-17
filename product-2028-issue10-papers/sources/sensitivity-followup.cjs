const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const packPath=path.join(root,'product-2028-issue10-papers/.build/representative-courses.json');
const before=hash(fs.readFileSync(packPath));
const pack=JSON.parse(fs.readFileSync(packPath));
const base=JSON.parse(fs.readFileSync(path.join(root,'audit-2028/evidence/2026-11-17-papers-delivery/remaining-sources-245.json')));
const previous=JSON.parse(fs.readFileSync(path.join(__dirname,'inverse-square-followup.json')));
const u=pack.units.find(x=>x.id==='353-medical-ai-validation'),id='353-medical-ai-validation-b2',q=u.basicQuestions.find(x=>x.id===id);
assert(previous.remainingIds.includes(id));assert.equal(hash(JSON.stringify(q)),base.rows.find(x=>x.id===id).questionHash);
const result={date:'2026-11-17',previousQueue:244,newDirectSubclaimAnchors:1,remainingQueueCount:243,
 sources:[{id:'FDA-DIAGNOSTIC-2007',agency:'FDA CDRH',title:'Statistical Guidance on Reporting Results from Studies Evaluating Diagnostic Tests',issued:'2007-03-13',url:'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/statistical-guidance-reporting-results-studies-evaluating-diagnostic-tests-guidance-industry-and-fda',readStatus:'actual HTML guidance body, specified sections',locator:'Sections4.1,5,7.1 Table1 and formula,7.2; retrieved lines203–218,284–298,438–494. HTML, no PDF-page claim.',supports:'Reference-positive denominator TP+FN; sensitivity TP/(TP+FN); reference standard and intended-use population matter.',limits:'Historical nonbinding US guidance used for stable statistical definition, not current Chinese regulatory requirements; agreement with a non-reference comparator is not automatically sensitivity.'}],
 rows:[{id,course:u.id,version:u.version,originalQuestion:q,questionSHA256:hash(JSON.stringify(q)),directSupport:'Sensitivity denominator is reference-positive TP+FN, hence option1 (20) in the given table.',independentlyReasonedAnswer:1,remainingBoundary:'This verifies the denominator subclaim only, not the validity of the hypothetical AI reference standard or generalization to other populations.',sourceIds:['FDA-DIAGNOSTIC-2007'],confirmedP0P1:false,minimalRevision:'No answer change. Existing gmlp sourceRef is broad for this formula; retain this supplemental exact statistical source in audit trail.',fullQuestionVerified:false,expertApproved:false}],removedIds:[id],remainingIds:previous.remainingIds.filter(x=>x!==id),independentProfessionalApprovals:0,failedSources:[]};
const checks=[];const check=(name,f)=>{f();checks.push({name,passed:true});};
check('queue exact and disjoint',()=>{assert.equal(result.remainingIds.length,243);assert.equal(new Set(result.remainingIds).size,243);assert(!result.remainingIds.includes(id));});
check('original question provenance',()=>assert.equal(result.rows[0].questionSHA256,base.rows.find(x=>x.id===id).questionHash));
check('independent denominator answer',()=>{assert.equal(q.answer,1);assert(q.options[1].includes('20'));});
check('explicit source and interpretation boundaries',()=>{assert(result.sources[0].locator.includes('7.2'));assert.equal(result.rows[0].fullQuestionVerified,false);assert.equal(result.independentProfessionalApprovals,0);});
check('candidate content unchanged',()=>assert.equal(hash(fs.readFileSync(packPath)),before));
fs.writeFileSync(path.join(__dirname,'sensitivity-followup.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(__dirname,'sensitivity-test-receipt.json'),JSON.stringify({date:'2026-11-17',passed:checks.length,failed:0,checks,protectedPackHash:before,evidenceSHA256:hash(fs.readFileSync(path.join(__dirname,'sensitivity-followup.json'))),scope:'evidence consistency; not clinical validation or expert approval'},null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,remaining:243}));
