'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { VideoBanner } from '@/components/home/VideoBanner';
import { LazySection } from '@/components/home/LazySection';

import styles from './main/home.module.css';

// Dynamic import các section để lazy load code splitting
const GallerySection = dynamic(() => import('@/components/home/GallerySection').then((mod) => ({ default: mod.GallerySection })), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

const Divider = dynamic(() => import('@/components/home/Divider').then((mod) => ({ default: mod.Divider })), {
  loading: () => <div style={{ minHeight: '100px' }} />,
});

const IntroductionSection = dynamic(() => import('@/components/home/IntroductionSection').then((mod) => ({ default: mod.IntroductionSection })), {
  loading: () => <div style={{ minHeight: '600px' }} />,
});

const PackagesSection = dynamic(() => import('@/components/home/PackagesSection').then((mod) => ({ default: mod.PackagesSection })), {
  loading: () => <div style={{ minHeight: '500px' }} />,
});

// Trang chủ tại route "/"
export default function HomePage() {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Banner video với autoplay - Load ngay vì là phần đầu tiên */}
        <VideoBanner
          videoSrc="/herobanner.mp4"
          title="Vietnam's First 5-Star Postpartum Sanctuary"
          subtitle="Nơi trí tuệ cổ xưa hòa quyện với sự sang trọng hiện đại, tạo nên một thiên đường yên bình cho những ngày đầu làm mẹ của bạn"
        />

        {/* Gallery - Lazy load khi scroll tới */}
        <LazySection rootMargin="150px">
          <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <GallerySection />
          </Suspense>
        </LazySection>

        {/* Divider - Lazy load khi scroll tới */}
        <LazySection rootMargin="100px">
          <Suspense fallback={<div style={{ minHeight: '100px' }} />}>
            <Divider />
          </Suspense>
        </LazySection>

        {/* Phần giới thiệu với hình ảnh không gian - Lazy load khi scroll tới */}
        <LazySection rootMargin="150px">
          <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
            <IntroductionSection />
          </Suspense>
        </LazySection>

        {/* Phần hiển thị các gói dịch vụ - Lazy load khi scroll tới */}
        <LazySection rootMargin="150px">
          <Suspense fallback={<div style={{ minHeight: '500px' }} />}>
            <PackagesSection />
          </Suspense>
        </LazySection>
      </main>
      <Footer />
    </div>
  );
}
