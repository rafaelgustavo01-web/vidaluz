
import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
  isPremium: boolean;
  role: 'user' | 'admin';
}

export interface AppSettings {
  isReadingLimitEnabled: boolean;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function useAppUser(firebaseUser: FirebaseUser | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    
    // Sync user profile
    const syncProfile = async () => {
      try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Consulente',
            createdAt: Timestamp.now(),
            isPremium: false,
            role: 'user'
          };
          await setDoc(userRef, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(snap.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error syncing profile:', error);
      }
    };

    syncProfile();

    // Listen for profile changes
    const unsubProfile = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`));

    // Listen for global settings
    const settingsRef = doc(db, 'settings', 'global');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as AppSettings);
      } else {
        // Initialize settings if they don't exist (only admin can do this, but we'll handle it gracefully)
        setSettings({ isReadingLimitEnabled: true });
      }
      setLoading(false);
    }, () => {
      // If settings don't exist or no permission, default to enabled
      setSettings({ isReadingLimitEnabled: true });
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubSettings();
    };
  }, [firebaseUser]);

  return { profile, settings, loading, isAdmin: profile?.role === 'admin' || profile?.email === 'rafaelgustavo.01@gmail.com' };
}
