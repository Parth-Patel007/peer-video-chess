// src/components/PromotionModal.tsx


export function PromotionModal({
  promo,
  onChoose,
}: {
  promo: { from: string; to: string };
  onChoose: (type: 'q'|'r'|'b'|'n') => void;
}) {
  if (!promo) return null;
  return (
    <div style={{ position:'absolute', top:0, left:0, 
                  width:'100%', height:'100%', background:'rgba(0,0,0,0.5)' }}>
      <div style={{ background:'white', padding:'1rem', margin:'5rem auto', width: 200 }}>
        <p>Choose promotion:</p>
        {(['q','r','b','n'] as const).map(t => (
          <button key={t} onClick={() => onChoose(t)}>{t.toUpperCase()}</button>
        ))}
      </div>
    </div>
  );
}
