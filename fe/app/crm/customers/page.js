// app/crm/customers/page.js
import styles from './page.module.css';
import CustomerSearch from './CustomerSearch';
import Link from 'next/link';
import { getCustomers } from '@/lib/api';

export const metadata = {
  title: 'Customers · Simple CRM',
};

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  let customers = [];
  try {
    const res = await getCustomers();
    if (res.ok) {
      const data = await res.json();
      customers = Array.isArray(data) ? data : [];
    }
  } catch {
    // Keep an empty list; the UI shows a friendly empty state.
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Customers</h1>
        <Link href="/crm/customers/new" className={styles.btnPrimaryLink}>
          Add Customer
        </Link>
      </div>
      <CustomerSearch customers={customers} />
    </div>
  );
}
