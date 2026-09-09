const CACHE = "qh-os-v531-date-hotfix";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./css/app.css",
  "./js/store.js",
  "./js/chapters.js",
  "./js/bank.js",
  "./js/app.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).then((x) => {
      const copy = x.clone();
      caches.open(CACHE).then((cache) => cache.put(e.request, copy));
      return x;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
