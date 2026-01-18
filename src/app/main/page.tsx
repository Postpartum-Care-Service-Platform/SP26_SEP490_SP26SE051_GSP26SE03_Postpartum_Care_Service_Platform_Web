import React from 'react';

import { Divider } from '@/components/home/Divider';
import { GallerySection } from '@/components/home/GallerySection';
import { IntroductionSection } from '@/components/home/IntroductionSection';
import { PackagesSection } from '@/components/home/PackagesSection';
import { VideoBanner } from '@/components/home/VideoBanner';

import styles from './home.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Banner video với autoplay */}
      <VideoBanner
        videoSrc="/herobanner.mp4"
        title="Vietnam's First 5-Star Postpartum Sanctuary"
        subtitle="Nơi trí tuệ cổ xưa hòa quyện với sự sang trọng hiện đại, tạo nên một thiên đường yên bình cho những ngày đầu làm mẹ của bạn"
      />

      {/* Gallery - Những khoảng khắc gia đình */}
      <GallerySection />

      {/* Divider */}
      <Divider />

      {/* Phần giới thiệu với hình ảnh không gian */}
      <IntroductionSection />

      {/* Phần hiển thị các gói dịch vụ */}
      <PackagesSection />
    </main>
  );
}

