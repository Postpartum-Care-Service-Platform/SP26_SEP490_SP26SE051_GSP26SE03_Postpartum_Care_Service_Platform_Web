'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import styles from './detail.module.css';

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
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
      staggerChildren: 0.1,
    },
  },
};

export default function ArticleDetail() {
  const sidebarArticles = [
    {
      date: 'Tháng 12 10, 2024',
      title: 'Công Thức Món Ăn Hỗ Trợ Phục Hồi Cho Mẹ Sau Sinh',
      description: 'Sau hành trình vượt cạn đầy kỳ diệu, cơ thể mẹ cần được&hellip;',
    },
    {
      date: 'Tháng 12 6, 2024',
      title: 'Nuôi Con Bằng Sữa Mẹ: Vượt Qua Những Thách Thức Thường Gặp',
      description: 'Nuôi con bằng sữa mẹ là một trải nghiệm tuyệt vời và thiêng&hellip;',
    },
    {
      date: 'Tháng 12 6, 2024',
      title: 'Phương Pháp Chánh Niệm Giúp Mẹ Sau Sinh Giảm Căng Thẳng Và Lo Âu',
      description: 'Hành trình chăm sóc một em bé sơ sinh có thể khiến bạn cảm&hellip;',
    },
  ];

  const superfoods = [
    {
      id: 1,
      name: 'Rau lá xanh – cải bó xôi, rau ngót, cải xoăn',
      content: 'Những loại rau này chứa nhiều sắt, canxi và axit folic, giúp bổ máu và hỗ trợ lành vết thương. Chúng cũng giàu chất chống oxy hóa, giúp mẹ giảm viêm và cải thiện sức khỏe tổng thể.',
      usage: 'Nấu canh rau ngót với thịt băm, cải bó xôi xào tỏi hoặc sinh tố cải xoăn với chuối.'
    },
    {
      id: 2,
      name: 'Cá hồi – giàu omega-3 giúp giảm trầm cảm sau sinh',
      content: 'Cá hồi chứa DHA, giúp cải thiện trí nhớ, giảm stress và phòng ngừa trầm cảm sau sinh. Chất béo lành mạnh trong cá hồi cũng giúp sữa mẹ dồi dào dinh dưỡng hơn.',
      usage: 'Hấp cá hồi với gừng, nấu cháo cá hồi hoặc làm salad cá hồi.'
    },
    {
      id: 3,
      name: 'Trứng – nguồn choline tốt cho trí não của bé',
      content: 'Trứng là thực phẩm giàu protein, dễ chế biến và giúp duy trì năng lượng. Choline trong trứng còn hỗ trợ phát triển trí não và thị nhớ cho bé yêu ngay từ những tháng đầu đời.',
      usage: 'Trứng luộc ăn sáng, trứng hấp hoặc trứng chiên với rau củ.'
    },
    {
      id: 4,
      name: 'Ngũ cốc nguyên hạt – cung cấp năng lượng bền vững',
      content: 'Yến mạch, quinoa và gạo lứt cung cấp carbohydrate lành mạnh, giúp mẹ duy trì năng lượng mà không lo bị kiệt sức. Đặc biệt, yến mạch còn giúp tăng tiết sữa cho mẹ đang cho con bú.',
      usage: 'Cháo yến mạch với hạt chia, cơm gạo lứt hoặc granola yến mạch với sữa chua.'
    },
    {
      id: 5,
      name: 'Nước hầm xương – hồi phục xương khớp và mô cơ',
      content: 'Nước hầm xương giàu collagen và khoáng chất, giúp mẹ hồi phục mô liên kết, giảm đau lưng và bảo vệ xương khớp sau quá trình mang thai và sinh nở.',
      usage: 'Canh nước hầm xương với rau củ hoặc uống một bát nước xương ấm vào buổi sáng.'
    },
    {
      id: 6,
      name: 'Sữa chua Hy Lạp – tốt cho tiêu hóa và hệ miễn dịch',
      content: 'Sau sinh, hệ tiêu hóa của mẹ có thể trở nên nhạy cảm hơn. Lợi khuẩn trong sữa chua Hy Lạp giúp cải thiện tiêu hóa, hấp thụ dinh dưỡng tốt hơn và tăng cường hệ miễn dịch.',
      usage: 'Sửa chua với mật ong, trái cây hoặc yến mạch.'
    },
    {
      id: 7,
      name: 'Bơ – giàu chất béo tốt và vitamin E',
      content: 'Bơ chứa nhiều chất béo lành mạnh, giúp da dẻ mẹ mịn màng hơn sau sinh và hỗ trợ chống mệt mỏi, mất nước.',
      usage: 'Sinh tố bơ, bơ dầm sữa hoặc salad bơ trứng.'
    },
    {
      id: 8,
      name: 'Kỷ tử – giúp mẹ có sức sống hơn',
      content: 'Kỷ tử chứa nhiều sắt, vitamin C và chất chống oxy hóa, giúp mẹ bổ máu, tăng cường sức khỏe tổng thể và giảm cảm giác mệt mỏi.',
      usage: 'Cho kỷ tử vào nước hầm xương, hãm trà hoặc nấu cháo.'
    },
    {
      id: 9,
      name: 'Gừng – giúp cơ thể ấm áp và hồi phục nhanh hơn',
      content: 'Gừng có tính ấm, giúp mẹ cải thiện lưu thông máu, giảm viêm và giữ ấm cơ thể – rất quan trọng đối với mẹ sau sinh.',
      usage: 'Trà gừng mật ong, canh gừng hoặc nước gừng xông hơi.'
    },
    {
      id: 10,
      name: 'Táo đỏ – bổ huyết và tăng cường năng lượng',
      content: 'Táo đỏ khô giàu vitamin C và các hợp chất giúp an thần, ngủ ngon, đồng thời tăng cường tuần hoàn máu, giúp làn da mẹ hồng hào hơn.',
      usage: 'Hầm canh táo đỏ, pha trà hoặc ăn trực tiếp.'
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Article Content */}
            <article className={styles.article}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className={styles.breadcrumb}>
                  In <Link href="/kien-thuc">Tips cho mẹ</Link>
                </div>
                
                <h1 className={styles.articleTitle}>
                  Siêu thực phẩm sau sinh giúp mẹ phục hồi: Dinh dưỡng để nuôi dưỡng cơ thể và tâm hồn
                </h1>

                <div className={styles.featuredImageWrapper}>
                  <Image
                    src="/thejoyfulnest/knowlegde/doan.jpg"
                    alt="Siêu thực phẩm sau sinh"
                    width={957}
                    height={638}
                    className={styles.featuredImage}
                    priority
                  />
                </div>

                <div className={styles.articleBody}>
                  <p>
                    Sau chín tháng mười ngày mang thai, rồi trải qua một hành trình đầy thử thách để đón con yêu chào đời, 
                    cơ thể mẹ cần được chăm sóc và phục hồi nhiều hơn bao giờ hết. Nhưng giữa những đêm thức trắng, 
                    những cơn đau nhức còn âm i và trách nhiệm mới đầy bỡ ngỡ, mẹ có thể quên mất rằng chính mình cũng cần được nuôi dưỡng.
                  </p>

                  <p>
                    Dinh dưỡng sau sinh không chỉ là để lấy lại sức mà còn là cách mẹ bồi đắp năng lượng, cân bằng nội tiết tố và hỗ trợ nguồn sữa cho con. 
                    Thực phẩm giàu dưỡng chất sẽ giúp mẹ phục hồi nhanh chóng, tinh thần tươi tắn hơn và sẵn sàng tận hưởng những khoảnh khắc đầu tiên đầy ý nghĩa bên bé. 
                    Hãy cùng khám phá những siêu thực phẩm giúp mẹ sau sinh khỏe mạnh hơn mỗi ngày.
                  </p>

                  <h2 className={styles.subTitle}>Tại sao dinh dưỡng sau sinh lại quan trọng?</h2>
                  <p>
                    Sau sinh, cơ thể mẹ trải qua nhiều thay đổi lớn, từ việc phục hồi sau quá trình chuyển dạ đến thích nghi với vai trò mới. 
                    Một chế độ ăn giàu dinh dưỡng sẽ giúp:
                  </p>
                  <ul className={styles.list}>
                    <li>Hỗ trợ vết thương mau lành, dù là sinh thường hay sinh mổ</li>
                    <li>Cải thiện tình trạng mệt mỏi, chóng mặt do mất máu</li>
                    <li>Cân bằng nội tiết tố, giảm nguy cơ trầm cảm sau sinh</li>
                    <li>Tăng cường chất lượng sữa mẹ, giúp bé yêu phát triển tốt hơn</li>
                  </ul>
                  <p>
                    Việc chăm sóc bản thân không cần quá cầu kỳ hay áp lực, chỉ cần từng bữa ăn nhỏ nhưng đầy đủ dinh dưỡng, 
                    mẹ sẽ cảm nhận được sự thay đổi tích cực trong cơ thể.
                  </p>

                  <h2 className={styles.sectionTitle}>10 siêu thực phẩm giúp mẹ sau sinh phục hồi nhanh chóng</h2>
                  
                  <div className={styles.superfoodsList}>
                    {superfoods.map((food) => (
                      <div key={food.id} className={styles.foodItem}>
                        <h3 className={styles.foodName}>{food.id}. {food.name}</h3>
                        <p className={food.content ? styles.foodContent : ''}>{food.content}</p>
                        <p className={styles.usage}>
                          <span className={styles.usageLabel}>Cách dùng:</span> {food.usage}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {sidebarArticles.map((article, idx) => (
                  <motion.div
                    key={idx}
                    className={styles.sidebarItem}
                    variants={fadeInUp}
                  >
                    <h4 className={styles.sidebarTitle}>{article.title}</h4>
                    <p className={styles.sidebarDesc}>{article.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </aside>
          </div>

          {/* Related Articles - You may also like&hellip; */}
          <section className={styles.relatedSection}>
            <motion.h2
              className={styles.relatedSectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              You may also like&hellip;
            </motion.h2>

            <motion.div
              className={styles.relatedGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  title: 'Em bé tuổi Ngọ mệnh Hỏa 2026: Sự ấm áp ẩn sau năng lượng',
                  image: '/thejoyfulnest/knowlegde/Horse-baby-2026-uai-1333x1000.png',
                  desc: 'Có những chiều bình yên, khi mẹ chợt đặt tay lên bụng và biết rằng em bé của mình đang đến. Và có lẽ từ giây phút ấy, một hành trình mới đang bắt đầu&hellip;'
                },
                {
                  title: 'Đặc quyền giáng sinh cùng The Joyful Nest',
                  image: '/thejoyfulnest/knowlegde/Xmas-promo-uai-1333x1000.png',
                  desc: 'Chào đón mùa lễ hội cuối năm với những ưu đãi đặc biệt dành riêng cho mẹ và bé&hellip;'
                },
                {
                  title: 'Dinh dưỡng sau sinh tại nhà cùng The Joyful Nest',
                  image: '/thejoyfulnest/knowlegde/Dinh-duong-sau-sinh-tai-nha-1-uai-1333x1000.png',
                  desc: 'Khi dinh dưỡng sau sinh trở thành điểm tựa an tâm cho hành trình hồi phục Giữa những đổi thay dồn dập của hành trình làm mẹ&hellip;'
                }
              ].map((post, idx) => (
                <motion.div
                  key={idx}
                  className={styles.relatedCard}
                  variants={fadeInUp}
                >
                  <div className={styles.relatedImageWrapper}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className={styles.relatedImage}
                    />
                  </div>
                  <div className={styles.relatedContent}>
                    <h3 className={styles.relatedTitle}>{post.title}</h3>
                    <p className={styles.relatedDesc}>{post.desc}</p>
                    <button className={styles.readMoreButton}>Read More</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
