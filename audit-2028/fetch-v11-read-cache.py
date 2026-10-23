"""Read-only public source cache; extracted text is not committed or counted as read."""
import urllib.request,json,hashlib,concurrent.futures
from pathlib import Path
sources={'feigley':'https://stacks.cdc.gov/view/cdc/218585/cdc_218585_DS1.pdf','trs461':'https://www-pub.iaea.org/MTCD/Publications/PDF/trs461_web.pdf','aapm82':'https://aapm.org/pubs/protected_files/reports/rpt_82.pdf','igrt':'https://www-pub.iaea.org/MTCD/Publications/PDF/P1827_web.pdf'}
def fetch(item):
 key,url=item;path=Path('tmp/pdfs/v11-'+key+'.pdf')
 try:
  data=urllib.request.urlopen(url,timeout=20).read()
  if not data.startswith(b'%PDF'):raise ValueError('Response is not PDF')
  path.write_bytes(data)
  return dict(id=key,url=url,status='downloaded-not-read',bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
 except Exception as error:return dict(id=key,url=url,status='failed',error=str(error))
if __name__=='__main__':
 rows=list(concurrent.futures.ThreadPoolExecutor(4).map(fetch,sources.items()))
 out=Path('tmp/pdfs/v11-access-escalated.json')
 if out.exists():raise RuntimeError('Preserve existing access receipt; use a new version')
 out.write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(rows,ensure_ascii=False))
