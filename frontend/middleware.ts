import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that are public and don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/_next',
  '/favicon.ico',
  '/assets',
];

// Middleware function to check if user is authenticated
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow access to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from the request cookie
  const token = request.cookies.get('token')?.value;

  // If trying to access a protected route without a token, redirect to login
  if (!token) {
    // Only redirect if not already on the login page to avoid loops
    if (!pathname.startsWith('/login')) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  // If there is a token, continue to the requested page
  return NextResponse.next();
}

// Config to match all protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
