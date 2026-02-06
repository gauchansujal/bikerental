// proxy.ts  (root level)

import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from './lib/cookies';  // adjust path if needed
export async function proxy(request: NextRequest) {
  console.log('PROXY RAN for:', request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;

  // Protect all routes that start with /user or /admin
  const isProtectedRoute =
    pathname.startsWith('/user') ||
    pathname.startsWith('/admin');

  if (isProtectedRoute) {
    const token = await getAuthToken();

    if (!token) {
      console.log('No token → redirecting to login from:', pathname);
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // optional: remember where they came from
      return NextResponse.redirect(loginUrl);
    }

    // Optional: you can add role check here later
    // const user = await getUserData();
    // if (pathname.startsWith('/admin') && user?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/user/dashboard', request.url));
    // }
  }

  return NextResponse.next();
}