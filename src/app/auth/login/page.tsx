import styles from './login.module.css';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  );
}
