if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, c) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let t = {};
    const o = (e) => n(e, i),
      r = { module: { uri: i }, exports: t, require: o };
    s[i] = Promise.all(a.map((e) => r[e] || o(e))).then((e) => (c(...e), t));
  };
}
define(["./workbox-49f2c8c8"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "3fe24967ad77128335252696ea2f5d8c",
        },
        {
          url: "/_next/static/chunks/1dd3208c-90f506bcbc815e19.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/231-6d61d6afe2de9338.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/286-9a082b758125dea6.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/656-448ff38cf1df8842.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/689-3a5be18dd1a9b334.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-02900b262f0df793.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/app/layout-669bb7d3e3153d76.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/app/page-bc4a197a06e5ebc8.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/app/talk-to-us/page-549935ab43ded899.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/framework-3664cab31236a9fa.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/main-3c1205494a1b4837.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/main-app-9e0d4c596ae4cf7a.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/pages/_app-dea0b6b1c42677ea.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/pages/_error-e327c3d2707a2378.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",
          revision: "79330112775102f91e1010318bae2bd3",
        },
        {
          url: "/_next/static/chunks/webpack-4073a8b0ab089893.js",
          revision: "hPHjSnssmKVoCcSoQ1pNV",
        },
        {
          url: "/_next/static/css/84c597825a1a7ff6.css",
          revision: "84c597825a1a7ff6",
        },
        {
          url: "/_next/static/hPHjSnssmKVoCcSoQ1pNV/_buildManifest.js",
          revision: "656b8902221579b9147c683663a2fb68",
        },
        {
          url: "/_next/static/hPHjSnssmKVoCcSoQ1pNV/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/media/161a6f459a5479b9-s.p.woff2",
          revision: "e06fb1aeda1377d0972bb646291ff0e5",
        },
        {
          url: "/_next/static/media/66f30814ff6d7cdf.p.woff2",
          revision: "addf0d443087aa4b985f763c80182017",
        },
        {
          url: "/_next/static/media/e11418ac562b8ac1-s.p.woff2",
          revision: "0e46e732cced180e3a2c7285100f27d4",
        },
        {
          url: "/browserconfig.xml",
          revision: "44286a127151d2b1eab828b48b7b7b4b",
        },
        { url: "/favicon.ico", revision: "ab634ba7c7bf019afc8b8662e3c2dfc3" },
        {
          url: "/icons/apple-touch-icon.svg",
          revision: "1f6efef17d6f02f5434b0424ce0f0bd3",
        },
        {
          url: "/icons/icon-128x128.svg",
          revision: "fbcbdd08d726323e7c86efb952069cc5",
        },
        {
          url: "/icons/icon-144x144.svg",
          revision: "e907175ad6762a340faa5f4446afbcf3",
        },
        {
          url: "/icons/icon-152x152.svg",
          revision: "97160fae9efe1f12b56ac95deafe75c6",
        },
        {
          url: "/icons/icon-192x192.svg",
          revision: "dacff271415aba6bd8be00bf2b27d5ac",
        },
        {
          url: "/icons/icon-384x384.svg",
          revision: "482690059f618ba6e38a1eaeb22c6a94",
        },
        {
          url: "/icons/icon-512x512.svg",
          revision: "c5a8c6363f3efcae63b47635f1c46ec8",
        },
        {
          url: "/icons/icon-72x72.svg",
          revision: "4d2c6da7f9e9e3c720f7cc82c4310876",
        },
        {
          url: "/icons/icon-96x96.svg",
          revision: "dbbf45c73a5dfa45dd14474135f6fae9",
        },
        { url: "/logo.png", revision: "1ce6b5da853c29b47144309a56a211b4" },
        { url: "/manifest.json", revision: "d8f78226356fb4ea540960f4fcf7a701" },
        {
          url: "/screenshots/desktop.svg",
          revision: "7d46b0f7bbfe894c62546045751b4794",
        },
        {
          url: "/screenshots/mobile.svg",
          revision: "9b290db6cba6cf29a6b848eaaa13beef",
        },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: a,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    );
});
