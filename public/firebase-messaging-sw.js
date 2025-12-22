importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  "apiKey":"",
  "authDomain":"",
  "projectId":"",
  "messagingSenderId":"",
  "appId":""
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Notification', {
    body: body || '',
    icon: icon || '/favicon.png',
  });
});
