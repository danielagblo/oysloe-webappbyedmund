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
const envFile = parseEnv(envPath);

// Check both .env file and process.env (for Heroku/CI/DigitalOcean environments)
// Prioritize process.env over .env file to ensure CI/CD env vars take precedence
const env = { ...envFile, ...process.env };

// Helper to get env var, preferring process.env, then .env file, then empty string
const getEnvVar = (key) => {
  // Check process.env first (for CI/CD platforms like DigitalOcean Apps Platform)
  const processValue = process.env[key];
  if (processValue && String(processValue).trim() !== '') {
    return String(processValue).trim();
  }
  // Fall back to .env file
  const fileValue = envFile[key];
  if (fileValue && String(fileValue).trim() !== '') {
    return String(fileValue).trim();
  }
  return '';
};

const cfg = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
};

const outPath = path.resolve(process.cwd(), 'public', 'firebase-messaging-sw.js');

// Debug: Log environment variable availability (helpful for troubleshooting)
// Check for DigitalOcean Apps Platform environment
const isDO = process.env.DO_APP_ID || process.env.DO_APP_PLATFORM || process.env.DO_APP_NAME;
if (isDO || process.env.CI) {
  console.log('Environment check:');
  console.log(`  Platform: ${isDO ? 'DigitalOcean Apps Platform' : 'CI/CD'}`);
  console.log(`  VITE_FIREBASE_API_KEY: ${process.env.VITE_FIREBASE_API_KEY ? `SET (${String(process.env.VITE_FIREBASE_API_KEY).substring(0, 20)}...)` : 'NOT SET'}`);
  console.log(`  VITE_FIREBASE_PROJECT_ID: ${process.env.VITE_FIREBASE_PROJECT_ID ? `SET (${process.env.VITE_FIREBASE_PROJECT_ID})` : 'NOT SET'}`);
  console.log(`  VITE_FIREBASE_AUTH_DOMAIN: ${process.env.VITE_FIREBASE_AUTH_DOMAIN ? `SET (${process.env.VITE_FIREBASE_AUTH_DOMAIN})` : 'NOT SET'}`);
  console.log(`  Config values:`, {
    apiKey: cfg.apiKey ? `${cfg.apiKey.substring(0, 20)}...` : 'EMPTY',
    projectId: cfg.projectId || 'EMPTY',
    authDomain: cfg.authDomain || 'EMPTY'
  });
}

// Validate that all required config values are present
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter(field => !cfg[field] || String(cfg[field]).trim() === '');
if (missingFields.length > 0) {
  console.error(`Error: Missing Firebase config fields: ${missingFields.join(', ')}`);
  console.error('Please set the following environment variables:');
  missingFields.forEach(field => {
    const envVar = `VITE_FIREBASE_${field.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '')}`;
    console.error(`  - ${envVar}`);
  });
  
  // Check if we're in a CI/CD environment
  const isCI = process.env.CI || process.env.HEROKU_APP_NAME || isDO;
  
  if (isCI) {
    if (isDO) {
      console.error('\nFor DigitalOcean Apps Platform:');
      console.error('1. Go to your App in DigitalOcean dashboard');
      console.error('2. Navigate to Settings → App-Level Environment Variables');
      console.error('3. Ensure all Firebase variables are set with scope: RUN_AND_BUILD_TIME');
      console.error('4. Verify the variable names match exactly (case-sensitive)');
      console.error('5. Redeploy your app');
    } else if (process.env.HEROKU_APP_NAME) {
      console.error('\nFor Heroku: Set these as Config Vars in your Heroku dashboard');
    } else {
      console.error('\nFor CI/CD: Ensure these environment variables are set in your build environment');
    }
    process.exit(1);
  } else {
    console.warn('Continuing with empty values (service worker may not work correctly)');
  }
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
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Generated', outPath);
