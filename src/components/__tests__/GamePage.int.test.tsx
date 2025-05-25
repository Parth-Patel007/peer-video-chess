// src/components/__tests__/GamePage.int.test.tsx

if (typeof (global as any).MediaStream === 'undefined') {
  class MediaStream {}
  (global as any).MediaStream = MediaStream;
}
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
// import PlayGame from '../../pages/PlayGame'
// import { MemoryRouter, Route, Routes } from 'react-router-dom'
import GamePage from '../GamePage';

// ─── Mock out the hooks so we don't hit Firestore or timers ─────────────────
jest.mock('../../hooks/useGameSync', () => ({
  useGameSync: () => {},             // no-op sync
}));
jest.mock('../../hooks/useSignaling', () => ({
  useSignaling: () => async () => {},// no-op signalling
}));
jest.mock('../../hooks/useChessGame', () => ({
  useChessGame: () => ({
    fen: 'start-fen',
    onDrop: () => true,
    reset: () => {},
    load: () => {},
  }),
}));
jest.mock('../../hooks/useChessClocks', () => ({
  useChessClocks: () => ({
    clocks: { w: 300, b: 300 },
    active: 'w' as const,
    start: () => {},
    pause: () => {},
    reset: () => {},
    setClocks: () => {},
  }),
}));

// ─── Mock simple-peer so connect/stream fire immediately ────────────────────
jest.mock('simple-peer', () => {
  return jest.fn().mockImplementation(() => {
    const listeners: Record<string, Function[]> = {};
    return {
      on: (ev: string, cb: Function) => {
        listeners[ev] = listeners[ev] || [];
        listeners[ev].push(cb);
        if (ev === 'connect') {
          // simulate a peer connection on next tick
          setTimeout(() => cb(), 0);
        }
      },
      once: (ev: string, cb: Function) => {
        listeners[ev] = listeners[ev] || [];
        const wrap = (...args: any[]) => {
          cb(...args);
          listeners[ev] = listeners[ev].filter(fn => fn !== wrap);
        };
        listeners[ev].push(wrap);
        if (ev === 'connect') {
          setTimeout(() => wrap(), 0);
        }
      },
      addStream: (_: any) => {},
      destroy: () => {},
    };
  });
});

let originalMediaDevices: any;

beforeAll(() => {
  // Save whatever was there (usually undefined)
  originalMediaDevices = (navigator as any).mediaDevices;

  // Define a fake mediaDevices with a Jest mock getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    writable: true,
    value: {
      getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
    },
  });
});

afterAll(() => {
  // Restore whatever was in navigator.mediaDevices before
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    writable: true,
    value: originalMediaDevices,
  });
});

// ─── The actual test ─────────────────────────────────────────────────────────
describe('GamePage integration', () => {
  it('shows “…connecting” then flips to “✅ P2P up” once peer fires connect', async () => {
    // simulate the ?init flag so our component becomes the offerer:
    window.history.pushState({}, 'test', '/play/xyz?init=true');

    render(<GamePage gameId="xyz" />);

    // before our mock peer connects:
    expect(screen.getByText(/…connecting/)).toBeInTheDocument();

    // after the mock’s setTimeout(…,0) kicks in:
    await waitFor(() =>
      expect(screen.getByText(/✅ P2P up/)).toBeInTheDocument()
    );
  });
});
