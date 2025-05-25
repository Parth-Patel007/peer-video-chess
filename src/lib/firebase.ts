// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore }    from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// import type { User } from 'firebase/auth';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};
console.log('🔥 firebaseConfig', firebaseConfig);


const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

signInAnonymously(auth).catch(console.error);

/** Hook that only flips to true once auth.currentUser is non-null */
export function useAuthReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      if (user) setReady(true);
    });
  }, []);
  return ready;
}