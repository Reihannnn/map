export async function showLocalNotification(title, body) {
  if (!("Notification" in window)) return;

  let permission = Notification.permission;
  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") return;

  // Pastikan service worker terdaftar
  const registration = await navigator.serviceWorker.ready;
  registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png' // optional, sesuaikan kalau ada
  });
}
