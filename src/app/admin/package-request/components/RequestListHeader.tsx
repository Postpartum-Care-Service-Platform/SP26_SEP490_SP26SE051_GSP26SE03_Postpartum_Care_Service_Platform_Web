'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface RequestListHeaderProps {
  view: 'list' | 'details';
  onBack: () => void;
  title?: string;
  onResetStatus?: () => void;
  onReject?: () => void;
}

import { RotateCcw, XCircle } from 'lucide-react';
import styles from '../../package/components/package-request/request-calendar-view.module.css';

export function RequestListHeader({ view, onBack, title, onResetStatus, onReject }: RequestListHeaderProps) {
  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  return (
    <div className="flex items-center justify-between w-full py-2">
      <div className="flex items-center gap-4">
        <Breadcrumbs
          items={[
            { label: 'Gói dịch vụ', href: '/admin/package' },
            { label: 'Yêu cầu gói', href: view === 'details' ? '/admin/package-request' : undefined, active: view === 'list' },
            ...(view === 'details' ? [{ label: title || 'Chi tiết yêu cầu', active: true }] : []),
          ]}
          homeHref={homeHref}
        />
      </div>

    </div>
  );
}
