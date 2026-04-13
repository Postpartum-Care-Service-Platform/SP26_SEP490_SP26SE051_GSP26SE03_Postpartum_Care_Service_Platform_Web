'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlurredIconTransition } from '@/components/ui/BlurredIconTransition';
import styles from './package.module.css';

export default function PackagePage() {
  return (
    <div className={styles.packagePage}>
      <Header />

      <main>
        {/* Full Video Hero Section */}
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
              <div className={styles.brandIconWrapper}>
                <BlurredIconTransition
                  iconA="/thejoyfulnest/package/icon.svg"
                  iconB="/thejoyfulnest/package/icon-2.svg"
                  duration={5.0}
                  size={80}
                  iconClassName={styles.brandIcon}
                  baseFilter="brightness(0) invert(1)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className={styles.introSection}>
          <h1 className={styles.introTitle}>
            Các chương trình chăm sóc toàn diện sau sinh và bảng giá
          </h1>
          
          <p className={styles.introHighlight}>
            Bốn tuần đầu sau sinh là khoảng thời gian đặc biệt và mong manh.
          </p>

          <div className={styles.introEmptySpace} />

          <p className={styles.introParagraph}>
            Cơ thể không còn mang thai, nhưng vẫn cần được chăm sóc sâu sắc. Khi em bé chào đời, mẹ cũng bắt đầu hành trình mới – làm mẹ.
          </p>

          <p className={styles.introShortDesc}>
            The Joyful Nest là trung tâm ở cữ 5 sao đầu tiên tại Việt Nam – được tạo ra để đồng hành cùng mẹ và em bé trong những ngày đầu sau sinh, với dịch vụ chăm sóc bé chuyên sâu, bữa ăn phục hồi dinh dưỡng và sự chăm sóc tận tâm, dịu dàng như mẹ xứng đáng được nhận.
          </p>

          <p className={styles.introParagraph}>
            Giai đoạn này xứng đáng được trân trọng, không vội vàng, không bỏ lỡ. Mẹ cần sự chậm rãi, nhẹ nhàng và nâng đỡ. Mọi nhịp sống trong mẹ khẽ đổi khác. Cảm xúc trở nên nhạy hơn. Và cơ thể bắt đầu quá trình phục hồi – chậm rãi, nhưng đầy cảm xúc.
          </p>

          <p className={styles.introShortDesc}>
            Tại đây, mẹ được hồi phục, bé được chăm sóc và hành trình làm mẹ bắt đầu trong sự dịu dàng và yêu thương
          </p>

          <div className={styles.introRightGroup}>
            <p className={styles.introParagraph}>
              Trong nhiều nền văn hoá, khoảng thời gian ở cử một tháng này luôn được gìn giữ. Mẹ được chăm sóc, không bị thúc ép. Được nuôi dưỡng, không bị lãng quên. Được nghỉ ngơi, để gắn kết trọn vẹn với con.
            </p>
            <p className={styles.introParagraph}>
              Tại The Joyful Nest, chúng tôi gìn giữ tinh hoa của truyền thống chăm sóc mẹ và bé, kết hợp cùng y khoa hiện đại để tạo nên một hành trình ở cử an yên và trọn vẹn. Dù mẹ cần vài ngày để nghỉ ngơi nhẹ nhàng hay một kỳ nghỉ trọn vẹn để phục hồi chuyên sâu, các gói 8, 14 và 28 ngày tại The Joyful Nest luôn sẵn sàng đồng hành và nâng niu mẹ bằng tất cả sự chăm sóc và thấu cảm.
            </p>
          </div>
        </section>

        {/* Packages Grid Section */}
        <section className={styles.packagesGridSection}>
          <div className={styles.packagesContainer}>
            <div className={styles.packageCardGrid}>
              {/* 14 Days Package */}
              <div className={styles.packageCard}>
                <div className={styles.cardIcon}>
                  <Image src="/thejoyfulnest/Room/ic-1.svg" alt="14 days" width={100} height={100} />
                </div>
                <h3 className={styles.cardTitle}>14 ngày nghỉ dưỡng</h3>
                <p className={styles.cardSubtitle}>Lấy lại cân bằng & thiết lập những kết nối đầu đời</p>
                <div className={styles.cardDivider} />
                <p className={styles.cardDescription}>
                  Hai tuần ở cữ là khoảng thời gian lý tưởng để mẹ phục hồi thể chất, ổn định cảm xúc, và bắt đầu kết nối sâu sắc với bé qua những chăm sóc cơ bản mỗi ngày. Mẹ có thời gian để học cách chăm con, hiểu con, và tự tin hơn trong vai trò mới.
                </p>
                <div className={styles.cardPriceWrapper}>
                  <div className={styles.cardDividerLight} />
                  <div className={styles.cardPrice}>
                    Từ 198 triệu đồng <span className={styles.usdPrice}>(~7,920 USD)</span>
                  </div>
                </div>
                <button className={styles.addToCartBtn}>Thêm vào giỏ hàng</button>
              </div>

              {/* 28 Days Package */}
              <div className={styles.packageCard}>
                <div className={styles.cardIcon}>
                  <Image src="/thejoyfulnest/Room/ic-2.svg" alt="28 days" width={100} height={100} />
                </div>
                <h3 className={styles.cardTitle}>28 ngày nghỉ dưỡng</h3>
                <p className={styles.cardSubtitle}>Phục hồi toàn diện, tự tin làm mẹ</p>
                <div className={styles.cardDivider} />
                <p className={styles.cardDescription}>
                  Gói 28 ngày mang đến hành trình hồi phục sâu sắc, lấy cảm hứng từ truyền thống ở cữ 1 tháng. Mẹ được chăm sóc toàn diện từ thể chất đến tinh thần, bé được nuôi dưỡng đúng cách theo chuẩn khoa học – ăn, ngủ, bú đều đặn. Sau một tháng, mẹ đủ mạnh mẽ, hiểu con và vững vàng bước vào hành trình nuôi dưỡng con dài lâu.
                </p>
                <div className={styles.cardPriceWrapper}>
                  <div className={styles.cardDividerLight} />
                  <div className={styles.cardPrice}>
                    Từ 388 triệu đồng <span className={styles.usdPrice}>(~15,520 USD)</span>
                  </div>
                </div>
                <button className={styles.addToCartBtn}>Thêm vào giỏ hàng</button>
              </div>

              {/* At Home Package */}
              <div className={styles.packageCard}>
                <div className={styles.cardIcon}>
                  <Image src="/thejoyfulnest/Room/ic-ldp-5.svg" alt="At home care" width={100} height={100} />
                </div>
                <h3 className={styles.cardTitle}>Chăm sóc toàn diện tại nhà</h3>
                <p className={styles.cardSubtitle}>Khi sự nâng niu vẫn tiếp tục, dù mẹ đã về nhà</p>
                <div className={styles.cardDivider} />
                <p className={styles.cardDescription}>
                  Hành trình tại The Joyful Nest có thể khép lại, nhưng sự nâng niu dành cho mẹ và bé vẫn tiếp tục. Chăm sóc Toàn diện tại Nhà giúp mẹ và bé được hỗ trợ cá nhân hóa ngay trong không gian quen thuộc của tổ ấm – để hành trình làm mẹ luôn liền mạch, nhẹ nhõm và an tâm.
                </p>
                <div className={styles.cardPriceWrapper}>
                  <div className={styles.cardDividerLight} />
                  <div className={styles.cardPrice}>
                    Từ 110 triệu đồng <span className={styles.usdPrice}>(~4,232 USD)</span>
                  </div>
                </div>
                <button className={styles.addToCartBtn}>Thêm vào giỏ hàng</button>
              </div>
            </div>
          </div>
        </section>

        {/* What Is Inside TJN Section */}
        <section className={styles.whatIsInside}>
          <div className={styles.whatIsInsideContainer}>
            <div className={styles.whatIsInsideGrid}>
              <div className={styles.imageColumn}>
                <Image
                  src="/thejoyfulnest/package/Joyful-nest12816-uai-1333x1000.jpg"
                  alt="Mom and baby care at TJN"
                  fill
                  className={styles.whatImage}
                />
              </div>

              <div className={styles.textColumn}>
                <h2 className={styles.whatTitle}>The Joyful Nest có gì?</h2>
                
                <p className={styles.whatSubtitle}>
                  Suốt 9 tháng thai kỳ, mẹ đã nâng niu từng nhịp tim, chờ đợi từng chuyển động bé xíu của con.
                </p>

                <p className={styles.whatDescription}>
                  Giờ đây, khi con đã chào đời, hãy để The Joyful Nest là nơi mẹ được vỗ về – một không gian ấm áp, riêng tư, nơi mẹ có thể thật sự nghỉ ngơi, phục hồi và bắt đầu hành trình làm mẹ trong sự dịu dàng và đủ đầy.
                </p>

                <p className={styles.whatDescription}>
                  Tại The Joyful Nest, mẹ sẽ được chăm sóc với trọn vẹn yêu thương:
                </p>

                <ul className={styles.whatList}>
                  <li className={styles.whatListItem}>
                    <span className={styles.bullet}>•</span>
                    <div>Bé yêu được chăm sóc 24/7 bởi điều dưỡng tận tâm và chuyên nghiệp</div>
                  </li>
                  <li className={styles.whatListItem}>
                    <span className={styles.bullet}>•</span>
                    <div>Phòng suite riêng biệt – đầy đủ tiện nghi, mang đến sự thư thái và kết nối sâu sắc giữa mẹ và bé</div>
                  </li>
                  <li className={styles.whatListItem}>
                    <span className={styles.bullet}>•</span>
                    <div>Các liệu trình phục hồi tự nhiên theo thể trạng của mẹ: tắm thảo dược, massage thư giãn, quấn bụng truyền thống</div>
                  </li>
                  <li className={styles.whatListItem}>
                    <span className={styles.bullet}>•</span>
                    <div>5 bữa ăn mỗi ngày – cân bằng dinh dưỡng, giúp mẹ phục hồi sức khỏe và cảm thấy nhẹ nhàng hơn từng ngày</div>
                  </li>
                  <li className={styles.whatListItem}>
                    <span className={styles.bullet}>•</span>
                    <div>Hỗ trợ nuôi con bằng sữa mẹ từ đội ngũ chuyên gia giàu kinh nghiệm</div>
                  </li>
                  <li className={styles.whatListItem}>
                    <span className={styles.bullet}>•</span>
                    <div>Tùy chọn lưu trú cùng ba hoặc người thân – để gia đình luôn ở bên nhau trong những ngày đầu thiêng liêng nhất</div>
                  </li>
                </ul>

                <p className={styles.whatFooterText}>
                  Mẹ không cần phải làm tất cả một mình – hãy để The Joyful Nest đồng hành cùng mẹ.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <h2 className={styles.faqMainTitle}>FAQs</h2>
            
            <div className={styles.faqList}>
              {[
                {
                  id: 1,
                  question: "Mẹ có thể ở cùng chồng hoặc người thân không?",
                  answer: "Có ạ. The Joyful Nest có các lựa chọn phòng suite để mẹ có thể ở cùng ba, ông/bà, hoặc bảo mẫu."
                },
                {
                  id: 2,
                  question: "Người thân đi cùng có được phục vụ bữa ăn không?",
                  answer: "Thực đơn tại The Joyful Nest được thiết kế chuyên biệt để hỗ trợ tối ưu cho quá trình phục hồi thể chất của mẹ sau sinh, vì vậy có thể không hoàn toàn phù hợp với nhu cầu của người thân đi cùng. Tuy nhiên, mỗi suite đều được trang bị khu bếp riêng với đầy đủ dụng cụ nấu nướng, mang đến sự linh hoạt và tiện nghi tối đa cho gia đình trong việc chuẩn bị bữa ăn theo ý muốn. Ngoài ra, chỉ mất 3 phút đi bộ là có thể đến trung tâm thương mại SC VivoCity với nhiều lựa chọn ẩm thực phong phú, và ngay dưới khách sạn cũng có nhà hàng phục vụ thuận tiện – giúp người thân dễ dàng tận hưởng bữa ăn trong suốt thời gian lưu trú."
                },
                {
                  id: 3,
                  question: "Phí dịch vụ và đặt cọc như thế nào?",
                  answer: "Mẹ cần đặt cọc 30% ngay khi ký hợp đồng, 70% còn lại thanh toán trước 30 ngày so với ngày nhận phòng. Đối với các đặt phòng gấp, cần thanh toán toàn bộ chi phí tại thời điểm đặt chỗ."
                },
                {
                  id: 4,
                  question: "Nếu ngày sinh thay đổi thì sao?",
                  answer: "Chúng tôi luôn linh hoạt trong trường hợp ngày dự sinh thay đổi – mẹ chỉ cần thông báo trước, và chúng tôi sẽ hỗ trợ điều chỉnh lịch trình một cách tốt nhất có thể."
                },
                {
                  id: 5,
                  question: "Chính sách hoàn hủy như thế nào?",
                  answer: (
                    <div className={styles.policyContent}>
                      <div className={styles.policyGroup}>
                        <h4 className={styles.policySubTitle}>HỦY HỢP ĐỒNG BỞI MẸ</h4>
                        <ul className={styles.policyList}>
                          <li>Nếu hủy hợp đồng vì lý do sức khỏe, Mẹ sẽ được hoàn lại toàn bộ số tiền, bao gồm cả tiền đặt cọc, với điều kiện cung cấp đầy đủ hồ sơ y tế.</li>
                          <li>Nếu hủy hợp đồng vì lý do khác trước ngày nhận phòng, tiền đặt cọc không được hoàn lại, nhưng các khoản thanh toán khác sẽ được hoàn trả.</li>
                          <li>Nếu hủy hợp đồng sau khi đã nhận phòng, cả tiền đặt cọc và phí dịch vụ đều không được hoàn lại.</li>
                        </ul>
                      </div>
                      <div className={styles.policyGroup}>
                        <h4 className={styles.policySubTitle}>HỦY HỢP ĐỒNG BỞI THE JOYFUL NEST</h4>
                        <p>The Joyful Nest có quyền hủy hợp đồng nếu sự an toàn của Mẹ hoặc Bé gặp rủi ro. Trong trường hợp này, Mẹ sẽ được hoàn trả chi phí cho các dịch vụ chưa sử dụng.</p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 6,
                  question: "Tôi không phải người Việt Nam, nếu tôi muốn sang Việt Nam sinh con và ở cữ tại The Joyful Nest, các bạn có hỗ trợ gì không?",
                  answer: (
                    <div className={styles.policyContent}>
                      <p className={styles.faqAnswer}>Chúng tôi rất hân hạnh được đồng hành cùng bạn trong hành trình sinh nở và phục hồi.</p>
                      <p className={styles.faqAnswer}>The Joyful Nest có thể hỗ trợ bạn:</p>
                      <ul className={styles.policyList}>
                        <li>Tư vấn quy trình đăng ký quốc tịch cho em bé sau sinh.</li>
                        <li>Kết nối bạn với các bệnh viện quốc tế uy tín tại Việt Nam, đảm bảo trải nghiệm sinh con an toàn và chất lượng.</li>
                        <li>Giới thiệu các bác sĩ sản khoa giàu kinh nghiệm, theo sát bạn trước – trong – và sau khi sinh.</li>
                        <li>Và sẵn sàng chia sẻ mọi thông tin cần thiết để bạn cảm thấy an tâm, vững vàng hơn trong giai đoạn đặc biệt này.</li>
                      </ul>
                    </div>
                  )
                },
                {
                  id: 7,
                  question: "Tôi có bắt buộc phải ở cùng người thân trong thời gian ở cữ không?",
                  answer: (
                    <div className={styles.policyContent}>
                      <p className={styles.faqAnswer}>Không bắt buộc – điều này hoàn toàn tùy thuộc vào mong muốn của mẹ. Nếu mẹ muốn có người thân ở cùng để được hỗ trợ tinh thần, The Joyful Nest luôn sẵn lòng chào đón.</p>
                      <p className={styles.faqAnswer}>Còn nếu mẹ mong muốn một không gian riêng tư, tĩnh lặng để nghỉ ngơi và phục hồi trọn vẹn, điều đó cũng hoàn toàn được – vì đội ngũ chăm sóc của chúng tôi luôn túc trực, sẵn sàng bên mẹ bất cứ lúc nào mẹ cần.</p>
                    </div>
                  )
                },
                {
                  id: 8,
                  question: "Tôi có thể chọn thời gian ở cữ khác với các gói có sẵn không?",
                  answer: "Có ạ. Chúng tôi thấu hiểu rằng mỗi mẹ đều có lịch trình sinh và nhu cầu riêng biệt. Vì vậy, The Joyful Nest luôn sẵn lòng thiết kế gói dịch vụ linh hoạt, phù hợp nhất với hành trình của riêng mẹ. Chỉ cần nhắn cho chúng tôi – mẹ sẽ luôn có một kế hoạch chăm sóc được cá nhân hóa, với sự dịu dàng và tận tâm đồng hành."
                },
                {
                  id: 9,
                  question: "Tôi nên đặt lịch ở cữ vào thời điểm nào?",
                  answer: "Chúng tôi khuyến khích các mẹ đặt lịch càng sớm càng tốt – để chắc chắn có chỗ và chuẩn bị chu đáo cho hành trình phục hồi sau sinh của bạn. Nhiều mẹ đã đặt chỗ ngay từ tuần thai thứ 6 để yên tâm sắp xếp mọi thứ thật nhẹ nhàng."
                }
              ].map((faq) => (
                <div key={faq.id} className={styles.faqItem}>
                  <button 
                    className={styles.faqHeader}
                    onClick={(e) => {
                      const el = document.getElementById(`faq-content-${faq.id}`);
                      const icon = document.getElementById(`faq-icon-${faq.id}`);
                      if (el) {
                        const isOpen = el.style.maxHeight !== '0px' && el.style.maxHeight !== '';
                        
                        // Close all other items if we are opening this one
                        if (!isOpen) {
                          const allContents = document.querySelectorAll('[id^="faq-content-"]');
                          const allIcons = document.querySelectorAll(`.${styles.faqIcon}`);
                          const allHeaders = document.querySelectorAll(`.${styles.faqHeader}`);
                          
                          allContents.forEach((c) => {
                            const content = c as HTMLElement;
                            content.style.maxHeight = '0px';
                            content.style.opacity = '0';
                            content.style.marginTop = '0px';
                          });
                          
                          allIcons.forEach((i) => {
                            (i as HTMLElement).style.transform = 'rotate(0deg)';
                          });
                          
                          allHeaders.forEach((h) => {
                            h.setAttribute('data-active', 'false');
                          });
                        }

                        el.style.maxHeight = isOpen ? '0px' : `${el.scrollHeight}px`;
                        el.style.opacity = isOpen ? '0' : '1';
                        el.style.marginTop = isOpen ? '0px' : '4px';
                        if (icon) icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                        
                        const btn = e.currentTarget;
                        btn.setAttribute('data-active', (!isOpen).toString());
                      }
                    }}
                  >
                    <span className={styles.faqQuestion}>{faq.question}</span>
                    <span id={`faq-icon-${faq.id}`} className={styles.faqIcon}></span>
                  </button>
                  <div 
                    id={`faq-content-${faq.id}`} 
                    className={styles.faqContent}
                    style={{ maxHeight: '0px', overflow: 'hidden', transition: 'all 0.4s ease', opacity: 0 }}
                  >
                    {typeof faq.answer === 'string' ? (
                      <p className={styles.faqAnswer}>{faq.answer}</p>
                    ) : (
                      faq.answer
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section className={styles.conclusionSection}>
          <div className={styles.faqContainer}>
            <div className={styles.conclusionTextWrapper}>
              <p className={styles.conclusionHighlight}>Hành trình làm mẹ có thể bắt đầu trong sự an yên.</p>
              <p className={styles.conclusionText}>
                The Joyful Nest luôn sẵn sàng là nơi mẹ được chăm sóc, được lắng nghe, và được nghỉ ngơi thực sự – để bạn hồi phục, kết nối và bắt đầu vai trò mới với tất cả yêu thương và vững chãi.
              </p>
            </div>
          </div>
          <div className={styles.orangeBar} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
