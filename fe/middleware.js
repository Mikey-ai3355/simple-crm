// middleware.js
import { NextResponse } from 'next/server';

// Next.js calls this function for every request that matches `config.matcher` below,
// before any page.js or layout.js on that route runs.
export function middleware(request) {
  // Read the cookie the login Server Action set. This does not verify the token
  // is genuine, only that the cookie exists, see the caveat earlier in this lesson.
  const accessToken = request.cookies.get('access_token');

  if (!accessToken) {
    // No token: build the /login URL relative to this request, then redirect there
    // instead of letting the original request continue to its destination.
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Access token present: let the request continue to the route it asked for.
  return NextResponse.next();
}

// Restricts which requests middleware() runs for. Without this, it would run on
// every request to the app, including the public homepage and /login itself.
export const config = {
  matcher: ['/crm', '/crm/:path*'],
};