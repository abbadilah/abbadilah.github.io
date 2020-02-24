const staticCacheName = 'cache-v1';
const filesToCache = [
  '/',
  'index.html',
  'css/app.css',
  'css/font.css',
  'css/game.css',
  'css/highscores.css',
  'css/materialize.css',
  'css/materialize.min.css',
  'css/style.css',
  'js/end.js',
  'js/game.js',
  'js/init.js',
  'js/highscores.js',
  'js/jquery-2.1.1.min.js',
  'js/materialize.js',
  'js/materialize.min.js',
  'image/asteroid.png',
  'image/asteroid1.png',
  'image/background.jpg',
  'image/background1.jpg',
  'image/bulan.jpg',
  'image/bulan1.jpg',
  'image/bumi.jpg',
  'image/bumi1.jpg',
  'image/card.jpg',
  'image/comet.png',
  'image/comet1.jpg',
  'image/gbulan1.jpg',
  'image/gmatahari1.jpg',
  'image/jupiter.jpg',
  'image/jupiter1.png',
  'image/mars.jpg',
  'image/mars1.jpg',
  'image/me.png',
  'image/merkurius.jpg',
  'image/merkurius1.png',
  'image/meteor.png',
  'image/meteor1.jpg',
  'image/neptunus.jpg',
  'image/neptunus1.jpg',
  'image/planet.png',
  'image/pluto.jpg',
  'image/pluto1.jpg',
  'image/rotasi1.jpg',
  'image/saturnus.jpg',
  'image/saturnus1.jpg',
  'image/sun.jpg',
  'image/sun1.jpg',
  'image/uranus.jpg',
  'image/uranus1.jpg',
  'image/venus.jpg',
  'image/venus1.jpg',
  'comp/blangit.html',
  'comp/jmateri.html',
  'comp/planet.html',
  'comp/pristiwa.html',
  'comp/tentang.html',
  'kuis/end.html',
  'kuis/game.html',
  'kuis/kuis.html',
  'kuis/highscores.html',
  'kuis/questions.json',
  'materi/asteroid.html',
  'materi/bulan.html',
  'materi/bumi.html',
  'materi/comet.html',
  'materi/gerhanab.html',
  'materi/gerhanam.html',
  'materi/jupiter.html',
  'materi/mars.html',
  'materi/matahari.html',
  'materi/merkuri.html',
  'materi/meteor.html',
  'materi/neptunus.html',
  'materi/pluto.html',
  'materi/revolusi.html',
  'materi/rotasi.html',
  'materi/saturnus.html',
  'materi/uranus.html',
  'materi/venus.html',
  'materi/style.css',
  'pages/page-offline.html',
  'pages/page-404.html',
  'manifest.json'

];

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)
      .then(response => {
        if (response.status === 404) {
          return caches.match('pages/page-404.html');
        }
        return caches.open(staticCacheName)
        .then(cache => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('pages/page-offline.html');
    })
  );
});