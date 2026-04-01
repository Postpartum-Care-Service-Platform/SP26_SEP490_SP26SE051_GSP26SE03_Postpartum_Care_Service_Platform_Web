import { ReceptionistLayout } from '@/components/layout/receptionist/ReceptionistLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ReceptionistLayout>{children}</ReceptionistLayout>;
}
