import urllib.request,concurrent.futures,hashlib,json
from pathlib import Path
from pypdf import PdfReader
jobs={
 'trs483':('https://www-pub.iaea.org/MTCD/Publications/PDF/D483_web.pdf',[19,21,22,78,79,80,82,83]),
 'spectqa':('https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1394_web.pdf',[5,24,28,44,154,155,256]),
 'pet-eanm':('https://link.springer.com/content/pdf/10.1007/s00259-014-2961-x.pdf',[14,15,16]),
 'czt':('https://link.springer.com/content/pdf/10.1007/s12350-009-9137-2.pdf',[2,3]),
 'hebd':('https://www.aapm.org/pubs/reports/RPT_229_full.pdf',[3,23,24,25,59]),
 'moses':('https://psec.uchicago.edu/library/applications/PET/Bill_moses_fundamental_limits.pdf',[2,3,4,5,6])}
def run(item):
 key,(url,pages)=item;p=Path('tmp/pdfs/v10-'+key+'.pdf')
 try:
  if not p.exists():
   with urllib.request.urlopen(url,timeout=45) as r: data=r.read()
   p.write_bytes(data)
  data=p.read_bytes();doc=PdfReader(p)
  txt='\n'.join('PDF PAGE '+str(n)+'\n'+doc.pages[n-1].extract_text() for n in pages)
  Path('tmp/pdfs/v10-'+key+'.txt').write_text(txt,encoding='utf8')
  return dict(id=key,url=url,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),totalPages=len(doc.pages),extractedPdfPages=pages,status='extracted-not-yet-read')
 except Exception as e:return dict(id=key,url=url,error=str(e),status='failed')
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  rows=list(ex.map(run,jobs.items()))
 Path('tmp/pdfs/v10-access.json').write_text(json.dumps(rows,indent=2),encoding='utf8')
 print(json.dumps(rows,indent=2))
