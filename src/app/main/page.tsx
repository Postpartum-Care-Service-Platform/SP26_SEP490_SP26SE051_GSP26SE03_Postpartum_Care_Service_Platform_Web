import React from 'react';

import { WelcomeSection } from './components/WelcomeSection';
import styles from './home.module.css';

export default function HomePage() {
  return (
    <main>
      <div className={styles.rowHeader}>
        <div className={styles.columnContent}>
          <h1 className={styles.title}>Vietnam's First 5-Star Postpartum Sanctuary</h1>
          <p className={styles.description}>
            Where timeless wisdom blends with modern luxury, creating a serene haven for your early days of
            motherhood. At The Joyful Nest, each detail is lovingly crafted.
          </p>
        </div>
      </div>
      <WelcomeSection />
    </main>
  );
}

