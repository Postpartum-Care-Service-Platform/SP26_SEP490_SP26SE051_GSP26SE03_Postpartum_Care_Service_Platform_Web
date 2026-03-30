'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import styles from './tien-ich.module.css';

// Animation variants
const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function TienIchPage() {
  const amenities = [
    {
      id: 'yoga',
      name: 'Phòng Yoga',
      description: 'Tìm về sự cân bằng và thư giãn với những buổi yoga nhẹ nhàng, được thiết kế riêng cho mẹ sau sinh. Chúng tôi tạo điều kiện để cơ thể và tâm trí mẹ được phục hồi một cách tự nhiên nhất.',
      image: '/thejoyfulnest/amenity/Yoga-2000x857.jpg',
    },
    {
      id: 'gym',
      name: 'Phòng tập thể hình',
      description: 'Phòng tập thể dục tràn ngập ánh sáng tự nhiên, với đầy đủ thiết bị hiện đại, là nơi lý tưởng để bố vận động và tăng cường sức khỏe theo nhịp độ của riêng mình.',
      image: '/thejoyfulnest/amenity/room-2000x857.jpg',
    },
    {
      id: 'pool',
      name: 'Hồ bơi',
      description: 'Hai hồ bơi tuyệt đẹp với tầm nhìn toàn cảnh thành phố – một hồ bơi yên tĩnh trên tầng 5 và một hồ bơi vô cực trên tầng thượng – là nơi hoàn hảo để gia đình bạn gắn kết và tận hưởng những giây phút thư giãn.',
      image: '/thejoyfulnest/amenity/pool-uai-2000x857.jpg',
    },
    {
      id: 'social',
      name: 'Không gian kết nối',
      description: 'Không gian của chúng tôi là nơi lý tưởng để các mẹ gặp gỡ, trò chuyện và kết nối với những tâm hồn đồng điệu. Dù là tham gia lớp học làm đồ thủ công, các buổi workshop về chăm sóc bé, hay đơn giản chỉ là chia sẻ câu chuyện bên tách trà – mẹ sẽ dễ dàng tìm thấy sự đồng cảm từ những người cùng chung hành trình. Tại đây, mẹ không chỉ được lắng nghe, mà còn xây dựng được các mối quan hệ tâm giao sâu sắc.',
      image: '/thejoyfulnest/amenity/Joyful-room-uai-2000x857.jpg',
    },
    {
      id: 'family',
      name: 'Khu giải trí gia đình',
      description: 'Sân chơi ngoài trời và khu vực BBQ là nơi lý tưởng để cả gia đình quây quần, vui chơi và tận hưởng những khoảnh khắc hạnh phúc bên nhau.',
      image: '/thejoyfulnest/amenity/vuichoi-uai-1024x438.jpg',
    },
    {
      id: 'lounge',
      name: 'Phòng Lounge',
      description: 'Có những ngày mẹ cần một góc nhỏ yên tĩnh để nghỉ ngơi, cũng có những lúc mẹ muốn tìm đến những cuộc trò chuyện thân tình. Hãy đến phòng chờ, thả mình trên chiếc sofa êm ái thưởng thức tách trà thảo mộc. Đắm mình trong cuốn tạp chí yêu thích, chia sẻ những khoảnh khắc đáng quý cho những người thân yêu. Không gian của chúng tôi luôn sẵn sàng chào đón mẹ – nghỉ dưỡng theo cách riêng của mình.',
      image: '/thejoyfulnest/amenity/happy-room-uai-1280x548.jpg',
    },
    {
      id: 'shopping',
      name: 'Mua sắm & Giải trí',
      description: 'Ngay bên cạnh The Joyful Nest là một trong những trung tâm mua sắm bậc nhất Sài Gòn – Vivo City. Đặt chân đến đây, cả gia đình sẽ bước vào một thế giới trải nghiệm đa dạng, từ các cửa hàng mua sắm cao cấp, khu ẩm thực phong phú đến những hoạt động giải trí hấp dẫn phù hợp với mọi lứa tuổi.',
      image: '/thejoyfulnest/amenity/VNO-SC20VivoCity20Shopping20Center.jpg-uai-1408x603.jpg',
    }
  ];

  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Hero Header Section */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.heroContent}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
                An dưỡng sức khoẻ trong không gian thanh tĩnh
              </motion.h1>
              <motion.p className={styles.heroDescription} variants={fadeInUp}>
                Trong khi mẹ tĩnh dưỡng cho quá trình hồi phục sức khoẻ, các thành viên trong gia đình có thể tận hưởng 
                những giây phút thư giãn và vui chơi trong không gian ấm cúng của The Joyful Nest. Từ những góc nhỏ 
                tĩnh lặng yên bình đến những không gian rộng mở, mỗi khoảnh khắc sum vầy bên nhau đều trở thành 
                những kỷ niệm đáng nhớ.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Amenities List */}
        <section className={styles.amenitiesList}>
          {amenities.map((amenity) => (
            <div key={amenity.id} className={styles.amenityItem}>
              {/* Large Image */}
              <motion.div 
                className={styles.imageSection}
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={amenity.image}
                    alt={amenity.name}
                    width={2000}
                    height={857}
                    className={styles.amenityImage}
                    priority
                  />
                </div>
              </motion.div>

              {/* Amenity Detail Info */}
              <div className={styles.container}>
                <motion.div 
                  className={styles.detailSection}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.h2 className={styles.amenityName} variants={fadeInUp}>
                    {amenity.name}
                  </motion.h2>
                  <motion.p className={styles.amenityDesc} variants={fadeInUp}>
                    {amenity.description}
                  </motion.p>
                </motion.div>
              </div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <Image 
              src="/thejoyfulnest/food/call-to-action.svg" 
              alt="CTA Background Decoration" 
              fill
              className={styles.ctaBackgroundSvg}
            />
            <motion.div 
              className={styles.ctaContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className={styles.ctaTitle}>Hãy để The Joyful Nest đồng hành cùng mẹ!</h2>
              <div className={styles.ctaButtons}>
                <button className={styles.ctaButton}>Đặt Lịch Ngay</button>
                <button className={styles.ctaButton}>Yêu cầu báo giá</button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
