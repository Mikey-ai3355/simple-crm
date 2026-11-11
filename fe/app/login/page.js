// app/login/page.js
import LoginForm from './LoginForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Sign In · Simple CRM',
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <h1 className={styles.heading}>Sign in</h1>
        <p className={styles.lead}>Welcome back to Simple CRM.</p>
        <LoginForm />
      </div>
    </main>
  );
}