import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from './lib/db';

const publicRoutes = ['/login', '/signup', '/'];
const protectedRoutes = ['/feed', '/account', '/bookmarks', '/search'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get('voiceit_session')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  if (isProtectedRoute) {
    // Verify session exists
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const session = await getSessionByToken(sessionToken);
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Middleware session check error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isPublicRoute && sessionToken) {
    try {
      const session = await getSessionByToken(sessionToken);
      if (session && pathname !== '/') {
        return NextResponse.redirect(new URL('/feed', request.url));
      }
    } catch (error) {
      // Continue if session check fails
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
