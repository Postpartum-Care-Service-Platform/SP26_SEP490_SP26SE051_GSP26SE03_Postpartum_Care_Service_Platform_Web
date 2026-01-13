import React, { Suspense } from 'react';

import { VerifyEmailForm } from './VerifyEmailForm';
import styles from './verify-email.module.css';

export default function VerifyEmailPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}

