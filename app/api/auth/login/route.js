import { NextResponse } from 'next/server';
import { API_BASE_URL, AUTH_COOKIE_NAME, decodeJwtIfUsable } from '@/lib/api';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days upper bound

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || 'Login failed' },
        { status: res.status }
      );
    }

    // Backend shape has been seen as both { data: { token, user } } and { token, user }.
    const token = data?.data?.token ?? data?.token;
    const user = data?.data?.user ?? data?.user ?? null;

    const payload = typeof token === 'string' ? decodeJwtIfUsable(token) : null;
    if (!payload) {
      return NextResponse.json(
        { message: 'Login failed: invalid token from server' },
        { status: 502 }
      );
    }

    // Do not let the cookie outlive the JWT itself.
    let maxAge = MAX_AGE_SECONDS;
    if (typeof payload.exp === 'number') {
      maxAge = Math.max(0, Math.min(maxAge, Math.floor(payload.exp - Date.now() / 1000)));
    }

    // Only non-sensitive profile fields go back to the browser.
    const safeUser = user
      ? { name: user.name, email: user.email, role: user.role }
      : null;

    const response = NextResponse.json({
      status: 'success',
      message: 'Logged in successfully',
      user: safeUser,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
