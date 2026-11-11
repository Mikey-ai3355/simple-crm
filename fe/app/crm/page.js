// app/crm/page.js (Dashboard)
import styles from './page.module.css';
import { getCustomerStats } from '@/lib/api';

export const metadata = {
  title: 'Dashboard · Simple CRM',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const defaults = {
    totalCustomers: 0,
    totalInteractions: 0,
    customersWithInteractions: 0,
  };

  let stats = defaults;
  try {
    const res = await getCustomerStats();
    if (res.ok) {
      stats = { ...defaults, ...(await res.json()) };
    }
  } catch {
    // Fall back to zeros if the API is unreachable.
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subtitle}>Overview of your workspace</p>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Customers</div>
          <div className={styles.statValue}>{stats.totalCustomers}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Customers with Interactions</div>
          <div className={`${styles.statValue} ${styles.statSuccess}`}>
            {stats.customersWithInteractions}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Interactions</div>
          <div className={`${styles.statValue} ${styles.statMuted}`}>
            {stats.totalInteractions}
          </div>
        </div>
      </div>
    </main>
  );
}
