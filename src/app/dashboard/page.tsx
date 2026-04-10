"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CURRENCY_SYMBOL } from '@/lib/constants';

const sideLinks = [
  { label: 'طلب جديد', href: '/dashboard', icon: 'https://img.icons8.com/fluency/256/shopping-cart.png', active: true },
  { label: 'طلباتي', href: '/dashboard/orders', icon: 'https://img.icons8.com/fluency/256/list.png' },
  { label: 'خدماتنا', href: '/services', icon: 'https://img.icons8.com/fluency/256/flash-on.png' },
  { label: 'إضافة رصيد', href: '/dashboard/deposit', icon: 'https://img.icons8.com/fluency/256/card-exchange.png' },
  { label: 'نظام النقاط', href: '/dashboard/points', icon: 'https://img.icons8.com/fluency/256/coins.png' },
  { label: 'الدعم الفني', href: '/dashboard/support', icon: 'https://img.icons8.com/fluency/256/headset.png' },
  { label: 'API', href: '/api-docs', icon: 'https://img.icons8.com/fluency/256/code.png' },
];

const platformIcons: Record<string, { icon: string, color: string, keywords: string[] }> = {
  'tiktok': { 
    icon: 'https://img.icons8.com/color/96/tiktok.png', 
    color: '#fe2c55', 
    keywords: ['تيك توك', 'تيكتوك', 'tiktok', 'tik tok'] 
  },
  'instagram': { 
    icon: 'https://img.icons8.com/color/96/instagram-new.png', 
    color: '#e1306c', 
    keywords: ['انستقرام', 'انستجرام', 'انستا', 'instagram', 'ig'] 
  },
  'snapchat': { 
    icon: 'https://img.icons8.com/color/96/snapchat.png', 
    color: '#fffc00', 
    keywords: ['سناب', 'snapchat'] 
  },
  'youtube': { 
    icon: 'https://img.icons8.com/color/96/youtube-play.png', 
    color: '#ff0000', 
    keywords: ['يوتيوب', 'youtube'] 
  },
  'twitter': { 
    icon: 'https://img.icons8.com/color/96/twitter.png', 
    color: '#1da1f2', 
    keywords: ['تويتر', 'twitter', 'x'] 
  },
  'facebook': { 
    icon: 'https://img.icons8.com/color/96/facebook-new.png', 
    color: '#1877f2', 
    keywords: ['فيسبوك', 'facebook'] 
  },
  'telegram': { 
    icon: 'https://img.icons8.com/color/96/telegram-app.png', 
    color: '#0088cc', 
    keywords: ['تيليجرام', 'telegram'] 
  },
  'whatsapp': { 
    icon: 'https://img.icons8.com/color/96/whatsapp.png', 
    color: '#25d366', 
    keywords: ['whatsapp', 'واتساب', 'واتس'] 
  },
  'kick': { 
    icon: 'https://www.google.com/s2/favicons?domain=kick.com&sz=128', 
    color: '#53fc18', 
    keywords: ['كيك', 'kick'] 
  },
  'jaco': { 
    icon: 'https://www.google.com/s2/favicons?domain=jaco.live&sz=128', 
    color: '#ff0050', 
    keywords: ['جاكو', 'jaco'] 
  },
  'discord': { 
    icon: 'https://www.google.com/s2/favicons?domain=discord.com&sz=128', 
    color: '#5865f2', 
    keywords: ['ديسكورد', 'discord'] 
  },
  'pinterest': { 
    icon: 'https://www.google.com/s2/favicons?domain=pinterest.com&sz=128', 
    color: '#bd081c', 
    keywords: ['بنتريست', 'pinterest'] 
  },
  'threads': { 
    icon: 'https://www.google.com/s2/favicons?domain=threads.net&sz=128', 
    color: '#000000', 
    keywords: ['ثريدز', 'threads'] 
  },
  'others': { 
    icon: 'https://img.icons8.com/color/96/services.png', 
    color: '#6c3ce1', 
    keywords: [] 
  }
};


