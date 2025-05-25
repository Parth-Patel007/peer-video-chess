// src/pages/NewGame.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function NewGame() {
  const navigate = useNavigate();

  useEffect(() => {
    const gameId = uuidv4();
    // mark this tab as the initiator
    navigate(`/play/${gameId}?init=true`, { replace: true });
  }, [navigate]);

  return <div>Creating game…</div>;
}
