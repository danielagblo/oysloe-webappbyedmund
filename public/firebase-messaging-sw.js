// Firebase Cloud Messaging Service Worker
// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-sw' to regenerate with current environment variables.

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase with the provided configuration
const firebaseConfig = {
  "apiKey": "",
  "authDomain": "",
  "projectId": "",
  "messagingSenderId": "",
  "appId": ""
};

// Validate config before initializing
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.error('Firebase config is missing required fields:', firebaseConfig);
  throw new Error('Invalid Firebase configuration in service worker');
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  // Verbose log to help inspect incoming payloads
  console.log('[firebase-messaging-sw.js] Received background message:', {
    notification: payload.notification,
    data: payload.data,
    raw: payload,
  });
  
  const notification = payload.notification || {};
  const title = notification.title || 'Notification';
  const body = notification.body || '';
  const icon = notification.icon || '/favicon.png';
  const image = notification.image;
  
  const notificationOptions = {
    body: body,
    icon: icon,
    badge: '/favicon.png',
    // Ensure the notification data contains a normalized url field so
    // we can group/close notifications by the destination URL.
    data: Object.assign({}, payload.data || {}, {
      url: payload.data?.url || payload.notification?.click_action || undefined,
    }),
    // Keep a tag for compatibility, but grouping will be done by URL below.
    tag: payload.data?.group || payload.data?.alert_id || payload.messageId || 'oysloe_group',
    requireInteraction: false,
  };
  
  if (image) {
    notificationOptions.image = image;
  }
  
  (async () => {
    try {
      await self.registration.showNotification(title, notificationOptions);
      try {
        const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        const payload = { type: 'NOTIFICATION_DISPLAYED', url: notificationOptions.data?.url, delay: 0 };
        for (const c of clientsList) {
          try { c.postMessage(payload); } catch (e) { /* ignore */ }
        }
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      console.error('Failed to show notification', e);
    }
  })();
});

// Also handle generic Push API messages (so the same service worker can be
// used for PushManager subscriptions created by the page). This allows a
// single SW to show and close notifications regardless of whether they
// originate from FCM or a direct Push API payload.
self.addEventListener('push', function (event) {
  let data = {};
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    data = { text: event.data ? event.data.text() : 'You have a notification' };
  }
  const title = data.title || 'Notification';
  const body = data.body || data.text || '';
  const options = {
    body,
    data: Object.assign({}, data.data || {}, {
      url: data.data?.url || data.url || data.click_action || undefined,
    }),
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
    tag: data.group || data.alert_id || data.tag || 'oysloe_group',
  };
  event.waitUntil((async () => {
    try {
      await self.registration.showNotification(title, options);
      try {
        const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        const payload = { type: 'NOTIFICATION_DISPLAYED', url: options.data?.url, delay: 0 };
        for (const c of clientsList) {
          try { c.postMessage(payload); } catch (e) { /* ignore */ }
        }
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      console.error('Failed to show push notification', e);
    }
  })());
});

// When a notification is shown and a client (webapp window) is open, post a
// message to that client so it can schedule auto-closing the notification
// after a short delay (15s). We do this because service worker timers may
// be unreliable if the worker is terminated; delegating the timer to the
// page ensures the auto-close happens while the app is active.
self.addEventListener('notificationdisplayed', function (event) {
  // Note: 'notificationdisplayed' isn't a widely supported event; as a
  // fallback we also postMessage immediately when pushing; this handler is
  // a best-effort hook if the browser supports it.
  (async () => {
    try {
      const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      if (!clientsList || clientsList.length === 0) return;
      const payload = {
        type: 'NOTIFICATION_DISPLAYED',
        url: event.notification?.data?.url,
        delay: 15000,
      };
      for (const c of clientsList) {
        try { c.postMessage(payload); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      /* ignore */
    }
  })();
});

// Handle notification clicks - close related notifications when one is clicked
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);

  // Close notifications that share the same destination URL as the clicked
  // notification. If no URL is available, fall back to closing all.
  event.waitUntil((async () => {
    try {
      const urlToClose = event.notification?.data?.url;
      let notifications = await self.registration.getNotifications();
      if (urlToClose) {
        notifications = notifications.filter(n => n?.data && n.data.url === urlToClose);
      }
      notifications.forEach(n => {
        try { n.close(); } catch (e) { /* ignore */ }
      });
    } catch (e) {
      console.warn('Failed to get/close notifications, falling back to closing the clicked one', e);
      try { event.notification.close(); } catch (err) { void err; }
    }

    const urlToOpen = event.notification?.data?.url || '/';
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  })());
});

// Simple runtime caching for images and a small precache list so images
// that have been viewed are available offline / load instantly on reload.
const RUNTIME_CACHE = 'oysloe-runtime-v1';
const PRECACHE_URLS = [
  '/no-image.jpeg',
  '/nothing-to-show.png',
  '/favicon.png',
  '/arrowleft.svg',
  '/arrowright.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    try {
      await cache.addAll(PRECACHE_URLS);
    } catch (e) {
      // ignore individual precache failures
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => {
        if (k !== RUNTIME_CACHE) return caches.delete(k);
        return Promise.resolve(true);
      }));
    } catch (e) {
      // ignore
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle GET image requests in runtime cache
  if (req.method === 'GET' && (req.destination === 'image' || /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(req.url))) {
    event.respondWith((async () => {
      try {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        const resp = await fetch(req);
        // Only cache successful responses
        if (resp && resp.status === 200) {
          try { cache.put(req, resp.clone()); } catch (e) { /* ignore */ }
        }
        return resp;
      } catch (e) {
        // fallback to cache if network fails
        try {
          const cache = await caches.open(RUNTIME_CACHE);
          const fallback = await cache.match('/no-image.jpeg');
          return fallback || new Response('', { status: 503 });
        } catch (err) {
          return new Response('', { status: 503 });
        }
      }
    })());
  }
});