const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, data] of Object.entries(platformIcons)) {
    if (data.keywords.some(k => lowerName.includes(k))) return data.icon;
  }
  return platformIcons.others.icon;
};

const getPlatformKey = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const [key, data] of Object.entries(platformIcons)) {
    if (data.keywords.some(k => lowerName.includes(k))) return key;
  }
  return 'others';
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');

  const [servicesData, setServicesData] = useState<Record<string, any[]>>({});
  const [platformGroups, setPlatformGroups] = useState<Record<string, string[]>>({});
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | number>('');
  const [quantity, setQuantity] = useState(1000);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [stats, setStats] = useState<any>({ totalSpent: '0.00', totalOrders: 0, pendingOrders: 0, accountStatus: 'مدقق' });
  const [loadingStats, setLoadingStats] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState<any>(null);

  // Custom Dropdown States
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          const grouped: Record<string, any[]> = {};
          const plats: Record<string, string[]> = {};
          let targetCategory = '';
          let targetPlatform = 'tiktok';

          data.forEach(s => {
            if (!grouped[s.category]) {
              grouped[s.category] = [];
              const pKey = getPlatformKey(s.category);
              if (!plats[pKey]) plats[pKey] = [];
              plats[pKey].push(s.category);
            }
            grouped[s.category].push({
              id: s.service,
              name: s.name,
              rate: parseFloat(s.rate),
              min: Number(s.min) || 10,
              max: Number(s.max) || 10000,
              refill: s.refill === true
            });

            if (preSelectedServiceId && String(s.service) === String(preSelectedServiceId)) {
              targetCategory = s.category;
              targetPlatform = getPlatformKey(s.category);
            }
          });

          // Sort Categories within platforms to put Followers/Views together
          Object.keys(plats).forEach(p => {
            plats[p].sort((a, b) => {
              const order = ['متابعين', 'مشاهدات', 'لايكات', 'اعجاب'];
              const aIdx = order.findIndex(o => a.includes(o));
              const bIdx = order.findIndex(o => b.includes(o));
              return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
            });
          });

          setServicesData(grouped);
          setPlatformGroups(plats);

          if (preSelectedServiceId && targetCategory) {
            setSelectedPlatform(targetPlatform);
            setSelectedCategory(targetCategory);
            setSelectedServiceId(preSelectedServiceId);
          } else {
            const firstPlat = plats['tiktok'] ? 'tiktok' : Object.keys(plats)[0];
            setSelectedPlatform(firstPlat);
            if (plats[firstPlat]?.length > 0) {
              setSelectedCategory(plats[firstPlat][0]);
              setSelectedServiceId(grouped[plats[firstPlat][0]][0]?.id || '');
            }
          }
        }
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        if (data.username) {
          setUser(data);
          setBalance(data.balance);
        }
      } catch (e) {
        console.error("Failed to load user");
      }
    };
    fetchUser();

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [preSelectedServiceId]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) {
      setMessage({ type: 'error', text: 'الرجاء إدخال الرابط' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          link,
          quantity,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الطلب');
      }

      setMessage({ type: 'success', text: 'تم استلام طلبك بنجاح!' });
      setBalance(data.newBalance);
      setLink(''); 
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const availableServices = servicesData[selectedCategory] || [];
  const selectedService = availableServices.find(s => String(s.id) === String(selectedServiceId)) || availableServices[0];
  const totalCostFloat = selectedService ? (quantity / 1000) * selectedService.rate : 0;
  const totalCost = totalCostFloat.toFixed(4);

  // Profit Calculation (Retail = Cost * 1.5)
  const baseCost = (totalCostFloat / 1.5).toFixed(4);
  const profit = (totalCostFloat - parseFloat(baseCost)).toFixed(4);

  const [hasSupportUnread, setHasSupportUnread] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
       try {
          const res = await fetch('/api/tickets');
          const data = await res.json();
          if (data.tickets) {
             const unread = data.tickets.some((t: any) => t.status === 'open' && t.messages?.[0]?.isAdmin);
             setHasSupportUnread(unread);
          }
       } catch (e) {}
    };
    checkSupport();
  }, []);

  return (
    <>
      <Navbar />
      <div dir="rtl" className="flex min-h-screen pt-[70px] bg-[var(--bg-secondary)]">
        {/* Sidebar */}
        <aside className="w-[240px] bg-[var(--bg-card)] border-l border-[var(--border-color)] p-6 px-4 flex flex-col gap-1 fixed top-[70px] bottom-0 overflow-y-auto z-10 hidden lg:flex">
          <div className="p-6 px-5 bg-[var(--gradient-primary)] rounded-[24px] mb-6 text-center shadow-[var(--shadow-md)]">
            <p className="text-white/85 text-[0.75rem] font-bold uppercase tracking-wider mb-2">رصيدك الحالي</p>
            <p className="text-white text-[2rem] font-black mb-3 drop-shadow-md" dir="ltr">{balance !== null ? balance.toFixed(2) : '...'} {CURRENCY_SYMBOL}</p>
            <Link href="/dashboard/deposit" className="flex items-center justify-center gap-2 p-3 rounded-[15px] bg-white/20 text-white text-[0.85rem] font-extrabold no-underline transition-all hover:scale-[1.02] backdrop-blur-sm">
              <img src="https://img.icons8.com/fluency/256/plus.png" width={16} height={16} className="brightness-0 invert" alt="إضافة رصيد" /> شحن رصيدك
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {sideLinks.map((link, i) => (
              <Link key={i} href={link.href} className={`p-3.5 px-5 rounded-[14px] no-underline flex items-center justify-between gap-4 text-[0.9rem] font-bold transition-all duration-300 ${
                link.active ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}>
                <div className="flex items-center gap-4">
                  <img src={link.icon} alt={link.label} width={22} height={22} className={link.active ? 'opacity-100' : 'opacity-70'} /> 
                  {link.label}
                </div>
                {link.href === '/dashboard/support' && hasSupportUnread && (
                   <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                )}
              </Link>
            ))}
          </div>

          <div className="mt-auto py-4 border-t border-[var(--border-color)]">
            <button 
              onClick={async () => {
                const res = await fetch('/api/auth/logout', { method: 'POST' });
                if (res.ok) window.location.href = '/';
              }}
              className="w-full bg-transparent border-none p-3.5 px-5 rounded-[14px] no-underline flex items-center gap-4 text-[0.9rem] font-bold text-[var(--brand-danger)] cursor-pointer transition-all hover:bg-red-500/10"
            >
              <img src="https://img.icons8.com/fluency/256/exit.png" width={22} height={22} alt="تسجيل الخروج" /> تسجيل الخروج
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:mr-[240px] p-10 px-4 md:px-14">
          <div className="max-w-[1100px] mx-auto">
            
            <div className="flex justify-between items-center mb-12 flex-wrap gap-6">
              <div>
                <h1 className="text-[2.2rem] font-black text-[var(--text-primary)] mb-2 tracking-tight flex items-center gap-4">
                  <img src="https://img.icons8.com/fluency/256/shopping-cart.png" width={38} height={38} alt="طلب جديد" />
                  إضافة طلب جديد
                </h1>
                <p className="text-[var(--text-secondary)] text-[1rem] font-semibold">أهلاً بك مجدداً يا <span className="text-[var(--brand-primary)] font-extrabold">{user?.username || 'ضيفنا'}</span> ⚡</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-[var(--bg-card)] p-3 px-6 rounded-[18px] border border-[var(--border-color)] flex items-center gap-3 shadow-[var(--shadow-sm)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[0.9rem] font-extrabold text-[var(--text-primary)]">حالة النظام: فعال 24/7</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr,1fr] gap-10">
              {/* Order Form */}
                <div className="card p-8 rounded-[24px] shadow-[var(--shadow-md)] relative overflow-hidden">
                  {/* Ghost Background Logo */}
                  <div className="absolute -top-10 -left-10 opacity-[0.03] pointer-events-none select-none z-0 transform -rotate-12">
                    <img src={platformIcons[selectedPlatform as keyof typeof platformIcons]?.icon} width={300} height={300} alt="Background Logo" />
                  </div>

                  <div className="relative z-[1]">
                    {message.text && (
                      <div className={`p-4 rounded-[16px] mb-6 text-[0.9rem] font-bold flex items-center gap-3 border ${
                        message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <img src={message.type === 'success' ? 'https://img.icons8.com/fluency/256/checkmark.png' : 'https://img.icons8.com/fluency/256/error.png'} width={24} height={24} alt={message.type} /> {message.text}
                      </div>
                    )}
                    
                    <form onSubmit={handleOrderSubmit} className="flex flex-col gap-6">
                      {/* Platform Tabs */}
                      <div>
                        <label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-3 flex justify-between items-center">
                          اختر المنصة
                          <span className="text-[0.7rem] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-2 py-0.5 rounded-full">تيك توك أولاً ⚡</span>
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar custom-tabs">
                          {Object.keys(platformIcons).map((key) => {
                            if (key === 'others' && !platformGroups['others']) return null;
                            if (key !== 'others' && !platformGroups[key]) return null;
                            
                            const isActive = selectedPlatform === key;
                            return (
                              <button 
                                key={key}
                                type="button"
                                onClick={() => {
                                  setSelectedPlatform(key);
                                  const cats = platformGroups[key];
                                  if (cats?.length > 0) {
                                    setSelectedCategory(cats[0]);
                                    setSelectedServiceId(servicesData[cats[0]][0]?.id || '');
                                  }
                                }}
                                className={`flex flex-col items-center justify-center min-w-[75px] h-[75px] rounded-[18px] border-2 transition-all gap-1 ${
                                  isActive 
                                  ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 shadow-[0_4px_15px_rgba(108,60,225,0.2)]' 
                                  : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--brand-primary)]/40'
                                }`}
                              >
                                <img src={platformIcons[key as keyof typeof platformIcons].icon} width={28} height={28} alt={key} className={isActive ? 'scale-110' : 'grayscale-[0.3]'} />
                                <span className={`text-[0.65rem] font-black uppercase ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                                  {key === 'others' ? 'أخرى' : key}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Custom Category Selection */}
                        <div className="relative">
                          <label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-2.5">القسم (Category)</label>
                          <div 
                              className="input-field cursor-pointer h-[52px] rounded-[14px] flex items-center justify-between px-4 bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                              onClick={() => setShowCatMenu(!showCatMenu)}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img src={getIcon(selectedCategory)} width={20} className="opacity-80" alt="icon" />
                              <span className="font-bold text-[var(--text-primary)] text-[0.85rem] truncate">{selectedCategory}</span>
                            </div>
                            <img src="https://img.icons8.com/fluency/256/expand-arrow.png" width={16} className={`transition-transform ${showCatMenu ? 'rotate-180' : ''}`} alt="arrow" />
                          </div>

                          {showCatMenu && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[18px] shadow-[var(--shadow-lg)] z-50 overflow-hidden backdrop-blur-md">
                              <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                                <input 
                                  type="text" 
                                  placeholder="بحث عن قسم..." 
                                  className="w-full bg-transparent border-none outline-none text-[0.8rem] font-bold text-[var(--text-primary)]"
                                  value={catSearch}
                                  onChange={e => setCatSearch(e.target.value)}
                                  onClick={e => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {(platformGroups[selectedPlatform] || [])
                                  .filter(cat => cat.includes(catSearch))
                                  .map(cat => (
                                    <div 
                                      key={cat} 
                                      className={`p-3.5 px-4 cursor-pointer flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition-all ${selectedCategory === cat ? 'bg-[var(--brand-primary)]/5 text-[var(--brand-primary)]' : 'text-[var(--text-secondary)]'}`}
                                      onClick={() => {
                                        setSelectedCategory(cat);
                                        setSelectedServiceId(servicesData[cat]?.[0]?.id || '');
                                        setShowCatMenu(false);
                                        setCatSearch('');
                                      }}
                                    >
                                      <img src={getIcon(cat)} width={18} alt="icon" />
                                      <span className="text-[0.8rem] font-bold">{cat}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Custom Service Selection */}
                        <div className="relative">
                          <label className="block text-[0.85rem] font-extrabold text-[var(--text-secondary)] mb-2.5">الخدمة (Service)</label>
                          <div 
                              className="input-field cursor-pointer h-[52px] rounded-[14px] flex items-center justify-between px-4 bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                              onClick={() => setShowServiceMenu(!showServiceMenu)}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-bold text-[var(--text-primary)] text-[0.85rem] truncate" dir="ltr">{selectedService?.name || 'اختر الخدمة'}</span>
                            </div>
                            <img src="https://img.icons8.com/fluency/256/expand-arrow.png" width={16} className={`transition-transform ${showServiceMenu ? 'rotate-180' : ''}`} alt="arrow" />
                          </div>

                          {showServiceMenu && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[18px] shadow-[var(--shadow-lg)] z-50 overflow-hidden backdrop-blur-md">
                              <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                                <input 
                                  type="text" 
                                  placeholder="بحث عن خدمة..." 
                                  className="w-full bg-transparent border-none outline-none text-[0.8rem] font-bold text-[var(--text-primary)]"
                                  value={serviceSearch}
                                  onChange={e => setServiceSearch(e.target.value)}
                                  onClick={e => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-60 overflow-y-auto">
                                {availableServices
                                  .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
                                  .map(s => (
                                    <div 
                                      key={s.id} 
                                      className={`p-3.5 px-4 cursor-pointer flex flex-col gap-0.5 hover:bg-[var(--bg-secondary)] transition-all ${selectedServiceId === s.id ? 'bg-[var(--brand-primary)]/5 border-r-4 border-[var(--brand-primary)]' : ''}`}
                                      onClick={() => {
                                        setSelectedServiceId(s.id);
                                        setShowServiceMenu(false);
                                        setServiceSearch('');
                                      }}
                                    >
                                      <div className="flex justify-between items-center gap-4">
                                        <span className="text-[0.75rem] font-bold text-[var(--text-primary)] leading-snug" dir="ltr">{s.name}</span>
                                        <span className="text-[0.7rem] font-black text-[var(--brand-primary)] whitespace-nowrap">{s.rate.toFixed(3)} {CURRENCY_SYMBOL}</span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    {selectedService && (
                      <div className="p-4 rounded-[16px] bg-[var(--bg-secondary)] border border-[var(--border-color)] border-dashed">
                        <p className="text-[0.85rem] font-bold text-[var(--brand-primary)] mb-2">تفاصيل الخدمة:</p>
                        <div className="grid grid-cols-2 gap-4 text-[0.8rem] text-[var(--text-secondary)] font-semibold">
                          <p>الحد الأدنى: <span className="text-[var(--text-primary)]">{selectedService.min}</span></p>
                          <p>الحد الأقصى: <span className="text-[var(--text-primary)]">{selectedService.max}</span></p>
                          <p>التعويض: <span className={selectedService.refill ? 'text-emerald-500' : 'text-red-500'}>{selectedService.refill ? 'متاح' : 'غير متاح'}</span></p>
                          <p>وقت البدء: <span className="text-[var(--text-primary)]">0-24 ساعة</span></p>
                        </div>
                      </div>
                    )}

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

                    <div className="p-5 px-6 rounded-[22px] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-inner">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[0.9rem] font-bold text-[var(--text-secondary)]">التكلفة الإجمالية:</span>
                        <span className="text-[1.8rem] font-black text-[var(--brand-primary)]" dir="ltr">{totalCost} {CURRENCY_SYMBOL}</span>
                      </div>
                      
                      {/* Admin Profit Comparison View */}
                      {user?.isProfitViewer && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)] border-dashed grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[0.7rem] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">سعر التكلفة (قبل)</span>
                            <span className="text-[1rem] font-black text-[var(--text-secondary)] opacity-70" dir="ltr">{baseCost} {CURRENCY_SYMBOL}</span>
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[0.7rem] font-bold text-emerald-500 uppercase tracking-wider">الربح الصافي (50%)</span>
                            <span className="text-[1rem] font-black text-emerald-500" dir="ltr">+{profit} {CURRENCY_SYMBOL}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button disabled={submitting || Number(totalCost) === 0} type="submit" className="btn-primary w-full p-5 text-[1.1rem] font-black rounded-[16px] shadow-[0_8px_25px_rgba(108,60,225,0.3)] transition-all flex items-center justify-center gap-3">
                      {submitting ? (
                        <>
                          <img src="https://img.icons8.com/fluency/256/hourglass.png" width={24} height={24} className="animate-spin brightness-0 invert" alt="جاري التحميل" />
                          جاري معالجة الطلب...
                        </>
                      ) : (
                        <>
                          <img src="https://img.icons8.com/fluency/256/checkmark.png" width={24} height={24} className="brightness-0 invert" alt="تأكيد" />
                          تأكيد وتنفيذ الطلب
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex flex-col gap-8">
                {/* Real Stats */}
                <div className="card p-7 rounded-[24px]">
                  <h3 className="text-[1.1rem] font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
                    <img src="https://img.icons8.com/fluency/96/combo-chart.png" width={28} height={28} alt="إحصائيات" /> ملخص النشاط
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'إجمالي المصروفات', value: loadingStats ? '...' : `${stats.totalSpent} ${CURRENCY_SYMBOL}`, color: 'var(--text-primary)' },
                      { label: 'إجمالي الطلبات', value: loadingStats ? '...' : stats.totalOrders, color: 'var(--text-primary)' },
                      { label: 'طلبات قيد المراجعة', value: loadingStats ? '...' : stats.pendingOrders, color: 'var(--brand-accent)' },
                      { label: 'حالة الحساب', value: loadingStats ? '...' : stats.accountStatus, color: 'var(--brand-success)' },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between p-3 px-4 bg-[var(--bg-secondary)] rounded-[12px] border border-[var(--border-color)]">
                        <span className="text-[0.85rem] text-[var(--text-secondary)] font-semibold">{stat.label}</span>
                        <span className={`text-[0.85rem] font-extrabold ${
                          stat.label === 'طلبات قيد المراجعة' ? 'text-[var(--brand-accent)]' :
                          stat.label === 'حالة الحساب' ? 'text-[var(--brand-success)]' :
                          'text-[var(--text-primary)]'
                        }`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Promo */}
                <div className="card p-7 rounded-[24px] relative overflow-hidden bg-gradient-to-br from-[var(--bg-card)] to-[var(--brand-primary)]/5">
                  <div className="relative z-[2]">
                    <h3 className="text-[1.1rem] font-black text-[var(--brand-primary)] mb-3 flex items-center gap-2.5">
                      <img src="https://img.icons8.com/fluency/256/code.png" width={24} height={24} alt="API" /> بوابة المطورين
                    </h3>
                    <p className="text-[var(--text-secondary)] text-[0.85rem] leading-relaxed mb-6">
                      هل تمتلك موقع SMM خاص بك؟ اربط خدماتنا بلوحتك عبر الـ API واحصل على أسعار الجملة.
                    </p>
                    <Link href="/api-docs" className="btn-secondary w-full text-center p-3 text-[0.9rem] rounded-[14px] font-extrabold border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] flex items-center justify-center gap-2.5 hover:bg-[var(--brand-primary)] hover:text-white transition-colors no-underline">
                      عرض وثائق الـ API <img src="https://img.icons8.com/fluency/256/link.png" width={18} height={18} className="opacity-80" alt="رابط" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-spinners::-webkit-outer-spin-button,
        .no-spinners::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinners { -moz-appearance: textfield; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-tabs button:active { transform: scale(0.95); }
        .hover-scale:hover { transform: translateY(-2px); background: rgba(255,255,255,0.3) !important; }
        .hover-danger:hover { background: rgba(255,77,77,0.1) !important; }
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 850px) {
          aside { display: none !important; }
          div[style*="marginRight: '220px'"] { margin-right: 0 !important; padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
