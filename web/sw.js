// dwell Service Worker — 推送通知
self.addEventListener('push', function(event) {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: 'dwell', body: event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || 'dwell', {
      body: data.body || '',
      icon: data.icon || '/icon.png',
      badge: data.badge || '/icon.png',
      tag: data.tag || 'dwell',
      data: data.url ? { url: data.url } : {}
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
