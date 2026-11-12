// lib/api.js
//
// Server-side client for the Simple CRM API (Spring Boot + JWT).
//
// IMPORTANT: import this ONLY from Server Components and Server Actions.
// It reads the `access_token` cookie via `next/headers` (async) and attaches
// it as an `Authorization: Bearer <token>` header. Do NOT import this into any
// 'use client' module — `next/headers` is server-only.
//
// The API base URL comes from the API_BASE_URL environment variable, read at
// RUNTIME (server actions run in the Node runtime). We deliberately do NOT use
// NEXT_PUBLIC_API_URL here: Next.js inlines NEXT_PUBLIC_* values into the
// bundle at BUILD time, so a variable set on Render after the image was built
// would be ignored and the FE would keep calling the build-time default
// (localhost). A plain server-side env var is read live on every request.
// Locally it defaults to http://localhost:8080 (the Spring Boot port).

import { cookies } from 'next/headers';

const API_BASE_URL =
  process.env.API_BASE_URL || 'http://localhost:8080';

// Read the JWT from the httpOnly `access_token` cookie and build the
// Authorization header. Returns {} when not logged in so the caller gets a
// 401 from the API instead of a client-side crash.
async function authHeaders() {
  const store = await cookies();
  const token = store.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// The Render free tier sleeps the API after ~15 min idle; the next request
// triggers a ~60–120s cold start during which the load balancer returns a
// 5xx (502/503/504) instead of a real API answer. Retry those (and network
// failures) a few times with backoff so a single cold start does not surface
// to the user as "incorrect username and password". 4xx responses are real
// API decisions (e.g. a genuine 401) and are returned immediately.
const RETRYABLE = new Set([502, 503, 504, 520, 521, 522, 524]);

async function attemptFetch(url, options) {
  return fetch(url, {
    ...options,
    cache: 'no-store',
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Low-level: returns the raw fetch Response so callers can inspect status and
// parse the body themselves. Throws on network failure only — a 401/404 is
// still a valid Response the caller can handle.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const url = path.startsWith('http') ? path : API_BASE_URL + path;
  const options = {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(await authHeaders()),
    },
    body:
      body !== undefined
        ? typeof body === 'string'
          ? body
          : JSON.stringify(body)
        : undefined,
  };

  // Up to 4 tries total (initial + 3 retries) with backoff. A free-tier
  // cold start takes ~100s and the load balancer gives up at ~50s with a 502,
  // so the total retry window (~100s of backoff + up to ~50s per attempt)
  // comfortably covers one full cold start.
  let lastError;
  for (let i = 0; i < 4; i++) {
    let res;
    try {
      res = await attemptFetch(url, options);
    } catch (err) {
      // Network-level failure (connection reset / timeout during cold start).
      lastError = err;
      await sleep(20000 * (i + 1));
      continue;
    }
    if (RETRYABLE.has(res.status) && i < 3) {
      // Cold-start 5xx from the load balancer — give the API more time.
      // Consume the body so the socket can be reused.
      try { await res.text(); } catch { /* ignore */ }
      await sleep(20000 * (i + 1));
      continue;
    }
    return res;
  }
  throw lastError || new Error('API unreachable after retries');
}

// POST /auth/login  { username, password }  ->  200 { token }  |  401 (no body)
export function loginRequest(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// GET /customers -> array of Customer
export function getCustomers() {
  return apiFetch('/customers');
}

// GET /customers/stats -> { totalCustomers, totalInteractions, customersWithInteractions }
export function getCustomerStats() {
  return apiFetch('/customers/stats');
}
