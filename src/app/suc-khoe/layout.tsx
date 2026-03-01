import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sức Khỏe Mẹ & Bé - The Joyful Nest | Dịch Vụ Chăm Sóc Y Tế Chuyên Nghiệp',
  description:
    'Dịch vụ chăm sóc sức khỏe toàn diện cho mẹ và bé sau sinh tại The Joyful Nest. Đội ngũ bác sĩ giàu kinh nghiệm, hỗ trợ y tế 24/7, khám sức khỏe định kỳ và tư vấn chuyên sâu.',
  keywords: [
    'chăm sóc sức khỏe',
    'sức khỏe mẹ và bé',
    'dịch vụ y tế',
    'bác sĩ sản phụ khoa',
    'chăm sóc sau sinh',
    'khám sức khỏe',
    'the joyful nest',
  ],
  openGraph: {
    title: 'Sức Khỏe Mẹ & Bé - The Joyful Nest',
    description: 'Dịch vụ chăm sóc sức khỏe toàn diện cho mẹ và bé sau sinh',
    type: 'website',
  },
};

export default function SucKhoeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
