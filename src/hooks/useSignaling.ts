// src/hooks/useSignaling.ts
import { useEffect, useCallback } from 'react';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { SignalData } from 'simple-peer';

export interface FireSignal {
  sender: string;
  type: SignalData['type'];
  sdp?: string;
  candidate?: any;
  timestamp?: unknown;
}

/**
 * Realtime SDP/ICE signalling via Firestore.
 *
 * @param gameId   The game document ID under /games/{gameId}/signals
 * @param onSignal Callback for each *remote* signal
 * @returns        sendSignal — function to publish an offer/answer/candidate
 */
export function useSignaling(
  gameId: string,
  onSignal: (sig: FireSignal) => void
): (sig: SignalData) => Promise<void> {
  const db = getFirestore();
  const uid = getAuth().currentUser!.uid;
  const signalsCol = collection(db, 'games', gameId, 'signals');

  // ——— Read side: subscribe to new docs ———
  useEffect(() => {
    const q = query(signalsCol, orderBy('timestamp'));
    const unsub = onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        const data = change.doc.data() as FireSignal;
        if (data.sender === uid) return;        // ignore our own writes
        onSignal(data);
      });
    });
    return unsub;
  }, [db, gameId, onSignal, uid]);

  // ——— Write side: whitelist only safe fields ———
  const sendSignal = useCallback(
    async (signal: SignalData) => {
      const payload: FireSignal = {
        sender: uid,
        type: signal.type!,
        timestamp: serverTimestamp(),
      };
      if ((signal as any).sdp != null) {
        payload.sdp = (signal as any).sdp;
      }
      if ((signal as any).candidate != null) {
        payload.candidate = (signal as any).candidate;
      }
      await addDoc(signalsCol, payload as DocumentData);
      console.log('[SIGNAL][TX]', payload.type);
    },
    [gameId, uid],
  );

  return sendSignal;
}
