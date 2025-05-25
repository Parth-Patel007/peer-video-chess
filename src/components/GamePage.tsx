// src/components/GamePage.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import type { SignalData } from 'simple-peer';

import { formatTime } from '../utils/formatTime';
import { useGameSync } from '../hooks/useGameSync';
import { useChessGame } from '../hooks/useChessGame';
import { useChessClocks, type Side } from '../hooks/useChessClocks';
import { useSignaling, type FireSignal } from '../hooks/useSignaling';

import {GameBoard} from './GameBoard';
import GameControls from './GameControls';

// Replace these with your actual TURN server credentials:
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  {
    urls: 'turn:your.turn.server:3478',
    username: 'TURN_USER',
    credential: 'TURN_PASS',
  },
];

export default function GamePage({ gameId }: { gameId: string }) {
  // ─── Chess + clocks ───────────────────────────
  const {
    fen,
    onDrop: rawOnDrop,
    reset: resetGame,
    load,
    gameOver,
    result,
  } = useChessGame();
  const { clocks, active, start, pause, reset: resetClocks, setClocks } =
    useChessClocks(300);

  // flip clocks when side changes
  useEffect(() => {
    start(fen.split(' ')[1] as Side);
  }, [fen, start]);

  // when gameOver flips true, pause clocks and show result
  useEffect(() => {
    if (gameOver) {
      pause();
      alert(result);
    }
  }, [gameOver, result, pause]);

  // two-way Firestore sync
  const handleRemote = useCallback(
    ({ fen: f, clocks: c }: { fen: string; clocks: typeof clocks }) => {
      load(f);
      setClocks(c);
      pause();
    },
    [load, setClocks, pause]
  );
  useGameSync(gameId, fen, clocks, handleRemote);

  // ─── Video + P2P setup ────────────────────────
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const [connected, setConnected] = useState(false);

  // Firestore signalling
  const handleSignal = useCallback((sig: FireSignal) => {
    peerRef.current?.signal(sig as SignalData);
  }, []);
  const sendSignal = useSignaling(gameId, handleSignal);

  useEffect(() => {
    const initiator = new URLSearchParams(location.search).has('init');
    let alive = true;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!alive) return;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peer = new Peer({
          initiator,
          trickle: true,
          config: { iceServers: ICE_SERVERS },
        });
        peerRef.current = peer;

        peer.on('signal', (signal: SignalData) => {
          if (
            signal.type === 'offer' ||
            signal.type === 'answer' ||
            (signal as any).candidate
          ) {
            void sendSignal(signal);
          }
        });

        peer.on('connect', () => setConnected(true));
        peer.on('stream', (remoteStream: MediaStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        peer.addStream(stream);
      })
      .catch((err) => console.error('⛔ getUserMedia error', err));

    return () => {
      alive = false;
      peerRef.current?.destroy();
      peerRef.current = null;
    };
  }, [gameId, sendSignal]);

  // wrap chess onDrop
  const onDrop = (from: string, to: string) =>
    rawOnDrop(from as any, to as any);

  // resign handler
  const onResign = () => {
    pause();
    alert(`${active === 'w' ? 'White' : 'Black'} resigned!`);
  };

  return (
    <div className="game-container">
      <h2 style={{ textAlign: 'center' }}>
        Game ID: {gameId} {connected ? '✅ P2P up' : '…connecting'}
      </h2>

      <div className="videos">
        <video ref={localVideoRef} autoPlay muted playsInline />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>

      <div className="clock black-clock">{formatTime(clocks.b)}</div>

      <div className="board-wrapper">
        <GameBoard fen={fen} onDrop={onDrop} />
      </div>

      <div className="clock white-clock">{formatTime(clocks.w)}</div>

      <div className="controls-wrapper">
        <GameControls
          fen={fen}
          clocks={clocks}
          active={active}
          onRestart={() => {
            resetGame();
            resetClocks();
          }}
          onResign={onResign}
        />
      </div>
    </div>
  );
}
