import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeJwtIfUsable } from '@/lib/api';

// Optional server-only secret. When set, HS256 signatures are verified here too.
// It must NOT be a NEXT_PUBLIC_ variable. Without it we can only check that the
// cookie is a well-formed, unexpired JWT; the backend remains the real authority.
const JWT_SECRET = process.env.JWT_SECRET;

function base64UrlToBytes(segment) {
  const b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function verifyHs256(token, secret) {
  try {
    const [h, p, s] = token.split('.');
    const header = JSON.parse(new TextDecoder().decode(base64UrlToBytes(h)));
    if (header.alg !== 'HS256') return false;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    return crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(s),
      new TextEncoder().encode(`${h}.${p}`)
    );
  } catch {
    return false;
  }
}

async function isTokenValid(token) {
  if (!decodeJwtIfUsable(token)) return false;
  if (JWT_SECRET) return verifyHs256(token, JWT_SECRET);
  return true;
}

export async function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isLogin = pathname === '/login';

  const valid = token ? await isTokenValid(token) : false;

  if (isDashboard && !valid) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (token) response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  if (isLogin && valid) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isLogin && token && !valid) {
    const response = NextResponse.next();
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
