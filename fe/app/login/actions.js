// app/login/actions.js
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginRequest } from '@/lib/api';

// Server Action. `previousState` is unused (kept for useActionState signature).
export async function login(_previousState, formData) {
  const username = (formData.get('username') || '').toString().trim();
  const password = (formData.get('password') || '').toString();

  if (!username || !password) {
    return { error: 'Enter your username and password.' };
  }

  let res;
  try {
    res = await loginRequest(username, password);
  } catch {
    return {
      error:
        'Could not reach the CRM API. Check NEXT_PUBLIC_API_URL in the environment.',
    };
  }

  if (!res.ok) {
    if (res.status === 401) {
      return { error: 'Incorrect username or password.' };
    }
    return {
      error:
        'Could not reach the CRM API (HTTP ' + res.status + '). The API may still be waking up — please try again in a moment.',
    };
  }

  let token;
  try {
    const payload = await res.json();
    token = payload && payload.token;
  } catch {
    token = undefined;
  }

  if (!token) {
    return { error: 'Login succeeded but the API returned no token.' };
  }

  const store = await cookies();
  store.set('access_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour — matches the API's JWT expiry
  });

  redirect('/crm');
}
