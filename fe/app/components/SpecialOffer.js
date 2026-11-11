// app/components/SpecialOffer.js
'use client';

import { useState } from 'react';
import styles from './SpecialOffer.module.css';

function discountFor(licences) {
  if (licences >= 20) return 0.25;
  if (licences >= 10) return 0.15;
  if (licences >= 5) return 0.1;
  return 0;
}

export default function SpecialOffer() {
  const [licences, setLicences] = useState(1);
  const discount = discountFor(licences);

  return (
    <section className={styles.card}>
      <div className={styles.copy}>
        <h2>Special offer: buy licences in bulk</h2>
        <p>Discounts apply automatically as your team grows.</p>
      </div>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepButton}
          onClick={() => setLicences(n => Math.max(1, n - 1))}
          aria-label="Decrease licences"
        >
          −
        </button>
        <span className={styles.count}>{licences}</span>
        <button
          type="button"
          className={styles.stepButton}
          onClick={() => setLicences(n => n + 1)}
          aria-label="Increase licences"
        >
          +
        </button>
        <span className={styles.discount}>
          {discount === 0 ? 'No discount yet' : `${discount * 100}% off`}
        </span>
      </div>
    </section>
  );
}