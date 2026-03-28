'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './experience.module.css';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
  },
};

const MILESTONES = [
  {
    id: 'week1',
    title: 'Tuần 1',
    image: '/thejoyfulnest/experience/message-uai-1777x1333.jpg',
    sections: [
      {
        label: 'Dành cho Mẹ',
        heading: 'Phục hồi và tình dưỡng',
        content: 'Tuần đầu sau sinh, mẹ bước vào hành trình đầy thử thách và nhiều cung bậc cảm xúc. Nhưng hãy yên tâm, đội ngũ hậu sản của chúng tôi luôn là điểm tựa vững vàng bên mẹ. Những chuyên gia y tế dày dặn kinh nghiệm sẽ đồng hành, theo dõi tỉ mỉ quá trình hồi phục của mẹ. Các chuyên gia tư vấn sữa mẹ ân cần, sẵn sàng hướng dẫn mẹ từng bước nhỏ trên hành trình cho con bú. Những liệu pháp thư giãn nhẹ nhàng cũng được chuẩn bị để xoa dịu cơ thể mỏi mệt. Hãy dành những ngày này để nghỉ ngơi, thưởng thức những bữa ăn bổ dưỡng, thư giãn trong làn nước ấm của bồn tắm thảo dược, và tận hưởng trọn vẹn sự chăm sóc tận tâm dành riêng cho mẹ.'
      },
      {
        label: 'Dành cho Bé',
        heading: 'Những ngày đầu đời',
        content: 'Những ngón tay bé xíu và nhịp thở khẽ khàng của bé trong tháng đầu đời là khoảnh khắc thật vô giá. Với sự am hiểu về tư thế ngủ an toàn và khoa học, chúng tôi mang đến cho bé giấc ngủ sâu trong vòng tay nhẹ nhàng, ấm áp và âu yếm.'
      }
    ]
  },
  {
    id: 'week2',
    title: 'Tuần 2',
    image: '/thejoyfulnest/experience/food-uai-1777x1333.jpg',
    sections: [
      {
        label: 'Dành cho Mẹ',
        heading: 'Tìm lại sự cân bằng',
        content: 'Khi cơ thể bạn tiếp tục hồi phục, nội tiết tố dần ổn định, nhưng sự mệt mỏi vẫn có thể kéo dài. Chúng tôi tiếp tục hỗ trợ mẹ với các bữa ăn dinh dưỡng, những bài vận động nhẹ nhàng và trị liệu giúp thư giãn tinh thần, mang đến sự cân bằng toàn diện. Các bài thuốc truyền thống cũng góp phần thúc đẩy quá trình chữa lành từ bên trong, giúp mẹ có giấc ngủ ngon và phục hồi năng lượng mỗi đêm.'
      },
      {
        label: 'Dành cho Bé',
        heading: 'Kết nối thiêng liêng',
        content: 'Bé giờ đây đã nhận ra giọng nói và vòng tay dịu dàng của mẹ. Chúng tôi sẽ chia sẻ với bạn những bí quyết nhỏ để xoa dịu bé yêu. Những động tác xoa bóp nhẹ nhàng lên chiếc bụng nhỏ xinh sẽ giúp xoa dịu những cơn khó chịu. Những giai điệu du dương, êm ái sẽ mang đến những giấc mơ ngọt ngào. Mỗi ngày trôi qua đều là một cơ hội mới để vun đắp và thắt chặt sợi dây liên kết yêu thương giữa mẹ và con.'
      }
    ]
  },
  {
    id: 'week3',
    title: 'Tuần 3',
    image: '/thejoyfulnest/experience/messagelung-uai-1333x1000.jpg',
    sections: [
      {
        label: 'Dành cho Mẹ',
        heading: 'Khoẻ mạnh toàn diện',
        content: 'Mẹ dần hồi phục và lấy lại năng lượng, và chúng tôi vẫn luôn đồng hành cùng mẹ trên hành trình phía trước. Các bài tập vật lý trị liệu giúp phục hồi sức khỏe, liệu pháp massage xoa dịu mọi căng thẳng. Với chế độ dinh dưỡng đầy đủ cho bé, mẹ có thể yên tâm hơn trong hành trình nuôi dưỡng. Tại phòng lounge ấm cúng, mẹ sẽ được kết nối và bao bọc bởi tình yêu thương và sự thấu hiểu.'
      },
      {
        label: 'Dành cho Bé',
        heading: 'Khám phá thế giới',
        content: 'Thế giới trong mắt bé thật diệu kỳ. Mỗi âm thanh, mỗi ánh sáng, mỗi cái chạm đều là một khám phá mới lạ. Không gian yên tĩnh tại The Joyful Nest giúp bé dễ dàng chìm vào giấc ngủ.'
      }
    ]
  },
  {
    id: 'week4',
    title: 'Tuần 4',
    image: '/thejoyfulnest/experience/nhin-uai-1333x1000.jpg',
    sections: [
      {
        label: 'Dành cho Mẹ',
        heading: 'Rạng rỡ và đầy sức sống',
        content: 'Tuần cuối cùng này, chúng tôi sẽ giúp mẹ củng cố những kiến thức và kỹ năng cần thiết để bạn có thể chăm sóc bản thân và bé tại nhà. Dưới sự chăm sóc tận tình, mẹ sẽ được tiếp thêm năng lượng, phục hồi toàn diện cả về thể chất lẫn tinh thần. Bạn sẽ tự tin tạm biệt The Joyful Nest, biết rằng mình đã xây dựng một nền tảng vững chắc cho hành trình phía trước.'
      },
      {
        label: 'Dành cho Bé',
        heading: 'Bé vui khoẻ',
        content: 'Bé đang lớn lên từng ngày và bạn cũng dần tinh tế hơn trong việc nhận biết những dấu hiệu đói, no hay buồn ngủ của con. Chúng tôi sẽ cùng bạn ghi lại những khoảnh khắc thay đổi đáng yêu và đầy quý giá này. Những bài tập vận động nhẹ nhàng sẽ giúp cơ thể bé phát triển. Chu kỳ ngủ của bé cũng dần ổn định và sâu giấc hơn. Mỗi ngày trôi qua như một món quà với những kỷ niệm khó quên.'
      }
    ]
  }
];

