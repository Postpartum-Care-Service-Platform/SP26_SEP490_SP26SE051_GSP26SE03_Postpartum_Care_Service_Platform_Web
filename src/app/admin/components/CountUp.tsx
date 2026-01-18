'use client';

import { useCountUp } from '@/hooks/useCountUp';

type CountUpProps = {
  value: number;
  format?: 'number' | 'currency' | 'percentage';
  duration?: number;
};

export function CountUp({ value, format = 'number', duration = 2000 }: CountUpProps) {
  const count = useCountUp(value, { duration, decimals: format === 'percentage' ? 0 : 0 });

  if (format === 'currency') {
    return (
      <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(count)}</>
    );
  }

  if (format === 'percentage') {
    return <>{count}%</>;
  }

  return <>{count.toLocaleString('vi-VN')}</>;
}
