import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // Bypass all gating when NODE_ENV !== 'production'
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }
  
  // PRODUCTION DOMAINS - FORCE COMING SOON
  if (hostname === 'servinly.com' || hostname === 'www.servinly.com') {
    // Only allow coming-soon and essential assets
    if (pathname === '/coming-soon' || 
        pathname.startsWith('/_next') || 
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname === '/') {
      return NextResponse.next();
    }
    
    // Redirect ALL other paths to coming-soon
    return NextResponse.redirect(new URL('/coming-soon', request.url));
  }
  
  // Test environment logic - gate by hostname (not port)
  if (hostname === 'test.servinly.com') {
    // Allow access to test-gate and static assets
    if (pathname === '/test-gate' || 
        pathname.startsWith('/_next') || 
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname === '/') {
      return NextResponse.next();
    }

    // Check if user has test access
    const testAccess = request.cookies.get('testAccess')?.value;
    
    if (!testAccess || testAccess !== 'granted') {
      // Redirect to test gate if no access
      return NextResponse.redirect(new URL('/test-gate', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
