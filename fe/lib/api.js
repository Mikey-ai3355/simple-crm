// lib/api.js
//
// Server-side client for the Simple CRM API (Spring Boot + JWT).
//
// IMPORTANT: import this ONLY from Server Components and Server Actions.
// It reads the `access_token` cookie via `next/headers` (async) and attaches
// it as an `Authorization: Bearer <token>` header. Do NOT import this into any
// 'use client' module — `next/headers` is server-only.
//
// The API base URL comes from NEXT_PUBLIC_API_URL (set per environment).
// Locally it defaults to http://localhost:8080 (the Spring Boot port).

import { cookies } from 'next/headers';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Read the JWT from the httpOnly `access_token` cookie and build the
// Authorization header. Returns {} when not logged in so the caller gets a
// 401 from the API instead of a client-side crash.
async function authHeaders() {
  const store = await cookies();
  const token = store.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Low-level: returns the raw fetch Response so callers can inspect status and
// parse the body themselves. Throws on network failure only — a 401/404 is
// still a valid Response the caller can handle.
export async function apiFetch(path, { method = 'GET', body } = {}) {
  const url = path.startsWith('http') ? path : API_BASE_URL + path;
  return fetch(url, {
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
    cache: 'no-store',
  });
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
