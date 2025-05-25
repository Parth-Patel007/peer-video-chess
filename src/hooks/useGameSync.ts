import { useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Clocks = { w: number; b: number };

export function useGameSync(
  gameId: string,
  fen: string,
  clocks: Clocks,
  onRemote: (d: { fen: string; clocks: Clocks }) => void,
) {
  const lastFen   = useRef(fen);
  const lastClock = useRef(clocks);

  /* listener */
  useEffect(() => {
    const ref = doc(db, 'games', gameId);
    return onSnapshot(ref, snap => {
      if (snap.metadata.hasPendingWrites || snap.metadata.fromCache) return;
      const data = snap.data() as { fen?: string; clocks?: Clocks } | undefined;
      if (!data?.fen || !data.clocks) return;
      if (
        data.fen === lastFen.current &&
        data.clocks.w === lastClock.current.w &&
        data.clocks.b === lastClock.current.b
      ) return;
      lastFen.current   = data.fen;
      lastClock.current = data.clocks;
      onRemote({ fen: data.fen, clocks: data.clocks });
    });
  }, [gameId, onRemote]);

  /* publisher */
  useEffect(() => {
    if (
      fen === lastFen.current &&
      clocks.w === lastClock.current.w &&
      clocks.b === lastClock.current.b
    ) return;
    lastFen.current   = fen;
    lastClock.current = clocks;
    setDoc(doc(db, 'games', gameId), { fen, clocks }, { merge: true })
      .catch(err => { throw err; });
  }, [gameId, fen, clocks]);
}
