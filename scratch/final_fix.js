const fs = require('fs');
const content = fs.readFileSync('src/app/dashboard/account/page.tsx', 'utf8');

// Find the modal start and the break point
const modalStart = '{unlockedTier && (';
const gridStart = '<div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">';

const parts = content.split(modalStart);
if (parts.length < 2) {
    console.log('Modal start not found');
    process.exit(1);
}

const beforeModal = parts[0] + modalStart;
const afterModalStart = parts[1];

const subParts = afterModalStart.split(gridStart);
if (subParts.length < 2) {
    console.log('Grid start not found');
    process.exit(1);
}

// Reconstruct the modal correctly and add the missing Header
const modalContent = `
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
      </div>
`;

const finalResult = beforeModal + modalContent + "\n      " + gridStart + subParts[1];
fs.writeFileSync('src/app/dashboard/account/page.tsx', finalResult);
console.log('Fixed successfully');
