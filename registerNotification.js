// src/registerPushNotification.js
export async function registerPushNotification() {
  if (!('serviceWorker' in navigator)) return;
  if (!('PushManager' in window)) return;

  // Minta izin notifikasi
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('🔕 User menolak izin notifikasi');
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const vapidPublicKey = import.meta.env.VAPID_PUBLIC_KEY || 
    'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

  // Subscribe user
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey
  });

  console.log("✅ Push Subscription didapat:", subscription);

  // TODO: kirim subscription ke backend kamu untuk di-save
  await fetch(`${import.meta.env.API_BASE}/v1/push-subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}
