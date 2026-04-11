"use client";

import { useState, useEffect, useCallback } from 'react';

// ============================================================
//  AI Device Detection & Responsive Optimization System
//  - Detects device type, brand, model, screen specs
//  - Provides smart breakpoints and layout recommendations
//  - Auto-adjusts font sizes, spacing, touch targets
// ============================================================

export interface DeviceInfo {
  // Device Classification
  type: 'mobile' | 'tablet' | 'desktop' | 'tv';
  brand: string;
  model: string;
  os: string;
  osVersion: string;
  browser: string;
  
  // Screen Specs
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  aspectRatio: string;
  orientation: 'portrait' | 'landscape';
  isRetina: boolean;
  
  // Touch & Input
  isTouchDevice: boolean;
  maxTouchPoints: number;
  hasHover: boolean;
  hasFinePointer: boolean;
  
  // Performance
  connectionType: string;
  isSlowConnection: boolean;
  deviceMemoryGB: number;
  cpuCores: number;
  
  // Smart Sizing Recommendations
  sizing: {
    baseFontSize: number;
    scaleFactor: number;
    touchTargetMin: number;
    containerMaxWidth: string;
    sidebarWidth: string;
    navHeight: string;
    cardPadding: string;
    cardRadius: string;
    gridCols: number;
    buttonPadding: string;
    inputHeight: string;
    iconSize: number;
    avatarSize: number;
    gap: string;
    sectionPadding: string;
  };
  
  // Layout Flags
  layout: {
    showSidebar: boolean;
    showDesktopNav: boolean;
    compactMode: boolean;
    stackedLayout: boolean;
    reducedMotion: boolean;
    useBottomNav: boolean;
    fullWidthCards: boolean;
    singleColumnForm: boolean;
  };
}

// ============================================================
//  Device & Brand Detection Database
// ============================================================
const DEVICE_DB: { pattern: RegExp; brand: string; model: string }[] = [
  // Apple Devices
  { pattern: /iPhone\s?(\d{1,2})?\s?Pro\s?Max/i, brand: 'Apple', model: 'iPhone Pro Max' },
  { pattern: /iPhone\s?(\d{1,2})?\s?Pro/i, brand: 'Apple', model: 'iPhone Pro' },
  { pattern: /iPhone\s?(\d{1,2})?\s?Plus/i, brand: 'Apple', model: 'iPhone Plus' },
  { pattern: /iPhone\s?(\d{1,2})?\s?mini/i, brand: 'Apple', model: 'iPhone Mini' },
  { pattern: /iPhone/i, brand: 'Apple', model: 'iPhone' },
  { pattern: /iPad\s?Pro/i, brand: 'Apple', model: 'iPad Pro' },
  { pattern: /iPad\s?Air/i, brand: 'Apple', model: 'iPad Air' },
  { pattern: /iPad\s?Mini/i, brand: 'Apple', model: 'iPad Mini' },
  { pattern: /iPad/i, brand: 'Apple', model: 'iPad' },
  
  // Samsung Devices
  { pattern: /SM-S9\d{2}/i, brand: 'Samsung', model: 'Galaxy S24' },
  { pattern: /SM-S91\d/i, brand: 'Samsung', model: 'Galaxy S23' },
  { pattern: /SM-G99\d/i, brand: 'Samsung', model: 'Galaxy S21' },
  { pattern: /SM-A\d{3}/i, brand: 'Samsung', model: 'Galaxy A Series' },
  { pattern: /SM-N9\d{2}/i, brand: 'Samsung', model: 'Galaxy Note' },
  { pattern: /SM-F9\d{2}/i, brand: 'Samsung', model: 'Galaxy Z Fold' },
  { pattern: /SM-F7\d{2}/i, brand: 'Samsung', model: 'Galaxy Z Flip' },
  { pattern: /SM-T\d{3}/i, brand: 'Samsung', model: 'Galaxy Tab' },
  { pattern: /Samsung|SAMSUNG|Galaxy/i, brand: 'Samsung', model: 'Galaxy' },
  
  // Huawei
  { pattern: /HUAWEI|Huawei|HarmonyOS/i, brand: 'Huawei', model: 'Huawei' },
  { pattern: /HONOR|Honor/i, brand: 'Honor', model: 'Honor' },
  
  // Xiaomi / Redmi / POCO
  { pattern: /POCO/i, brand: 'Xiaomi', model: 'POCO' },
  { pattern: /Redmi/i, brand: 'Xiaomi', model: 'Redmi' },
  { pattern: /Mi\s?\d|Xiaomi/i, brand: 'Xiaomi', model: 'Xiaomi' },
  
  // Oppo / Realme / OnePlus
  { pattern: /OPPO|CPH\d{4}/i, brand: 'OPPO', model: 'OPPO' },
  { pattern: /realme|RMX\d{4}/i, brand: 'Realme', model: 'Realme' },
  { pattern: /OnePlus/i, brand: 'OnePlus', model: 'OnePlus' },
  
  // Vivo
  { pattern: /vivo/i, brand: 'Vivo', model: 'Vivo' },
  
  // Google
  { pattern: /Pixel\s?\d/i, brand: 'Google', model: 'Pixel' },
  
  // Sony
  { pattern: /Sony|Xperia/i, brand: 'Sony', model: 'Xperia' },
  
  // Others
  { pattern: /LG/i, brand: 'LG', model: 'LG' },
  { pattern: /Nokia/i, brand: 'Nokia', model: 'Nokia' },
  { pattern: /Motorola|moto/i, brand: 'Motorola', model: 'Motorola' },
];

