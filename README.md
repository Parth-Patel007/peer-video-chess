# Peer-to-Peer Video Chess (link-invite)

> Instant 1-on-1 web chess with live P2P video and no backend code.

---

## Demo

![Demo GIF](assets/demo.gif)  
Try it live: https://your-deploy-url.com

---

## Features

- **Click-invite-play** – share a link, start in < 2 s (P75).  
- **Realtime board & clock sync** via Firebase Firestore.  
- **P2P video/audio** using WebRTC (STUN/TURN).  
- **Responsive & touch-friendly** down to 320 px; drag-drop support.  
- **PWA-ready** with > 90 % Lighthouse score.  
- **Low latency**: ≈ 120 ms move RTT, ≈ 350 ms video e2e.

---

## Tech Stack

- React 18 + TypeScript  
- Firebase (Firestore & Anonymous Auth)  
- simple-peer + WebRTC & Coturn TURN server  
- Vite for fast dev & build  

---

## Architecture

        ┌────────────┐    ┌────────────┐
        │ Browser A  │◀──▶│ Firestore  │◀──▶ Browser B │
        └────────────┘    └────────────┘
               ▲                   ▲
               │   P2P Video/Audio │
               └───────────────────┘

---

## Getting Started

  
    git clone https://github.com/Parth-Patel007/peer-video-chess.git
    cd peer-video-chess
    npm install
    cp .env.example .env     
    npm run dev              

---

## Build & Serve

    npm run build
    npm run serve

---

## Usage

1. Open `/new` → generates `/play/:id?init=true`.  
2. Share that URL; opponent opens without `?init`.  
3. Board & clocks sync via Firestore; video streams P2P.  

---

## Testing

    npm test                # Jest unit & component tests
    npm run cypress:open    # open Cypress E2E

---

## Deployment

    npm install -g firebase-tools
    firebase login
    firebase deploy --only hosting
