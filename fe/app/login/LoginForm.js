// app/login/LoginForm.js
'use client';

import { useActionState } from 'react';
import { login } from './actions';
import styles from './page.module.css';

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction}>
      {state?.error && <div className={styles.error}>{state.error}</div>}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className={styles.input}
          required
          autoComplete="username"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          required
          autoComplete="current-password"
        />
      </div>
      <button type="submit" className={styles.submit}>
        Sign in
      </button>
    </form>
  );
}