// Screen Size Categories (physical width in CSS px)
const BREAKPOINTS = {
  smallMobile: 360,    // iPhone SE, small Androids
  mobile: 390,         // iPhone 14, most modern phones
  largeMobile: 430,    // iPhone Pro Max, Galaxy S Ultra
  smallTablet: 768,    // iPad Mini
  tablet: 834,         // iPad Air
  largeTablet: 1024,   // iPad Pro 11"
  laptop: 1280,        // Small laptop
  desktop: 1440,       // Standard desktop
  wideDesktop: 1920,   // Full HD
  ultraWide: 2560,     // QHD+
};

function detectBrand(ua: string): { brand: string; model: string } {
  for (const device of DEVICE_DB) {
    if (device.pattern.test(ua)) {
      return { brand: device.brand, model: device.model };
    }
  }
  return { brand: 'Unknown', model: 'Unknown' };
}

function detectOS(ua: string): { os: string; version: string } {
  if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS (\d+[_\.]\d+)/);
    return { os: 'iOS', version: match ? match[1].replace('_', '.') : '' };
  }
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android (\d+\.?\d*)/);
    return { os: 'Android', version: match ? match[1] : '' };
  }
  if (/Windows/i.test(ua)) {
    const match = ua.match(/Windows NT (\d+\.?\d*)/);
    return { os: 'Windows', version: match ? match[1] : '' };
  }
  if (/Macintosh/i.test(ua)) {
    const match = ua.match(/Mac OS X (\d+[_\.]\d+)/);
    return { os: 'macOS', version: match ? match[1].replace('_', '.') : '' };
  }
  if (/Linux/i.test(ua)) return { os: 'Linux', version: '' };
  if (/CrOS/i.test(ua)) return { os: 'Chrome OS', version: '' };
  return { os: 'Unknown', version: '' };
}

function detectBrowser(ua: string): string {
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  if (/OPR|Opera/i.test(ua)) return 'Opera';
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/CriOS|Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  return 'Other';
}

function getAspectRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const d = gcd(w, h);
  return `${w / d}:${h / d}`;
}

