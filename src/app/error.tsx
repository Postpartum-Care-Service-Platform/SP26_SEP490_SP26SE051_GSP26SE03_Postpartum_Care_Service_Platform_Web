'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import error500Image from '@/assets/images/500.png';

import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src={error500Image}
            alt="Lỗi"
            width={400}
            height={400}
            className={styles.image}
            priority
          />
        </div>

        <h1 className={`${styles.errorCode}`}>Lỗi</h1>

        <h2 className={`${styles.subtitle}`}>Ối! Có lỗi xảy ra trong quá trình xử lý.</h2>

        <p className={styles.description}>
          Đừng lo, đội ngũ của chúng tôi đang khắc phục sự cố này.
          Bạn có thể thử làm mới trang hoặc quay về trang chủ.
        </p>

        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.primaryButton}>
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => reset()}
            className={styles.secondaryButton}
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}
