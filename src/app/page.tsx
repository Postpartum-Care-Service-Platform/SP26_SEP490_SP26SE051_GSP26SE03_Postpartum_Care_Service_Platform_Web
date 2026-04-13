'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './main/home.module.css';

const CAROUSEL_IMAGES = [
  '/thejoyfulnest/experience/carousel/167c7e0e-dcb3-4a5d-9193-a019a63b5709.jpg',
  '/thejoyfulnest/experience/carousel/be84fd07-72d8-4887-b64e-bdc97315d678.jpg',
  '/thejoyfulnest/experience/carousel/Diem-My-9x-Mom-1-1.png',
  '/thejoyfulnest/experience/carousel/Diem-My-9x-mom-1.png',
  '/thejoyfulnest/experience/carousel/Tina-Yong-letter.jpg',
  '/thejoyfulnest/experience/carousel/TJN-A-letter-to-The-Joyful-Nest-1.png',
  '/thejoyfulnest/experience/carousel/TJN-A-letter-to-The-Joyful-Nest-2-1.png'
];

export default function HomePage() {
  return (
    <div className="app-shell__inner">
      <Header />
      
      <main>
        {/* Full Video Hero Section - Mirrored from Package Page */}
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
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Trải nghiệm ở cữ 5 sao đầu tiên tại Việt Nam</h1>
                <p className={styles.heroSubtitle}>
                  The Joyful Nest, nơi tinh hoa truyền thống hòa quyện cùng tiện nghi sang trọng, cho bạn tận hưởng trọn vẹn những ngày tháng đầu tiên làm mẹ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className={styles.introSection}>
          <div className={styles.introContainer}>
            <div className={styles.introHeader}>
              <h2 className={styles.introMainTitle}>Chào mừng bạn đến với The Joyful Nest</h2>
              <p className={styles.introMainSubtitle}>Một trải nghiệm đẳng cấp cho mẹ sau sinh và bé</p>
            </div>

            <div className={styles.introGrid}>
              {/* Left Column */}
              <div className={styles.introLeft}>
                <h3 className={styles.introSubTitle}>Khởi đầu hành trình làm mẹ...</h3>
                <p className={styles.introItalic}>
                  Những tuần đầu tiên trong vai trò mới – làm Mẹ – là một dấu mốc thiêng liêng, nơi niềm hạnh phúc vỡ òa lẫn những trăn trở thầm lặng.
                </p>
                <p className={styles.introParagraph}>
                  Từ những trải nghiệm sâu sắc của bản thân và lắng nghe bao tâm tư của những người mẹ khác, The Joyful Nest được kiến tạo như một lời tri ân dành cho thiên chức làm mẹ cao quý – nơi mọi mong đợi đều được đáp ứng bằng sự chăm chút tinh tế và trân trọng sâu sắc.
                </p>
                <p className={styles.introParagraph}>
                  Đúc kết kinh nghiệm từ những không gian chăm sóc sau sinh hàng đầu thế giới, The Joyful Nest mang đến một trải nghiệm khác biệt: y học hiện đại kết hợp cùng sự khéo léo và tinh tế trong từng chi tiết chăm sóc, giúp mẹ không chỉ hồi phục về thể chất mà còn tìm lại sự cân bằng và bình yên trong tâm hồn. Đây chính là khởi đầu cho một hành trình làm mẹ trọn vẹn, nơi mẹ và bé được tôn vinh, yêu thương và nâng niu theo cách xứng đáng nhất.
                </p>
              </div>

              {/* Right Column */}
              <div className={styles.introRight}>
                <p className={styles.introParagraph}>
                  Những căn phòng tràn ngập ánh sáng tự nhiên, nơi mẹ và bé cảm nhận sự thư thái dịu dàng như vòng tay ấm áp. Đội ngũ chuyên gia tận tâm luôn đồng hành chu đáo, giúp mẹ phục hồi từ sâu bên trong, cả về thể chất lẫn tinh thần. Các phương pháp chăm sóc được cá nhân hóa, từ chế độ dinh dưỡng đến liệu pháp trị liệu, được thiết kế riêng để phù hợp với hành trình đặc biệt của mỗi người mẹ.
                </p>
                <p className={styles.introParagraph}>
                  The Joyful Nest không chỉ là nơi chữa lành, mà còn là nơi ấp ủ những giấc mơ về hành trình làm mẹ trọn vẹn. Chúng tôi tin rằng, giai đoạn sau sinh sẽ không chỉ là sự hồi phục, mà còn là một sự khởi đầu đầy cảm hứng. Tại đây, bạn sẽ vun đắp những mối liên kết mới, nuôi dưỡng sự tự tin và xây dựng nền tảng vững chắc cho tương lai.
                </p>
                <p className={styles.introParagraph}>
                  The Joyful Nest – nơi chúng tôi gửi gắm những mong ước của chính mình khi làm mẹ, và giờ đây, chúng tôi mong muốn dành tặng món quà ý nghĩa ấy cho bạn.
                </p>
              </div>
            </div>

            <div className={styles.introIcons}>
              <Image src="/thejoyfulnest/Room/ic-1.svg" alt="Icon 1" width={60} height={60} className={styles.introIcon} />
              <Image src="/thejoyfulnest/Room/ic-2.svg" alt="Icon 2" width={60} height={60} className={styles.introIcon} />
              <Image src="/thejoyfulnest/Room/ic-ldp-5.svg" alt="Icon 3" width={60} height={60} className={styles.introIcon} />
            </div>
          </div>
        </section>

        {/* Discovery Carousel Section */}
        <section className={styles.discoverySection}>
          <div className={styles.discoveryContainer}>
            <div className={styles.carouselWrapper}>
              {/* Card 1: Không gian lưu trú */}
              <div className={styles.carouselCard}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src="/thejoyfulnest/Home/carousel/Joyful-nest12443-1.jpg" 
                    alt="Không gian lưu trú" 
                    fill 
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.discoveryCardTitle}>Không gian lưu trú</h3>
                  <p className={styles.discoveryCardDescription}>
                    Không gian tại The Joyful Nest mang đến sự thư thái tuyệt đối, lý tưởng cho hành trình phục hồi sau sinh. Chiếc giường êm ái tựa như mây, đệm gối mềm mại nâng niu cơ thể bạn. Mỗi căn suite là một chiếc kén ấm áp ôm trọn lấy những giây phút nghỉ ngơi quý giá. Từng chi tiết, từ thiết kế tinh giản đến vật dụng dành riêng cho mẹ và bé, đều được chăm chút tỉ mỉ, tạo nên trải nghiệm phục hồi đầy ý nghĩa.
                  </p>
                </div>
              </div>

              {/* Card 2: Tinh hoa ẩm thực */}
              <div className={styles.carouselCard}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src="/thejoyfulnest/Home/carousel/Joyful-nest12778-1.jpg" 
                    alt="Tinh hoa ẩm thực" 
                    fill 
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.discoveryCardTitle}>Tinh hoa ẩm thực</h3>
                  <p className={styles.discoveryCardDescription}>
                    Gian bếp tại The Joyful Nest là một không gian đặc biệt nơi mỗi bữa ăn đều là một trải nghiệm mới mẻ, không lặp lại. Từng món ăn được chế biến công phu, kết hợp hài hòa giữa hương vị truyền thống và cảm hứng quốc tế, mang đến trải nghiệm vị giác độc đáo mà bạn khó tìm thấy ở nơi khác. Thực đơn 28 ngày sau sinh, được nghiên cứu hơn 400 giờ bởi đội ngũ đầu bếp 5 sao và chuyên gia dinh dưỡng, không chỉ giúp đào thải độc tố mà còn hỗ trợ phục hồi từ bên trong. Những món canh bổ dưỡng và trà thảo mộc Trung Hoa, chắt lọc từ tinh hoa y học cổ truyền, giúp cơ thể nhanh chóng cân bằng và tái tạo năng lượng.
                  </p>
                </div>
              </div>

              {/* Card 3: Dịch vụ tiện ích */}
              <div className={styles.carouselCard}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src="/thejoyfulnest/Home/carousel/Joyful-nest12910.jpg" 
                    alt="Dịch vụ tiện ích" 
                    fill 
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.discoveryCardTitle}>Dịch vụ tiện ích</h3>
                  <p className={styles.discoveryCardDescription}>
                    Tại The Joyful Nest, cuộc sống như chậm lại để bạn tận hưởng từng khoảnh khắc quý giá. Phòng nghỉ ngơi riêng tư là nơi lý tưởng để tái tạo năng lượng, trong khi không gian yoga mang đến sự tĩnh lặng và cân bằng tâm trí. Hồ bơi trên tầng thượng là nơi lưu giữ những khoảnh khắc vui vẻ bên gia đình. Hãy dành thời gian chăm sóc bản thân với liệu pháp spa thư giãn hoặc tận hưởng niềm vui mua sắm tại khu trung tâm mua sâm hiện đại liền kề. Mỗi tiện nghi tại đây đều được thiết kế để bạn cảm nhận sự thoải mái và bình yên tuyệt đối.
                  </p>
                </div>
              </div>

              {/* Card 4: Lưu giữ kỷ niệm */}
              <div className={styles.carouselCard}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src="/thejoyfulnest/Home/carousel/432A0586.jpg" 
                    alt="Lưu giữ kỷ niệm" 
                    fill 
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.discoveryCardTitle}>Lưu giữ kỷ niệm</h3>
                  <p className={styles.discoveryCardDescription}>
                    Những tuần đầu tiên bên con yêu trôi qua thật nhanh, mỗi ngày bé lại lớn thêm một chút, để lại những khoảnh khắc khó quên mà bạn muốn giữ mãi trong tim. Chúng tôi giúp bạn lưu giữ những ký ức quý giá ấy qua những bức ảnh nghệ thuật ghi lại nét đẹp ngây thơ của bé và những món quà lưu niệm thủ công tinh tế, như một cách nâng niu từng dấu ấn đầu đời của con.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Love Narrative Section (from Experience Page) */}
        <section className={styles.loveNarrativeSection}>
          <div className={styles.loveCenteredContent}>
            <h2 className={styles.loveTitle}>Yêu thương gửi đến The Joyful Nest</h2>
            <div className={styles.loveTextWrapper}>
              <p>Mỗi hành trình làm mẹ là một câu chuyện dịu dàng, đong đầy yêu thương trong từng khoảnh khắc nhỏ bé. Những niềm vui lặng lẽ, những phút giây biết ơn sâu lắng – tất cả đều xứng đáng trân trọng và sẻ chia.</p>
              <p>Nếu trái tim bạn có những điều muốn nói, hãy để từng dòng chữ trở thành lời thì thầm ấm áp, gửi đến The Joyful Nest – nơi đã chở che, chăm sóc và đồng hành cùng bạn trong hành trình đặc biệt này.</p>
              <p className={styles.loveSignature}>Viết từ trái tim. Gửi đi bằng yêu thương. Trân trọng từng khoảnh khắc quý giá này.</p>
            </div>
          </div>
        </section>

        {/* Infinite Letter Carousel (from Experience Page) */}
        <section className={styles.experienceCarouselSection}>
          <div className={styles.experienceCarouselWrapper}>
            <motion.div 
              className={styles.experienceCarouselTrack}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 30, 
                ease: "linear", 
                repeat: Infinity 
              }}
            >
              {/* Double the images for seamless loop */}
              {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((img, idx) => (
                <div key={idx} className={styles.experienceCarouselItem}>
                  <div className={styles.letterImageWrapper}>
                    <Image 
                      src={img}
                      alt={`Feedback letter ${idx}`}
                      width={343}
                      height={457}
                      className={styles.letterImage}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section (from Am Thuc Page) */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBackground}>
            <Image 
              src="/thejoyfulnest/food/call-to-action.svg" 
              alt="Background decoration" 
              fill 
              className={styles.ctaBgImage}
            />
          </div>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Hãy để The Joyful Nest đồng hành cùng mẹ!</h2>
            <div className={styles.ctaButtons}>
              <Link href="/dat-lich" className={styles.ctaButton}>
                Đặt Lịch Ngay
              </Link>
              <Link href="/bao-gia" className={styles.ctaButton}>
                Yêu cầu báo giá
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
