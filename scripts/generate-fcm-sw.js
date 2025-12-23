import fs from 'fs';
import path from 'path';

function parseEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  const raw = fs.readFileSync(file, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    // remove optional surrounding quotes
    out[key] = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
  return out;
}

const envPath = path.resolve(process.cwd(), '.env');
const env = parseEnv(envPath);

const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};

const outPath = path.resolve(process.cwd(), 'public', 'firebase-messaging-sw.js');

// Validate that all required config values are present
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !cfg[field]);
if (missingFields.length > 0) {
  console.warn(`Warning: Missing Firebase config fields: ${missingFields.join(', ')}`);
}

const content = `// Firebase Cloud Messaging Service Worker
// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-sw' to regenerate with current environment variables.

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase with the provided configuration
const firebaseConfig = ${JSON.stringify(cfg, null, 2)};

// Validate config before initializing
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.error('Firebase config is missing required fields:', firebaseConfig);
  throw new Error('Invalid Firebase configuration in service worker');
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
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
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Generated', outPath);
