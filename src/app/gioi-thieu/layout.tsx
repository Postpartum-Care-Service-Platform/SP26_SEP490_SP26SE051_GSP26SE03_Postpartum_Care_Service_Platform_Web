import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu - The Joyful Nest | Dịch Vụ Chăm Sóc Hậu Sản 5 Sao',
  description:
    'The Joyful Nest - Trung tâm chăm sóc hậu sản đầu tiên tại Việt Nam đạt tiêu chuẩn 5 sao quốc tế. Khám phá về chúng tôi, giá trị cốt lõi, đội ngũ chuyên nghiệp và cam kết mang đến trải nghiệm tuyệt vời cho mẹ và bé.',
  keywords: [
    'giới thiệu',
    'the joyful nest',
    'chăm sóc hậu sản',
    'dịch vụ 5 sao',
    'trung tâm hậu sản',
    'chăm sóc mẹ và bé',
  ],
  openGraph: {
    title: 'Giới Thiệu - The Joyful Nest',
    description:
      'Trung tâm chăm sóc hậu sản đầu tiên tại Việt Nam đạt tiêu chuẩn 5 sao quốc tế',
    type: 'website',
  },
};

export default function GioiThieuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
