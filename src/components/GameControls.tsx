// src/components/GameControls.tsx


export interface GameControlsProps {
  fen: string;
  clocks: { w: number; b: number };
  active: 'w' | 'b' | null;
  onRestart: () => void;
  onResign: () => void;
}

export default function GameControls({
  clocks,
  active,
  onRestart,
  onResign,
}: GameControlsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 600,
        margin: '1rem auto',
      }}
    >
      <div>
        <div>White: {clocks.w}s {active === 'w' ? '(Running)' : ''}</div>
        <div>Black: {clocks.b}s {active === 'b' ? '(Running)' : ''}</div>
      </div>

      <div>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onResign} style={{ marginLeft: '0.5rem' }}>
          Resign
        </button>
      </div>
    </div>
  );
}
