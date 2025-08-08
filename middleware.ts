import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Production-only "Coming Soon" gate.
 *
 * Behavior:
 *  - If NEXT_PUBLIC_MAINTENANCE==='1' (production env), rewrite '/' to '/coming-soon' on servinly.com.
 *  - Otherwise, still rewrite '/' to '/coming-soon' on servinly.com by default.
 *  - Never affects preview/staging*.vercel.app deployments.
 *
 * Change `rewrite` to `redirect` if you want the URL bar to show /coming-soon.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { hostname, pathname } = url;

  const isProdDomain =
    hostname === 'servinly.com' || hostname === 'www.servinly.com';

  const maintenanceOn = process.env.NEXT_PUBLIC_MAINTENANCE === '1';

  if (isProdDomain && pathname === '/') {
    if (maintenanceOn || process.env.NEXT_PUBLIC_MAINTENANCE === undefined) {
      const to = url.clone();
      to.pathname = '/coming-soon';
      return NextResponse.rewrite(to);
      // return NextResponse.redirect(to); // <- use redirect if you prefer URL to change
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
