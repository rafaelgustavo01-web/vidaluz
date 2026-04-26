
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
  isPremium: boolean;
  premiumExpiresAt?: any;
  role: 'user' | 'admin';
  lastVisionDate?: any;
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
    let isMounted = true;

    if (!firebaseUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    
    // Safety timeout: If Firebase takes longer than 3 seconds to respond, unlock the app UI
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 3000);

    const userRef = doc(db, 'users', firebaseUser.uid);
    
    const checkExpiration = async (profileData: UserProfile) => {
      if (profileData.isPremium && profileData.premiumExpiresAt) {
        const expiresAt = profileData.premiumExpiresAt.toDate ? profileData.premiumExpiresAt.toDate() : new Date(profileData.premiumExpiresAt);
        if (new Date() > expiresAt) {
          // Expirou
          profileData.isPremium = false;
          profileData.premiumExpiresAt = null;
          await setDoc(userRef, { isPremium: false, premiumExpiresAt: null }, { merge: true }).catch(e => console.error(e));
        }
      }
      return profileData;
    };

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
          // Try to set it, but don't block everything if permissions deny it somehow initially
          await setDoc(userRef, newProfile).catch(e => console.error('SetDoc profile error:', e));
          if (isMounted) setProfile(newProfile);
        } else {
          const p = snap.data() as UserProfile;
          const checked = await checkExpiration(p);
          if (isMounted) setProfile(checked);
        }
      } catch (error) {
        console.error('Error syncing profile:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    syncProfile();

    // Listen for profile changes
    const unsubProfile = onSnapshot(userRef, async (snap) => {
      if (snap.exists() && isMounted) {
        const p = snap.data() as UserProfile;
        const checked = await checkExpiration(p);
        if (isMounted) setProfile(checked);
      }
    }, (error) => {
       console.error('Error listening to profile', error);
    });

    // Listen for global settings
    const settingsRef = doc(db, 'settings', 'global');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (isMounted) {
        if (snap.exists()) {
          setSettings(snap.data() as AppSettings);
        } else {
          setSettings({ isReadingLimitEnabled: true });
        }
        setLoading(false);
      }
    }, (error) => {
      console.error('Error listening to settings', error);
      if (isMounted) {
        setSettings({ isReadingLimitEnabled: true });
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      unsubProfile();
      unsubSettings();
    };
  }, [firebaseUser]);

  return { profile, settings, loading, isAdmin: profile?.role === 'admin' || profile?.email === 'rafaelgustavo.01@gmail.com' };
}
