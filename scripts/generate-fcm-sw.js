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
const content = `importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');\nimportScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');\n\nfirebase.initializeApp(${JSON.stringify(cfg)});\n\nconst messaging = firebase.messaging();\n\nmessaging.onBackgroundMessage(function(payload) {\n  const { title, body, icon } = payload.notification || {};\n  self.registration.showNotification(title || 'Notification', {\n    body: body || '',\n    icon: icon || '/favicon.png',\n  });\n});\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
console.log('Generated', outPath);
