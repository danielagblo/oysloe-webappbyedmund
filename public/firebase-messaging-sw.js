importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// These values should be replaced at build time or populated via a script.
firebase.initializeApp({
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME',
  projectId: 'REPLACE_ME',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Notification', {
    body: body || '',
    icon: icon || '/favicon.png',
  });
});
