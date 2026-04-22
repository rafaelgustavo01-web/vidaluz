import { useState, useEffect } from 'react';
import { messaging, getToken, onMessage } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!messaging) return;
    
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Frontend received foreground message: ', payload);
      // Optional: show toast notification here if you have a toast system
      alert(`Nova mensagem: ${payload.notification?.title} - ${payload.notification?.body}`);
    });

    return () => unsubscribe();
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert("Este navegador não suporta notificações de área de trabalho.");
      return;
    }

    try {
      const p = await Notification.requestPermission();
      setPermission(p);

      if (p === 'granted' && messaging) {
        // Obter token
        // Use the VAPID key below (you'll need to configure this in your Firebase console)
        // You can leave vapidKey empty for testing standard FCM, but for web push across browsers it's required
        const currentToken = await getToken(messaging, { 
          // vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' 
        });

        if (currentToken) {
          setToken(currentToken);
          
          if (auth.currentUser) {
            await setDoc(doc(db, 'users', auth.currentUser.uid, 'tokens', currentToken), {
              token: currentToken,
              createdAt: new Date().toISOString(),
              device: navigator.userAgent
            });
            console.log("Token FCM salvo com sucesso.");
          }
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
    }
  };

  return { permission, requestPermission, token };
}
