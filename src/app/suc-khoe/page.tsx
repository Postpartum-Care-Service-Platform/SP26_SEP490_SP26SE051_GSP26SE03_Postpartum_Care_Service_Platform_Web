'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './suc-khoe.module.css';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } as any
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

export default function SucKhoePage() {
  const detailedServiceBlocks = [
    {
      id: 'maternity',
      title: 'Chăm sóc sản phụ',
      description: 'Từ đội ngũ bác sĩ, y tá, nhân viên hộ sinh cho đến các nhân viên chăm sóc, chúng tôi luôn sát cánh kề bên mỗi khi mẹ cần, vừa đủ tinh tế để tôn trọng không gian riêng của mẹ và bé.',
      image: '/thejoyfulnest/health/bopvai-uai-2000x599.jpg',
      hasTopBorder: true,
      services: [
        {
          title: 'Phục hồi thể chất',
          description: 'Sự phục hồi của mẹ là ưu tiên hàng đầu của chúng tôi. Để đáp ứng những gì mẹ cần trong hành trình phục hồi sau sinh, đội ngũ y tá chúng tôi sẽ chăm sóc mẹ dưới sự theo dõi sát sao của các chuyên gia quốc tế, bao gồm làm hồi phục vết thương cho sinh mổ hoặc sinh thường.',
        },
        {
          title: 'Hỗ trợ cho con bú',
          description: 'Các chuyên gia tư vấn sữa mẹ giàu kinh nghiệm luôn sẵn sàng hỗ trợ bạn 24/7. Dù bạn cần tư vấn về tư thế cho con bú, lo lắng về lượng sữa, hay gặp phải những vấn đề như tắc sữa vào ban đêm, chúng tôi luôn ở bên để giúp đỡ bạn.',
        },
        {
          title: 'Sức khỏe tinh thần',
          description: 'Chúng tôi nâng niu cơ thể và cả cảm xúc của mẹ với sự quan tâm sâu sắc. Đội ngũ chuyên gia tâm lý của chúng tôi luôn ở bên cạnh giúp bạn thích nghi với thiên chức mới. Dù bạn đang trải qua những thay đổi cảm xúc thông thường hay cần thêm sự hỗ trợ để vượt qua trầm cảm sau sinh, The Joyful Nest sẽ là nơi an toàn để bạn trải lòng và tìm thấy sự cân bằng.',
        }
      ]
    },
    {
      id: 'newborn',
      title: 'Chăm sóc trẻ sơ sinh',
      image: '/thejoyfulnest/health/chobu-uai-2000x599.jpg',
      hasTopBorder: true,
      services: [
        {
          title: 'Theo dõi sơ sinh',
          description: 'Chúng tôi dõi theo từng bước chân đầu đời của bé bằng tất cả tình yêu thương và sự trân trọng. Mỗi ngày là một hành trình khám phá những điều kỳ diệu nhỏ bé – từ những cử động nhỏ xíu đến những biểu cảm đáng yêu. Chúng tôi nhẹ nhàng cân đo, quan sát những thay đổi trong thói quen ăn ngủ của bé, và cùng bạn tận hưởng những khoảnh khắc vô giá này.',
        },
        {
          title: 'Chăm sóc chuyên biệt',
          description: 'Mỗi bé đều có sự khác biệt – từ lúc tắm, đi ngủ cho đến khi bé cảm thấy khó chịu hay mong muốn điều gì đó. Đội ngũ y tá của chúng tôi luôn tinh tế lắng nghe và phối hợp nhịp nhàng giúp bé cảm thấy thoải mái và an yên, như được vỗ về trong tình yêu thương ấm áp của mẹ.',
        },
        {
          title: 'Hỗ trợ phát triển',
          description: 'Những giai điệu du dương, êm ái như lời ru của mẹ và những cử động nhẹ nhàng, âu yếm sẽ đồng hành cùng bé mỗi ngày, khơi dậy những tiềm năng đang ẩn chứa bên trong. Những khoảnh khắc da kề da ấm áp như phương pháp kangaroo sẽ giúp tình cảm mẹ con thêm gắn bó, tạo nên những kỷ niệm đẹp và khó quên.',
        }
      ]
    },
    {
      id: 'spa',
      title: 'Spa & Sức khoẻ toàn diện',
      image: '/thejoyfulnest/health/spa-2000x599.jpg',
      hasTopBorder: true,
      services: [
        {
          title: 'Liệu pháp truyền thống',
          description: 'Với mỗi liệu trình, mẹ sẽ được giải toả các cơn đau nhức trong cơ thể, nhẹ nhàng tái tạo lại năng lượng. Với sự hướng dẫn của những chuyên gia trong lĩnh vực y học cổ truyền, từng phương pháp nơi đây là kết tinh của nhiều năm hành nghề, mang đến trải nghiệm tuyệt vời giúp mẹ tìm lại sự thoải mái và bình yên.',
        },
        {
          title: 'Cân bằng tinh thần - thể chất',
          description: 'Trong không gian lý tưởng dành cho thiền và yoga, với làn hương dịu nhẹ từ tinh dầu aroma thiên nhiên, mẹ sẽ được thả mình vào khoảnh khắc tĩnh tại để kết nối với bản thân từ tâm khảm. Nhờ đó, cả thể chất lẫn tinh thần của mẹ sẽ được hồi phục một cách nhẹ nhàng hơn bao giờ hết.',
        },
        {
          title: 'Làm đẹp & Chăm sóc bản thân',
          description: 'Tận hưởng các liệu pháp được thiết kế riêng cho bạn, từ các liệu pháp chăm sóc da mặt được cá nhân hoá đến dưỡng tóc bằng thảo dược Trung Hoa quý hiếm. Các bài tập yoga và pilates sau sinh được thiết kế phù hợp sẽ giúp bạn dần hồi phục sức khỏe.',
        }
      ]
    },
    {
      id: 'community',
      title: 'Gắn kết cộng đồng',
      image: '/thejoyfulnest/health/congdong-uai-2000x599.jpg',
      hasTopBorder: true,
      services: [
        {
          title: 'Hành trình san sẻ',
          description: 'Còn điều gì tuyệt vời hơn khi mẹ có những người bạn đồng hành để chia sẻ. Những buổi trà chiều ấm áp và thân mật là nơi những tâm hồn đồng điệu gặp gỡ và kết nối.',
        },
        {
          title: 'Học hỏi cùng nhau',
          description: 'Chúng tôi tổ chức những buổi workshop gần gũi, ấm áp, giúp mẹ nâng cao kiến thức chăm sóc bé và kỹ năng làm mẹ.',
        },
        {
          title: 'Kết nối ý tưởng',
          description: 'Lưu giữ những kỷ niệm đẹp trong các lớp học làm đồ lưu niệm. Cùng những người mẹ khác, bạn sẽ tạo ra những món quà ý nghĩa và vun đắp những tình bạn bền lâu.',
        }
      ]
    },
    {
      id: 'memories',
      title: 'Lưu giữ kỷ niệm',
      image: '/thejoyfulnest/health/kyniem-uai-2000x599.jpg',
      hasTopBorder: true,
      services: [
        {
          title: 'Nhiếp ảnh chuyên nghiệp',
          description: 'Các nhiếp ảnh gia của chúng tôi sẽ ghi lại những hình ảnh đáng yêu của con, từ những ngón tay nhỏ xinh đến nụ cười đầu tiên, giúp bạn lưu giữ những kỷ niệm vô giá.',
        },
        {
          title: 'Kỷ niệm quý giá',
          description: 'Ghi dấu những khoảnh khắc đầu đời của bé của bé bằng cách tạo khuôn tay và chân, giúp bạn lưu giữ những khoảng khắc quý giá mãi về sau.',
        },
        {
          title: 'Tiệc mừng gia đình',
          description: 'The Joyful Nest sẽ đồng hành cùng bạn trong những sự kiện quan trọng, từ chụp ảnh gia đình đến tổ chức tiệc đầy tháng, để bạn có những kỷ niệm trọn vẹn và ý nghĩa.',
        }
      ]
    }
  ];

  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Intro Narrative Section */}
        <section className={styles.contentSection}>
          <div className={styles.narrativeItem}>
            <motion.div
              className={`${styles.imageSection} ${styles.fullWidthImage}`}
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src="/thejoyfulnest/health/Joyful-nest12877.jpg"
                  alt="Hành trình chữa lành"
                  width={2000}
                  height={857}
                  className={styles.narrativeImage}
                  priority
                />
              </div>
            </motion.div>

            <div className={styles.container}>
              <motion.div
                className={styles.detailSection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.h2 className={styles.sectionTitle} variants={fadeInUp}>
                  Hành trình chữa lành: Giúp mẹ tìm lại sự cân bằng sau sinh
                </motion.h2>
                <motion.p className={styles.sectionDesc} variants={fadeInUp}>
                  Ở The Joyful Nest, chúng tôi hiểu rằng hành trình làm mẹ là một hành trình đầy cảm xúc. Vì vậy, chúng tôi không chỉ chăm sóc sức khỏe thể chất mà còn quan tâm đến cả tinh thần của bạn. Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi luôn sẵn sàng lắng nghe, chia sẻ và hỗ trợ bạn. Từ những liệu pháp spa êm dịu đến những cử chỉ chăm sóc ân cần mỗi ngày, The Joyful Nest sẽ là nơi bạn tìm thấy sự bình yên, niềm tin và tình bạn ấm áp.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Service Blocks */}
        {detailedServiceBlocks.map((block) => (
          <section key={block.id} className={styles.serviceSection}>
            {block.hasTopBorder && <div className={styles.topBorder} />}

            <div className={styles.container}>
              {block.id === 'maternity' ? (
                /* Split Header for Maternity Care */
                <motion.div 
                  className={styles.splitHeader}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.sectionDesc}>{block.description}</p>
                </motion.div>
              ) : (
                /* Centered Header for other sections */
                <motion.div 
                  className={styles.centeredHeader}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <h2 className={styles.blockTitle}>{block.title}</h2>
                  {block.description && <p className={styles.blockDesc}>{block.description}</p>}
                </motion.div>
              )}
            </div>

            {/* Framed Image */}
            <motion.div
              className={styles.imageSection}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={block.image}
                  alt={block.title}
                  width={2000}
                  height={599}
                  className={styles.narrativeImage}
                />
              </div>
            </motion.div>

            {/* 3-Column Grid */}
            <div className={styles.gridSection}>
              <div className={styles.container}>
                <div className={styles.servicesGrid}>
                  {block.services.map((service, index) => (
                    <motion.div
                      key={index}
                      className={styles.gridItem}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeInUp}
                    >
                      <h3 className={styles.gridTitle}>{service.title}</h3>
                      <p className={styles.gridDesc}>{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

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
