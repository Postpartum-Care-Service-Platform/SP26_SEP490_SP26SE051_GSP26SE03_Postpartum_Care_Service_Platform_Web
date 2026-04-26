'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import transactionService from '@/services/transaction.service';
import type { Transaction } from '@/types/transaction';

import { TransactionHeader } from './components/TransactionHeader';
import { TransactionTable } from './components/TransactionTable';
import { TransactionTableControls } from './components/TransactionTableControls';
import styles from './transaction.module.css';



const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }
  return fallback;
};

const sortTransactions = (items: Transaction[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'date-asc':
      return arr.sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());
    case 'date-desc':
      return arr.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
    case 'amount-asc':
      return arr.sort((a, b) => a.amount - b.amount);
    case 'amount-desc':
      return arr.sort((a, b) => b.amount - a.amount);
    default:
      return arr;
  }
};

// Internal Premium Skeleton Component for consistent look
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

export default function AdminTransactionPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Pending' | 'Failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Deposit' | 'Payment' | 'Refund'>('all');
  const [sortKey, setSortKey] = useState<string>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Artificial delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'Không thể tải danh sách giao dịch');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.customer.email.toLowerCase().includes(q) ||
          t.customer.username.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.bookingId.toString().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    return sortTransactions(filtered, sortKey);
  }, [transactions, searchQuery, statusFilter, typeFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, sortKey]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-white">
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <AdminPageLayout
          header={<TransactionHeader />}
          controlPanel={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <SkeletonBone width={320} height={42} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <SkeletonBone width={180} height={42} />
                <SkeletonBone width={120} height={42} />
              </div>
            </div>
          }
        >
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden',
            margin: '0 4px'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize || 10)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === (pageSize || 10) - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="70%" height={16} />
                </div>
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </AdminPageLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <AdminPageLayout header={<TransactionHeader />}>
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
            <p>{error}</p>
          </div>
        </AdminPageLayout>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<TransactionHeader />}
        controlPanel={
          <TransactionTableControls
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            sortKey={sortKey}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
            onSortChange={setSortKey}
          />
        }
        pagination={
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredTransactions.length}
              onPageChange={handlePageChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showResultCount={true}
            />
          ) : null
        }
      >
        <TransactionTable
          transactions={paginatedTransactions}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </AdminPageLayout>
    </div>
  );
}

