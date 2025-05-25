// src/hooks/useChessGame.ts
import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

export function useChessGame() {
  // internal Chess.js instance
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [history, setHistory] = useState<string[]>([]);

  // expose whether the game is over, and a human-readable result message
  const gameOver = game.isGameOver();
  let result = '';
  if (game.isCheckmate()) {
    // after checkmate, turn() is the side to move next, so the _other_ side won
    const winner = game.turn() === 'w' ? 'Black' : 'White';
    result = `${winner} wins by checkmate!`;
  } else if (game.isStalemate()) {
    result = 'Draw by stalemate';
  } else if (game.isThreefoldRepetition()) {
    result = 'Draw by threefold repetition';
  } else if (game.isInsufficientMaterial()) {
    result = 'Draw by insufficient material';
  } else if (game.isDraw()) {
    result = 'Draw';
  }

  // move handler
  const onDrop = useCallback((from: Square, to: Square) => {
    const move = game.move({ from, to, promotion: 'q' });
    if (move) {
      setFen(game.fen());
      setHistory(game.history());
      return true;
    }
    return false;
  }, [game]);

  // reset board
  const reset = useCallback(() => {
    game.reset();
    setFen(game.fen());
    setHistory([]);
  }, [game]);

  // load a FEN string
  const load = useCallback((f: string) => {
    game.load(f);
    setFen(game.fen());
    setHistory(game.history());
  }, [game]);

  return {
    fen,
    history,
    onDrop,
    reset,
    load,
    gameOver,
    result,
  };
}
