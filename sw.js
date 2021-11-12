const CACHE_VERSION = "0.0.1-beta";
async function InstallEvent(e){
    const CACHE_LIST = [
        "/css/index.css",
        "/script/index.js",
        "/",
        "/index.html",
        // Iconos
        "/icons/favicon.svg",
        "/icons/icon-192x192.png",
        "/icons/icon-256x256.png",
        "/icons/icon-384x384.png",
        "/icons/icon-512x512.png",
    ];

    e.waitUntil(
        caches.open(CACHE_VERSION)
        .then(function(cache){
            console.log('Opened cache');
            return cache.addAll(CACHE_LIST);
        })
    );
};

async function FetchEvent(e){
    console.log(e);
    if(e.request.method != "GET") return;
    let cache_element = await caches.match(e.request);
    if(cache_element) return cache_element;
    else return fetch(e.request);
};

self.addEventListener("install", InstallEvent);
self.addEventListener("fetch", FetchEvent);