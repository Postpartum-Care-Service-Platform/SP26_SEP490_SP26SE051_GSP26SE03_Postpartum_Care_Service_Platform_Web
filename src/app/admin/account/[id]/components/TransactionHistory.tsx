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

import { useToast } from '@/components/ui/toast/use-toast';
import transactionService from '@/services/transaction.service';
import type { Transaction as APITransaction } from '@/types/transaction';

import styles from './transaction-history.module.css';

interface TransactionHistoryProps {
  customerId?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'Paid':
      return { label: 'Thành công', className: 'success', icon: CheckCircle2 };
    case 'Pending':
      return { label: 'Chờ xử lý', className: 'pending', icon: Clock };
    case 'Cancelled':
    case 'Failed':
      return { label: 'Thất bại', className: 'failed', icon: XCircle };
    default:
      return { label: status, className: 'pending', icon: Clock };
  }
};

const getMethodIcon = (method: string) => {
  if (method.includes('VNPay')) return CreditCard;
  if (method.includes('Transferred')) return ExternalLink;
  return Wallet;
};

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ customerId }) => {
  const { toast } = useToast();
  const [transactions, setTransactions] = React.useState<APITransaction[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (customerId) {
      setLoading(true);
      transactionService.getTransactionByUser(customerId)
        .then(setTransactions)
        .catch((err) => {
          console.error('Error fetching transactions:', err);
          toast({ title: 'Không thể tải lịch sử giao dịch', variant: 'error' });
        })
        .finally(() => setLoading(false));
    }
  }, [customerId, toast]);

  if (loading) {
    return <div className={styles.loading}>Đang tải lịch sử giao dịch...</div>;
  }

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
            {transactions.length > 0 ? (
              transactions.map((tx) => {
                const statusInfo = getStatusInfo(tx.status);
                const MethodIcon = getMethodIcon(tx.paymentMethod);
                return (
                  <tr key={tx.id}>
                    <td className={styles.invoiceCell}>
                      <span className={styles.invoiceNo}>INV-{tx.id.substring(0, 8).toUpperCase()}</span>
                    </td>
                    <td className={styles.dateCell}>{formatDate(tx.transactionDate)}</td>
                    <td className={styles.serviceCell}>Đơn hàng #{tx.bookingId} - {tx.type}</td>
                    <td className={styles.amountCell}>{formatCurrency(tx.amount)}</td>
                    <td className={styles.methodCell}>
                      <div className={styles.methodTag}>
                        <MethodIcon size={14} />
                        <span>{tx.paymentMethod}</span>
                      </div>
                    </td>
                    <td>
                      <div className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
                        <statusInfo.icon size={12} />
                        {statusInfo.label}
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
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  Không có lịch sử giao dịch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <p className={styles.paginationInfo}>Hiển thị 1 - {transactions.length} trên tổng {transactions.length} giao dịch</p>
        <div className={styles.pagination}>
          <button disabled>Trước</button>
          <button className={styles.activePage}>1</button>
          <button disabled>Sau</button>
        </div>
      </div>
    </div>
  );
};