function computeSmartSizing(
  viewportWidth: number,
  viewportHeight: number,
  pixelRatio: number,
  type: 'mobile' | 'tablet' | 'desktop' | 'tv'
): DeviceInfo['sizing'] {
  const vw = viewportWidth;

  // Dynamic base font scaling
  let baseFontSize: number;
  let scaleFactor: number;

  if (vw <= BREAKPOINTS.smallMobile) {
    baseFontSize = 13;
    scaleFactor = 0.8;
  } else if (vw <= BREAKPOINTS.mobile) {
    baseFontSize = 14;
    scaleFactor = 0.85;
  } else if (vw <= BREAKPOINTS.largeMobile) {
    baseFontSize = 15;
    scaleFactor = 0.9;
  } else if (vw <= BREAKPOINTS.smallTablet) {
    baseFontSize = 15;
    scaleFactor = 0.92;
  } else if (vw <= BREAKPOINTS.tablet) {
    baseFontSize = 16;
    scaleFactor = 0.95;
  } else if (vw <= BREAKPOINTS.largeTablet) {
    baseFontSize = 16;
    scaleFactor = 1.0;
  } else {
    baseFontSize = 16;
    scaleFactor = 1.0;
  }

  // Extra boost for high-DPI small screens
  if (pixelRatio >= 3 && vw <= 430) {
    baseFontSize = Math.max(baseFontSize, 14);
  }

  const touchTargetMin = type === 'mobile' ? 44 : type === 'tablet' ? 40 : 36;

  // Grid columns
  let gridCols: number;
  if (vw < 600) gridCols = 1;
  else if (vw < 900) gridCols = 2;
  else if (vw < 1200) gridCols = 3;
  else gridCols = 4;

  return {
    baseFontSize,
    scaleFactor,
    touchTargetMin,
    containerMaxWidth: vw <= 600 ? '100%' : vw <= 1024 ? '960px' : '1280px',
    sidebarWidth: vw >= 1024 ? '240px' : '0px',
    navHeight: vw <= 768 ? '60px' : '70px',
    cardPadding: vw <= 400 ? '1rem' : vw <= 768 ? '1.25rem' : '2rem',
    cardRadius: vw <= 400 ? '16px' : vw <= 768 ? '20px' : '24px',
    gridCols,
    buttonPadding: vw <= 400 ? '0.65rem 1.2rem' : vw <= 768 ? '0.75rem 1.5rem' : '0.85rem 2rem',
    inputHeight: vw <= 400 ? '44px' : vw <= 768 ? '48px' : '52px',
    iconSize: vw <= 400 ? 18 : vw <= 768 ? 22 : 24,
    avatarSize: vw <= 400 ? 28 : vw <= 768 ? 32 : 36,
    gap: vw <= 400 ? '0.5rem' : vw <= 768 ? '0.75rem' : '1rem',
    sectionPadding: vw <= 400 ? '3rem 0' : vw <= 768 ? '4rem 0' : '6rem 0',
  };
}

function computeLayout(
  viewportWidth: number,
  type: 'mobile' | 'tablet' | 'desktop' | 'tv'
): DeviceInfo['layout'] {
  const vw = viewportWidth;
  return {
    showSidebar: vw >= 1024,
    showDesktopNav: vw >= 768,
    compactMode: vw < 600,
    stackedLayout: vw < 768,
    reducedMotion: false, // Will be checked via media query
    useBottomNav: type === 'mobile',
    fullWidthCards: vw < 600,
    singleColumnForm: vw < 768,
  };
}

