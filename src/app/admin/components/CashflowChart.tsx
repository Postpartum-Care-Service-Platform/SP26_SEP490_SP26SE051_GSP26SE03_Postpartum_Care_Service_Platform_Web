'use client';

import React, { useState, useEffect } from 'react';
import transactionService from '@/services/transaction.service';
import { Transaction } from '@/types/transaction';
import { TransactionTable } from '@/app/admin/transaction/components/TransactionTable';
import { Pagination } from '@/components/ui/pagination';
import styles from './cashflow-chart.module.css';

export const CashflowChart = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const PAGE_SIZE_OPTIONS = [5, 10, 20];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const txRes = await transactionService.getAllTransactions();
        if (txRes) {
          const sorted = txRes.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
          setTransactions(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Lịch sử giao dịch</h3>
      </div>

      <div className={styles.body}>
        {loading ? (
          <div className={styles.loadingOverlay}>Đang tải dữ liệu...</div>
        ) : (
          <>
            <TransactionTable
              transactions={currentTransactions}
              currentPage={currentPage}
              pageSize={pageSize}
            />
            {totalPages > 0 && (
              <div className={styles.paginationWrapper}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={totalItems}
                  onPageChange={(page) => setCurrentPage(page)}
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  showResultCount={true}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
