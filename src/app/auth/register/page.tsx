import { RegisterForm } from './RegisterForm';

import styles from './register.module.css';

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <RegisterForm />
    </main>
  );
}

