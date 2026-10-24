"""Evidence-only checks. Does not extract curves or touch learning data."""
import json, hashlib, math
from pathlib import Path
D=Path(__file__).resolve().parent
R=D.parents[1]
sha=lambda b:hashlib.sha256(b).hexdigest()
blob=lambda b:hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
e=json.loads((D/'fixed-library-metadata-v16.json').read_text(encoding='utf-8'))
results=[]
def check(name,value):
    results.append({'name':name,'passed':bool(value)})
f={x['id']:x for x in e['findings']}
check('Expected engineering and source commits',e['baseCommit']=='b105b21ce003cead1a44ad57b1216f470f75a791' and e['sourceCommit']=='008bfd7c2e8d5101912262a33adea5ef867d7f25')
check('Four disjoint metadata questions',len(f)==4)
check('Isotope and charge remain unknown',f['isotope-charge']['fileDirect']=={'massNumber':None,'chargeState':None})
check('Paper filter not promoted to file fact',f['ripple-filter']['fileDirect']['thickness_mm'] is None and f['ripple-filter']['paperMethod']['thickness_mm']==3)
check('FLUKA run parameters remain unknown',all(v is None for v in f['fluka-run']['fileDirect'].values()))
check('Lateral integration aperture remains unknown',f['lateral-beam-normalization']['fileDirect']['lateralScoringArea_mm2'] is None)
check('Runtime normalization dimensional calculation',math.isclose(1.6021766208e-10*100*1e6,f['lateral-beam-normalization']['runtimeCode']['conversionFactor'],rel_tol=1e-14))
check('Pinned source locators and hashes provided',len(e['sourceReading'])==6 and all(len(s['gitBlob'])==40 and len(s['sha256'])==64 and s['readRanges'] for s in e['sourceReading']))
check('v15 bytes match remote Git blobs',all(blob((R/x['path']).read_bytes())==x['sha'] for x in e['protection']['v15GitBlobs']))
check('Historical and v15 protected hashes unchanged',len(e['protection']['hashes'])==87 and all(sha((R/p).read_bytes())==h for p,h in e['protection']['hashes'].items()))
check('Professional handoff has four real questions, no approval',len(e['expertHandoff'])==4 and all(x['question'] and x['qualification'] for x in e['expertHandoff']) and e['independentExpertApproved']==0)
check('Failures and stopping boundary retained',len(e['paperAccessThisRound'])==3 and e['stopDecision'] and e['conclusion']=='条件性支持')
receipt={'command':'bundled Python -X utf8 product-2028-draft/mp-evidence-2026-10-24-v16/verify-v16.py','scope':'Local metadata/evidence/hash checks only; no numerical curve re-extraction, full regression, CI, browser or real iPhone tests','passed':sum(x['passed'] for x in results),'total':len(results),'results':results,'evidenceSha256':sha((D/'fixed-library-metadata-v16.json').read_bytes()),'reportSha256':sha((D/'固定碳库元数据核查-v16.md').read_bytes()),'validatorSha256':sha(Path(__file__).read_bytes()),'independentExpertApproved':0,'CIStarted':False}
target=D/'validation-receipt-v16.json'
if target.exists():
    assert json.loads(target.read_text(encoding='utf-8'))==receipt,'Refuse replace different previous receipt'
else:target.write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f"v16 local evidence checks {receipt['passed']}/{receipt['total']}")
assert all(x['passed'] for x in results),results
