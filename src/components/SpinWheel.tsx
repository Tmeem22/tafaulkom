"use client";
import { useState, useEffect, useRef } from 'react';
import { showToast } from '@/hooks/useNotification';

const SEGMENTS = [
  { name: '0.25 ر.س', color: '#14b8a6', emoji: '💵' },
  { name: '0.50 ر.س', color: '#0ea5e9', emoji: '💰' },
  { name: '1.00 ر.س', color: '#6366f1', emoji: '💎' },
  { name: 'حظ أوفر', color: '#94a3b8', emoji: '🚫' },
  { name: '2.00 ر.س', color: '#a855f7', emoji: '🔥' },
  { name: '5.00 ر.س', color: '#ec4899', emoji: '🚀' },
  { name: '0.10 ر.س', color: '#f43f5e', emoji: '✨' },
  { name: '10.00 ر.س', color: '#eab308', emoji: '👑' },
];

export default function SpinWheel() {
  const [canSpin, setCanSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [lastPrize, setLastPrize] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/spin')
      .then(r => r.json())
      .then(d => {
        setCanSpin(d.canSpin);
        setLastPrize(d.lastPrize);
      }).catch(() => {});
  }, []);

  const handleSpin = async () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);

    try {
      const res = await fetch('/api/user/spin', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error, 'error');
        setSpinning(false);
        return;
      }

      const segAngle = 360 / SEGMENTS.length;
      const targetAngle = 360 - (data.prizeIndex * segAngle) - segAngle / 2;
      const fullSpins = 360 * 5;
      const finalRotation = rotation + fullSpins + targetAngle;

      setRotation(finalRotation);

      setTimeout(() => {
        setResult(data.prize);
        setCanSpin(false);
        setSpinning(false);
        if (data.prize.type !== 'none') {
          showToast(`🎉 مبروك! فزت بـ ${data.prize.name}!`, 'success');
        }
      }, 4000);
    } catch (e) {
      showToast('حدث خطأ!', 'error');
      setSpinning(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xl shadow-amber-500/30 flex items-center justify-center hover:scale-110 transition-all animate-bounce"
        title="عجلة الحظ"
      >
        <span className="text-[1.5rem]">🎰</span>
        {canSpin && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[0.6rem] font-black flex items-center justify-center text-white animate-pulse">1</span>}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !spinning && setShowModal(false)}>
          <div className="bg-[var(--bg-card)] rounded-[32px] p-6 md:p-8 max-w-[420px] w-full border border-[var(--border-color)] shadow-2xl" dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h2 className="text-[1.5rem] font-black text-[var(--text-primary)]">🎰 عجلة الحظ اليومية</h2>
              <p className="text-[0.8rem] text-[var(--text-secondary)] font-bold mt-1">لف العجلة مرة واحدة كل يوم واربح جوائز!</p>
            </div>

            {/* Wheel */}
            <div className="relative w-[280px] h-[280px] mx-auto mb-6">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 text-[1.8rem]">▼</div>

              {/* Spinning Wheel */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-lg overflow-hidden relative"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                }}
              >
                {SEGMENTS.map((seg, i) => {
                  const angle = (360 / SEGMENTS.length) * i;
                  return (
                    <div
                      key={i}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)',
                      }}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: seg.color }}>
                        <span className="absolute top-[18%] left-[52%] text-white text-[0.6rem] font-black -rotate-12 whitespace-nowrap"
                          style={{ transform: `rotate(${360 / SEGMENTS.length / 2}deg)` }}>
                          {seg.emoji}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
                  <span className="text-[1.5rem]">🎰</span>
                </div>
              </div>
            </div>

            {/* Prizes Legend */}
            <div className="grid grid-cols-4 gap-1.5 mb-5">
              {SEGMENTS.map((seg, i) => (
                <div key={i} className="flex items-center gap-1 text-[0.6rem] font-bold text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  {seg.name}
                </div>
              ))}
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-2xl text-center mb-4 ${result.type === 'none' ? 'bg-gray-500/10' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                <p className="text-[1.3rem] mb-1">{result.type === 'none' ? '😅' : '🎉'}</p>
                <p className={`font-black text-[1rem] ${result.type === 'none' ? 'text-[var(--text-tertiary)]' : 'text-emerald-500'}`}>
                  {result.type === 'none' ? 'حظ أوفر! جرب بكرة 😊' : `مبروك! فزت بـ ${result.name}!`}
                </p>
                {result.couponCode && (
                  <p className="text-[0.75rem] font-bold text-amber-500 mt-2">كود الخصم: <span className="bg-amber-500/10 px-2 py-1 rounded-lg font-mono" dir="ltr">{result.couponCode}</span></p>
                )}
              </div>
            )}

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={!canSpin || spinning}
              className="w-full py-4 rounded-2xl font-black text-[1rem] transition-all flex items-center justify-center gap-2 bg-gradient-to-l from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/20 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {spinning ? '🎰 جاري الدوران...' : canSpin ? '🎰 لف العجلة!' : lastPrize ? `لعبت اليوم! (فزت بـ ${lastPrize.name})` : 'عد غداً! ⏰'}
            </button>

            <button onClick={() => setShowModal(false)} className="w-full mt-3 py-2 text-[var(--text-tertiary)] font-bold text-[0.85rem] hover:text-[var(--text-primary)] transition-all">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}
