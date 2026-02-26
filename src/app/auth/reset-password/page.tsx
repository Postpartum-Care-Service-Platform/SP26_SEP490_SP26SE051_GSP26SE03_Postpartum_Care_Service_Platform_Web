import styles from './reset-password.module.css';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <main className={styles.page}>
      <ResetPasswordForm />
    </main>
  );
}
