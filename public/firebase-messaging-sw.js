// Firebase Cloud Messaging Service Worker
// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-sw' to regenerate with current environment variables.

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase with the provided configuration
const firebaseConfig = {
  "apiKey": "AIzaSyBxeua-AU_WOpNS2ECM4owYxbOTFoKDFOA",
  "authDomain": "oysloe-45292.firebaseapp.com",
  "projectId": "oysloe-45292",
  "messagingSenderId": "473482750146",
  "appId": "1:473482750146:web:070c9347e8964a7003f35b"
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
    data: payload.data || {},
    tag: payload.data?.alert_id || payload.messageId || 'default',
    requireInteraction: false,
  };
  
  if (image) {
    notificationOptions.image = image;
  }
  
  return self.registration.showNotification(title, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.notification);
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Check if there's already a window open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
