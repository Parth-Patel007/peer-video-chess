import { useState, useCallback, useRef, useEffect } from 'react';

export type Side = 'w' | 'b';
type Clocks = { w: number; b: number };

export function useChessClocks(startSec = 300) {
  const [clocks, setClocks] = useState<Clocks>({ w: startSec, b: startSec });
  const [running, setRunning] = useState(false);
  const activeRef = useRef<Side>('w');

  /* tick */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setClocks(c => ({
        ...c,
        [activeRef.current]: c[activeRef.current] - 1,
      }));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback((side: Side) => {
    activeRef.current = side;
    setRunning(true);
  }, []);

  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback(() => {
    setRunning(false);
    setClocks({ w: startSec, b: startSec });
  }, [startSec]);

  return { clocks, active: activeRef.current, start, pause, reset, setClocks };
}
