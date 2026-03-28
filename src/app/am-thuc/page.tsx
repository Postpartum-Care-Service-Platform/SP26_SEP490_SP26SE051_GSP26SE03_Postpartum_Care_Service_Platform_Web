'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import styles from './am-thuc.module.css';

export default function AmThucPage() {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Full-width Hero Section */}
        <div className={styles.heroWrapper}>
          <Image
            src="/thejoyfulnest/food/Joyful-nest12976.jpg"
            alt="The Joyful Nest Cuisine"
            width={1716}
            height={372}
            className={styles.heroImage}
            priority
          />
        </div>

        <section className={styles.amThucSection}>
          <div className={styles.container}>
            {/* Intro Sections */}
            <div className={styles.introSections}>
              {/* Section 1: Experience */}
              <div className={styles.introGrid}>
                <div className={styles.introLeft}>
                  <h2 className={styles.introTitle}>Trải nghiệm ẩm thực dinh dưỡng và đẳng cấp</h2>
                </div>
                <div className={styles.introRight}>
                  <p className={styles.introText}>
                    Ẩm thực tại The Joyful Nest là bản giao hưởng đầy tinh tế giữa hương vị đậm đà bản sắc Việt, 
                    những công thức gia truyền bởi bộ Trung Hoa cùng các món ăn quốc tế được yêu thích. 
                    Mỗi bữa ăn đều là một hành trình khám phá ẩm thực độc đáo, giúp mẹ thư giãn và tái tạo năng lượng.
                  </p>
                  <p className={styles.introText}>
                    Cảm giác ngon miệng và hài lòng của mẹ là mục tiêu mà chúng tôi hướng tới, 
                    luôn tận tâm chuẩn bị để phù hợp với văn hoá và khẩu vị riêng biệt. 
                    Từng món súp, mỗi tách trà đều được chế biến tỉ mỉ mỗi ngày dựa trên quá trình phục hồi của mẹ. 
                    Sự cân bằng tinh tế giữa hương vị và công dụng trị liệu ấy không chỉ đem lại sự thoải mái, 
                    mà còn khiến mẹ cảm nhận sự chăm sóc ân cần trên hành trình chữa lành này.
                  </p>
                </div>
              </div>

              {/* Section 2: Devotion */}
              <div className={styles.devotionSection}>
                <h2 className={styles.introTitle}>Tâm huyết của chúng tôi</h2>
                <p className={styles.introText}>
                  Những món ăn tại The Joyful Nest không chỉ xoa dịu cơn đói mà còn chứa đựng cả sự ân cần và chăm sóc. 
                  Các đầu bếp của chúng tôi, bằng tất cả tâm huyết, đã tạo nên những thực đơn không chỉ đánh thức mọi giác quan 
                  mà còn nuôi dưỡng cơ thể, giúp mẹ phục hồi và khỏe mạnh hơn mỗi ngày.
                </p>
              </div>
            </div>

            {/* Featured Cards Grid */}
            <div className={styles.featuredGrid}>
              <div className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <Image
                    src="/thejoyfulnest/food/Green-salad.jpg"
                    alt="Hương vị địa phương"
                    width={332}
                    height={498}
                    className={styles.featuredImage}
                  />
                </div>
              </div>

              <div className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <Image
                    src="/thejoyfulnest/food/432A1026.jpg"
                    alt="Công thức truyền thống"
                    width={332}
                    height={498}
                    className={styles.featuredImage}
                  />
                </div>
              </div>

              <div className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <Image
                    src="/thejoyfulnest/food/cake.jpg"
                    alt="Dinh dưỡng tối ưu"
                    width={332}
                    height={498}
                    className={styles.featuredImage}
                  />
                </div>
              </div>

              <div className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <Image
                    src="/thejoyfulnest/food/che.jpg"
                    alt="Món tráng miệng"
                    width={332}
                    height={498}
                    className={styles.featuredImage}
                  />
                </div>
              </div>
            </div>

            {/* Featured Content Details Grid */}
            <div className={styles.featuredContentGrid}>
              <div className={styles.featuredContentItem}>
                <h4 className={styles.featuredContentTitle}>Hương vị tươi ngon từ địa phương</h4>
                <p className={styles.featuredContentText}>
                  Để mang đến cho bạn những bữa ăn tươi ngon và bổ dưỡng nhất, 
                  The Joyful Nest hợp tác với các trang trại địa phương, 
                  lựa chọn những nguyên liệu tươi mới mỗi ngày.
                </p>
              </div>

              <div className={styles.featuredContentItem}>
                <h4 className={styles.featuredContentTitle}>Dinh dưỡng cho mẹ và bé</h4>
                <p className={styles.featuredContentText}>
                  Mỗi món ăn là một món quà đầy yêu thương, đồng hành cùng mẹ trên hành trình phục hồi sức khỏe, 
                  cung cấp dưỡng chất cho việc nuôi con bằng sữa mẹ đầy nhẹ nhàng và trọn vẹn.
                </p>
              </div>

              <div className={styles.featuredContentItem}>
                <h4 className={styles.featuredContentTitle}>Thoả mãn mọi giác quan</h4>
                <p className={styles.featuredContentText}>
                  Từ bài trí tinh tế, hương vị thơm ngon đến khẩu phần hợp lý, 
                  mỗi bữa ăn đều mang lại trải nghiệm ẩm thực độc đáo dành riêng cho mẹ.
                </p>
              </div>

              <div className={styles.featuredContentItem}>
                <h4 className={styles.featuredContentTitle}>Dành riêng cho mẹ</h4>
                <p className={styles.featuredContentText}>
                  Thực đơn được thiết kế riêng theo sở thích, đáp ứng khẩu vị và nhu cầu dinh dưỡng đặc thù 
                  của mẹ trong giai đoạn sau sinh này.
                </p>
              </div>
            </div>
          </div>

          {/* Nutrition Program Section - Full Width Background */}
          <div className={styles.nutritionProgramSection}>
            <div className={styles.container}>
              <h2 className={styles.nutritionProgramTitle}>Chương trình dinh dưỡng phục hồi sau sinh cho mẹ</h2>
              
              <div className={styles.nutritionGrid}>
                {/* 1. Ingredients */}
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionIconWrapper}>
                    <Image
                      src="/thejoyfulnest/food/ic-6.svg"
                      alt="Nguyên liệu tươi ngon"
                      width={100}
                      height={100}
                      className={styles.nutritionIcon}
                    />
                  </div>
                  <h3 className={styles.nutritionItemTitle}>Hương vị tinh tuý từ những nguyên liệu tươi ngon nhất</h3>
                  <p className={styles.nutritionItemText}>
                    Chúng tôi tự hào mang đến cho mẹ trải nghiệm ẩm thực đẳng cấp, 
                    với nguyên liệu hảo hạng đến từ các nhà cung cấp địa phương uy tín.
                  </p>
                </div>

                {/* 2. Calories/Nutrition */}
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionIconWrapper}>
                    <Image
                      src="/thejoyfulnest/food/ic-5.svg"
                      alt="Calo mỗi ngày"
                      width={100}
                      height={100}
                      className={styles.nutritionIcon}
                    />
                  </div>
                  <h3 className={styles.nutritionItemTitle}>Từ 1,730 đến 2,550 calo mỗi ngày</h3>
                  <p className={styles.nutritionItemText}>
                    Mỗi khẩu phần ăn được cân chỉnh hợp lý dựa trên chế độ dinh dưỡng 
                    của mẹ để nuôi dưỡng nguồn sữa ấm áp và cải thiện sức khỏe bên trong.
                  </p>
                </div>

                {/* 3. Daily Meals */}
                <div className={styles.nutritionItem}>
                  <div className={styles.nutritionIconWrapper}>
                    <Image
                      src="/thejoyfulnest/food/ic4.svg"
                      alt="5 bữa chính 2 bữa phụ"
                      width={100}
                      height={100}
                      className={styles.nutritionIcon}
                    />
                  </div>
                  <h3 className={styles.nutritionItemTitle}>5 bữa đầy đủ với 3 bữa chính và 2 bữa phụ</h3>
                  <p className={styles.nutritionItemText}>
                    Khẩu phần được thiết kế chu đáo để mang đến nguồn năng lượng dồi dào 
                    cho cơ thể mẹ suốt ngày dài.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nurturing Food Section - True Full Width */}
        <div className={styles.nurturingFoodSection}>
          <Image
            src="/thejoyfulnest/food/download.jpg"
            alt="Thực phẩm an dưỡng"
            fill
            className={styles.nurturingFoodBg}
          />
          <div className={styles.container}>
            <div className={styles.nurturingFoodBox}>
              <h2 className={styles.nurturingFoodTitle}>Thực phẩm an dưỡng</h2>
              <p className={styles.nurturingFoodText}>
                Những đầu bếp tại The Joyful Nest đã tạo nên những món ăn không chỉ ngon miệng mà còn chứa đựng cả tình yêu thương và sự quan tâm chân thành. 
                Mỗi bát súp thơm lừng, mỗi tách trà dịu ngọt - đều là những công thức được lưu truyền qua bao thế hệ. 
                Thảo mộc thiên nhiên và nguyên liệu tinh tuý sẽ nhẹ nhàng nâng niu và hỗ trợ quá trình phục hồi của bạn.
              </p>
            </div>
          </div>
        </div>

        <section className={styles.amThucSection} style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            {/* Healing Tea Section */}
            <div className={styles.healingTeaSection}>
              <h2 className={styles.healingTeaMainTitle}>Những tách trà chữa lành</h2>
              
              <div className={styles.teaGrid}>
                {/* Tea Card 1 */}
                <div className={styles.teaCard}>
                  <div className={styles.teaImageWrapper}>
                    <Image
                      src="/thejoyfulnest/food/tra.jpg"
                      alt="Trà thảo mộc"
                      fill
                      className={styles.teaImage}
                    />
                  </div>
                  <h3 className={styles.teaCardTitle}>Trà thảo mộc</h3>
                  <p className={styles.teaCardText}>
                    Cảm thụ từng nốt hương truyền thống trong mỗi tách trà an yên. 
                    Bộ sưu tập tám loại trà thảo mộc tinh tuý của chúng tôi được pha chế kỹ lưỡng, 
                    nâng niu mẹ trên mỗi giai đoạn hồi phục. Mỗi tách trà là sự hoà quyện 
                    hoàn hảo của những thảo mộc quý.
                  </p>
                </div>

                {/* Tea Card 2 */}
                <div className={styles.teaCard}>
                  <div className={styles.teaImageWrapper}>
                    <Image
                      src="/thejoyfulnest/food/tra(1).jpg"
                      alt="Nguồn gốc"
                      fill
                      className={styles.teaImage}
                    />
                  </div>
                  <h3 className={styles.teaCardTitle}>Nguồn gốc</h3>
                  <p className={styles.teaCardText}>
                    Truyền thống quý giá này bắt nguồn từ Trung Hoa cổ đại, nơi những bài thuốc 
                    chữa lành đầu tiên được ghi chép trong Hoàng đế Nội Kinh cách đây hàng 
                    nghìn năm. The Joyful Nest tự hào gìn giữ và tôn vinh những phương thuốc 
                    đã được thử thách qua thời gian.
                  </p>
                </div>

                {/* Tea Card 3 */}
                <div className={styles.teaCard}>
                  <div className={styles.teaImageWrapper}>
                    <Image
                      src="/thejoyfulnest/food/tra2.jpg"
                      alt="Truyền thống tình thân gia đình"
                      fill
                      className={styles.teaImage}
                    />
                  </div>
                  <h3 className={styles.teaCardTitle}>Truyền thống tình thân gia đình</h3>
                  <p className={styles.teaCardText}>
                    Mỗi tách trà là một câu chuyện về tình yêu thương và sự sẻ chia giữa những người mẹ. 
                    Vị ngọt thanh của táo đỏ, điểm chút ngọt nhẹ của kỷ tử, quyện lấy hương thơm 
                    đặc trưng của các loại thảo mộc cổ truyền tạo nên một thức trà không chỉ thơm 
                    ngon mà còn ấm lòng.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
