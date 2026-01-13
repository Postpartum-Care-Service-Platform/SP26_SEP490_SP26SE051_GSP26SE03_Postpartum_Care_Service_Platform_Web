'use client';

import React from 'react';

import '@/styles/footer.css';

const EXPLORE_LINKS = [
  { label: 'The Joyful Experience', href: 'https://thejoyfulnest.com/vi/thejoyfulexperience/' },
  { label: 'Phòng Nghỉ', href: 'https://thejoyfulnest.com/vi/phong-nghi/' },
  { label: 'Ẩm Thực', href: 'https://thejoyfulnest.com/vi/am-thuc/' },
  { label: 'Sức Khỏe', href: 'https://thejoyfulnest.com/vi/suc-khoe/' },
  { label: 'Tiện Ích', href: 'https://thejoyfulnest.com/vi/tien-ich/' },
  { label: 'Giới Thiệu', href: 'https://thejoyfulnest.com/vi/gioi-thieu/' },
  { label: 'Liên Hệ', href: 'https://thejoyfulnest.com/vi/lien-he/' },
];

const CONNECT_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/thejoyfulnestvn/' },
  { label: 'Facebook', href: 'https://www.facebook.com/thejoyfulnestvn/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/103067394' },
  { label: 'YouTube', href: 'https://www.youtube.com/@thejoyfulnest' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@thejoyfulnestvn' },
  { label: 'Trò chuyện qua WhatsApp', href: 'https://wa.me/84392048299' },
  { label: 'Trò chuyện qua Zalo', href: 'https://zalo.me/1458716735570123944' },
];

export function Footer() {
  return (
    <footer className="footer" id="colophon" aria-label="Site footer">
      <div className="footer__container">
        <div className="footer__grid">
            {/* Address */}
          <div className="footer__col">
              <p>
                Oakwood Residence Saigon
                <br />
                1056A Đường Nguyễn Văn Linh, Phường Tân Phong, Quận 7, Thành phố Hồ Chí Minh, Việt Nam
              </p>

              <p>
                Chăm sóc khách hàng:
                <br />
                Hotline: (+84) 392 048 299
                <br />
                Email: hello@thejoyfulnest.com
              </p>

              <p>Thứ Hai đến Thứ Bảy: 8:00 – 17:00</p>
            </div>

            {/* Explore */}
          <nav className="footer__col" aria-label="Khám phá">
            <p className="footer__title">Khám phá</p>
            <ul className="footer__list">
                {EXPLORE_LINKS.map((l) => (
                  <li key={l.label}>
                  <a className="footer__link" href={l.href}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect */}
          <nav className="footer__col" aria-label="Kết nối">
            <p className="footer__title">Kết nối</p>
            <ul className="footer__list">
                {CONNECT_LINKS.map((l) => (
                  <li key={l.label}>
                  <a className="footer__link" href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter + policy */}
          <div className="footer__col">
            <p className="footer__title">Đăng ký nhận thông tin mới nhất</p>

              <form
              className="footer__newsletter"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                className="footer__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="email"
                />
              <button className="footer__submit" type="submit">
                  Gửi
                </button>
              </form>

            <div className="footer__policy">
              <a className="footer__link" href="https://thejoyfulnest.com/vi/dieu-khoan-va-dieu-kien/">
                  Điều Khoản và Điều Kiện
                </a>
              <a className="footer__link" href="https://thejoyfulnest.com/vi/chinh-sach-rieng-tu/">
                  Chính Sách Riêng Tư
                </a>
              </div>
            </div>
          </div>

        <div className="footer__bottom">Ⓒ 2025 - All Rights Reserved</div>
        </div>
    </footer>
  );
}
