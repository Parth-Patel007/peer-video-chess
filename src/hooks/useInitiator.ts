import { useState, useEffect } from 'react';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';

interface GameDoc { initiator?: string; }

export function useInitiator(gameId: string): boolean | null {
  const [isInitiator, setIsInitiator] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    let uid = auth.currentUser?.uid;

    const assignOrCheck = async (): Promise<void> => {
      if (!uid) return;
      const gameRef = doc(db, 'games', gameId);
      try {
        const amI = await runTransaction(db, async tx => {
          const snap = await tx.get(gameRef);
          const data = (snap.data() as GameDoc) || {};
          if (!data.initiator) {
            tx.set(gameRef, { initiator: uid, createdAt: serverTimestamp() }, { merge: true });
            return true;
          }
          return data.initiator === uid;
        });
        setIsInitiator(amI);
      } catch (e) {
        console.error('useInitiator failed', e);
        setIsInitiator(false);
      }
    };

    if (!uid) {
      const unsub = onAuthStateChanged(auth, user => {
        if (user?.uid) {
          uid = user.uid;
          assignOrCheck();
        }
        unsub();
      });
    } else {
      assignOrCheck();
    }
  }, [gameId]);

  return isInitiator;
}
