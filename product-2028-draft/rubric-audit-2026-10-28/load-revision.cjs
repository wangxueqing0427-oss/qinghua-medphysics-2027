const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const A=require('../content/review-ledger.cjs');
const base=()=>require('../course-development-2026-10-25-fourth/load-batch.cjs').combined();
const all=u=>['basicQuestions','applicationQuestions','delayedQuestions'].flatMap(k=>u[k]);
function combined(){
  const pack=structuredClone(base()),r=require('./revisions.json'),frozen=require('./frozen-baseline.json');
  assert.equal(r.mode,'isolated-content-only');assert.equal(r.approved,false);
  for(const u of pack.units)assert.equal(A.contentHash(u),frozen.units.find(x=>x.id===u.id).hash,'Base changed: '+u.id);
  const changed=new Set();
  for(const row of r.changes){const u=pack.units.find(x=>x.id===row.course),q=all(u).find(x=>x.id===row.questionId);assert(q&&q.type==='subjective','Unknown subjective question');q.rubric=structuredClone(row.rubric);changed.add(u.id);}
  for(const u of pack.units.filter(x=>changed.has(x.id))){u.version='0.2-rubric-r1';u.reviewRecord={...u.reviewRecord,internalCheck:'rubric-revised-pending-recheck',expertApproved:false,publicRelease:false,priorVersion:'0.1',priorContentHash:frozen.units.find(x=>x.id===u.id).hash};}
  pack.contentVersion=r.revision;return pack;
}
module.exports={combined,base,all};
