// app/crm/customers/CustomerSearch.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import styles from './CustomerSearch.module.css';

function initials(firstName, lastName) {
  const first = (firstName || '?').trim();
  const last = (lastName || '').trim();
  return (first[0] + last[0]).toUpperCase();
}

export default function CustomerSearch({ customers }) {
  const [query, setQuery] = useState('');

  const filtered = customers.filter(c => {
    const fullName = `${c.firstName} ${c.lastName || ''}`.toLowerCase();
    const job = (c.jobTitle || '').toLowerCase();
    const q = query.toLowerCase();
    return fullName.includes(q) || job.includes(q);
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or job title..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className={styles.input}
      />
      {filtered.length === 0 ? (
        <p className={styles.empty}>No customers match your search.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(c => (
            <Link key={c.id} href={`/crm/customers/${c.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{initials(c.firstName, c.lastName)}</div>
                {c.jobTitle && (
                  <span className={`${styles.badge} ${styles.badgeActive}`}>{c.jobTitle}</span>
                )}
              </div>
              <p className={styles.name}>{c.firstName} {c.lastName || ''}</p>
              <div className={styles.meta}>
                <div className={styles.metaRow}>
                  <Mail size={14} />
                  {c.email || 'No email'}
                </div>
                {c.contactNo && (
                  <div className={styles.metaRow}>
                    <Phone size={14} />
                    {c.contactNo}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
