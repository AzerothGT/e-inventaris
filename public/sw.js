self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'Notifikasi Baru';
    const options = {
      body: data.body || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: data.url || '/'
      }
    };

    const promises = [
      self.registration.showNotification(title, options)
    ];

    if ('setAppBadge' in navigator) {
      if (data.badge) {
        promises.push(navigator.setAppBadge(data.badge));
      } else {
        promises.push(navigator.setAppBadge());
      }
    }

    event.waitUntil(
      Promise.all(promises)
    );
  } catch (err) {
    console.error('Failed to handle push event:', err);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Minimal fetch listener to allow PWA install prompt trigger
  event.respondWith(
    fetch(event.request).catch(function () {
      return new Response('Offline');
    })
  );
});
