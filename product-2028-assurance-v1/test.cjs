'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit}=require('./assurance.cjs');
const pack=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const registry=require('./evidence-register.json');
const clone=x=>structuredClone(x);
function firstQuestion(u){return u.basicQuestions[0];}
test('the full, current 47-course/524-question pack is audited, not a stale 43-question subset',()=>{
 const r=audit(pack,registry);
 assert.equal(r.totals.courses,47);
 assert.equal(r.totals.all,524);
 assert.deepEqual(Object.fromEntries(Object.entries(r.subjects).map(([k,v])=>[k,[v.units,v.questions]])),{
  en:[15,164],pol:[14,156],'353':[18,204]
 });
 assert.equal(r.questions.length,524);
 assert.equal(new Set(r.questions.map(q=>q.id)).size,524);
 assert.equal(r.units.length,47);
 assert.equal(r.exactDuplicateStems.length,0);
 assert.equal(r.fatal.length,0);
 assert.equal(r.safePersonalStudyPilot,true);
 assert.equal(r.passedAutomaticContracts,true);
 assert.equal(r.formalReleaseApproved,false);
 assert.equal(r.expertApprovals,0);
 assert.equal(r.confirmedFullExamCoverage,null);
 assert.equal(r.verified2028Syllabus,false);
 assert.equal(r.machineContentCorrectnessCertified,false);
 assert(r.questions.some(q=>q.id==='en-svo-delay-3'&&q.type==='subjective'));
 assert.equal(r.totals.objective+r.totals.subjective,524);
 assert(r.totals.numeric>0);
 assert(r.units.every(x=>x.mappedToOfficial2028Outline===false&&x.expertApproved===false));
});
test('official 2027 source is a provisional basis and English/Politics book records are not full outlines',()=>{
 const r=audit(pack,registry);
 assert.equal(registry.formal2028SyllabusAvailable,false);
 assert.equal(registry.fullEnglishAndPoliticsOutlineVerified,false);
 assert.equal(registry.hasIndependentExpert,false);
 assert(r.flags.length>=47);
 assert(r.units.filter(x=>x.subject==='353').every(x=>x.riskLevel==='high'));
 assert(r.units.filter(x=>x.subject==='pol').every(x=>x.riskLevel==='medium'));
 assert(r.knownLimitations.some(x=>x.includes('not independent formula recalculation')));
 const official=registry.references.find(x=>x.id==='tsinghua-2027-353-syllabus');
 assert.equal(official.year,2027);
 assert.equal(official.url,'https://vsph.tsinghua.edu.cn/info/1025/2775.htm');
 for(const id of ['english-one-2027-publication','politics-2027-publication']){
  assert.equal(registry.references.find(x=>x.id===id).evidenceLevel,'publication-catalog-not-full-syllabus');
 }
});
test('tampered question identity, answer bounds, source URLs and expert labels fail closed',()=>{
 const dup=clone(pack);
 dup.units[0].basicQuestions[0].id=dup.units[1].basicQuestions[0].id;
 assert(audit(dup,registry).fatal.some(x=>x.includes('question-id')));
 const repeated=clone(pack);
 repeated.units[1].basicQuestions[0].stem=repeated.units[0].basicQuestions[0].stem;
 assert(audit(repeated,registry).fatal.some(x=>x.startsWith('exact-duplicate-stems:')));
 const wrong=clone(pack);
 const q=wrong.units.find(u=>u.basicQuestions.some(z=>z.type==='single')).basicQuestions.find(z=>z.type==='single');
 q.answer=q.options.length+2;
 assert(audit(wrong,registry).fatal.some(x=>x.includes('invalid-choice-answer')||x.startsWith('objective-answer-contract:')));
 const source=clone(pack);
 source.units[0].sources=['http://unverified.example.com'];
 assert(audit(source,registry).fatal.some(x=>x.startsWith('invalid-source-url:')));
 const fake=clone(pack);
 fake.units[0].reviewRecord.expertApproved=true;
 assert(audit(fake,registry).fatal.some(x=>x.startsWith('unverified-approval:')));
 const false2028=clone(registry);false2028.formal2028SyllabusAvailable=true;
 assert.throws(()=>audit(pack,false2028),/Misleading/);
 const falseExpert=clone(registry);falseExpert.hasIndependentExpert=true;
 assert.throws(()=>audit(pack,falseExpert),/Misleading/);
});
test('subjective questions never become machine scores; numeric contracts do not claim independent math proof',()=>{
 const r=audit(pack,registry);
 for(const x of r.questions){
  assert.equal(x.contentEvidenceCheckedAgainstSource,false);
  assert.equal(x.numericalComputationIndependentlyReperformed,false);
  assert.equal(x.officialExamQuestion,false);
  if(x.type==='subjective')assert.equal(x.answerFormVerified,'reference-only-no-auto-score');
  else assert.equal(x.answerFormVerified,'engine-expected-answer-contract');
 }
 assert.equal(r.sourceRelevanceValidatedAutomatically,false);
 assert.equal(r.independentProfessionalSignoff,false);
 assert.equal(r.formalReleaseApproved,false);
});
