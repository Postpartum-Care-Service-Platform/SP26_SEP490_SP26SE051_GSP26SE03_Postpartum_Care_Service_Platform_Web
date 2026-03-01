'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Heart,
  Stethoscope,
  Baby,
  Activity,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Import images
import babyImage from '@/assets/images/gallery/baby.webp';
import momentImage from '@/assets/images/gallery/moment.avif';
import roomImage from '@/assets/images/gallery/room.jpg';
import foodImage from '@/assets/images/gallery/food.avif';

import styles from './suc-khoe.module.css';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function SucKhoePage() {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.gradientOrb1} />
            <div className={styles.gradientOrb2} />
            <div className={styles.gradientOrb3} />
            <div className={styles.gridPattern} />
          </div>

          <div className={styles.heroContent}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className={styles.heroText}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className={styles.heroBadge}
              >
                <Heart className={styles.badgeIcon} />
                Chăm Sóc Sức Khỏe Toàn Diện
              </motion.div>

              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine1}>Sức Khỏe</span>
                <span className={styles.titleLine2}>
                  Mẹ & Bé
                  <span className={styles.heroTitleAccent}>.</span>
                </span>
              </h1>

              <div className={styles.titleUnderline} />

              <p className={styles.heroSubtitle}>
                Chăm sóc y tế chuyên nghiệp 24/7 với đội ngũ bác sĩ giàu kinh nghiệm
              </p>

              <p className={styles.heroDescription}>
                Tại The Joyful Nest, sức khỏe của mẹ và bé là ưu tiên hàng đầu. Chúng tôi cung cấp
                dịch vụ chăm sóc y tế toàn diện, từ khám sức khỏe định kỳ đến hỗ trợ khẩn cấp, đảm bảo
                mẹ và bé luôn được theo dõi và chăm sóc tốt nhất.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Section - Dịch vụ chăm sóc sức khỏe */}
        <section className={styles.servicesSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.servicesHeader}
            >
              <div className={styles.sectionLabel}>Dịch Vụ Y Tế</div>
              <h2 className={styles.sectionTitle}>Chăm Sóc Sức Khỏe Chuyên Nghiệp</h2>
              <p className={styles.sectionDescription}>
                Hệ thống dịch vụ y tế hoàn chỉnh được thiết kế riêng cho mẹ và bé sau sinh
              </p>
            </motion.div>

            <div className={styles.servicesWrapper}>
              {[
                {
                  icon: Stethoscope,
                  title: 'Khám Sức Khỏe Định Kỳ',
                  description:
                    'Khám sức khỏe hàng ngày cho mẹ và bé bởi đội ngũ bác sĩ sản phụ khoa và nhi khoa giàu kinh nghiệm.',
                  features: [
                    'Khám sức khỏe mẹ hàng ngày',
                    'Theo dõi sức khỏe bé 24/7',
                    'Đánh giá và tư vấn dinh dưỡng',
                    'Theo dõi vết mổ/vết thương',
                  ],
                  image: babyImage,
                  color: '#fa8314',
                  number: '01',
                },
                {
                  icon: Activity,
                  title: 'Theo Dõi Sinh Hiệu',
                  description:
                    'Theo dõi liên tục các chỉ số sinh hiệu quan trọng của mẹ và bé để phát hiện sớm các vấn đề bất thường.',
                  features: [
                    'Đo huyết áp, nhịp tim',
                    'Theo dõi nhiệt độ cơ thể',
                    'Kiểm tra cân nặng',
                    'Ghi nhận và phân tích dữ liệu',
                  ],
                  image: momentImage,
                  color: '#4EC5AD',
                  number: '02',
                },
                {
                  icon: Baby,
                  title: 'Chăm Sóc Bé Sơ Sinh',
                  description:
                    'Hướng dẫn và hỗ trợ chăm sóc bé sơ sinh từ những ngày đầu tiên, đảm bảo bé phát triển khỏe mạnh.',
                  features: [
                    'Hướng dẫn cho bú đúng cách',
                    'Chăm sóc rốn và da',
                    'Theo dõi vàng da',
                    'Tư vấn giấc ngủ và phát triển',
                  ],
                  image: roomImage,
                  color: '#A47BC8',
                  number: '03',
                },
                {
                  icon: Heart,
                  title: 'Hỗ Trợ Tâm Lý',
                  description:
                    'Tư vấn và hỗ trợ tâm lý cho mẹ trong giai đoạn hậu sản, giúp mẹ vượt qua những khó khăn ban đầu.',
                  features: [
                    'Tư vấn tâm lý hậu sản',
                    'Hỗ trợ trầm cảm sau sinh',
                    'Chia sẻ kinh nghiệm làm mẹ',
                    'Hoạt động thư giãn và giải trí',
                  ],
                  image: foodImage,
                  color: '#FD6161',
                  number: '04',
                },
              ].map((service, index) => {
                const IconComponent = service.icon;
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={fadeInUp}
                    className={`${styles.serviceCard} ${isEven ? styles.serviceCardLeft : styles.serviceCardRight}`}
                    style={{ '--service-color': service.color } as React.CSSProperties}
                  >
                    <div className={styles.serviceCardInner}>
                      {/* Number Badge */}
                      <div className={styles.serviceNumber}>{service.number}</div>

                      {/* Image Section */}
                      <div className={styles.serviceImageSection}>
                        <div className={styles.serviceImageWrapper}>
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className={styles.serviceImage}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                          />
                          <div className={styles.serviceImageOverlay} />
                          <div className={styles.serviceImageGradient} />
                        </div>
                        {/* Floating Icon */}
                        <div className={styles.serviceFloatingIcon}>
                          <div className={styles.serviceIconWrapper}>
                            <IconComponent className={styles.serviceIcon} />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className={styles.serviceContentSection}>
                        <div className={styles.serviceContentHeader}>
                          <div className={styles.serviceIconBadge}>
                            <IconComponent className={styles.serviceIconSmall} />
                          </div>
                          <h3 className={styles.serviceTitle}>{service.title}</h3>
                        </div>
                        <p className={styles.serviceDescription}>{service.description}</p>
                        <ul className={styles.serviceFeatures}>
                          {service.features.map((feature, idx) => (
                            <li key={idx}>
                              <div className={styles.featureDot} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className={styles.serviceFooter}>
                          <div className={styles.serviceAccentLine} />
                          <span className={styles.serviceLearnMore}>Tìm hiểu thêm</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section - Quy trình chăm sóc */}
        <section className={styles.processSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.processHeader}
            >
              <div className={styles.sectionLabel}>Quy Trình</div>
              <h2 className={styles.sectionTitle}>Quy Trình Chăm Sóc Sức Khỏe</h2>
              <p className={styles.sectionDescription}>
                Một quy trình khoa học và chuyên nghiệp được thiết kế để đảm bảo sức khỏe tối ưu cho
                mẹ và bé
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className={styles.processTimeline}
            >
              {[
                {
                  step: '01',
                  title: 'Đánh Giá Ban Đầu',
                  description:
                    'Bác sĩ tiến hành khám tổng quát và đánh giá tình trạng sức khỏe của mẹ và bé ngay khi nhập viện.',
                  icon: Stethoscope,
                },
                {
                  step: '02',
                  title: 'Lập Kế Hoạch Chăm Sóc',
                  description:
                    'Xây dựng kế hoạch chăm sóc cá nhân hóa dựa trên tình trạng sức khỏe và nhu cầu cụ thể.',
                  icon: Activity,
                },
                {
                  step: '03',
                  title: 'Theo Dõi Hàng Ngày',
                  description:
                    'Khám và theo dõi sức khỏe hàng ngày, ghi nhận các chỉ số và điều chỉnh kế hoạch khi cần thiết.',
                  icon: Clock,
                },
                {
                  step: '04',
                  title: 'Tư Vấn & Hướng Dẫn',
                  description:
                    'Tư vấn về dinh dưỡng, chăm sóc bé và hỗ trợ tâm lý để mẹ tự tin chăm sóc bé khi về nhà.',
                  icon: Users,
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div key={index} variants={fadeInUp} className={styles.processStep}>
                    <div className={styles.processStepNumber}>{item.step}</div>
                    <div className={styles.processStepIcon}>
                      <IconComponent className={styles.processIcon} />
                    </div>
                    <h3 className={styles.processStepTitle}>{item.title}</h3>
                    <p className={styles.processStepDescription}>{item.description}</p>
                    {index < 3 && <div className={styles.processConnector} />}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Team Section - Đội ngũ chuyên gia */}
        <section className={styles.teamSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.teamHeader}
            >
              <div className={styles.sectionLabel}>Đội Ngũ</div>
              <h2 className={styles.sectionTitle}>Đội Ngũ Chuyên Gia Y Tế</h2>
              <p className={styles.sectionDescription}>
                Đội ngũ bác sĩ và y tá được đào tạo chuyên sâu, giàu kinh nghiệm và luôn tận tâm
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className={styles.teamGrid}
            >
              {[
                {
                  icon: Stethoscope,
                  title: 'Bác Sĩ Sản Phụ Khoa',
                  description:
                    'Đội ngũ bác sĩ chuyên khoa với nhiều năm kinh nghiệm trong chăm sóc sức khỏe mẹ sau sinh.',
                  color: '#fa8314',
                },
                {
                  icon: Baby,
                  title: 'Bác Sĩ Nhi Khoa',
                  description:
                    'Chuyên gia về chăm sóc sức khỏe trẻ sơ sinh, đảm bảo bé phát triển khỏe mạnh.',
                  color: '#4EC5AD',
                },
                {
                  icon: Users,
                  title: 'Y Tá & Điều Dưỡng',
                  description:
                    'Nhân viên y tế được đào tạo chuyên sâu, luôn sẵn sàng hỗ trợ mẹ và bé 24/7.',
                  color: '#A47BC8',
                },
                {
                  icon: Heart,
                  title: 'Chuyên Gia Tâm Lý',
                  description:
                    'Tư vấn và hỗ trợ tâm lý cho mẹ trong giai đoạn hậu sản quan trọng.',
                  color: '#FD6161',
                },
              ].map((member, index) => {
                const IconComponent = member.icon;
                return (
                  <motion.div key={index} variants={fadeInUp} className={styles.teamCard}>
                    <div className={styles.teamIconWrapper} style={{ '--color': member.color } as React.CSSProperties}>
                      <IconComponent className={styles.teamIcon} />
                    </div>
                    <h3 className={styles.teamTitle}>{member.title}</h3>
                    <p className={styles.teamDescription}>{member.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Commitment Section - Cam kết về sức khỏe */}
        <section className={styles.commitmentSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.commitmentHeader}
            >
              <div className={styles.sectionLabel}>Cam Kết</div>
              <h2 className={styles.sectionTitle}>Cam Kết Về Sức Khỏe</h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className={styles.commitmentGrid}
            >
              {[
                {
                  icon: Shield,
                  title: 'An Toàn Tuyệt Đối',
                  description:
                    'Mọi quy trình y tế đều tuân thủ nghiêm ngặt các tiêu chuẩn an toàn và vệ sinh.',
                },
                {
                  icon: Clock,
                  title: 'Hỗ Trợ 24/7',
                  description:
                    'Đội ngũ y tế luôn sẵn sàng hỗ trợ mẹ và bé mọi lúc, kể cả trong trường hợp khẩn cấp.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Chuyên Nghiệp',
                  description:
                    'Đội ngũ được đào tạo bài bản, giàu kinh nghiệm và luôn cập nhật kiến thức mới nhất.',
                },
                {
                  icon: Heart,
                  title: 'Tận Tâm',
                  description:
                    'Chúng tôi không chỉ chăm sóc sức khỏe mà còn quan tâm đến cảm xúc và tinh thần của mẹ.',
                },
              ].map((commitment, index) => {
                const IconComponent = commitment.icon;
                return (
                  <motion.div key={index} variants={fadeInUp} className={styles.commitmentCard}>
                    <div className={styles.commitmentIconWrapper}>
                      <IconComponent className={styles.commitmentIcon} />
                    </div>
                    <h3 className={styles.commitmentTitle}>{commitment.title}</h3>
                    <p className={styles.commitmentDescription}>{commitment.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.ctaContent}
            >
              <h2 className={styles.ctaTitle}>Muốn Tìm Hiểu Thêm Về Dịch Vụ Y Tế?</h2>
              <p className={styles.ctaDescription}>
                Liên hệ với chúng tôi để được tư vấn chi tiết về các dịch vụ chăm sóc sức khỏe cho
                mẹ và bé
              </p>
              <div className={styles.ctaButtons}>
                <a href="/lien-he" className={styles.ctaButtonPrimary}>
                  Liên Hệ Tư Vấn
                  <ArrowRight className={styles.ctaButtonIcon} />
                </a>
                <a href="/main/booking" className={styles.ctaButtonSecondary}>
                  Đặt Lịch Khám
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
