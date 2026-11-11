// app/components/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

function navItemClass(pathname, href, exact = false) {
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/');
  return isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className={styles.logoText}>Simple CRM</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>Workspace</div>
        <Link href="/crm" className={navItemClass(pathname, '/crm', true)}>
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </Link>
        <Link href="/crm/customers" className={navItemClass(pathname, '/crm/customers')}>
          <Users size={17} />
          <span>Customers</span>
        </Link>
      </nav>

      <div className={styles.foot}>
        <button className={styles.signOutBtn} title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}