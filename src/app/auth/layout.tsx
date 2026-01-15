import type { ReactNode } from 'react';

// Layout cho auth routes: chỉ render children, không có Header/Footer
// và KHÔNG được chứa <html>/<body> để tránh hydration error.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

