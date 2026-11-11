// app/crm/layout.js
import Sidebar from '../components/Sidebar';
import styles from './layout.module.css';

export default function CrmLayout({ children }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}