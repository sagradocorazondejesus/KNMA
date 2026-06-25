const CACHE_NAME = "cantoral-kerigma-v1.0.0";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/estilos.css",
  "./css/misa.css",

  "./js/app.js",
  "./js/misa.js",
  "./js/transpositor.js",

  "./js/cantos/entrada.js",
  "./js/cantos/kyrie.js",
  "./js/cantos/gloria.js",
  "./js/cantos/aleluya.js",
  "./js/cantos/ofertorio.js",
  "./js/cantos/santo.js",
  "./js/cantos/cordero.js",
  "./js/cantos/comunion.js",
  "./js/cantos/salida.js",
  "./js/cantos/marianos.js",
  "./js/cantos/otros.js",

  "./img/logo-kerigma.jpg"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(respuesta => {
        const copia = respuesta.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copia);
        });

        return respuesta;
      })
      .catch(() => caches.match(event.request))
  );
});