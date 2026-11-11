// app/page.js (public landing page)
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Simple CRM — Know Every Customer, Close Every Deal',
  description:
    'Simple CRM helps small teams track customers, log interactions, and never lose a lead again. Free to start, no credit card required.',
};

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Simple CRM</p>
        <h1 className={styles.headline}>
          Know every customer. Close every deal.
        </h1>
        <p className={styles.subhead}>
          Simple CRM helps small teams track customers, log interactions, and
          never lose a lead again. No spreadsheets, no sticky notes.
        </p>
        <ul className={styles.features}>
          <li>See every customer and their history in one place</li>
          <li>Log calls, emails, and meetings as they happen</li>
          <li>Built for teams who are done using spreadsheets</li>
        </ul>
        <Link href="/login" className={styles.cta}>
          Sign in to get started
        </Link>
      </div>
    </main>
  );
}
