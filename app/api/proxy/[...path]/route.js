import { NextResponse } from 'next/server';
import { API_BASE_URL, AUTH_COOKIE_NAME, decodeJwtIfUsable } from '@/lib/api';

// Admin API proxy for the dashboard.
// The admin JWT lives in an HttpOnly cookie, so browser code cannot read it.
// Dashboard pages call /api/proxy/<endpoint>; this handler reads the cookie
// server-side and forwards the request to API_BASE_URL/<endpoint> with
// `Authorization: Bearer <token>`.

export const dynamic = 'force-dynamic';

// Only these top-level backend resources may be reached through the proxy.
const ALLOWED_RESOURCES = new Set([
  'offers',
  'categories',
  'brands',
  'banner',
  'reviews',
  'upload',
]);

// Request headers worth forwarding to the backend.
const FORWARD_REQUEST_HEADERS = ['content-type', 'accept'];

function json(status, message) {
  return NextResponse.json({ message }, { status });
}

function isSameOrigin(req) {
  // Browser-set header that page scripts cannot forge; does not depend on the
  // reverse proxy forwarding the Host header correctly.
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite === 'same-origin') return true;
  if (fetchSite === 'cross-site' || fetchSite === 'same-site') return false;

  const origin = req.headers.get('origin');
  // Same-origin fetch() for non-GET requests always sends Origin in modern
  // browsers; a missing Origin is treated as same-origin (non-browser clients
  // still need the cookie).
  if (!origin) return true;
  const forwarded = req.headers.get('x-forwarded-host');
  const host = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function handle(req, { params }) {
  const { path = [] } = await params;

  if (
    path.length === 0 ||
    !ALLOWED_RESOURCES.has(path[0]) ||
    path.some((seg) => !seg || seg === '.' || seg === '..')
  ) {
    return json(404, 'Not found');
  }

  const method = req.method.toUpperCase();
  const isWrite = method !== 'GET' && method !== 'HEAD';

  // CSRF defence in depth (SameSite=Lax already blocks cross-site writes).
  if (isWrite && !isSameOrigin(req)) {
    return json(403, 'Forbidden');
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!decodeJwtIfUsable(token)) {
    return json(401, 'Not authenticated. Please log in again.');
  }

  const target = `${API_BASE_URL}/${path.map(encodeURIComponent).join('/')}${req.nextUrl.search}`;

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('Authorization', `Bearer ${token}`);

  // Raw body keeps multipart boundaries (image uploads) and JSON intact.
  let body;
  if (isWrite) {
    const buf = await req.arrayBuffer();
    if (buf.byteLength > 0) body = buf;
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: 'no-store',
      redirect: 'manual',
    });
  } catch {
    return json(502, 'Could not reach the API server.');
  }

  const resHeaders = new Headers();
  const contentType = upstream.headers.get('content-type');
  if (contentType) resHeaders.set('content-type', contentType);
  resHeaders.set('cache-control', 'no-store');

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
