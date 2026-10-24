const C='jiugae-v4';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon.svg','./manifest.webmanifest']).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
// 네트워크 우선, 안 되면 캐시(오프라인용)
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;if(e.request.url.indexOf('/gichul-jiugae-audio/')>=0)return;/* 패턴 듣기 오디오는 브라우저가 직접(부분 받기·재생), 캐시하지 않음 */e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});
