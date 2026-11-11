// app/crm/customers/new/page.js
import Link from 'next/link';
import { customerFormAction } from './action';
import styles from './page.module.css';

export default function NewCustomerPage() {
  return (
    <div>
      <Link href="/crm/customers" className={styles.backLink}>
        &larr; Back to customers
      </Link>
      <form action={customerFormAction} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstName">
            First name *
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={styles.input}
            required
            placeholder="Jane"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={styles.input}
            placeholder="Doe"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={styles.input}
            placeholder="jane@example.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="contactNo">
            Contact number
          </label>
          <input
            id="contactNo"
            name="contactNo"
            type="text"
            className={styles.input}
            placeholder="+65 9123 4567"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="jobTitle">
            Job title
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            className={styles.input}
            placeholder="Engineer"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="yearOfBirth">
            Year of birth
          </label>
          <input
            id="yearOfBirth"
            name="yearOfBirth"
            type="number"
            min="1900"
            max="2020"
            className={styles.input}
            placeholder="1990"
          />
        </div>
        <button type="submit" className={styles.submit}>
          Add customer
        </button>
      </form>
    </div>
  );
}