// ============================================================
//  Main Hook
// ============================================================
export function useDeviceAI(): DeviceInfo & { cssVars: Record<string, string>; deviceClass: string } {
  const [info, setInfo] = useState<DeviceInfo>(() => getDefaultInfo());
  const [cssVars, setCssVars] = useState<Record<string, string>>({});
  const [deviceClass, setDeviceClass] = useState('');

  const detect = useCallback(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent;
    const { brand, model } = detectBrand(ua);
    const { os, version } = detectOS(ua);
    const browser = detectBrowser(ua);

    const sw = window.screen?.width || window.innerWidth;
    const sh = window.screen?.height || window.innerHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const isMobile = /Mobi|Android|iPhone|iPod/i.test(ua) || vw < 768;
    const isTablet = /iPad|Tablet|SM-T|Tab/i.test(ua) || (vw >= 768 && vw < 1024 && 'ontouchstart' in window);
    const isTV = /Smart[-\s]?TV|Tizen|Web0S|PlayStation|Xbox/i.test(ua);

    let type: DeviceInfo['type'] = 'desktop';
    if (isTV) type = 'tv';
    else if (isTablet) type = 'tablet';
    else if (isMobile) type = 'mobile';

    const orientation: 'portrait' | 'landscape' = vh > vw ? 'portrait' : 'landscape';
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    // Media query checks
    const hasHover = window.matchMedia?.('(hover: hover)')?.matches ?? !isTouchDevice;
    const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches ?? !isTouchDevice;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    // Connection & Performance
    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const connectionType = conn?.effectiveType || 'unknown';
    const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';
    const deviceMemoryGB = nav.deviceMemory || 4;
    const cpuCores = nav.hardwareConcurrency || 4;

    const sizing = computeSmartSizing(vw, vh, dpr, type);
    const layout = computeLayout(vw, type);
    layout.reducedMotion = prefersReducedMotion;

    const newInfo: DeviceInfo = {
      type,
      brand,
      model,
      os,
      osVersion: version,
      browser,
      screenWidth: sw,
      screenHeight: sh,
      viewportWidth: vw,
      viewportHeight: vh,
      pixelRatio: dpr,
      aspectRatio: getAspectRatio(vw, vh),
      orientation,
      isRetina: dpr >= 2,
      isTouchDevice,
      maxTouchPoints,
      hasHover,
      hasFinePointer,
      connectionType,
      isSlowConnection,
      deviceMemoryGB,
      cpuCores,
      sizing,
      layout,
    };

    setInfo(newInfo);

    // Generate CSS custom properties
    const vars: Record<string, string> = {
      '--device-base-font': `${sizing.baseFontSize}px`,
      '--device-scale': `${sizing.scaleFactor}`,
      '--device-touch-min': `${sizing.touchTargetMin}px`,
      '--device-container': sizing.containerMaxWidth,
      '--device-sidebar': sizing.sidebarWidth,
      '--device-nav-h': sizing.navHeight,
      '--device-card-pad': sizing.cardPadding,
      '--device-card-radius': sizing.cardRadius,
      '--device-btn-pad': sizing.buttonPadding,
      '--device-input-h': sizing.inputHeight,
      '--device-icon': `${sizing.iconSize}px`,
      '--device-avatar': `${sizing.avatarSize}px`,
      '--device-gap': sizing.gap,
      '--device-section-pad': sizing.sectionPadding,
      '--device-grid-cols': `${sizing.gridCols}`,
    };

    setCssVars(vars);

    // Apply CSS vars to root
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Build device class string for body
    const classes = [
      `device-${type}`,
      `brand-${brand.toLowerCase().replace(/\s+/g, '-')}`,
      `os-${os.toLowerCase().replace(/\s+/g, '-')}`,
      orientation === 'portrait' ? 'orient-portrait' : 'orient-landscape',
      isTouchDevice ? 'touch-device' : 'pointer-device',
      isSlowConnection ? 'slow-connection' : '',
      prefersReducedMotion ? 'reduced-motion' : '',
      layout.compactMode ? 'compact-mode' : '',
      dpr >= 3 ? 'ultra-retina' : dpr >= 2 ? 'retina' : 'standard-dpi',
      vw <= 360 ? 'screen-xs' : '',
      vw <= 390 ? 'screen-sm' : '',
      vw <= 430 ? 'screen-md' : '',
      vw <= 768 ? 'screen-lg' : '',
    ].filter(Boolean).join(' ');

    setDeviceClass(classes);

    // Apply to body
    document.body.setAttribute('data-device', type);
    document.body.setAttribute('data-brand', brand.toLowerCase());
    document.body.setAttribute('data-os', os.toLowerCase());
    document.body.setAttribute('data-orientation', orientation);
    document.body.className = document.body.className
      .replace(/device-\S+|brand-\S+|os-\S+|orient-\S+|touch-device|pointer-device|slow-connection|reduced-motion|compact-mode|ultra-retina|retina|standard-dpi|screen-\S+/g, '')
      .trim() + ' ' + classes;

  }, []);

  useEffect(() => {
    detect();

    const handleResize = () => {
      requestAnimationFrame(detect);
    };

    const handleOrientationChange = () => {
      setTimeout(detect, 150); // small delay for orientation to settle
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Watch for screen changes (e.g., connecting external monitor)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener?.('change', detect);
    motionQuery.addEventListener?.('change', detect);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      mediaQuery.removeEventListener?.('change', detect);
      motionQuery.removeEventListener?.('change', detect);
    };
  }, [detect]);

  return { ...info, cssVars, deviceClass };
}

function getDefaultInfo(): DeviceInfo {
  return {
    type: 'desktop',
    brand: 'Unknown',
    model: 'Unknown',
    os: 'Unknown',
    osVersion: '',
    browser: 'Unknown',
    screenWidth: 1920,
    screenHeight: 1080,
    viewportWidth: 1920,
    viewportHeight: 1080,
    pixelRatio: 1,
    aspectRatio: '16:9',
    orientation: 'landscape',
    isRetina: false,
    isTouchDevice: false,
    maxTouchPoints: 0,
    hasHover: true,
    hasFinePointer: true,
    connectionType: 'unknown',
    isSlowConnection: false,
    deviceMemoryGB: 4,
    cpuCores: 4,
    sizing: {
      baseFontSize: 16,
      scaleFactor: 1,
      touchTargetMin: 36,
      containerMaxWidth: '1280px',
      sidebarWidth: '240px',
      navHeight: '70px',
      cardPadding: '2rem',
      cardRadius: '24px',
      gridCols: 3,
      buttonPadding: '0.85rem 2rem',
      inputHeight: '52px',
      iconSize: 24,
      avatarSize: 36,
      gap: '1rem',
      sectionPadding: '6rem 0',
    },
    layout: {
      showSidebar: true,
      showDesktopNav: true,
      compactMode: false,
      stackedLayout: false,
      reducedMotion: false,
      useBottomNav: false,
      fullWidthCards: false,
      singleColumnForm: false,
    },
  };
}

export default useDeviceAI;
