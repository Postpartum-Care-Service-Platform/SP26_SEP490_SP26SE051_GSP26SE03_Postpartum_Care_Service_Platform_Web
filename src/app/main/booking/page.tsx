import { BookingForm } from './BookingForm';

import styles from './booking.module.css';

export default function BookingPage() {
  return (
    <main className={styles.page}>
      <BookingForm />
    </main>
  );
}
