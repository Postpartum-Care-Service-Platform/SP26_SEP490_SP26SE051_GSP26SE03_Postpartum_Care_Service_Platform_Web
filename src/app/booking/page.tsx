import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './booking.module.css';
import { BookingForm } from './BookingForm';

export default function BookingPage() {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.page}`}>
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}
