const CACHE = "qh-os-v590-materials";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./css/app.css?v=590",
  "./js/store.js?v=590",
  "./js/chapters.js?v=590",
  "./js/bank.js?v=590",
  "./js/english_support.js?v=590",
  "./js/reading58.js?v=590",
  "./js/learning58.js?v=590",
  "./js/material-catalog59.js?v=590",
  "./js/materials59.js?v=590",
  "./js/app.js?v=590",
  "./epi.html", "./stats.html", "./public_health.html", "./medical_physics.html",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('qh-os-') && k !== CACHE).map((k) => caches.delete(k))))
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
