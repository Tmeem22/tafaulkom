import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security Headers Configuration
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://img.icons8.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; object-src 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
};

// Advanced Security Detection Patterns
const MALICIOUS_PATTERNS = [
  /<script/i, /javascript:/i, /onerror/i, /onload/i, // XSS
  /union\s+select/i, /insert\s+into/i, /delete\s+from/i, /drop\s+table/i, // SQLi
  /\.\.\//, /\/etc\/passwd/, // Path Traversal
  /base64_/i, /eval\(/i, // Code Injection
];

const BOT_KEYWORDS = ['sqlmap', 'nikto', 'burp', 'scanner', 'python-requests', 'curl', 'wget'];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Auto-redirect Logged-in Users from Landing Page ('/')
  if (pathname === '/') {
    const session = request.cookies.get('session');
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Helper to log security threats asynchronously
  const logThreat = async (reason: string, severity: string = 'WARNING') => {
    try {
      const secret = process.env.SECURITY_SECRET || 'internal-secret-123';
      fetch(`${request.nextUrl.origin}/api/admin/security/log`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-security-secret': secret
        },
        body: JSON.stringify({ ip, event: `Blocked Request: ${reason} (${pathname})`, severity, userAgent }),
      }).catch(() => {});
    } catch (e) {}
  };

  // 1. Audit URL for Malicious Patterns
  const fullUrl = `${pathname}${search}`;
  if (MALICIOUS_PATTERNS.some(pattern => pattern.test(fullUrl))) {
    console.error(`[CRITICAL SECURITY ALERT] Malicious pattern detected: ${fullUrl} from IP: ${ip}`);
    logThreat('Malicious Injection Pattern', 'CRITICAL');
    return new NextResponse('Access Blocked: Malicious activity detected by Tafaulkom Security Proxy.', { status: 403 });
  }

  // 2. Bot Protection (Targeted at scanners)
  const isApiV2 = pathname.startsWith('/api/v2');
  if (!isApiV2 && BOT_KEYWORDS.some(keyword => userAgent.toLowerCase().includes(keyword))) {
    logThreat(`Bot/Scanner: ${userAgent}`, 'INFO');
    return new NextResponse('Bot Access Reserved for Official Engines.', { status: 403 });
  }

  const response = NextResponse.next();

  // 3. Apply Security Headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Ensure security logic applies to API and sensitive routes
export const config = {
  matcher: [
    '/',
    '/api/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/my-secret-door-67/:path*',
    '/register',
    '/login',
  ],
};
