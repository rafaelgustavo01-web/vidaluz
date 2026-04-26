importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Add your Firebase Config here (from firebase-applet-config.json)
const firebaseConfig = {
  projectId: "gen-lang-client-0658499140",
  appId: "1:268096958285:web:55622c8dc513702829d104",
  apiKey: "AIzaSyDtF2yHVgLw7CET6V5GsdQ_beiknbbVwXQ",
  authDomain: "gen-lang-client-0658499140.firebaseapp.com",
  messagingSenderId: "268096958285",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handles background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'VidaLuz';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/logobg.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
