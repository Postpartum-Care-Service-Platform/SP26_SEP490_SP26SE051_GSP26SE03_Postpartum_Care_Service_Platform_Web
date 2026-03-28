'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlurredIconTransition } from '@/components/ui/BlurredIconTransition';
import styles from './package.module.css';

const PACKAGES = [
  {
    id: 'luxury-experience',
    name: 'Gói Luxury Experience',
    price: '35.000.000',
    description: 'Trải nghiệm hồi phục thượng lưu với đầy đủ dịch vụ chăm sóc cao cấp.',
    features: [
      'Phòng Suite đơn cao cấp view sân vườn',
      'Chăm sóc y tế 24/7 cho mẹ và bé',
      'Thực đơn dinh dưỡng 5 bữa/ngày',
      'Liệu trình massage thư giãn mỗi ngày',
      'Dịch vụ giặt là cá nhân cao cấp',
      'Tư vấn tâm lý và dinh dưỡng chuyên sâu'
    ],
    featured: true
  },
  {
    id: 'comfort-recovery',
    name: 'Gói Comfort Recovery',
    price: '25.000.000',
    description: 'Sự kết hợp hoàn hảo giữa tiện nghi hiện đại và chăm sóc hồi phục cơ bản.',
    features: [
      'Phòng đơn Superior đầy đủ tiện nghi',
      'Chăm sóc y tế 24/7',
      'Thực đơn dinh dưỡng 5 bữa/ngày',
      'Liệu trình tắm bé và massage mẹ (3 buổi)',
      'Tham gia các lớp học kỹ năng làm mẹ',
      'Hỗ trợ sau cư trú (1 tháng)'
    ],
    featured: false
  },
  {
    id: 'essential-care',
    name: 'Gói Essential Care',
    price: '18.000.000',
    description: 'Gói dịch vụ thiết yếu tập trung vào chất lượng chăm sóc chuyên môn.',
    features: [
      'Phòng đôi chuẩn y tế hiện đại',
      'Chăm sóc y tế 24/7 cho mẹ và bé',
      'Thực đơn dinh dưỡng 3 bữa chính',
      'Tư vấn nuôi con bằng sữa mẹ',
      'Bác sĩ nhi thăm khám hàng ngày',
      'Quà tặng chào mừng bé yêu'
    ],
    featured: false
  }
];

export default function PackagePage() {
  return (
    <div className={styles.packagePage}>
      <Header />

      <main>
        {/* Full Video Hero Section */}
        <section className={styles.hero}>
          <div className={styles.videoContainer}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className={styles.videoElement}
            >
              <source src="/thejoyfulnest/package/241203-TJN-Brand-Vid-Draft-1080-best.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className={styles.heroOverlay}>
              <div className={styles.brandIconWrapper}>
                <BlurredIconTransition
                  iconA="/thejoyfulnest/package/icon.svg"
                  iconB="/thejoyfulnest/package/icon-2.svg"
                  duration={5.0}
                  mode="loop"
                  size={80}
                  iconClassName={styles.brandIcon}
                  baseFilter="brightness(0) invert(1)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className={styles.introSection}>
          <h1 className={styles.introTitle}>
            Các chương trình chăm sóc toàn diện sau sinh và bảng giá
          </h1>
          
          <p className={styles.introHighlight}>
            Bốn tuần đầu sau sinh là khoảng thời gian đặc biệt và mong manh.
          </p>

          <div className={styles.introEmptySpace} />

          <p className={styles.introParagraph}>
            Cơ thể không còn mang thai, nhưng vẫn cần được chăm sóc sâu sắc. Khi em bé chào đời, mẹ cũng bắt đầu hành trình mới – làm mẹ.
          </p>

          <p className={styles.introShortDesc}>
            The Joyful Nest là trung tâm ở cữ 5 sao đầu tiên tại Việt Nam – được tạo ra để đồng hành cùng mẹ và em bé trong những ngày đầu sau sinh, với dịch vụ chăm sóc bé chuyên sâu, bữa ăn phục hồi dinh dưỡng và sự chăm sóc tận tâm, dịu dàng như mẹ xứng đáng được nhận.
          </p>

          <p className={styles.introParagraph}>
            Giai đoạn này xứng đáng được trân trọng, không vội vàng, không bỏ lỡ. Mẹ cần sự chậm rãi, nhẹ nhàng và nâng đỡ. Mọi nhịp sống trong mẹ khẽ đổi khác. Cảm xúc trở nên nhạy hơn. Và cơ thể bắt đầu quá trình phục hồi – chậm rãi, nhưng đầy cảm xúc.
          </p>

          <p className={styles.introShortDesc}>
            Tại đây, mẹ được hồi phục, bé được chăm sóc và hành trình làm mẹ bắt đầu trong sự dịu dàng và yêu thương
          </p>

          <div className={styles.introRightGroup}>
            <p className={styles.introParagraph}>
              Trong nhiều nền văn hoá, khoảng thời gian ở cử một tháng này luôn được gìn giữ. Mẹ được chăm sóc, không bị thúc ép. Được nuôi dưỡng, không bị lãng quên. Được nghỉ ngơi, để gắn kết trọn vẹn với con.
            </p>
            <p className={styles.introParagraph}>
              Tại The Joyful Nest, chúng tôi gìn giữ tinh hoa của truyền thống chăm sóc mẹ và bé, kết hợp cùng y khoa hiện đại để tạo nên một hành trình ở cử an yên và trọn vẹn. Dù mẹ cần vài ngày để nghỉ ngơi nhẹ nhàng hay một kỳ nghỉ trọn vẹn để phục hồi chuyên sâu, các gói 8, 14 và 28 ngày tại The Joyful Nest luôn sẵn sàng đồng hành và nâng niu mẹ bằng tất cả sự chăm sóc và thấu cảm.
            </p>
          </div>
        </section>

        {/* Packages Grid Section */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Sự Lựa Chọn Hoàn Hảo</span>
            <h2 className={styles.sectionTitle}>Các Gói Chăm Sóc Sau Sinh</h2>
            <p className="max-w-2xl mx-auto text-gray-500">
              Mỗi gói dịch vụ đều được thiết kế tỉ mỉ để đáp ứng nhu cầu phục hồi sức khỏe của mẹ và sự phát triển ban đầu của bé yêu.
            </p>
          </div>

          <div className={styles.grid}>
            {PACKAGES.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`${styles.packageCard} ${pkg.featured ? styles.featuredCard : ''}`}
              >
                {pkg.featured && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl uppercase tracking-wider">
                    Phổ Biến Nhất
                  </div>
                )}

                <div className={styles.cardHeader}>
                  <h3 className={styles.packageName}>{pkg.name}</h3>
                  <div className={styles.packagePrice}>
                    {pkg.price} <span className={styles.priceSuffix}>VNĐ</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <ul className={styles.featuresList}>
                  {pkg.features.map((feature, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.featureIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/lien-he?package=${pkg.id}`}
                  className={`${styles.ctaButton} ${pkg.featured ? styles.featured : ''}`}
                >
                  Đăng Ký Tư Vấn
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
