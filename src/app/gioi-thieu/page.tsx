'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import styles from './gioi-thieu.module.css';

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

export default function GioiThieuPage() {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        <section className={styles.introSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.introContent}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Left Column: Image and Signature */}
              <motion.div className={styles.leftColumn} variants={fadeInUp}>
                <div className={styles.imageWrapper}>
                  <Image
                    src="/thejoyfulnest/introduce/intro.jpg"
                    alt="The Joyful Nest Founders"
                    width={500}
                    height={667}
                    className={styles.introImage}
                    priority
                  />
                </div>
                {/* Signature - Using image */}
                <div className={styles.signature}>
                  <Image 
                    src="/thejoyfulnest/introduce/Handwriter-1.png" 
                    alt="Kim + Ruby Signature" 
                    width={200} 
                    height={80} 
                    className={styles.signatureImage}
                  />
                </div>
              </motion.div>

              {/* Right Column: Text Content */}
              <motion.div className={styles.rightColumn} variants={fadeInUp}>
                <h1 className={styles.pageTitle}>Khởi đầu hành trình làm mẹ...</h1>
                
                <div className={styles.textContent}>
                  <p>
                    Những tuần đầu tiên trong vai trò mới – làm Mẹ – là một dấu mốc thiêng liêng, nơi niềm hạnh phúc vỡ òa hòa lẫn 
                    những trăn trở thầm lặng. Từ những trải nghiệm sâu sắc của bản thân và lắng nghe bao tâm tư của những người mẹ khác, 
                    The Joyful Nest được kiến tạo như một lời tri ân dành cho thiên chức làm mẹ cao quy – nơi mọi mong đợi 
                    đều được đáp ứng bằng sự chăm chút tinh tế và trân trọng sâu sắc.
                  </p>
                  
                  <p>
                    Đúc kết kinh nghiệm từ những không gian chăm sóc sau sinh hàng đầu thế giới, The Joyful Nest mang đến 
                    một trải nghiệm khác biệt: y học hiện đại kết hợp cùng sự khéo léo và tinh tế trong từng chi tiết chăm sóc, 
                    giúp mẹ không chỉ hồi phục về thể chất mà còn tìm lại sự cân bằng và bình yên trong tâm hồn. 
                    Đây chính là khởi đầu cho một hành trình làm mẹ trọn vẹn, nơi mẹ và bé được tôn vinh, 
                    yêu thương và nâng niu theo cách xứng đáng nhất.
                  </p>
                  
                  <p>
                    Những căn phòng tràn ngập ánh sáng tự nhiên, nơi mẹ và bé cảm nhận sự thư thái dịu dàng như vòng tay ấm áp. 
                    Đội ngũ chuyên gia tận tâm luôn đồng hành chu đáo, giúp mẹ phục hồi từ sâu bên trong, cả về thể chất lẫn tinh thần. 
                    Các phương pháp chăm sóc được cá nhân hóa, từ chế độ dinh dưỡng đến liệu pháp trị liệu, 
                    được thiết kế riêng để phù hợp với hành trình đặc biệt của mỗi người mẹ.
                  </p>
                  
                  <p>
                    The Joyful Nest không chỉ là nơi chữa lành, mà còn là nơi ấp ủ những giấc mơ về hành trình làm mẹ trọn vẹn. 
                    Chúng tôi tin rằng, giai đoạn sau sinh sẽ không chỉ là sự hồi phục, mà còn là một sự khởi đầu đầy cảm hứng. 
                    Tại đây, bạn sẽ vun đắp những mối liên kết mới, nuôi dưỡng sự tự tin và xây dựng nền tảng vững chắc cho tương lai.
                  </p>
                  
                  <div className={styles.closingText}>
                    The Joyful Nest – nơi chúng tôi gửi gắm những mong ước của chính mình khi làm mẹ, 
                    và giờ đây, chúng tôi mong muốn dành tặng món quà ý nghĩa ấy cho bạn.
                  </div>
                </div>

                {/* Icons Grid */}
                <div className={styles.iconBox}>
                  <Image src="/thejoyfulnest/introduce/ic-7.svg" alt="Icon 1" width={40} height={40} className={styles.contentIcon} />
                  <Image src="/thejoyfulnest/food/ic-5.svg" alt="Icon 2" width={40} height={40} className={styles.contentIcon} />
                  <Image src="/thejoyfulnest/food/ic-6.svg" alt="Icon 3" width={40} height={40} className={styles.contentIcon} />
                  <Image src="/thejoyfulnest/food/ic4.svg" alt="Icon 4" width={40} height={40} className={styles.contentIcon} />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section with Background Image */}
        <section className={styles.missionSection}>
          <Image
            src="/thejoyfulnest/introduce/Joyful-nest12611-e1734517958925.jpg"
            alt="Mission background"
            fill
            className={styles.missionBgImage}
            priority
          />
          <div className={styles.missionOverlay} />
          <div className={styles.container}>
            <motion.div 
              className={styles.missionContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className={styles.missionLabel}>Sứ mệnh</span>
              <h2 className={styles.missionQuote}>
                "Với sự kết hợp tinh tế giữa không gian sang trọng và những liệu pháp chăm sóc sức khỏe cá nhân hóa toàn diện, 
                chúng tôi mong muốn kiến tạo một trải nghiệm hậu sản thật sự ý nghĩa và hạnh phúc, 
                nơi mỗi người mẹ được chăm sóc và thấu hiểu."
              </h2>
            </motion.div>
          </div>
        </section>

        {/* Vision Section */}
        <section className={styles.visionSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.visionContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className={styles.visionLabel}>Tầm nhìn</span>
              <h2 className={styles.visionQuote}>
                "Chúng tôi hướng đến việc tiên phong trong lĩnh vực chăm sóc hậu sản cao cấp tại Việt Nam, 
                kiến tạo những tiêu chuẩn mới về sự hỗ trợ toàn diện và cá nhân hóa, trao quyền cho những người mẹ, 
                nuôi dưỡng những mầm non khỏe mạnh và góp phần xây dựng những gia đình hạnh phúc, 
                từ đó tạo dựng một tương lai tươi sáng và vững chắc cho cộng đồng."
              </h2>
              <div className={styles.visionIconWrapper}>
                <Image 
                  src="/thejoyfulnest/introduce/icon-1-uai-161x161.png" 
                  alt="Vision Icon" 
                  width={80} 
                  height={80} 
                />
              </div>
            </motion.div>
          </div>
          <div className={styles.bottomOrangeBar} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
