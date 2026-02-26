import React, { Suspense } from 'react';

import styles from './verify-email.module.css';
import { VerifyEmailForm } from './VerifyEmailForm';

export default function VerifyEmailPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}

