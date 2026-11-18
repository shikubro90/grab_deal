// Single source of truth for the backend base URL (includes /api/v1).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://grabdeal-server.vercel.app/api/v1';

// Auth hook: the dashboard registers a function that returns the admin token.
// Every request made through apiFetch then carries `Authorization: Bearer <token>`.
let tokenProvider: () => string | null | undefined = () => null;
export function setAuthTokenProvider(fn: () => string | null | undefined) {
  tokenProvider = fn;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const token = tokenProvider();
    const headers = new Headers(fetchOptions.headers);
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Offers
  getOffers: (query?: string) => 
    apiFetch(`/offers${query ? `?${query}` : ''}`),
  
  getOfferById: (id: string) => 
    apiFetch(`/offers/${id}`),
  
  getEndingSoonOffers: () => 
    apiFetch('/offers/ending-soon'),
  
  // Brands
  getBrands: () => 
    apiFetch('/brands'),
  
  getBrandById: (id: string) => 
    apiFetch(`/brands/${id}`),
  
  // Categories
  getCategories: () => 
    apiFetch('/categories'),
  
  // Testimonials
  getTestimonials: () => 
    apiFetch('/testimonials'),
  
  // FAQs
  getFAQs: (category?: string) => 
    apiFetch(`/faqs${category ? `?category=${category}` : ''}`),
};

// ---------------------------------------------------------------------------
// Admin / dashboard helpers
// ---------------------------------------------------------------------------

// Name of the HttpOnly cookie that holds the admin JWT (set by /api/auth/login).
export const AUTH_COOKIE_NAME = 'grabdeal_token';

// Same-origin route handler that reads the HttpOnly cookie server-side and
// forwards the request to API_BASE_URL with `Authorization: Bearer <token>`.
export const ADMIN_PROXY_PATH = '/api/proxy';

/**
 * Dashboard fetch. `endpoint` is relative to API_BASE_URL (no /api/v1 prefix),
 * e.g. adminFetch('/offers/123', { method: 'DELETE' }).
 * Returns the raw Response so callers can read `res.ok` and the backend's
 * `message` field. The browser never sees the token: the proxy attaches it.
 */
export function adminFetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return fetch(`${ADMIN_PROXY_PATH}${path}`, {
    cache: 'no-store',
    ...init,
    credentials: 'same-origin',
  });
}

export interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

function base64UrlDecode(segment: string): string {
  const b64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Decodes a JWT WITHOUT verifying its signature. Returns null when the token
 * is not a well-formed JWT or is expired (`exp` in the past). A token with no
 * `exp` claim is accepted (the cookie's own maxAge still bounds it).
 * Works in Edge, Node and the browser (atob/TextDecoder only).
 */
export function decodeJwtIfUsable(token: string | null | undefined): JwtPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((p) => !/^[A-Za-z0-9_-]+$/.test(p))) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (!header || typeof header !== 'object' || typeof header.alg !== 'string') return null;
    if (header.alg.toLowerCase() === 'none') return null;
    if (!payload || typeof payload !== 'object') return null;
    if (payload.exp !== undefined) {
      if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null;
    }
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
