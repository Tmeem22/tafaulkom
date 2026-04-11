"use client";

import { useEffect, useState } from 'react';
import useDeviceAI, { DeviceInfo } from '@/hooks/useDeviceAI';

// ============================================================
//  DeviceOptimizer Component
//  - Applies AI-powered responsive CSS variables to the page
//  - Shows a subtle device detection indicator (dev mode only)
//  - Handles safe-area insets for notch devices
//  - Manages viewport optimizations
// ============================================================

interface DeviceOptimizerProps {
  showDebug?: boolean; // Show device info indicator (for dev testing)
}

export default function DeviceOptimizer({ showDebug = false }: DeviceOptimizerProps) {
  const device = useDeviceAI();
  const [mounted, setMounted] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply smart optimizations based on device
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const body = document.body;

    // 1) Dynamic viewport height fix (iOS Safari address bar)
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      root.style.setProperty('--vh', `${vh}px`);
      root.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);

    // 2) Safe area insets for notch phones (iPhone X+, Android punch-hole)
    root.style.setProperty('--safe-top', 'env(safe-area-inset-top, 0px)');
    root.style.setProperty('--safe-bottom', 'env(safe-area-inset-bottom, 0px)');
    root.style.setProperty('--safe-left', 'env(safe-area-inset-left, 0px)');
    root.style.setProperty('--safe-right', 'env(safe-area-inset-right, 0px)');

    // 3) Touch-action optimization for mobile
    if (device.isTouchDevice) {
      body.style.touchAction = 'manipulation';
      (body.style as any).webkitTapHighlightColor = 'transparent';
      // Prevent double-tap zoom on iOS
      root.style.touchAction = 'manipulation';
    }

    // 4) Apply font-size scaling based on device
    root.style.fontSize = `${device.sizing.baseFontSize}px`;

    // 5) Disable animations on slow connections
    if (device.isSlowConnection || device.layout.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
      root.style.setProperty('--transition-duration', '0.3s');
    }

    // 6) Apply performance optimizations
    if (device.deviceMemoryGB <= 2 || device.cpuCores <= 2) {
      root.classList.add('low-performance');
    } else {
      root.classList.remove('low-performance');
    }

    return () => {
      window.removeEventListener('resize', setVH);
    };
  }, [mounted, device]);

  if (!mounted) return null;

  // Dev Debug Indicator (only shown if showDebug=true)
  if (showDebug) {
    return (
      <>
        {/* Floating Debug Button */}
        <button
          onClick={() => setShowIndicator(!showIndicator)}
          style={{
            position: 'fixed',
            bottom: '120px',
            left: '16px',
            zIndex: 99999,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6C3CE1, #06B6D4)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(108,60,225,0.4)',
            backdropFilter: 'blur(10px)',
          }}
          title="معلومات الجهاز - AI Device Detection"
        >
          📱
        </button>

        {/* Debug Panel */}
        {showIndicator && (
          <div
            style={{
              position: 'fixed',
              bottom: '170px',
              left: '16px',
              zIndex: 99999,
              width: '320px',
              maxHeight: '60vh',
              overflowY: 'auto',
              background: 'rgba(8, 9, 21, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(108, 60, 225, 0.3)',
              borderRadius: '20px',
              padding: '20px',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '12px',
              direction: 'ltr',
              textAlign: 'left',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', background: 'linear-gradient(90deg, #6C3CE1, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🤖 AI Device Detection
              </span>
              <button
                onClick={() => setShowIndicator(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <InfoRow label="Type" value={device.type} color="#10B981" />
              <InfoRow label="Brand" value={device.brand} color="#8B5CF6" />
              <InfoRow label="Model" value={device.model} color="#8B5CF6" />
              <InfoRow label="OS" value={`${device.os} ${device.osVersion}`} color="#06B6D4" />
              <InfoRow label="Browser" value={device.browser} color="#06B6D4" />
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
              
              <InfoRow label="Viewport" value={`${device.viewportWidth} × ${device.viewportHeight}`} color="#F59E0B" />
              <InfoRow label="Screen" value={`${device.screenWidth} × ${device.screenHeight}`} color="#F59E0B" />
              <InfoRow label="DPR" value={`${device.pixelRatio}x ${device.isRetina ? '(Retina)' : ''}`} color="#F59E0B" />
              <InfoRow label="Ratio" value={device.aspectRatio} color="#F59E0B" />
              <InfoRow label="Orient" value={device.orientation} color="#F59E0B" />
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
              
              <InfoRow label="Touch" value={device.isTouchDevice ? `✅ (${device.maxTouchPoints}pts)` : '❌'} color="#EF4444" />
              <InfoRow label="Hover" value={device.hasHover ? '✅' : '❌'} color="#EF4444" />
              <InfoRow label="Connection" value={device.connectionType} color={device.isSlowConnection ? '#EF4444' : '#10B981'} />
              <InfoRow label="Memory" value={`${device.deviceMemoryGB}GB`} color="#10B981" />
              <InfoRow label="CPU" value={`${device.cpuCores} cores`} color="#10B981" />
              
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }} />
              
              <InfoRow label="Font Size" value={`${device.sizing.baseFontSize}px`} color="#C4B5FD" />
              <InfoRow label="Scale" value={`${device.sizing.scaleFactor}x`} color="#C4B5FD" />
              <InfoRow label="Grid Cols" value={`${device.sizing.gridCols}`} color="#C4B5FD" />
              <InfoRow label="Sidebar" value={device.layout.showSidebar ? '✅' : '❌'} color="#C4B5FD" />
              <InfoRow label="Bottom Nav" value={device.layout.useBottomNav ? '✅' : '❌'} color="#C4B5FD" />
              <InfoRow label="Compact" value={device.layout.compactMode ? '✅' : '❌'} color="#C4B5FD" />
            </div>
          </div>
        )}
      </>
    );
  }

  // In production, render nothing visible (optimizations are applied via useEffect)
  return null;
}

function InfoRow({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{label}</span>
      <span style={{ color, fontWeight: 'bold', fontSize: '11px' }}>{value}</span>
    </div>
  );
}
