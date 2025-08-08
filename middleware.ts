import { NextResponse, NextRequest } from 'next/server';

// Domains to gate in production
const PROD_HOSTS = new Set(['servinly.com', 'www.servinly.com']);

// Optional bypass cookie name (set it to view real site in prod)
const BYPASS_COOKIE = 'SERVINLY_PREVIEW_BYPASS';

export function middleware(req: NextRequest) {
  // Only act in production
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (!isProd) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';

  // Allow coming-soon itself, static assets, api routes, next internals
  const passthrough =
    pathname.startsWith('/coming-soon') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|txt|json|xml)$/);

  if (passthrough) return NextResponse.next();

  // Bypass if cookie present
  if (req.cookies.get(BYPASS_COOKIE)?.value === '1') {
    return NextResponse.next();
  }

  // Gate only on our production hosts, and only the homepage
  if (PROD_HOSTS.has(host) && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/coming-soon';
    // Use rewrite to keep URL /; change to redirect if you want URL to show /coming-soon
    return NextResponse.rewrite(url);
    // return NextResponse.redirect(url); // <- uncomment to show /coming-soon in the bar
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt|json|xml)).*)'],
};
