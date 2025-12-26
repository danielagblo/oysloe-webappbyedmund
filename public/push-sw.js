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
  // Close all notifications when any one is clicked
  event.waitUntil((async () => {
    try {
      const notifications = await self.registration.getNotifications();
      notifications.forEach(n => {
        try { n.close(); } catch (e) { /* ignore */ }
      });
    } catch (e) {
      console.warn('Failed to get notifications, falling back to closing clicked one', e);
      try { event.notification.close(); } catch (err) { void err; }
    }

    const url = event.notification?.data?.url || '/';
    const clientList = await clients.matchAll({ type: 'window' });
    for (const client of clientList) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  })());
});
