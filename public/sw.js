// ZaloChat Service Worker with Full Web Push Support
const CACHE_NAME = 'zalochat-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/images/logo.png',
  '/images/logo.svg',
  '/images/cloud.svg',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('/socket.io/') || event.request.url.includes('/api/')) {
    return;
  }

  // Network-first for HTML, JS and CSS to ensure code changes apply immediately
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Web Push Notification Event - Wakes phone even when app is closed!
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'ZaloChat', body: event.data.text() };
    }
  }

  const title = data.title || 'ZaloChat';
  const isCall = data.data && data.data.type === 'incoming_call';

  const options = {
    body: data.body || 'Bạn có thông báo mới',
    icon: data.icon || '/images/icon-192.png',
    badge: '/images/icon-192.png',
    tag: data.tag || (isCall ? 'incoming_call' : 'zalochat-notification'),
    renotify: true,
    requireInteraction: isCall ? true : (data.requireInteraction || false),
    vibrate: isCall 
      ? [1000, 500, 1000, 500, 1000, 500, 1000, 500] 
      : (data.vibrate || [300, 150, 300]),
    actions: isCall 
      ? [
          { action: 'answer', title: 'Trả lời 📞' },
          { action: 'decline', title: 'Từ chối ❌' }
        ]
      : (data.actions || []),
    data: data.data || { url: '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Push notification click - Opens window & navigates straight into call screen!
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  const notifData = event.notification.data || {};
  let targetUrl = notifData.url || '/';

  if (action === 'decline') {
    // User declined from notification action
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.navigate) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window directly to the call/chat URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
