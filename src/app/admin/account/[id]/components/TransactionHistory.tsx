'use client';

import { 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  Receipt,
  CreditCard,
  Wallet,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import React from 'react';

import styles from './transaction-history.module.css';

interface Transaction {
  id: string;
  invoiceNo: string;
  date: string;
  service: string;
  amount: string;
  method: 'VNPay' | 'Transferred' | 'Cash';
  status: 'success' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    invoiceNo: 'INV-2026-001',
    date: '10/06/2026, 09:30 AM',
    service: 'Gói Chăm sóc mẹ & bé toàn diện (24 buổi)',
    amount: '450.000 đ',
    method: 'VNPay',
    status: 'success'
  },
  {
    id: '2',
    invoiceNo: 'INV-2026-002',
    date: '15/06/2026, 02:45 PM',
    service: 'Dịch vụ Massage sau sinh (1 buổi lẻ)',
    amount: '25.000 đ',
    method: 'Transferred',
    status: 'success'
  },
  {
    id: '3',
    invoiceNo: 'INV-2026-003',
    date: '20/06/2026, 11:15 AM',
    service: 'Combo Vitamin & Thực phẩm bổ sung',
    amount: '12.500 đ',
    method: 'VNPay',
    status: 'pending'
  }
];

export const TransactionHistory: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Receipt size={20} className={styles.headerIcon} />
          <h3 className={styles.title}>Lịch sử giao dịch & Hóa đơn</h3>
        </div>
        
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input type="text" placeholder="Tìm mã hóa đơn..." />
          </div>
          <button className={styles.filterButton}>
            <Filter size={16} />
            <span>Bộ lọc</span>
          </button>
          <button className={styles.exportButton}>
            <Download size={16} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã hóa đơn</th>
              <th>Ngày thực hiện</th>
              <th>Dịch vụ / Sản phẩm</th>
              <th>Số tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th className={styles.actionCol}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((tx) => (
              <tr key={tx.id}>
                <td className={styles.invoiceCell}>
                  <span className={styles.invoiceNo}>{tx.invoiceNo}</span>
                </td>
                <td className={styles.dateCell}>{tx.date}</td>
                <td className={styles.serviceCell}>{tx.service}</td>
                <td className={styles.amountCell}>{tx.amount}</td>
                <td className={styles.methodCell}>
                  <div className={styles.methodTag}>
                    {tx.method === 'VNPay' && <CreditCard size={14} />}
                    {tx.method === 'Transferred' && <ExternalLink size={14} />}
                    {tx.method === 'Cash' && <Wallet size={14} />}
                    <span>{tx.method}</span>
                  </div>
                </td>
                <td>
                  <div className={`${styles.statusBadge} ${styles[tx.status]}`}>
                    {tx.status === 'success' && <CheckCircle2 size={12} />}
                    {tx.status === 'pending' && <Clock size={12} />}
                    {tx.status === 'failed' && <XCircle size={12} />}
                    {tx.status === 'success' && 'Thành công'}
                    {tx.status === 'pending' && 'Chờ xử lý'}
                    {tx.status === 'failed' && 'Thất bại'}
                  </div>
                </td>
                <td className={styles.actionCol}>
                  <div className={styles.rowActions}>
                    <button className={styles.iconBtn} title="Xem hóa đơn">
                      <ExternalLink size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Tải xuống">
                      <Download size={16} />
                    </button>
                    <button className={styles.iconBtn} title="Thêm">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p className={styles.paginationInfo}>Hiển thị 1 - 3 trên tổng 45 giao dịch</p>
        <div className={styles.pagination}>
          <button disabled>Trước</button>
          <button className={styles.activePage}>1</button>
          <button>2</button>
          <button>3</button>
          <button>Sau</button>
        </div>
      </div>
    </div>
  );
};
