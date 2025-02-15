self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("notepad-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/style.css",
                "/text.js",
                "/background.js",
                "/icons/icon-192x192.png",
                "/icons/icon-512x512.png",
                "/saveDocument.js",
                "/toolbar.js"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
