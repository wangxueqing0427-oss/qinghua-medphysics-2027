// Read the explicitly versioned continuation; never infer completion from absent fields.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),H=b=>crypto.createHash('sha256').update(b).digest('hex');
const rel='product-2028-issue10-papers/sources/policy-ventilation-followup.json',b=fs.readFileSync(path.join(root,rel)),x=JSON.parse(b);
const git=cp.execFileSync('git',['-c','safe.directory='+root,'-C',root,'show','0a08a22:'+rel]);
const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,'policy-ventilation-test-receipt.json')));
assert(b.equals(git));assert.equal(H(b),receipt.evidenceSHA256);assert.equal(x.remainingIds.length,241);assert.equal(new Set(x.remainingIds).size,241);
const base=JSON.parse(fs.readFileSync(path.join(root,'audit-2028/evidence/2026-11-17-papers-delivery/remaining-sources-245.json')));
const removed=base.rows.filter(r=>!x.remainingIds.includes(r.id));assert.equal(removed.length,4);assert(x.remainingIds.every(id=>base.rows.some(r=>r.id===id)));
const out={date:'2026-11-17',baselineCommit:'0a08a22c5ae0d938b61c7e8b58bfbdee118d2f3c',baselineQueueFile:rel,baselineQueueFileSHA256:H(b),idsSHA256:H(JSON.stringify(x.remainingIds)),count:241,rows:x.remainingIds.map(id=>base.rows.find(r=>r.id===id)),differenceFromHistorical245:removed.map(r=>r.id),explanation:'245 file is immutable historical evidence; 241 continuation is byte-identical to commit0a08a22, not a conflicting branch.',expertApprovals:0};
fs.writeFileSync(path.join(__dirname,'queue-current-241.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({count:241,idsSHA256:out.idsSHA256,localEqualsCommit:true,receiptHashMatches:true}));
