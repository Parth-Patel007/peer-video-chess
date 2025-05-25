// src/hooks/useChessClocks.test.tsx
import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useChessClocks, Side } from './useChessClocks';

jest.useFakeTimers();

interface Update {
  clocks: { w: number; b: number };
  active: Side;
}

function TestComponent({
  startSide,
  pauseFlag,
  resetFlag,
  onUpdate,
}: {
  startSide: Side;
  pauseFlag: boolean;
  resetFlag: boolean;
  onUpdate: (u: Update) => void;
}) {
  const { clocks, active, start, pause, reset } = useChessClocks(10);

  // Start clock once
  useEffect(() => {
    start(startSide);
  }, [start, startSide]);

  // Pause if flag set
  useEffect(() => {
    if (pauseFlag) pause();
  }, [pauseFlag, pause]);

  // Reset if flag set
  useEffect(() => {
    if (resetFlag) reset();
  }, [resetFlag, reset]);

  // Report every time clocks or active side change
  useEffect(() => {
    onUpdate({ clocks, active });
  }, [clocks, active, onUpdate]);

  return null;
}

describe('useChessClocks', () => {
  it('ticks the active side, pauses, and resets correctly', () => {
    const updates: Update[] = [];

    // initial render: start white
    const { rerender, unmount } = render(
      <TestComponent
        startSide="w"
        pauseFlag={false}
        resetFlag={false}
        onUpdate={u => updates.push(u)}
      />
    );

    // ——— initial state
    expect(updates[0]).toEqual({ clocks: { w: 10, b: 10 }, active: 'w' });

    // ——— tick 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    // last update should show white down to 7
    const last1 = updates[updates.length - 1];
    expect(last1).toEqual({ clocks: { w: 7, b: 10 }, active: 'w' });

    // ——— pause
    rerender(
      <TestComponent
        startSide="w"
        pauseFlag={true}
        resetFlag={false}
        onUpdate={u => updates.push(u)}
      />
    );
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // no further changes after pause
    const last2 = updates[updates.length - 1];
    expect(last2).toEqual(last1);

    // ——— reset
    rerender(
      <TestComponent
        startSide="w"
        pauseFlag={false}
        resetFlag={true}
        onUpdate={u => updates.push(u)}
      />
    );
    // reset triggers immediately
    const last3 = updates[updates.length - 1];
    expect(last3).toEqual({ clocks: { w: 10, b: 10 }, active: 'w' });

    // ——— cleanup does not throw
    unmount();
    act(() => jest.advanceTimersByTime(2000));
  });
});