const PROGRAMS = [
  { 
    id: 'classic', 
    title: 'The Joyful Classic',
    heading: 'Chương trình 28 ngày',
    image: '/thejoyfulnest/experience/nhincon.jpg',
    description: 'The Joyful Classic mang đến trải nghiệm trọn vẹn về quá trình phục hồi và chế độ dinh dưỡng. Trong căn phòng hai phòng ngủ rộng rãi dành cho cả gia đình, mẹ sẽ tìm thấy sự thoải mái và yên bình trong từng chi tiết. Chương trình này mang đến sự cân bằng hoàn hảo giữa các liệu pháp chữa lành cho cả tinh thần và thể chất, giúp mẹ sẵn sàng cho hành trình làm mẹ tuyệt vời phía trước.'
  },
  { 
    id: 'luxe', 
    title: 'The Joyful Luxe',
    heading: 'Chương trình 28 ngày nâng cấp',
    image: '/thejoyfulnest/experience/dieuduong.jpg',
    description: 'The Joyful Luxe cung cấp cho mẹ và bé dịch vụ chăm sóc sau sinh tối ưu. Thực đơn dinh dưỡng được chế biến từ những nguyên liệu tinh tuý nhất, nuôi dưỡng cơ thể mẹ từ sâu bên trong. Liệu trình massage, chăm sóc da mặt và các phương pháp trị liệu cao cấp giúp mẹ phục hồi nhan sắc và tái tạo năng lượng. Căn ba phòng ngủ rộng rãi mang đến không gian riêng tư và thoải mái cho cả gia đình. Và để kỷ niệm tháng ngày đầu đời của bé yêu, chúng tôi sẽ giúp mẹ tổ chức một bữa tiệc đầy tháng ý nghĩa.'
  },
  { 
    id: 'royal', 
    title: 'The Joyful Royal',
    heading: 'Chương trình 28 ngày toàn diện và cao cấp nhất',
    image: '/thejoyfulnest/experience/tanhuong.jpg',
    description: 'The Joyful Royal mở ra một chương mới đầy viên mãn với dịch vụ đẳng cấp cho hành trình sau sinh của mẹ. Không chỉ là những bữa ăn bổ dưỡng và liệu trình hồi phục sức khỏe, The Joyful Royal còn mang đến những dịch vụ cá nhân hóa, từ liệu pháp massage chuyên biệt đến buổi chụp hình chuyên nghiệp ghi dấu khoảnh khắc thiêng liêng bên con yêu. Các buổi tập yoga nhẹ nhàng, pilates uyển chuyển hay các lớp học chăm sóc trẻ sơ sinh bổ ích, đều được thiết kế và tinh chỉnh phù hợp với nhu cầu riêng của mẹ. Đội ngũ chăm sóc tận tâm sẽ đồng hành cùng mẹ 24/7, hỗ trợ gia đình từ những ngày đầu sau sinh cho đến khi rời tổ ấm The Joyful Nest. The Joyful Royal không chỉ là một chương trình chăm sóc sau sinh chuyên biệt mà còn là món quà ý nghĩa nhất dành tặng mẹ, một hành trình tôn vinh thiên chức mới, nơi bạn được yêu thương, chăm sóc và tận hưởng trọn vẹn niềm hạnh phúc bên con.'
  },
  { 
    id: 'beginning', 
    title: 'The Joyful Beginning',
    heading: 'Chương trình 14 ngày',
    image: '/thejoyfulnest/experience/con.jpg',
    description: 'Hãy bước vào hành trình hồi phục sau sinh với tất cả sự yêu thương và hỗ trợ mà mẹ xứng đáng nhận được. Chương trình The Joyful Beginning được thiết kế đặc biệt giúp mẹ hồi phục và lấy lại sức khỏe, dù mẹ sinh mổ hay sinh thường. Chúng tôi sẽ luôn túc trực bên mẹ, cung cấp chế độ ăn chuyên biệt và sự hỗ trợ tận tình để mẹ tự tin trên hành trình nuôi con bằng sữa mẹ. Đây chính là điểm tựa và là khởi đầu vững chắc cho hành trình phía trước của mẹ.'
  },
  { 
    id: 'glow', 
    title: 'The Joyful Glow',
    heading: 'Chương trình 14 ngày',
    image: '/thejoyfulnest/experience/tay.jpg',
    description: 'Hãy đắm chìm trong hành trình chữa lành sâu sắc cùng The Joyful Glow, nơi giai đoạn hậu sản của mẹ được nâng tầm với những liệu pháp thư giãn, nuôi dưỡng cả thể chất lẫn tinh thần. Tận hưởng những liệu trình massage nhẹ nhàng, tái tạo làn da tươi trẻ, và những buổi xông hơi ấm áp, tất cả được thiết kế tỉ mỉ để mang lại sự an dưỡng cho mẹ. Thưởng thức những món ăn tinh tế, chế biến từ nguyên liệu thượng hạng, và lưu giữ những khoảnh khắc quý giá này qua ống kính của các nhiếp ảnh gia chuyên nghiệp. Khi hành trình này khép lại, mẹ sẽ sẵn sàng bước ra với vẻ ngoài rạng rỡ, tự tin và tràn đầy sức sống.'
  }
];

