import { NextRequest, NextResponse } from 'next/server';

// List of paths that are public and don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
];

// Middleware function to check if user is authenticated
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Return early if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the token from the request cookie
  const token = request.cookies.get('token')?.value;

  // If there is no token, redirect to the login page
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If there is a token, continue to the requested page
  return NextResponse.next();
}

// Config to match all protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Public paths
     * - API routes that don't require auth
     * - Static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
