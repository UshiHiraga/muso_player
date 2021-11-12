const CACHE_VERSION = "0.0.1-beta";
const CACHE_LIST = [
    "./css/index.css",
    "./script/index.js",
    "./index.html",
    // Iconos
    "./icons/favicon.svg",
    "./icons/icon-192x192.png",
    "./icons/icon-256x256.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",
]


function InstallEvent(e){
   let promise = caches.open(CACHE_VERSION)
   .then((cache) => cache.addAll(CACHE_LIST));

   e.waitUntil(promise);
};

async function FetchEvent(e){
    if(e.request.method != "GET") return;

    


    console.log(e);
}

self.addEventListener("install", InstallEvent);
self.addEventListener("fetch", FetchEvent);