const CAROUSEL_IMAGES = [
  '/thejoyfulnest/experience/carousel/167c7e0e-dcb3-4a5d-9193-a019a63b5709.jpg',
  '/thejoyfulnest/experience/carousel/be84fd07-72d8-4887-b64e-bdc97315d678.jpg',
  '/thejoyfulnest/experience/carousel/Diem-My-9x-Mom-1-1.png',
  '/thejoyfulnest/experience/carousel/Diem-My-9x-mom-1.png',
  '/thejoyfulnest/experience/carousel/Tina-Yong-letter.jpg',
  '/thejoyfulnest/experience/carousel/TJN-A-letter-to-The-Joyful-Nest-1.png',
  '/thejoyfulnest/experience/carousel/TJN-A-letter-to-The-Joyful-Nest-2-1.png'
];

export default function ExperiencePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeProgramId, setActiveProgramId] = useState(PROGRAMS[0].id);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % CAROUSEL_IMAGES.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Intro Hero Section */}
        <section className={styles.heroSection}>
          <motion.div 
            className={styles.heroImageWrapper}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/thejoyfulnest/experience/experience.jpg"
              alt="The Joyful Experience"
              width={2000}
              height={857}
              className={styles.heroImage}
              priority
            />
          </motion.div>
        </section>

        {/* Narrative Split Section */}
        <section className={styles.narrativeSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.splitHeader}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h1 className={styles.pageTitle}>
                28 Ngày đầu tiên -<br />
                The Joyful Experience
              </h1>
              <div className={styles.descriptionWrapper}>
                <p className={styles.pageDesc}>
                  Chương trình đặc biệt của The Joyful Nest được chắt lọc tinh hoa từ nghệ thuật chăm sóc hậu sản cổ truyền và y học hiện đại, tạo nên hành trình 28 ngày phục hồi dành riêng cho mẹ. Mỗi ngày, cơ thể mẹ được nâng niu, hồi sinh từng chút một, trong khi thiên thần nhỏ được lớn lên trong vòng tay yêu thương. Đây không chỉ là thời gian để mẹ phục hồi mà còn là dịp để tình mẫu tử đâm chồi, nở hoa. Khi hành trình khép lại, mẹ sẵn sàng bước tiếp với nguồn sinh lực dồi dào và niềm hạnh phúc trọn vẹn.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Accordion Section */}
        <section className={styles.accordionSection}>
          <div className={styles.accordionContainer}>
            {MILESTONES.map((milestone) => (
              <div key={milestone.id} className={styles.accordionItem}>
                <button 
                  className={`${styles.accordionHeader} ${expandedId === milestone.id ? styles.activeHeader : ''}`}
                  onClick={() => toggleAccordion(milestone.id)}
                  aria-expanded={expandedId === milestone.id}
                >
                  <span className={styles.accordionTitle}>{milestone.title}</span>
                  <motion.span 
                    className={`${styles.accordionIcon} ${expandedId === milestone.id ? styles.activeIcon : ''}`}
                    animate={{ rotate: expandedId === milestone.id ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedId === milestone.id ? '✕' : '+'}
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedId === milestone.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.accordionContent}
                    >
                      <div className={styles.contentInner}>
                        <div className={styles.milestoneGrid}>
                          <div className={styles.milestoneImageWrapper}>
                            <Image 
                              src={milestone.image}
                              alt={milestone.title}
                              width={800}
                              height={600}
                              className={styles.milestoneImage}
                            />
                          </div>
                          <div className={styles.milestoneTextContent}>
                            {milestone.sections.map((sec, sidx) => (
                              <div key={sidx} className={styles.milestoneSection}>
                                <span className={styles.sectionLabel}>{sec.label}</span>
                                <h3 className={styles.sectionHeading}>{sec.heading}</h3>
                                <p className={styles.sectionText}>{sec.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
        
        {/* Programs Tabbed Section */}
        <section className={styles.programsSection}>
          <div className={styles.container}>
            <motion.h2 
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              Các chương trình chăm sóc
            </motion.h2>

            <div className={styles.tabsContainer}>
              <div className={styles.tabList}>
                {PROGRAMS.map((prog) => (
                  <button
                    key={prog.id}
                    className={`${styles.tabButton} ${activeProgramId === prog.id ? styles.activeTab : ''}`}
                    onClick={() => setActiveProgramId(prog.id)}
                  >
                    {prog.title}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProgramId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.tabContent}
              >
                {(() => {
                  const program = PROGRAMS.find(p => p.id === activeProgramId);
                  if (!program) return null;
                  return (
                    <div className={styles.programGrid}>
                      <div className={styles.programImageWrapper}>
                        <Image 
                          src={program.image}
                          alt={program.title}
                          width={1000}
                          height={750}
                          className={styles.programImage}
                        />
                      </div>
                      <div className={styles.programTextContent}>
                        <h3 className={styles.programHeading}>{program.heading}</h3>
                        <p className={styles.programDescription}>{program.description}</p>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Love Narrative Section */}
        <section className={styles.loveNarrativeSection}>
          <div className={styles.container}>
            <motion.div 
              className={styles.centeredContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className={styles.loveTitle}>Yêu thương gửi đến The Joyful Nest</h2>
              <div className={styles.loveTextWrapper}>
                <p>Mỗi hành trình làm mẹ là một câu chuyện dịu dàng, đong đầy yêu thương trong từng khoảnh khắc nhỏ bé. Những niềm vui lặng lẽ, những phút giây biết ơn sâu lắng – tất cả đều xứng đáng trân trọng và sẻ chia.</p>
                <p>Nếu trái tim bạn có những điều muốn nói, hãy để từng dòng chữ trở thành lời thì thầm ấm áp, gửi đến The Joyful Nest – nơi đã chở che, chăm sóc và đồng hành cùng bạn trong hành trình đặc biệt này.</p>
                <p className={styles.loveSignature}>Viết từ trái tim. Gửi đi bằng yêu thương. Trân trọng từng khoảnh khắc quý giá này.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Infinite Letter Carousel */}
        <section className={styles.carouselSection}>
          <div className={styles.carouselWrapper}>
            <motion.div 
              className={styles.carouselTrack}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 20, 
                ease: "linear", 
                repeat: Infinity 
              }}
            >
              {/* Double the images for seamless loop */}
              {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((img, idx) => (
                <div 
                  key={idx} 
                  className={styles.carouselItem} 
                  onClick={() => setSelectedIndex(idx % CAROUSEL_IMAGES.length)}
                >
                  <div className={styles.letterImageWrapper}>
                    <div className={styles.letterOverlay}>
                      <span className={styles.viewLabel}>View Letter</span>
                    </div>
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

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div 
              className={styles.lightboxOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
            >
              <button 
                className={styles.closeButtonX}
                onClick={() => setSelectedIndex(null)}
              >
                ✕
              </button>

              <button 
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                ‹
              </button>

              <motion.div 
                className={styles.lightboxContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={CAROUSEL_IMAGES[selectedIndex]} 
                  alt="Full feedback letter" 
                  className={styles.lightboxImage} 
                />
              </motion.div>

              <button 
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                ›
              </button>

              {/* Thumbnails below */}
              <div className={styles.thumbnailStrip} onClick={(e) => e.stopPropagation()}>
                {CAROUSEL_IMAGES.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.thumbnailItem} ${selectedIndex === idx ? styles.activeThumbnail : ''}`}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumbnail ${idx}`} 
                      width={60} 
                      height={80} 
                      className={styles.thumbnailImage}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final CTA Section */}
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
                <button className={styles.ctaButton}>Yêu Cầu Báo Giá</button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
