// src/components/__tests__/GameControls.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameControls from '../GameControls';

describe('<GameControls>', () => {
  it('calls callbacks on buttons', async () => {
    const onRestart = jest.fn();          // or jest.fn() if you stay on Jest
    const onResign  = jest.fn();

    render(
      <GameControls
        fen="startpos"
        clocks={{ w: 300, b: 300 }}
        active="w"
        onRestart={onRestart}
        onResign={onResign}
      />
    );

    const restartBtn = screen.getByRole('button', { name: /restart/i });
    const resignBtn  = screen.getByRole('button', { name: /resign/i });

    // click “Restart”
    await userEvent.click(restartBtn);
    expect(onRestart).toHaveBeenCalledTimes(1);

    // click “Resign”
    await userEvent.click(resignBtn);
    expect(onResign).toHaveBeenCalledTimes(1);
  });
});
