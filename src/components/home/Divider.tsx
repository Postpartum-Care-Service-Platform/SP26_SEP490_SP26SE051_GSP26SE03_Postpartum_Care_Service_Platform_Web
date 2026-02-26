import Image from 'next/image';
import React from 'react';

import dividerImage from '@/assets/images/home/br-solution.png';

import styles from './Divider.module.css';

export const Divider: React.FC = () => {
  return (
    <div className={styles.divider}>
      <Image
        src={dividerImage}
        alt="Divider trang chủ"
        className={styles.image}
        priority
      />
    </div>
  );
};
