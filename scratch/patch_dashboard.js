const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'src/app/dashboard/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update totalCostFloat calculation
content = content.replace(/const totalCostFloat = selectedService \? \(quantity \/ 1000\) \* selectedService\.rate : 0;/, 
`let totalCostFloat = 0;
  if (selectedService) {
    if (isSubscription) {
      totalCostFloat = ((subPosts * subMax) / 1000) * selectedService.rate;
    } else {
      totalCostFloat = (quantity / 1000) * selectedService.rate;
    }
  }`);

// 2. Update UI Block
const uiStartTag = '<div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-5">';
const uiEndTag = '</div>';
// We want to find the specific grid that starts with Link label
const searchText = '<label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-2.5">الرابط (Link)</label>';

let lines = content.split('\n');
let uiStartLine = -1;
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes(uiStartTag) && lines[i+1]?.includes(searchText)) {
        uiStartLine = i;
        break;
    }
}

if (uiStartLine !== -1) {
    // Find the end of this specific div block
    // It's lines 531 to 604 based on previous view_file
    let openDivs = 1;
    let uiEndLine = -1;
    for(let i=uiStartLine+1; i<lines.length; i++) {
        openDivs += (lines[i].match(/<div/g) || []).length;
        openDivs -= (lines[i].match(/<\/div/g) || []).length;
        if (openDivs === 0) {
            uiEndLine = i;
            break;
        }
    }

    if (uiEndLine !== -1) {
        const subUI = `                    {/* Subscription Toggle */}
                    <div className="flex bg-[var(--bg-secondary)] p-1 rounded-[14px] mb-4">
                      <button 
                        type="button" 
                        onClick={() => setIsSubscription(false)} 
                        className={\`flex-1 py-3 text-[0.85rem] font-bold rounded-[12px] transition-all \${!isSubscription ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'}\`}
                      >
                        طلب لمرة واحدة
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsSubscription(true)} 
                        className={\`flex-1 py-3 text-[0.85rem] font-bold rounded-[12px] transition-all \${isSubscription ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'}\`}
                      >
                        اشتراك تلقائي (للبوستات القادمة)
                      </button>
                    </div>

                    {!isSubscription ? (
                      <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-5">
                        <div>
                          <label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-2.5">الرابط (Link)</label>
                          <input type="text" className="input-field h-[52px] rounded-[14px] font-semibold" placeholder="https://..." dir="ltr" value={link} onChange={e => setLink(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-2.5">الكمية (Quantity)</label>
                          <div className="relative flex items-center">
                            <button 
                              type="button"
                              onClick={() => setQuantity(prev => {
                                const minVal = (selectedService as any)?.min || 1;
                                return Math.max(minVal, prev - 100);
                              })}
                              className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-[10px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all z-10"
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              inputMode="numeric"
                              pattern="[0-9]*"
                              className="input-field h-[52px] rounded-[14px] font-semibold pr-12 pl-12 text-center no-spinners outline-none focus:border-[var(--brand-primary)]" 
                              dir="ltr" 
                              value={quantity || ''} 
                              onChange={e => {
                                const val = e.target.value;
                                if (val === '') setQuantity(0);
                                else setQuantity(Number(val));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setQuantity(prev => {
                                    const maxVal = (selectedService as any)?.max || 1000000;
                                    return Math.min(maxVal, (prev || 0) + 100);
                                  });
                                } else if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setQuantity(prev => {
                                    const minVal = (selectedService as any)?.min || 1;
                                    return Math.max(minVal, (prev || 0) - 100);
                                  });
                                }
                              }}
                              min="1" 
                              aria-label="الكمية" 
                              placeholder="الكمية"
                            />
                            <button 
                              type="button"
                              onClick={() => setQuantity(prev => {
                                const maxVal = (selectedService as any)?.max || 1000000;
                                return Math.min(maxVal, prev + 100);
                              })}
                              className="absolute left-2 w-8 h-8 flex items-center justify-center rounded-[10px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all z-10"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {[100, 500, 1000, 5000].map(val => (
                              <button 
                                key={val}
                                type="button"
                                onClick={() => setQuantity(prev => prev + val)}
                                className="text-[0.7rem] font-bold px-2 py-1 rounded-[8px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all"
                              >
                                +{val}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5 bg-[var(--brand-primary)]/5 p-5 rounded-[16px] border border-[var(--brand-primary)]/20 shadow-inner">
                        <div>
                          <label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-2.5">يوزر حسابك (Username)</label>
                          <input type="text" className="input-field h-[52px] rounded-[14px] font-semibold bg-[var(--bg-card)]" placeholder="@username او رابط حسابك" dir="ltr" value={subUsername} onChange={e => setSubUsername(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-[var(--bg-card)] p-3 rounded-[14px] border border-[var(--border-color)]">
                            <label className="block text-[0.7rem] font-bold text-[var(--text-tertiary)] mb-1">لكم بوست؟</label>
                            <input type="number" className="w-full bg-transparent border-none outline-none text-[0.9rem] font-bold text-[var(--text-primary)] text-center no-spinners" min="1" placeholder="10" value={subPosts || ''} onChange={e => setSubPosts(Number(e.target.value))} />
                          </div>
                          <div className="bg-[var(--bg-card)] p-3 rounded-[14px] border border-[var(--border-color)]">
                            <label className="block text-[0.7rem] font-bold text-[var(--text-tertiary)] mb-1">أقل عدد (Min)</label>
                            <input type="number" className="w-full bg-transparent border-none outline-none text-[0.9rem] font-bold text-[var(--text-primary)] text-center no-spinners" min="1" placeholder="..." value={subMin || ''} onChange={e => setSubMin(Number(e.target.value))} />
                          </div>
                          <div className="bg-[var(--bg-card)] p-3 rounded-[14px] border border-[var(--border-color)]">
                            <label className="block text-[0.7rem] font-bold text-[var(--text-tertiary)] mb-1">أعلى عدد (Max)</label>
                            <input type="number" className="w-full bg-transparent border-none outline-none text-[0.9rem] font-bold text-[var(--text-primary)] text-center no-spinners" min="1" placeholder="..." value={subMax || ''} onChange={e => setSubMax(Number(e.target.value))} />
                          </div>
                          <div className="bg-[var(--bg-card)] p-3 rounded-[14px] border border-[var(--border-color)]">
                            <label className="block text-[0.7rem] font-bold text-[var(--text-tertiary)] mb-1">تأخير (دقائق)</label>
                            <input type="number" className="w-full bg-transparent border-none outline-none text-[0.9rem] font-bold text-[var(--text-primary)] text-center no-spinners" min="0" placeholder="0" value={subDelay || ''} onChange={e => setSubDelay(Number(e.target.value))} />
                          </div>
                        </div>
                        <p className="text-[0.75rem] text-[var(--text-tertiary)] font-bold mb-0 mt-1 leading-relaxed">
                          * النظام سيقوم بإرسال عدد عشوائي بين <span className="text-[var(--brand-primary)]">({subMin} و {subMax})</span> لكل بوست جديد تنشره تلقائياً لضمان نمو طبيعي. ⚡
                        </p>
                      </div>
                    )}`;
        lines.splice(uiStartLine, uiEndLine - uiStartLine + 1, subUI);
        content = lines.join('\n');
    }
}

fs.writeFileSync(targetPath, content);
console.log('Update successful');
