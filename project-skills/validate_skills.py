from pathlib import Path
import json,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
validator=Path.home()/'.codex/skills/.system/skill-creator/scripts/quick_validate.py'
rows=[]
for folder in sorted((ROOT/'.agents/skills').iterdir()):
 if not folder.is_dir(): continue
 text=(folder/'SKILL.md').read_text(encoding='utf-8')
 result=subprocess.run([sys.executable,str(validator),str(folder)],capture_output=True,text=True)
 links=re.findall(r'\]\(([^)]+)\)',text)
 missing=[link for link in links if not (folder/link).resolve().exists()]
 rows.append({'skill':folder.name,'officialValidatorPassed':result.returncode==0,'validatorOutput':result.stdout.strip(),'references':len(links),'missingReferences':missing,'passed':result.returncode==0 and not missing})
report={'scope':'Installed repository files and explicit workflow invocation; not live client automatic discovery','skills':rows,'automaticDiscoveryObserved':False,'placementDocumentation':'https://learn.chatgpt.com/docs/build-skills','passed':len(rows)==7 and all(r['passed'] for r in rows)}
(ROOT/'audit-2028/skills-quality-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(0 if report['passed'] else 1)
