'use client';

import Image from 'next/image';
import Link from 'next/link';
import error404Image from '@/assets/images/404.png';
import styles from './404.module.css';

export default function NotFound404Page() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src={error404Image}
            alt="404 Not Found"
            width={400}
            height={400}
            className={styles.image}
            priority
          />
        </div>

        <h1 className={`${styles.errorCode} ${styles.hennyPennyRegular}`}>404</h1>

        <h2 className={styles.subtitle}>Ối! Bạn bị lạc rồi.</h2>

        <p className={styles.description}>
          Trang này đã đi lạc giữa sa mạc mất rồi.
        </p>

        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.primaryButton}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
