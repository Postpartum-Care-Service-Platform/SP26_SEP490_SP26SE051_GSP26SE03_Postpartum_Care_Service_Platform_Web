'use client';

import { BarChart3, CreditCard, Download, Megaphone, Settings, ShoppingCart, Users } from 'lucide-react';
import React from 'react';

import styles from './admin-layout.module.css';

type Item = {
  title: string;
  description: string;
  href?: string;
  icon: React.ReactNode;
};

type Column = {
  title?: string;
  items: Item[];
};

type Props = {
  className?: string;
};

const columns: Column[] = [
  {
    items: [
      {
        title: 'Hóa đơn',
        description: 'Quản lý hóa đơn và thanh toán',
        icon: <CreditCard size={18} />,
      },
      {
        title: 'Đơn hàng',
        description: 'Theo dõi và quản lý tất cả đơn hàng',
        icon: <ShoppingCart size={18} />,
      },
    ],
  },
  {
    items: [
      {
        title: 'Khách hàng',
        description: 'Quản lý thông tin khách hàng',
        icon: <Users size={18} />,
      },
      {
        title: 'Thống kê',
        description: 'Xem hiệu suất và số liệu hệ thống',
        icon: <BarChart3 size={18} />,
      },
    ],
  },
  {
    items: [
      {
        title: 'Marketing',
        description: 'Tổng quan hiệu quả chiến dịch',
        icon: <Megaphone size={18} />,
      },
      {
        title: 'Xuất dữ liệu',
        description: 'Tải báo cáo CSV hoặc PDF',
        icon: <Download size={18} />,
      },
    ],
  },
  {
    items: [
      {
        title: 'Cài đặt',
        description: 'Cấu hình tuỳ chọn và thiết lập hệ thống',
        icon: <Settings size={18} />,
      },
    ],
  },
];

export function AdminControlPanel({ className }: Props) {
  return (
    <div id="admin-control-panel" className={`${styles.controlPanel} ${className ?? ''}`} role="dialog" aria-label="Bảng điều khiển" aria-modal="false">
      <div className={styles.controlGrid}>
        {columns.map((col, idx) => (
          <div key={idx} className={styles.controlCol}>
            {col.title ? <div className={styles.controlColTitle}>{col.title}</div> : null}
            {col.items.map((item) => (
              <a key={item.title} className={styles.controlItem} href={item.href ?? '#'}>
                <span className={styles.controlIcon}>{item.icon}</span>
                <span className={styles.controlText}>
                  <span className={styles.controlTitle}>{item.title}</span>
                  <span className={styles.controlDesc}>{item.description}</span>
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
