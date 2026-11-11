// app/crm/customers/new/action.js
'use server';

import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export async function customerFormAction(formData) {
  const firstName = (formData.get('firstName') || '').toString().trim();
  const lastName = (formData.get('lastName') || '').toString().trim() || null;
  const email = (formData.get('email') || '').toString().trim() || null;
  const contactNo = (formData.get('contactNo') || '').toString().trim() || null;
  const jobTitle = (formData.get('jobTitle') || '').toString().trim() || null;
  const yearOfBirth = parseInt(formData.get('yearOfBirth') || '', 10) || 0;

  if (!firstName) {
    throw new Error('First name is required');
  }

  const res = await apiFetch('/customers', {
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      contactNo,
      jobTitle,
      yearOfBirth,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail || `Failed to add customer (HTTP ${res.status})`);
  }

  const created = await res.json().catch(() => null);
  redirect(created?.id ? `/crm/customers/${created.id}` : '/crm/customers');
}
