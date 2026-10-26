const C='jiugae-v5';
// 설치할 때 문제 원문 그림(74개, 약 6MB)도 받아 둔다: 지하철 같은 데서 계산 문제 그림이 안 떠 못 푸는 일이 없게(10-26)
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon.svg','./manifest.webmanifest']).catch(()=>{}).then(()=>fetch('./cards.json').then(r=>r.json()).then(d=>Promise.all(Object.values(d.questions).filter(q=>q.img).map(q=>c.add('./'+q.img).catch(()=>{}))))).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
// 그림(img/)은 바뀌지 않으니 캐시 먼저. 나머지는 네트워크 우선, 안 되면 캐시(오프라인용). 실패한 응답(404 등)은 캐시에 넣지 않는다
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.url.indexOf('/gichul-jiugae-audio/')>=0)return;/* 패턴 듣기 오디오는 브라우저가 직접(부분 받기·재생), 캐시하지 않음 */
  const put=r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;};
  if(e.request.url.indexOf('/img/')>=0){e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(put)));return;}
  e.respondWith(fetch(e.request).then(put).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
