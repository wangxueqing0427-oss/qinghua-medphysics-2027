const CACHE = 'qh2028-test-v600-r1';
const ASSETS = ['./','./index.html','./backup-safe.html','./manifest.json','./icon.svg','./css/app.css?v=600',
  ...['store','chapters','bank','courses60','english_support','reading58','learning58','material-catalog59','materials59','plan60','backup60','app','reliability60'].map(x=>'./js/'+x+'.js?v=600'),
  './epi.html','./stats.html','./public_health.html','./medical_physics.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
// Keep previous offline cache for recovery. Never change learning storage or IDB.
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(e.request);
      if(response.ok){try{await cache.put(e.request,response.clone());}catch(error){/* Cache quota must not block online learning. */}return response;}
      return await cache.match(e.request)||response;
    }catch(error){
      const cached=await cache.match(e.request);if(cached)return cached;
      if(e.request.mode==='navigate'){const shell=await cache.match('./index.html');if(shell)return shell;}
      return new Response('离线资源暂不可用',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
  })());
});
