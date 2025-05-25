// src/components/GameBoard.tsx
import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import type { Square } from 'chess.js';

interface GameBoardProps {
  fen: string;
  onDrop: (from: Square, to: Square) => boolean;
}

export function GameBoard({ fen, onDrop }: GameBoardProps) {
  const [illegal, setIllegal] = useState<Square | null>(null);

  const handleDrop = useCallback((from: Square, to: Square) => {
    const legal = onDrop(from, to);
    if (!legal) {
      setIllegal(from);
      setTimeout(() => setIllegal(null), 500);
    }
    return legal;
  }, [onDrop]);

  // react-chessboard expects: { [square]: { [cssProp]: string|number } }
  const customSquareStyles: Partial<Record<Square, Record<string, string>>> = illegal
    ? { [illegal]: { boxShadow: 'inset 0 0 0 3px red' } }
    : {};

  return (
    <Chessboard
      position={fen}
      onPieceDrop={handleDrop}
      customSquareStyles={customSquareStyles}
      boardWidth={600}
    />
  );
}
