'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import styles from './invoice-list.module.css';

type Invoice = {
  id: string;
  client: {
    name: string;
    company: string;
    avatar?: string;
  };
  date: string;
  dueDate: string;
  total: number;
  paid: number;
  balance: number;
  paymentMethod: string;
  status: 'Partial' | 'Paid' | 'Overdue' | 'Partially Paid';
};

type InvoiceListProps = {
  invoices?: Invoice[];
};

const mockInvoices: Invoice[] = [
  {
    id: 'INV-1001',
    client: {
      name: 'Eleanor Pena',
      company: 'Apple Inc.',
    },
    date: '2025-09-01',
    dueDate: '2025-09-15',
    total: 2400.0,
    paid: 1200.0,
    balance: 1200.0,
    paymentMethod: 'Credit Card',
    status: 'Partial',
  },
  {
    id: 'INV-1002',
    client: {
      name: 'Robert Fox',
      company: 'Microsoft Corp.',
    },
    date: '2025-09-02',
    dueDate: '2025-09-16',
    total: 3200.0,
    paid: 3200.0,
    balance: 0.0,
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
  {
    id: 'INV-1003',
    client: {
      name: 'Courtney Henry',
      company: 'Google',
    },
    date: '2025-09-05',
    dueDate: '2025-09-20',
    total: 1800.0,
    paid: 0.0,
    balance: 1800.0,
    paymentMethod: 'Paypal',
    status: 'Overdue',
  },
  {
    id: 'INV-1004',
    client: {
      name: 'Leslie Alexander',
      company: 'Google LLC',
    },
    date: '2025-09-10',
    dueDate: '2025-09-25',
    total: 5200.0,
    paid: 5200.0,
    balance: 0.0,
    paymentMethod: 'Credit Card',
    status: 'Paid',
  },
  {
    id: 'INV-1005',
    client: {
      name: 'Jane Smith',
      company: 'Amazon Inc.',
    },
    date: '2025-09-12',
    dueDate: '2025-09-27',
    total: 1500.0,
    paid: 750.0,
    balance: 750.0,
    paymentMethod: 'Bank Transfer',
    status: 'Partially Paid',
  },
  {
    id: 'INV-1006',
    client: {
      name: 'John Doe',
      company: 'Facebook Inc.',
    },
    date: '2025-09-15',
    dueDate: '2025-09-30',
    total: 2800.0,
    paid: 0.0,
    balance: 2800.0,
    paymentMethod: 'Credit Card',
    status: 'Overdue',
  },
  {
    id: 'INV-1007',
    client: {
      name: 'Emily Johnson',
      company: 'Netflix Inc.',
    },
    date: '2025-09-18',
    dueDate: '2025-10-03',
    total: 2100.0,
    paid: 2100.0,
    balance: 0.0,
    paymentMethod: 'Paypal',
    status: 'Paid',
  },
];

const EyeOutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-eye-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="eye">
        <rect width="24" height="24" opacity="0" />
        <path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zM12.22 17c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z" />
        <path d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
      </g>
    </g>
  </svg>
);

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const getStatusClass = (status: Invoice['status']) => {
  switch (status) {
    case 'Paid':
      return styles.statusPaid;
    case 'Partial':
    case 'Partially Paid':
      return styles.statusPartial;
    case 'Overdue':
      return styles.statusOverdue;
    default:
      return '';
  }
};

export function InvoiceList({ invoices = mockInvoices }: InvoiceListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = invoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Invoice List</h3>
        <a href="#" className={styles.seeAllLink}>
          See All <span className={styles.arrow}>→</span>
        </a>
      </div>
      <div className={styles.body}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.emptyState}>
                  Chưa có hóa đơn nào
                </td>
              </tr>
            ) : (
              currentInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className={styles.invoiceId}>#{invoice.id}</td>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.avatarContainer}>
                      {invoice.client.avatar ? (
                        <Image
                          src={invoice.client.avatar}
                          alt={invoice.client.name}
                          width={32}
                          height={32}
                          className={styles.avatar}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <span>{invoice.client.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.clientInfo}>
                      <div className={styles.clientName}>{invoice.client.name}</div>
                      <div className={styles.clientCompany}>{invoice.client.company}</div>
                    </div>
                  </div>
                </td>
                <td>{invoice.date}</td>
                <td>{invoice.dueDate}</td>
                <td>{formatCurrency(invoice.total)}</td>
                <td>{formatCurrency(invoice.paid)}</td>
                <td>{formatCurrency(invoice.balance)}</td>
                <td>{invoice.paymentMethod}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${styles.actionButton} btn-icon btn-sm`}
                      aria-label={`View invoice ${invoice.id}`}
                    >
                      <EyeOutlineIcon fill="#A47BC8" size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${styles.actionButton} btn-icon btn-sm`}
                      aria-label={`Edit invoice ${invoice.id}`}
                    >
                      <Edit2OutlineIcon fill="#A47BC8" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
