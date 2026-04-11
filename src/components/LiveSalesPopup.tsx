"use client";
import { useState, useEffect } from 'react';

interface Sale {
  id: string;
  name: string;
  service: string;
  timeAgo: number;
}

export default function LiveSalesPopup() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/user/live-sales')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) setSales(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (sales.length === 0) return;

    // Show popup
    const showTimeout = setTimeout(() => {
      setVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
        // Move to next item after hidden
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % sales.length);
        }, 1000);
      }, 5000);

    }, 15000); // 15 seconds delay between popups

    return () => clearTimeout(showTimeout);
  }, [sales, currentIndex, visible]);

  if (sales.length === 0) return null;

  const currentSale = sales[currentIndex];

  return (
    <div 
      className={`fixed z-[100] transition-all duration-700 ease-in-out ${
        visible 
          ? 'bottom-6 md:bottom-8 left-4 md:left-12 opacity-100 translate-y-0 scale-90 md:scale-100' 
          : 'bottom-6 md:bottom-8 left-4 md:left-12 opacity-0 translate-y-10 scale-75 pointer-events-none'
      }`}
      dir="rtl"
    >
      <div className="bg-white border border-[var(--border-color)] shadow-2xl shadow-purple-500/10 rounded-[18px] p-3 md:p-4 flex items-center gap-4 min-w-[280px] max-w-[340px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-primary)]/5 to-[var(--brand-primary)]/10" />
        
        <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center flex-shrink-0 relative z-10">
          <span className="text-[1.2rem] animate-pulse">🛒</span>
        </div>
        
        <div className="relative z-10 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-black text-[var(--text-primary)] text-[0.85rem] truncate">{currentSale.name}</span>
            <span className="text-[0.65rem] font-bold text-[var(--text-tertiary)] flex-shrink-0">منذ {currentSale.timeAgo === 0 ? 'الآن' : `${currentSale.timeAgo} د`}</span>
          </div>
          <p className="text-[0.75rem] font-bold text-[var(--text-secondary)]">اشترى <span className="text-[var(--brand-primary)] block font-black truncate max-w-[200px]">{currentSale.service}</span></p>
        </div>
        
        {/* Verification Checkmark */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-emerald-500 rounded-full text-white flex items-center justify-center text-[0.5rem] shadow-sm tooltip" title="تم التحقق من الشراء">
          ✓
        </div>
      </div>
    </div>
  );
}
