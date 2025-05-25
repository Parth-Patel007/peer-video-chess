// src/pages/PlayGame.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, useAuthReady } from '../lib/firebase';
import GamePage from '../components/GamePage';

export default function PlayGame() {
  const { id } = useParams<{ id: string }>();
  const gameId = id ?? 'local';
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const [joined, setJoined] = useState(false);

  // decide which side we are
  const initiator = new URLSearchParams(window.location.search).get('init') === 'true';

  // if initiator, subscribe to the "joined" flag in Firestore
  useEffect(() => {
    if (!initiator) return;
    const unsub = onSnapshot(doc(db, 'games', gameId), snap => {
      if (snap.data()?.joined) {
        setJoined(true);
      }
    });
    return unsub;
  }, [gameId, initiator]);

  if (!authReady) {
    return <div className="spinner" style={{ textAlign: 'center' }}>Connecting…</div>;
  }

  // --- JOINER: show a Join button until they click it ---
  if (!initiator && !joined) {
    return (
      <div className="waiting-room" style={{ textAlign: 'center', padding: 16 }}>
        <button
          style={{ fontSize: '1.25rem', padding: '0.75em 1.5em' }}
          onClick={async () => {
            // set the joined flag so the initiator can un-block themselves
            await setDoc(doc(db, 'games', gameId), { joined: true }, { merge: true });
            setJoined(true);
          }}
        >
          Join game as Black
        </button>
      </div>
    );
  }

  // --- INITIATOR: show share-link + spinner until joiner arrives ---
  if (initiator && !joined) {
    const inviteLink = `${window.location.origin}/play/${gameId}`;
    return (
      <div className="waiting-room" style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
        <p>Share this link with your opponent:</p>
        <input
          readOnly
          value={inviteLink}
          style={{ width: '100%', padding: '0.5em', marginBottom: '0.5em' }}
        />
        <button onClick={() => navigator.clipboard.writeText(inviteLink)}>
          Copy link
        </button>
        <p style={{ marginTop: '1em' }}>Waiting for opponent…</p>
        <div className="spinner"></div>
      </div>
    );
  }

  // --- BOTH IN: render the actual GamePage ---
  return <GamePage gameId={gameId} initiator={initiator} />;
}
