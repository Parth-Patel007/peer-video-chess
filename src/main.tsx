// src/main.tsx

// ─── Polyfill Node globals for browser ────────────────────────────────────
// Import the browser-compatible process shim
import process from 'process';
import './index.css';

// Extend the GlobalThis interface so TS knows about `process`
declare global {
  interface GlobalThis {
    process: typeof process;
    global: GlobalThis;
  }
}

// Assign the shims onto globalThis without using `any`
globalThis.global = globalThis;
globalThis.process = process;

// ─── App Entry Point ─────────────────────────────────────────────────────
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <App />
    </DndProvider>
    </BrowserRouter>
  </React.StrictMode>
);
