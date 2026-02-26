'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import transactionService from '@/services/transaction.service';
import type { Transaction } from '@/types/transaction';

import { TransactionHeader } from './components/TransactionHeader';
import { TransactionTable } from './components/TransactionTable';
import { TransactionTableControls } from './components/TransactionTableControls';
import styles from './transaction.module.css';


const PAGE_SIZE = 10;

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

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Không thể tải danh sách giao dịch';
      setError(errorMessage);
      toast({ title: errorMessage, variant: 'error' });
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
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.pageContainer}>
      <TransactionHeader />

      {loading ? (
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <>
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

          <TransactionTable
            transactions={paginatedTransactions}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredTransactions.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </>
      )}
    </div>
  );
}
