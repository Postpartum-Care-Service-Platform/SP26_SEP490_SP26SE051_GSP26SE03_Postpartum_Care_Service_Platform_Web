'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import styles from './kien-thuc.module.css';

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
      staggerChildren: 0.15,
    },
  },
};

export default function KienThucPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.main}>
        {/* Knowledge Hero Section */}
        <section className={styles.heroSection}>
          <motion.div
            className={styles.titleArea}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className={styles.pageTitle}>Kiến Thức</h1>
          </motion.div>

          <motion.div
            className={styles.contentArea}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p className={styles.introText} variants={fadeInUp}>
              Những khoảnh khắc đầu tiên trong thiên chức làm mẹ có thể tràn đầy lo lắng và băn khoăn.
              Tại The Joyful Nest, chúng tôi luôn sẵn sàng hỗ trợ và đồng hành cùng bạn trên hành trình thiêng liêng này.
              Với kiến thức và kinh nghiệm chuyên môn xuất sắc, chúng tôi mong muốn mang đến những hiểu biết quý giá,
              đồng hành cùng bạn trên con đường nuôi dưỡng hạnh phúc.
            </motion.p>

            <motion.div className={styles.searchContainer} variants={fadeInUp}>
              <input
                type="text"
                placeholder="tin tức"
                className={styles.searchInput}
              />
              <div className={styles.searchIconWrapper}>
                <MagnifyingGlassIcon className={styles.searchIcon} />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Knowledge Categories Grid */}
        <section className={styles.postsSection}>
          <motion.div
            className={styles.categoryGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { title: 'Tips cho mẹ', image: '/thejoyfulnest/knowlegde/docbao.jpg', href: '/kien-thuc/sieu-thuc-pham-sau-sinh-phuc-hoi' },
              { title: 'Tin Tức và Sự Kiện', image: '/thejoyfulnest/knowlegde/nhincon.jpg' },
              { title: 'Không Gian Tĩnh Dưỡng', image: '/thejoyfulnest/knowlegde/ngam.jpg' },
              { title: 'Chăm Sóc Sức Khỏe Mẹ Và Bé', image: '/thejoyfulnest/knowlegde/food.jpg' },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                className={styles.categoryCard}
                variants={fadeInUp}
              >
                <div className={styles.imageWrapper}>
                  {cat.href ? (
                    <Link href={cat.href}>
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className={styles.categoryImage}
                      />
                    </Link>
                  ) : (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className={styles.categoryImage}
                    />
                  )}
                </div>
                <div className={styles.cardTitleArea}>
                  <h3 className={styles.cardTitle}>{cat.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Post - Tips for Moms */}
        <section className={styles.featuredSection}>
          <motion.h2
            className={styles.sectionCategoryTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Tips cho mẹ
          </motion.h2>

          <motion.div
            className={styles.featuredCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.featuredImageArea}>
              <Link href="/kien-thuc/sieu-thuc-pham-sau-sinh-phuc-hoi" className={styles.featuredImageLink}>
                <Image
                  src="/thejoyfulnest/knowlegde/doan.jpg"
                  alt="Post"
                  fill
                  className={styles.featuredImage}
                />
              </Link>
            </div>
            <div className={styles.featuredContentArea}>
              <h3 className={styles.featuredTitle}>
                Siêu thực phẩm sau sinh giúp mẹ phục hồi: Dinh dưỡng để nuôi dưỡng cơ thể và tâm hồn
              </h3>
              <p className={styles.featuredText}>
                Sau chín tháng mười ngày mang thai, rồi trải qua một hành trình đầy thử thách để đón con yêu chào đời,
                cơ thể mẹ cần được chăm sóc và phục hồi nhiều hơn bao giờ hết. Nhưng giữa những đêm thức trắng,
                những cơn đau nhức còn âm i và trách nhiệm mới đấy&hellip;
              </p>
              <Link href="/kien-thuc/sieu-thuc-pham-sau-sinh-phuc-hoi">
                <button className={styles.viewDetailButton}>
                  Xem chi tiết
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Articles Grid - More Posts */}
        <section className={styles.articlesGridSection}>
          <motion.div
            className={styles.articlesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Thiết lập ranh giới cảm xúc khi làm mẹ: Chăm sóc bản thân để nuôi dưỡng yêu thương',
                image: '/thejoyfulnest/knowlegde/Joyful-nest12746-1-scaled-uai-2276x1707.jpg',
                desc: 'Trở thành mẹ là một trải nghiệm sâu sắc và đầy biến đổi, mang đến những cảm xúc hạnh phúc ngập tràn, sự gắn kết thiêng liêng, nhưng cũng đi kèm với&hellip;'
              },
              {
                title: 'Rụng tóc sau sinh – Chăm sóc và phục hồi',
                image: '/thejoyfulnest/knowlegde/ngam.jpg',
                desc: 'Làm mẹ là một sự chuyển hóa kỳ diệu - bản hòa ca của niềm vui, sự dịu dàng và sức mạnh bền bỉ. Nhưng giữa những khoảnh khắc ngọt ngào ôm ấp thiên&hellip;'
              },
              {
                title: 'Trữ đông sữa non: Hướng dẫn cơ bản cho Mẹ bầu và Mẹ sau sinh',
                image: '/thejoyfulnest/knowlegde/docbao.jpg',
                desc: 'Những giọt sữa đầu tiên của mẹ chính là món quà quý giá nhất dành cho bé, được ví như "vàng lỏng", sữa non chứa đầy đủ dưỡng chất và kháng thể giúp&hellip;'
              }
            ].map((post, idx) => (
              <motion.div
                key={idx}
                className={styles.articleCard}
                variants={fadeInUp}
              >
                <div className={styles.articleImageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className={styles.articleImage}
                  />
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>{post.title}</h3>
                  <p className={styles.articleDesc}>{post.desc}</p>
                  <button className={styles.viewDetailButton}>Xem chi tiết</button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.loadMoreContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <a href="#" className={styles.loadMoreButton}>Xem Thêm</a>
          </motion.div>
        </section>

        {/* Featured Post - News & Events */}
        <section className={styles.featuredSection}>
          <motion.h2
            className={styles.sectionCategoryTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Tin Tức và Sự Kiện
          </motion.h2>

          <motion.div
            className={styles.featuredCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.featuredImageArea}>
              <Image
                src="/thejoyfulnest/knowlegde/Horse-baby-2026-uai-1333x1000.png"
                alt="Horse Baby 2026"
                fill
                className={styles.featuredImage}
              />
            </div>
            <div className={styles.featuredContentArea}>
              <h3 className={styles.featuredTitle}>
                Em bé tuổi Ngọ mệnh Hỏa 2026: Sự ấm áp ẩn sau năng lượng
              </h3>
              <p className={styles.featuredText}>
                Có những chiều bình yên, khi mẹ chợt đặt tay lên bụng và biết rằng em bé của mình đang đến.
                Và có lẽ từ giây phút ấy, một hành trình mới đang bắt đầu. Chào đón em bé tuổi Ngọ 2026
                không chỉ là chờ đón ngày con yêu ra đời. Đó còn là hành trình mẹ học...
              </p>
              <button className={styles.viewDetailButton}>
                Xem chi tiết
              </button>
            </div>
          </motion.div>
        </section>

        {/* Articles Grid 2 - More News */}
        <section className={styles.articlesGridSection}>
          <motion.div
            className={styles.articlesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Đặc quyền giáng sinh cùng The Joyful Nest',
                image: '/thejoyfulnest/knowlegde/Xmas-promo-uai-1333x1000.png',
                desc: 'Chào đón mùa lễ hội cuối năm với những ưu đãi đặc biệt dành riêng cho mẹ và bé...'
              },
              {
                title: 'Dinh dưỡng sau sinh tại nhà cùng The Joyful Nest',
                image: '/thejoyfulnest/knowlegde/Dinh-duong-sau-sinh-tai-nha-1-uai-1333x1000.png',
                desc: 'Khi dinh dưỡng sau sinh trở thành điểm tựa an tâm cho hành trình hồi phục Giữa những đổi thay dồn dập của hành trình làm mẹ, dinh dưỡng không chỉ là...'
              },
              {
                title: 'Ở cữ toàn diện tại nhà cùng The Joyful Nest',
                image: '/thejoyfulnest/knowlegde/O-cu-toan-dien-tai-nha-1-uai-1333x1000.png',
                desc: 'Ở cữ toàn diện tại nhà Khi hành trình phục hồi được tiếp nối trong chính tổ ấm thân quen Với nhiều gia đình, sau sinh không chỉ là thời gian chăm sóc...'
              }
            ].map((post, idx) => (
              <motion.div
                key={idx}
                className={styles.articleCard}
                variants={fadeInUp}
              >
                <div className={styles.articleImageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className={styles.articleImage}
                  />
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>{post.title}</h3>
                  <p className={post.desc ? styles.articleDesc : ''}>{post.desc}</p>
                  <button className={styles.viewDetailButton}>Xem chi tiết</button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.loadMoreContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <a href="#" className={styles.loadMoreButton}>Xem Thêm</a>
          </motion.div>
        </section>

        {/* Featured Post - Tranquil Space */}
        <section className={styles.featuredSection}>
          <motion.h2
            className={styles.sectionCategoryTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Không Gian Tĩnh Dưỡng
          </motion.h2>

          <motion.div
            className={styles.featuredCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.featuredImageArea}>
              <Image
                src="/thejoyfulnest/knowlegde/TJN-Website-3-uai-1333x1000.png"
                alt="Caregiver Ratio"
                fill
                className={styles.featuredImage}
              />
            </div>
            <div className={styles.featuredContentArea}>
              <h3 className={styles.featuredTitle}>
                Tỉ lệ người chăm sóc trên một người mẹ và em bé: Điều quan trọng nhất bạn chưa hỏi khi chọn trung tâm chăm sóc sau sinh
              </h3>
              <p className={styles.featuredText}>
                Khi các gia đình bắt đầu tìm hiểu về các trung tâm chăm sóc sau sinh tại TP. Hồ Chí Minh,
                họ thường đặt ra những câu hỏi quen thuộc: Phòng có rộng không? Có đầu bếp riêng không?
                Gói dịch vụ bao gồm những gì? Đây đều là những yếu tố hoàn toàn hợp lý...
              </p>
              <button className={styles.viewDetailButton}>
                Xem chi tiết
              </button>
            </div>
          </motion.div>
        </section>

        {/* Articles Grid 3 - More Space/Recovery */}
        <section className={styles.articlesGridSection}>
          <motion.div
            className={styles.articlesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Hành Trình Làm Mẹ: Lời Chia Sẻ Tại The Joyful Nest',
                image: '/thejoyfulnest/knowlegde/post-3.png-uai-606x455.jpg',
                desc: 'Bước vào The Joyful Nest, bạn không chỉ tìm thấy một nơi để nghỉ ngơi mà còn là điểm tựa để phục hồi và kết nối sâu sắc hơn với chính...'
              },
              {
                title: 'Hành Trình Trọn Vẹn: Khởi Đầu Làm Mẹ Khỏe Mạnh và Chào Đón Bé Bình An',
                image: '/thejoyfulnest/knowlegde/Post-1-uai-906x680.jpg',
                desc: 'Giai đoạn làm mẹ là một trong những khoảng thời gian thay đổi thiêng liêng nhất trong cuộc đời. Tuy nhiên, bên cạnh niềm vui chào bản thiện thần nhỏ,...'
              },
              {
                title: 'Những Hoạt Động Phục Hồi Sau Sinh Tại The Joyful Nest',
                image: '/thejoyfulnest/knowlegde/post-4-uai-606x455.jpg',
                desc: 'Thời gian hậu sản là một giai đoạn chuyển mình quan trọng, nơi các bà mẹ không chỉ chăm sóc con cái mà còn cần tập trung vào việc phục hồi cả về thể...'
              }
            ].map((post, idx) => (
              <motion.div
                key={idx}
                className={styles.articleCard}
                variants={fadeInUp}
              >
                <div className={styles.articleImageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className={styles.articleImage}
                  />
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>{post.title}</h3>
                  <p className={styles.articleDesc}>{post.desc}</p>
                  <button className={styles.viewDetailButton}>Xem chi tiết</button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.loadMoreContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <a href="#" className={styles.loadMoreButton}>Xem Thêm</a>
          </motion.div>
        </section>

        {/* Featured Post - Health & Nutrition */}
        <section className={styles.featuredSection}>
          <motion.h2
            className={styles.sectionCategoryTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            Chăm Sóc Sức Khỏe Mẹ Và Bé
          </motion.h2>

          <motion.div
            className={styles.featuredCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.featuredImageArea}>
              <Image
                src="/thejoyfulnest/knowlegde/post-2-uai-906x680.jpg"
                alt="Recovery Recipes"
                fill
                className={styles.featuredImage}
              />
            </div>
            <div className={styles.featuredContentArea}>
              <h3 className={styles.featuredTitle}>
                Công Thức Món Ăn Hỗ Trợ Phục Hồi Cho Mẹ Sau Sinh
              </h3>
              <p className={styles.featuredText}>
                Sau hành trình vượt cạn đầy kỳ diệu, cơ thể mẹ cần được chăm sóc đặc biệt để phục hồi
                cả về thể chất lẫn tinh thần. Một chế độ dinh dưỡng khoa học không chỉ giúp mẹ
                nhanh chóng tái tạo năng lượng mà còn cung cấp nguồn sữa dồi dào, chất lượng cho...
              </p>
              <button className={styles.viewDetailButton}>
                Xem chi tiết
              </button>
            </div>
          </motion.div>
        </section>

        {/* Articles Grid 4 - Health & Well-being */}
        <section className={styles.articlesGridSection}>
          <motion.div
            className={styles.articlesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Nuôi Con Bằng Sữa Mẹ: Vượt Qua Những Thách Thức Thường Gặp',
                image: '/thejoyfulnest/knowlegde/Joyful-nest12887-uai-1777x1333.jpg',
                desc: 'Nuôi con bằng sữa mẹ là một trải nghiệm tuyệt vời và thiêng liêng, nhưng không phải lúc nào cũng dễ dàng. Đối với nhiều bà mẹ, hành trình này đầy thử...'
              },
              {
                title: 'Phương Pháp Chánh Niệm Giúp Mẹ Sau Sinh Giảm Căng Thẳng Và Lo Âu',
                image: '/thejoyfulnest/knowlegde/432A0449-uai-889x667.jpg',
                desc: 'Hành trình chăm sóc một em bé sơ sinh có thể khiến bạn cảm thấy choáng ngợp giữa niềm vui và sự mệt mỏi, và điều này hoàn toàn bình thường. Một trong...'
              },
              {
                title: 'Thể Dục Sau Sinh: Khôi Phục Sức Khỏe Và Tìm Lại Sức Mạnh',
                image: '/thejoyfulnest/knowlegde/Green-salad-at-the-joyful-nest-uai-1333x1000.jpg',
                desc: 'Hành trình làm mẹ là một hành trình tuyệt vời, nhưng cũng đậm thử thách về thể chất. Sau khi sinh con, nhiều bà mẹ tập trung vào việc chăm sóc...'
              }
            ].map((post, idx) => (
              <motion.div
                key={idx}
                className={styles.articleCard}
                variants={fadeInUp}
              >
                <div className={styles.articleImageWrapper}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className={styles.articleImage}
                  />
                </div>
                <div className={styles.articleContent}>
                  <h3 className={styles.articleTitle}>{post.title}</h3>
                  <p className={styles.articleDesc}>{post.desc}</p>
                  <button className={styles.viewDetailButton}>Xem chi tiết</button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.loadMoreContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <a href="#" className={styles.loadMoreButton}>Xem Thêm</a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
