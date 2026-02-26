import styles from './booking.module.css';
import { BookingForm } from './BookingForm';

export default function BookingPage() {
  return (
    <main className={styles.page}>
      <BookingForm />
    </main>
  );
}
