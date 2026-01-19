'use client';

import Image from 'next/image';
import Link from 'next/link';
import error500Image from '@/assets/images/500.png';
import styles from './500.module.css';

export default function Error500Page() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src={error500Image}
            alt="Lỗi 500"
            width={400}
            height={400}
            className={styles.image}
            priority
          />
        </div>

        <h1 className={`${styles.errorCode} ${styles.hennyPennyRegular}`}>500</h1>

        <h2 className={`${styles.subtitle} ${styles.hennyPennyRegular}`}>Ối! Máy chủ đang nghỉ một chút.</h2>

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
            onClick={() => window.location.reload()}
            className={styles.secondaryButton}
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}
