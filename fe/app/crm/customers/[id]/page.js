// app/crm/customers/[id]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }) {
  // Next 15: `params` is an async Promise — must await before reading .id.
  const { id } = await params;

  let customer = null;
  let interactions = [];
  try {
    // apiFetch returns raw Responses — parse them to JSON ourselves.
    const [customerRes, interactionsRes] = await Promise.all([
      apiFetch(`/customers/${id}`),
      apiFetch(`/customers/${id}/interactions`),
    ]);
    if (!customerRes.ok) {
      notFound();
    }
    customer = await customerRes.json().catch(() => null);
    if (interactionsRes.ok) {
      interactions = await interactionsRes.json().catch(() => []);
    }
  } catch {
    notFound();
  }

  if (!customer || customer.id === undefined) {
    notFound();
  }

  if (!Array.isArray(interactions)) {
    interactions = [];
  }

  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');

  return (
    <div className={styles.panel}>
      <Link href="/crm/customers" className={styles.backLink}>
        &larr; Back to customers
      </Link>

      <h2 className={styles.name}>{fullName || 'Unknown customer'}</h2>

      {customer.jobTitle && (
        <p className={styles.company}>
          <Briefcase size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {customer.jobTitle}
        </p>
      )}

      <div className={styles.contactRow}>
        <Mail size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        {customer.email || 'No email on file'}
      </div>
      <div className={styles.contactRow}>
        <Phone size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        {customer.contactNo || 'No contact number on file'}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Details</p>
        <div className={styles.tags}>
          <span className={styles.tag}>
            <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {customer.yearOfBirth ? `Born ${customer.yearOfBirth}` : 'Year of birth not set'}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>Interaction history</p>
        {interactions.length === 0 ? (
          <p className={styles.contactRow}>No interactions recorded yet.</p>
        ) : (
          <ul className={styles.interactionList}>
            {interactions.map(interaction => (
              <li key={interaction.id} className={styles.interactionCard}>
                {interaction.remarks || <em>No notes</em>}
                {interaction.interactionDate && (
                  <div className={styles.interactionMeta}>{interaction.interactionDate}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
