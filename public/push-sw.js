/* Basic service worker to show push notifications.
   Place this file at /push-sw.js so that it is registered at root scope.
*/

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
    data: data.data || {},
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    }),
  );
});
