const fs = require('fs');
const path = 'src/app/dashboard/account/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newContent = `  return (
    <div className="max-w-[800px] mx-auto animate-fade-in-up relative">
      
      {/* 👾 Saudi Pixel-Art Motion Graphic */}
      {saving && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#07080a] animate-in fade-in duration-500">
           <div className="flex flex-col items-center gap-10 max-w-[400px] w-full text-center px-10">
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-[40px] border-4 border-white/10 bg-black/40 shadow-[0_0_50px_rgba(108,60,225,0.3)]">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-20"></div>
                 <div className="absolute inset-x-0 h-[4px] bg-white/5 left-1/4 animate-speed-line"></div>
                 <div className="absolute inset-x-0 h-[4px] bg-[var(--brand-primary)]/40 left-1/2 animate-speed-line animate-delay-300"></div>
                 <div className="absolute inset-x-0 h-[4px] bg-white/5 left-3/4 animate-speed-line animate-delay-600"></div>
                 <img src="/pixel_saudi.png" className="relative z-10 w-[300px] h-[300px] object-contain animate-pixel-run image-render-pixel" alt="Pixel Running..." />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full w-full pointer-events-none animate-scanline"></div>
              </div>
              <div className="space-y-4">
                 <h2 className="text-[2rem] font-black text-white tracking-widest uppercase font-retro">UPDATING... 👾</h2>
                 <p className="text-[var(--brand-primary)] text-[1.1rem] font-black tracking-tight">جاري تشغيل الطاقة البكسلية لحفظ بياناتك</p>
                 <div className="flex justify-center gap-4 pt-4">
                    <div className="w-4 h-4 rounded-none bg-[var(--brand-primary)] animate-pulse"></div>
                    <div className="w-4 h-4 rounded-none bg-[var(--brand-primary)] animate-pulse animate-delay-200"></div>
                    <div className="w-4 h-4 rounded-none bg-[var(--brand-primary)] animate-pulse animate-delay-400"></div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 🎊 Celebration Modal - UNLOCKED! */}
      {unlockedTier && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in zoom-in duration-500 overflow-hidden">
           <div className="relative max-w-lg w-full bg-[#0a0a0c] rounded-[3.5rem] p-10 border-4 border-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.2)] text-center">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
              <div className="mb-8 relative">
                 <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                 <img src={unlockedTier.icon} className="w-48 h-48 mx-auto drop-shadow-[0_0_40px_rgba(250,204,21,0.6)] animate-bounce" alt="Gold" />
              </div>
              <h2 className="text-[2.8rem] font-black text-white mb-2 leading-tight tracking-tighter">مبروووك! 🎉</h2>
              <p className="text-yellow-400 text-[1.4rem] font-black mb-8 px-4">لقد قمت بفتح باقة: {unlockedTier.name}</p>
              <div className="bg-white/5 rounded-[2.5rem] p-8 mb-10 text-right space-y-4 border border-white/5">
                 <p className="text-white/40 text-[0.8rem] font-black uppercase tracking-widest mb-2">المميزات الجديدة المكتسبة:</p>
                 <div className="flex items-center gap-4 text-[1.1rem] text-white font-black">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span>خصم {unlockedTier.discount} دائم على الخدمات</span>
                 </div>
                 <div className="flex items-center gap-4 text-[1.1rem] text-white font-black">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span>دعم فني أولوية ملكية 24/7</span>
                 </div>
                 <div className="flex items-center gap-4 text-[1.1rem] text-white font-black">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                    <span>دخول تلقائي في سحوبات الـ 100$</span>
                 </div>
              </div>
              <button onClick={() => setUnlockedTier(null)} className="btn-accent w-full py-5 rounded-[2rem] text-[1.2rem] font-black shadow-xl">تم الاستلام ✅</button>
           </div>
        </div>
      )}

      {/* Top Header & Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-lg">
              <img src="https://img.icons8.com/papercut/256/user-male-circle.png" width={34} height={34} alt="Avatar" />
           </div>
           <div>
             <h1 className="text-[1.8rem] font-black text-[var(--text-primary)] leading-tight">إعدادات حسابي</h1>
             <p className="text-[var(--text-secondary)] text-[0.8rem] font-medium">التحكم في بياناتك الشخصية</p>
           </div>
        </div>
        <div className="flex gap-3">
           <button 
              onClick={() => window.location.href = '/dashboard'}
              className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-3 text-[0.85rem] font-black hover:border-[var(--brand-primary)] transition-all"
           >
              <img src="https://img.icons8.com/fluency/256/back.png" width={18} height={18} alt="Back" />
              العودة للمتجر
           </button>
        </div>
      </div>`;

const searchStart = "return (";
const searchEnd = "      <div className=\"grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8\">";

const startIdx = content.indexOf(searchStart);
const endIdx = content.indexOf(searchEnd);

if (startIdx !== -1 && endIdx !== -1) {
  const updatedFile = content.substring(0, startIdx) + newContent + "\n\n" + content.substring(endIdx);
  fs.writeFileSync(path, updatedFile);
  console.log('File structure fixed successfully');
} else {
  console.log('Could not find markers', { startIdx, endIdx });
}
`;

fs.writeFileSync('scratch/fix_structure.js', CodeContent);
console.log('Fix script created');
