'use client';

import styles from './welcome-section.module.css';

export function WelcomeSection() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Chào mừng bạn đến với The Joyful Nest</h2>
        <p className={styles.subtitle}>Một trải nghiệm đẳng cấp cho mẹ sau sinh và bé</p>

        <div className={styles.columns}>
          <div className={styles.column}>
            <h3 className={styles.sectionTitle}>Khởi đầu hành trình làm mẹ...</h3>
            <p className={styles.paragraph}>
              Những tuần đầu tiên sau khi sinh là một cột mốc thiêng liêng trong cuộc đời mỗi người mẹ. Đó là
              khoảng thời gian đầy cảm xúc, nơi niềm hạnh phúc ngập tràn hòa quyện cùng những lo âu thầm lặng.
            </p>
            <p className={styles.paragraph}>
              The Joyful Nest được tạo nên từ những trải nghiệm sâu sắc của chính chúng tôi và từ việc lắng nghe
              những câu chuyện của các bà mẹ khác. Đây là lời tri ân dành cho thiên chức làm mẹ cao quý, nơi mọi
              kỳ vọng đều được đáp ứng bằng sự chăm sóc tinh tế và sâu sắc.
            </p>
            <p className={styles.paragraph}>
              The Joyful Nest mang đến một trải nghiệm độc đáo, kết hợp giữa y học hiện đại và sự chăm sóc khéo
              léo, tinh tế, giúp mẹ phục hồi về thể chất và tìm thấy sự cân bằng, bình yên trong tâm hồn. Đây là
              khởi đầu của hành trình làm mẹ trọn vẹn, nơi mẹ và bé được tôn vinh, yêu thương và nâng niu một cách
              xứng đáng nhất.
            </p>
          </div>

          <div className={styles.column}>
            <p className={styles.paragraph}>
              Những căn phòng tràn ngập ánh sáng tự nhiên, nơi mẹ và bé có thể cảm nhận sự thư giãn nhẹ nhàng như
              một vòng tay ấm áp. Đội ngũ chuyên gia tận tâm luôn đồng hành, cung cấp sự hỗ trợ toàn diện cho cả
              quá trình phục hồi về thể chất và tinh thần. Các phương pháp chăm sóc cá nhân hóa, từ dinh dưỡng
              đến trị liệu, được thiết kế riêng cho hành trình độc đáo của từng người mẹ.
            </p>
            <p className={styles.paragraph}>
              The Joyful Nest không chỉ là nơi để hồi phục, mà còn là nơi nuôi dưỡng những giấc mơ về một hành
              trình làm mẹ trọn vẹn. Chúng tôi tin rằng thời kỳ hậu sản không chỉ là về sự phục hồi, mà còn là
              một khởi đầu mới đầy cảm hứng, nơi những mối liên kết mới được nuôi dưỡng, sự tự tin được xây dựng
              và nền tảng vững chắc được đặt ra cho tương lai.
            </p>
            <p className={styles.paragraph}>
              Đây là nơi chúng tôi đã gửi gắm những khát vọng của chính mình từ hành trình làm mẹ, và giờ đây,
              chúng tôi muốn dành tặng món quà ý nghĩa này cho bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

