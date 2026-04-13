'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

import styles from './phong-nghi.module.css';

export default function PhongNghiPage() {
  return (
    <div className="app-shell__inner">
      <Header />
      <main className={`app-shell__main ${styles.main}`}>
        {/* Full-width Hero Section - Tương tự trang ẩm thực */}
        <div className={styles.heroWrapper}>
          <Image
            src="/thejoyfulnest/Room/Room.jpg"
            alt="The Joyful Nest Rooms"
            width={1716}
            height={500}
            className={styles.heroImage}
            priority
          />
        </div>

        <section className={styles.roomSection}>
          <div className={styles.container}>
            {/* Intro Sections - Tương tự trang ẩm thực */}
            <div className={styles.introSections}>
              <div className={styles.introGrid}>
                <div className={styles.introLeft}>
                  <h2 className={styles.introTitle}>Trải nghiệm không gian nghỉ ngơi thư giãn và đẳng cấp</h2>
                </div>
                <div className={styles.introRight}>
                  <p className={styles.introText}>
                    Hệ thống phòng nghỉ tại The Joyful Nest được thiết kế như một tổ ấm an yên, 
                    kết hợp hài hòa giữa kiến trúc hiện đại và sự tinh tế trong từng chi tiết. 
                    Mỗi căn phòng đều được tối ưu hóa ánh sáng tự nhiên, mang lại cảm giác nhẹ nhàng và thư thái tuyệt đối cho mẹ.
                  </p>
                  <p className={styles.introText}>
                    Chúng tôi chăm chút từ chất liệu ga giường lụa cao cấp đến hệ thống cách âm hoàn hảo, 
                    đảm bảo mẹ có những giấc ngủ sâu để phục hồi sức khỏe nhanh chóng. 
                    Sự tiện nghi vượt trội và không gian riêng tư chính là món quà mà chúng tôi dành tặng mẹ trên hành trình làm mẹ thiêng liêng này.
                  </p>
                </div>
              </div>
            </div>

            {/* Suite Services Section - New Section from Image */}
            <div className={styles.suiteServicesSection}>
              <h2 className={styles.suiteServicesTitle}>Dịch vụ mỗi phòng suite</h2>
              
              <div className={styles.servicesGrid}>
                {/* Item 1 */}
                <div className={styles.serviceItem}>
                  <div className={styles.serviceIconWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/ic-1.svg"
                      alt="Chăm sóc tận tâm"
                      width={80}
                      height={80}
                      className={styles.serviceIcon}
                    />
                  </div>
                  <p className={styles.serviceText}>
                    Chăm sóc ngày đêm đầy tận tâm từ đội ngũ bác sĩ, y tá và chuyên gia về sữa mẹ.
                  </p>
                </div>

                {/* Item 2 */}
                <div className={styles.serviceItem}>
                  <div className={styles.serviceIconWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/ic-3.svg"
                      alt="Chăm sóc mẹ"
                      width={80}
                      height={80}
                      className={styles.serviceIcon}
                    />
                  </div>
                  <p className={styles.serviceText}>
                    Bộ chăm sóc toàn diện cho mẹ, từ gối cho con bú mềm mại đến các dụng cụ hỗ trợ phục hồi chuyên dụng.
                  </p>
                </div>

                {/* Item 3 */}
                <div className={styles.serviceItem}>
                  <div className={styles.serviceIconWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/ic-2.svg"
                      alt="Chăm sóc bé"
                      width={80}
                      height={80}
                      className={styles.serviceIcon}
                    />
                  </div>
                  <p className={styles.serviceText}>
                    Bộ chăm sóc toàn diện cho bé, bao gồm nôi cao cấp, đồ dùng vệ sinh, và thiết bị theo dõi an toàn.
                  </p>
                </div>

                {/* Item 4 */}
                <div className={styles.serviceItem}>
                  <div className={styles.serviceIconWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/ic-4.svg"
                      alt="Dinh dưỡng"
                      width={80}
                      height={80}
                      className={styles.serviceIcon}
                    />
                  </div>
                  <p className={styles.serviceText}>
                    Năm bữa ăn tinh tế mỗi ngày, được chế biến kỳ công bởi các đầu bếp và chuyên gia dinh dưỡng.
                  </p>
                </div>
              </div>
            </div>
            {/* Room Carousel Section - Automatic Scroll */}
            <section className={styles.roomCarouselSection}>
              <div className={styles.carouselHeader}>
                <h2 className={styles.carouselTitle}>Phòng cao cấp hai phòng ngủ</h2>
                <p className={styles.carouselDesc}>
                  Cửa sổ lớn đượm nắng tạo nên một không gian sống 82 m² đầy thư thái, nơi gia đình nhỏ có thể tận hưởng những khoảnh khắc bình yên bên nhau. 
                  Mỗi góc nhỏ đều được thiết kế tỉ mỉ - từ chất liệu mềm mại, tông màu dịu dàng đến những tiện nghi tối giản, 
                  mang lại cảm giác dễ chịu giúp mẹ có thể thư giãn và hồi phục một cách tự nhiên nhất.
                </p>
              </div>

              <div className={styles.carouselViewport}>
                <div className={styles.carouselTrack}>
                  {/* First set of images */}
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel1/432A0977.jpg"
                      alt="Room View 1"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel1/Joyful-nest12331.jpg"
                      alt="Room View 2"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel1/Joyful-nest12370.jpg"
                      alt="Room View 3"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  {/* Duplicated set for seamless loop */}
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel1/432A0977.jpg"
                      alt="Room View 1"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel1/Joyful-nest12331.jpg"
                      alt="Room View 2"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel1/Joyful-nest12370.jpg"
                      alt="Room View 3"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Room Carousel Section 2 - Premium 3-Bedroom */}
            <section className={styles.roomCarouselSection} style={{ paddingTop: 0 }}>
              <div className={styles.carouselHeader}>
                <h2 className={styles.carouselTitle}>Phòng cao cấp ba phòng ngủ</h2>
                <p className={styles.carouselDesc}>
                  Tận hưởng cảm giác thư thái trong không gian 110 m² của căn hộ ba phòng ngủ, nơi mẹ có thể ngắm nhìn khung cảnh thành phố hòa cùng phong quang hữu tình. 
                  Ánh sáng ngập tràn mọi ngóc nhỏ, tạo nên không gian lý tưởng cho gia đình quây quần bên nhau, lưu giữ những khoảnh khắc đáng nhớ. 
                  Tiếp đón người thân trong những căn phòng rộng rãi, nơi niềm vui và tình yêu được sẻ chia. 
                  Mỗi chi tiết - từ sự chăm sóc chu đáo đến những tiện nghi thoải mái, giúp mẹ viết nên những trang đầu tiên trong hành trình mới cùng gia đình.
                </p>
              </div>

              <div className={styles.carouselViewport}>
                <div className={styles.carouselTrack}>
                  {/* First set of images */}
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel2/IMG_9843.jpg"
                      alt="Room View 4"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel2/IMG_9860.jpg"
                      alt="Room View 5"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel2/Joyful-nest12356.jpg"
                      alt="Room View 6"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  {/* Duplicated set for seamless loop */}
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel2/IMG_9843.jpg"
                      alt="Room View 4"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel2/IMG_9860.jpg"
                      alt="Room View 5"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                  <div className={styles.carouselImageWrapper}>
                    <Image
                      src="/thejoyfulnest/Room/carousel2/Joyful-nest12356.jpg"
                      alt="Room View 6"
                      fill
                      className={styles.carouselImage}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Room Amenities Section */}
            <section className={styles.amenitiesSection}>
              <div className={styles.amenitiesGrid}>
                <div className={styles.amenitiesLeft}>
                  <h2 className={styles.introTitle} style={{ color: '#fa8314' }}>Tiện nghi phòng</h2>
                </div>
                
                <div className={styles.amenitiesRight}>
                  {/* Category 1 */}
                  <div className={styles.amenityCategory}>
                    <h3 className={styles.amenityCategoryTitle}>Dịch vụ chăm sóc chuyên nghiệp</h3>
                    <div className={styles.amenityItemList}>
                      <p className={styles.amenityItemText}>Chăm sóc toàn diện theo lịch trình của mẹ: Bác sĩ thăm khám hàng tuần để theo dõi quá trình hồi phục của mẹ.</p>
                      <p className={styles.amenityItemText}>Đội ngũ chăm sóc luôn túc trực: Các y tá và bảo mẫu giàu kinh nghiệm sẽ chăm sóc mẹ và bé suốt 24/7.</p>
                      <p className={styles.amenityItemText}>An yên trong từng khoảnh khắc: Luôn có người bên cạnh, thấu hiểu những lo lắng của mẹ.</p>
                      <p className={styles.amenityItemText}>Bữa ăn dinh dưỡng hợp khẩu vị: Năm bữa ăn bổ dưỡng mỗi ngày, được chế biến tỉ mỉ bởi các đầu bếp và chuyên gia dinh dưỡng xuất sắc của chúng tôi.</p>
                      <p className={styles.amenityItemText}>Chúng tôi thay bạn lo toan tất cả những công việc thường nhật, từ giặt giũ, rửa bát cho đến tiệt trùng bình sữa.</p>
                      <p className={styles.amenityItemText}>Giờ đây, bạn có thể hoàn toàn an tâm, dành trọn thời gian vào quá trình phục hồi và có những khoảnh khắc quý giá bên gia đình.</p>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div className={styles.amenityCategory}>
                    <h3 className={styles.amenityCategoryTitle}>Đồ dùng cho Mẹ</h3>
                    <div className={styles.amenityItemList}>
                      <p className={styles.amenityItemText}>Thư thái từ những chi tiết nhỏ: Gối cho mẹ bú mềm mại và chiếc áo choàng ấm áp giúp mẹ cảm thấy thoải mái như trong chính ngôi nhà của mình.</p>
                      <p className={styles.amenityItemText}>Chăm sóc khi mẹ cần: Ghế cho bé bú êm ái, dụng cụ hỗ trợ chuyên dụng, và đội ngũ chuyên gia tư vấn về quá trình cho con bú luôn sẵn sàng trợ giúp mẹ.</p>
                      <p className={styles.amenityItemText}>Chu toàn mọi mặt: Những sản phẩm chăm sóc dịu nhẹ được chọn lọc cho quá trình hồi phục của mẹ.</p>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div className={styles.amenityCategory}>
                    <h3 className={styles.amenityCategoryTitle}>Đồ dùng cho Bé</h3>
                    <div className={styles.amenityItemList}>
                      <p className={styles.amenityItemText}>Mọi thứ cần thiết cho bé: Tã lót êm ái, sữa tắm và kem dưỡng dịu nhẹ, máy hâm sữa tiện dụng.</p>
                      <p className={styles.amenityItemText}>Hành trình nuôi con bằng sữa mẹ: Máy hút sữa theo tiêu chuẩn bệnh viện, máy tiệt trùng, túi trữ sữa cao cấp cùng các phụ kiện hỗ trợ khác.</p>
                      <p className={styles.amenityItemText}>Chăm sóc giấc ngủ của bé: Những chiếc nôi thoải mái, giá tắm vững chắc và giường ngủ ấm áp - tất cả đều được lựa chọn kỹ càng.</p>
                      <p className={styles.amenityItemText}>Chăm sóc từng khoảnh khắc của bé: Cân điện tử và đo nhiệt kế, để cả gia đình luôn yên tâm.</p>
                    </div>
                  </div>

                  {/* Category 4 */}
                  <div className={styles.amenityCategory}>
                    <h3 className={styles.amenityCategoryTitle}>Tiện nghi</h3>
                    <div className={styles.amenityItemList}>
                      <p className={styles.amenityItemText}>Mỗi căn suite được chăm chút tỉ mỉ, mang đến không gian thư giãn hoàn hảo với hai phòng tắm giúp bạn cảm thấy thoải mái và tĩnh dưỡng trong từng khoảnh khắc.</p>
                      <p className={styles.amenityItemText}>Một gian bếp đầy đủ tiện nghi, với mọi dụng cụ cần thiết, sẵn sàng chào đón bạn và những vị khách quý.</p>
                      <p className={styles.amenityItemText}>Thưởng thức sự tinh khiết của nước lọc Brita từ vòi, trong khi máy lọc không khí và máy tạo độ ẩm nhẹ nhàng duy trì không gian trong lành, thư thái.</p>
                      <p className={styles.amenityItemText}>Chúng tôi cũng chuẩn bị đầy đủ những tiện ích cần thiết cho cuộc sống hàng ngày: máy giặt, máy sấy, lò vi sóng, ấm đun nước và máy pha cà phê - tất cả đều sẵn sàng để mẹ cảm thấy như ở chính ngôi nhà của mình, thư giãn và tận hưởng mọi giây phút.</p>
                    </div>
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
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
