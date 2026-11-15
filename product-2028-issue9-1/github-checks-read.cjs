'use strict';
// Read-only public API. Never logs authorization, retries quota denial, or substitutes a deployment.
async function readChecks(url,{fetcher=fetch,pause=ms=>new Promise(r=>setTimeout(r,ms)),log=x=>console.error(JSON.stringify(x))}={}){
 for(let attempt=1;attempt<=3;attempt++){
  const r=await fetcher(url,{headers:{Accept:'application/vnd.github+json','User-Agent':'qinghua-preview-readonly'},signal:AbortSignal.timeout(15000)});
  if(r.ok)return r.json();
  const detail={attempt,status:r.status,remaining:r.headers?.get?.('x-ratelimit-remaining')??null,reset:r.headers?.get?.('x-ratelimit-reset')??null,retryAfter:r.headers?.get?.('retry-after')??null,proofGranted:false};log(detail);
  if(![500,502,503,504].includes(r.status)||attempt===3)throw Object.assign(Error('Exact SHA checks read refused: '+JSON.stringify(detail)),{httpStatus:r.status});
  await pause(1000*attempt);
 }
}
module.exports={readChecks};
