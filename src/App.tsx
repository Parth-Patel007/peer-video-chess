// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import NewGame from './pages/NewGame';
import PlayGame from './pages/PlayGame';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/new" replace />} />
      <Route path="/new" element={<NewGame />} />
      <Route path="/play/:id" element={<PlayGame />} />
    </Routes>
  );
}
