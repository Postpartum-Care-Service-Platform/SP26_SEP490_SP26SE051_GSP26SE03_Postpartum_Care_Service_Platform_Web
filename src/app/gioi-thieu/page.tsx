'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Eye, CheckCircle2, Shield, Award, Heart, Sparkles } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Import images
import roomImage from '@/assets/images/gallery/room.jpg';
import foodImage from '@/assets/images/gallery/food.avif';
import momentImage from '@/assets/images/gallery/moment.avif';
import babyImage from '@/assets/images/gallery/baby.webp';

import styles from './gioi-thieu.module.css';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 0.3 } },
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

export default function GioiThieuPage() {
  // Generate random values using useState and useEffect to avoid calling Math.random() during render
  const [particleData, setParticleData] = useState<Array<{
    x: number;
    y: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Generate random values after component mounts
    setParticleData(
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 10,
      }))
    );
  }, []);

  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Hero Section - Thiết kế sáng tạo không dùng hình ảnh */}
        <section className={styles.heroSection}>
          {/* Animated Background Elements */}
          <div className={styles.heroBackground}>
            <div className={styles.gradientOrb1} />
            <div className={styles.gradientOrb2} />
            <div className={styles.gradientOrb3} />
            
            {/* Geometric Shapes */}
            <div className={styles.shape1} />
            <div className={styles.shape2} />
            <div className={styles.shape3} />
            <div className={styles.shape4} />
            
            {/* Animated Grid Pattern */}
            <div className={styles.gridPattern} />
            
            {/* Floating Particles */}
            <div className={styles.particles}>
              {particleData.length > 0 &&
                particleData.map((particle, i) => (
                  <div
                    key={i}
                    className={styles.particle}
                    style={{
                      '--delay': `${particle.delay}s`,
                      '--duration': `${particle.duration}s`,
                      '--x': `${particle.x}%`,
                      '--y': `${particle.y}%`,
                    } as React.CSSProperties}
                  />
                ))}
            </div>
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
                variants={fadeIn}
                className={styles.heroBadge}
              >
                <span className={styles.badgeIcon}>✨</span>
                Đầu Tiên Tại Việt Nam
              </motion.div>
              
              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine1}>The Joyful</span>
                <span className={styles.titleLine2}>
                  Nest
                  <span className={styles.heroTitleAccent}>.</span>
                </span>
              </h1>
              
              <div className={styles.titleUnderline} />
              
              <p className={styles.heroSubtitle}>
                Nơi trí tuệ cổ xưa hòa quyện với sự sang trọng hiện đại
              </p>
              
              <p className={styles.heroDescription}>
                Thiên đường chăm sóc hậu sản đầu tiên tại Việt Nam đạt tiêu chuẩn 5 sao quốc tế, 
                nơi mẹ và bé được đón nhận bằng tình yêu thương và sự chăm sóc tận tâm nhất.
              </p>
              
              {/* Decorative Elements */}
              <div className={styles.heroDecorations}>
                <div className={styles.decorLine1} />
                <div className={styles.decorLine2} />
                <div className={styles.decorCircle} />
              </div>
            </motion.div>
          </div>
          
          {/* Scroll Indicator */}
          <div className={styles.scrollIndicator}>
            <div className={styles.scrollMouse} />
            <div className={styles.scrollArrow} />
          </div>
        </section>

        {/* Story Section - Câu chuyện về chúng tôi */}
        <section className={styles.storySection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.storyContent}
            >
              <div className={styles.storyText}>
                <div className={styles.storyLabel}>Câu Chuyện Của Chúng Tôi</div>
                <h2 className={styles.sectionTitle}>
                  Tại Sao The Joyful Nest Ra Đời?
                </h2>
                <div className={styles.storyParagraphs}>
                  <p className={styles.storyLead}>
                    Những ngày đầu làm mẹ là khoảng thời gian thiêng liêng nhất, nhưng cũng đầy thử thách.
                  </p>
                  <p>
                    Chúng tôi nhận ra rằng tại Việt Nam, các bà mẹ sau sinh thường phải đối mặt với nhiều 
                    khó khăn: thiếu kiến thức chăm sóc, áp lực từ gia đình, và đặc biệt là không có không gian 
                    yên tĩnh để nghỉ ngơi và phục hồi. The Joyful Nest được sinh ra từ mong muốn mang đến 
                    một giải pháp toàn diện cho vấn đề này.
                  </p>
                  <p>
                    Chúng tôi không chỉ tạo ra một trung tâm chăm sóc, mà là một <strong>ngôi nhà thứ hai</strong> 
                    - nơi mẹ và bé được đón nhận bằng tình yêu thương, được chăm sóc bởi đội ngũ chuyên gia 
                    giàu kinh nghiệm, và được tận hưởng những tiện nghi đẳng cấp quốc tế.
                  </p>
                  <p>
                    Mỗi chi tiết tại The Joyful Nest đều được chăm chút kỹ lưỡng, từ không gian phòng nghỉ 
                    sang trọng, thực đơn dinh dưỡng được thiết kế riêng, đến các dịch vụ spa và chăm sóc sức khỏe 
                    chuyên nghiệp. Tất cả đều hướng đến một mục tiêu: <strong>mẹ khỏe, bé vui, gia đình hạnh phúc</strong>.
                  </p>
                </div>
              </div>
              <div className={styles.storyImageWrapper}>
                <Image
                  src={momentImage}
                  alt="Khoảnh khắc yêu thương tại The Joyful Nest"
                  fill
                  className={styles.storyImage}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={styles.storyImageOverlay} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Highlight - Dịch vụ nổi bật với Marquee */}
        <section className={styles.servicesSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.servicesHeader}
            >
              <div className={styles.sectionLabel}>Dịch Vụ Của Chúng Tôi</div>
              <h2 className={styles.sectionTitle}>Chăm Sóc Toàn Diện Cho Mẹ Và Bé</h2>
              <p className={styles.sectionDescription}>
                Một hệ sinh thái dịch vụ hoàn chỉnh, được thiết kế để đáp ứng mọi nhu cầu của mẹ và bé
              </p>
            </motion.div>

            {/* Marquee Container */}
            <div className={styles.marqueeContainer}>
              <div className={styles.marqueeTrack}>
                {/* First set */}
                {[
                  {
                    image: roomImage,
                    title: 'Phòng Nghỉ Đẳng Cấp',
                    description:
                      'Không gian sang trọng, tiện nghi đầy đủ với thiết kế hiện đại và ấm cúng, tạo cảm giác như ở nhà.',
                    features: ['Phòng suite rộng rãi', 'Nội thất cao cấp', 'Hệ thống điều hòa thông minh'],
                  },
                  {
                    image: foodImage,
                    title: 'Dinh Dưỡng Chuyên Biệt',
                    description:
                      'Thực đơn được thiết kế riêng bởi chuyên gia dinh dưỡng, đảm bảo mẹ có đủ năng lượng và sữa tốt cho bé.',
                    features: ['Thực đơn cá nhân hóa', 'Nguyên liệu tươi sạch', 'Phục vụ 3 bữa chính + 2 bữa phụ'],
                  },
                  {
                    image: babyImage,
                    title: 'Chăm Sóc Y Tế 24/7',
                    description:
                      'Đội ngũ bác sĩ và y tá chuyên khoa luôn sẵn sàng theo dõi sức khỏe mẹ và bé mọi lúc.',
                    features: ['Khám sức khỏe định kỳ', 'Tư vấn chăm sóc bé', 'Hỗ trợ khẩn cấp 24/7'],
                  },
                  {
                    image: momentImage,
                    title: 'Spa & Massage Trị Liệu',
                    description:
                      'Các liệu pháp massage chuyên sâu giúp mẹ thư giãn, giảm đau nhức và phục hồi nhanh chóng.',
                    features: ['Massage sau sinh', 'Chăm sóc da mặt', 'Thư giãn toàn thân'],
                  },
                ].map((service, index) => (
                  <motion.div
                    key={`first-${index}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fadeInUp}
                    className={styles.serviceCard}
                  >
                    <div className={styles.serviceImageWrapper}>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className={styles.serviceImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className={styles.serviceImageOverlay} />
                    </div>
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <p className={styles.serviceDescription}>{service.description}</p>
                      <ul className={styles.serviceFeatures}>
                        {service.features.map((feature, idx) => (
                          <li key={idx}>
                            <CheckCircle2 className={styles.featureIcon} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
                
                {/* Duplicate for seamless loop */}
                {[
                  {
                    image: roomImage,
                    title: 'Phòng Nghỉ Đẳng Cấp',
                    description:
                      'Không gian sang trọng, tiện nghi đầy đủ với thiết kế hiện đại và ấm cúng, tạo cảm giác như ở nhà.',
                    features: ['Phòng suite rộng rãi', 'Nội thất cao cấp', 'Hệ thống điều hòa thông minh'],
                  },
                  {
                    image: foodImage,
                    title: 'Dinh Dưỡng Chuyên Biệt',
                    description:
                      'Thực đơn được thiết kế riêng bởi chuyên gia dinh dưỡng, đảm bảo mẹ có đủ năng lượng và sữa tốt cho bé.',
                    features: ['Thực đơn cá nhân hóa', 'Nguyên liệu tươi sạch', 'Phục vụ 3 bữa chính + 2 bữa phụ'],
                  },
                  {
                    image: babyImage,
                    title: 'Chăm Sóc Y Tế 24/7',
                    description:
                      'Đội ngũ bác sĩ và y tá chuyên khoa luôn sẵn sàng theo dõi sức khỏe mẹ và bé mọi lúc.',
                    features: ['Khám sức khỏe định kỳ', 'Tư vấn chăm sóc bé', 'Hỗ trợ khẩn cấp 24/7'],
                  },
                  {
                    image: momentImage,
                    title: 'Spa & Massage Trị Liệu',
                    description:
                      'Các liệu pháp massage chuyên sâu giúp mẹ thư giãn, giảm đau nhức và phục hồi nhanh chóng.',
                    features: ['Massage sau sinh', 'Chăm sóc da mặt', 'Thư giãn toàn thân'],
                  },
                ].map((service, index) => (
                  <div
                    key={`second-${index}`}
                    className={styles.serviceCard}
                    aria-hidden="true"
                  >
                    <div className={styles.serviceImageWrapper}>
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        className={styles.serviceImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className={styles.serviceImageOverlay} />
                    </div>
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <p className={styles.serviceDescription}>{service.description}</p>
                      <ul className={styles.serviceFeatures}>
                        {service.features.map((feature, idx) => (
                          <li key={idx}>
                            <CheckCircle2 className={styles.featureIcon} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Điểm khác biệt */}
        <section className={styles.whySection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.whyHeader}
            >
              <div className={styles.sectionLabel}>Điểm Khác Biệt</div>
              <h2 className={styles.sectionTitle}>Tại Sao Chọn The Joyful Nest?</h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className={styles.whyGrid}
            >
              {[
                {
                  icon: '🏆',
                  number: '01',
                  title: 'Đầu Tiên & Duy Nhất',
                  description:
                    'Trung tâm chăm sóc hậu sản đầu tiên tại Việt Nam đạt tiêu chuẩn 5 sao quốc tế, với hệ thống dịch vụ hoàn chỉnh và chuyên nghiệp.',
                },
                {
                  icon: '👨‍⚕️',
                  number: '02',
                  title: 'Đội Ngũ Chuyên Gia',
                  description:
                    'Bác sĩ sản phụ khoa, y tá, chuyên gia dinh dưỡng và spa được đào tạo bài bản, giàu kinh nghiệm và luôn tận tâm.',
                },
                {
                  icon: '🌿',
                  number: '03',
                  title: 'Phương Pháp Tự Nhiên',
                  description:
                    'Kết hợp hoàn hảo giữa y học cổ truyền Việt Nam và phương pháp hiện đại, đảm bảo an toàn tuyệt đối cho mẹ và bé.',
                },
                {
                  icon: '💎',
                  number: '04',
                  title: 'Tiêu Chuẩn Quốc Tế',
                  description:
                    'Không gian sang trọng, tiện nghi đẳng cấp, mọi chi tiết đều được chăm chút theo tiêu chuẩn 5 sao quốc tế.',
                },
                {
                  icon: '🤝',
                  number: '05',
                  title: 'Đồng Hành Lâu Dài',
                  description:
                    'Không chỉ chăm sóc trong thời gian lưu trú, chúng tôi đồng hành cùng gia đình cả sau khi về nhà thông qua tư vấn và hỗ trợ.',
                },
                {
                  icon: '✨',
                  number: '06',
                  title: 'Trải Nghiệm Độc Đáo',
                  description:
                    'Mỗi khoảnh khắc đều được tạo nên để trở thành kỷ niệm đẹp, từ không gian nghỉ ngơi đến các hoạt động giáo dục và giải trí.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={styles.whyCard}
                >
                  <div className={styles.whyCardHeader}>
                    <div className={styles.whyNumber}>{item.number}</div>
                    <div className={styles.whyIcon}>{item.icon}</div>
                  </div>
                  <h3 className={styles.whyTitle}>{item.title}</h3>
                  <p className={styles.whyDescription}>{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section - Sứ mệnh và Tầm nhìn */}
        <section className={styles.missionSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.missionHeader}
            >
              <div className={styles.sectionLabel}>Giá Trị Cốt Lõi</div>
              <h2 className={styles.sectionTitle}>Sứ Mệnh & Tầm Nhìn</h2>
              <p className={styles.sectionDescription}>
                Những nguyên tắc định hướng và cam kết của chúng tôi trong hành trình chăm sóc mẹ và bé
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className={styles.missionGrid}
            >
              <motion.div variants={fadeInUp} className={styles.missionCard}>
                <div className={styles.missionNumber}>01</div>
                <div className={styles.missionIconWrapper}>
                  <Target className={styles.missionIcon} />
                </div>
                <h3 className={styles.missionTitle}>Sứ Mệnh</h3>
                <p className={styles.missionText}>
                  Mang đến dịch vụ chăm sóc hậu sản đẳng cấp quốc tế, tạo nên một môi trường an toàn,
                  yên bình và đầy yêu thương để mẹ và bé có thể phục hồi sức khỏe, tận hưởng những
                  khoảnh khắc đầu tiên bên nhau một cách trọn vẹn nhất.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className={styles.missionCard}>
                <div className={styles.missionNumber}>02</div>
                <div className={styles.missionIconWrapper}>
                  <Eye className={styles.missionIcon} />
                </div>
                <h3 className={styles.missionTitle}>Tầm Nhìn</h3>
                <p className={styles.missionText}>
                  Trở thành trung tâm chăm sóc hậu sản hàng đầu tại Việt Nam và khu vực Đông Nam Á,
                  được công nhận về chất lượng dịch vụ, sự chuyên nghiệp và cam kết mang đến trải
                  nghiệm tuyệt vời cho mỗi gia đình.
                </p>
              </motion.div>
            </motion.div>

            {/* Cam kết chất lượng - Hợp nhất vào section này */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.commitmentWrapper}
            >
              <h3 className={styles.commitmentSectionTitle}>Cam Kết Của Chúng Tôi</h3>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={staggerContainer}
                className={styles.commitmentGrid}
              >
                {[
                  {
                    icon: Shield,
                    title: 'An Toàn Tuyệt Đối',
                    description: 'Mọi quy trình đều được kiểm soát chặt chẽ, đảm bảo an toàn cho mẹ và bé.',
                  },
                  {
                    icon: Award,
                    title: 'Chất Lượng Dịch Vụ',
                    description: 'Tiêu chuẩn 5 sao quốc tế trong mọi khía cạnh, từ không gian đến dịch vụ.',
                  },
                  {
                    icon: Heart,
                    title: 'Tận Tâm Phục Vụ',
                    description: 'Đội ngũ nhân viên được đào tạo chuyên nghiệp, luôn sẵn sàng hỗ trợ.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Minh Bạch & Trung Thực',
                    description: 'Cam kết minh bạch về giá cả, dịch vụ và quy trình chăm sóc.',
                  },
                ].map((commitment, index) => {
                  const IconComponent = commitment.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className={styles.commitmentCard}
                    >
                      <div className={styles.commitmentIconWrapper}>
                        <IconComponent className={styles.commitmentIcon} />
                      </div>
                      <h4 className={styles.commitmentTitle}>{commitment.title}</h4>
                      <p className={styles.commitmentDescription}>{commitment.description}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA - Liên hệ nhẹ nhàng */}
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
              className={styles.contactContent}
            >
              <h2 className={styles.contactTitle}>Muốn Tìm Hiểu Thêm?</h2>
              <p className={styles.contactDescription}>
                Chúng tôi luôn sẵn sàng lắng nghe và tư vấn cho bạn về dịch vụ chăm sóc hậu sản
              </p>
              <a href="/lien-he" className={styles.contactButton}>
                Liên Hệ Với Chúng Tôi
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
