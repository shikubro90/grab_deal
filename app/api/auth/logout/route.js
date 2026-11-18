import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/api';

export async function POST() {
  const response = NextResponse.json({
    status: 'success',
    message: 'Logged out successfully',
  });

  // Same attributes as /api/auth/login so the browser replaces the cookie.
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
