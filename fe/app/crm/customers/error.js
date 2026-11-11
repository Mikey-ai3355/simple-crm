// app/crm/customers/error.js
'use client';

export default function CustomersError({ error, reset }) {
  return (
    <main>
      <p>Something went wrong loading customers.</p>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}