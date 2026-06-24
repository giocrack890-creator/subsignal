self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? "Nueva señal";
  const options = {
    body: data.body ?? "",
    icon: data.icon ?? "/window.svg",
    data: data.data ?? {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const signalId = event.notification.data?.signal_id;
  const url = signalId
    ? `${self.location.origin}/signals?highlight=${signalId}`
    : `${self.location.origin}/signals`;
  event.waitUntil(clients.openWindow(url));
});
