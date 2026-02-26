import styles from './register.module.css';
import { RegisterForm } from './RegisterForm';

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <RegisterForm />
    </main>
  );
}

