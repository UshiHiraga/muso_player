const CACHE_VERSION = "0.0.1";
async function InstallEvent(e){
    const CACHE_LIST = [
        // Estilos CSS
        "./css/computer_index_page.css",
        "./css/phone_index_page.css",
        "./css/colors_scheme.css",
        // Iconos
        "./icons/favicon.svg",
        "./icons/icon-192x192.png",
        "./icons/icon-256x256.png",
        "./icons/icon-384x384.png",
        "./icons/icon-512x512.png",
        // Scripts
        "./script/index.js",
        "./script/NodeListPrototype.js",
        "./script/StoragePrototype.js",
        // HTML Pages
        "./index.html",
        "./404.html",
        "./manifest.webmanifest",
        "./"
    ];

    e.waitUntil(
        caches.open(CACHE_VERSION)
        .then(function(cache){
            console.log('Opened cache');
            return cache.addAll(CACHE_LIST);
        })
    );
};

function FetchEvent(event) {
    event.respondWith(            
        caches.match(event.request).then(function(response) {
            if(response) {
                console.log('Found response in cache:', response);
                return response;
            };

            console.log('No response found in cache. About to fetch from network...');
            return fetch(event.request).then(function(response) {
                return response;
            }).catch(function (error) {                
                return caches.match("/404.html");
            });
        })
    );
}

self.addEventListener("install", InstallEvent);
self.addEventListener("fetch", FetchEvent);