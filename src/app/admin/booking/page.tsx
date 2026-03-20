'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import styles from './booking.module.css';
import { BookingHeader } from './components/BookingHeader';
import { BookingTable } from './components/BookingTable';
import { BookingTableControls } from './components/BookingTableControls';

import { useToast } from '@/components/ui/toast/use-toast';
import bookingService from '@/services/booking.service';
import type { AdminBooking } from '@/types/admin-booking';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

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

export default function AdminBookingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingService.getAllBookings();
        setBookings(data);
      } catch (err: unknown) {
        const message = getErrorMessage(err, 'Không thể tải danh sách booking');
        setError(message);
        toast({ title: message, variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    void fetchBookings();
  }, [toast]);

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.customer.username.toLowerCase().includes(q) ||
          b.customer.phone.includes(q) ||
          b.customer.email.toLowerCase().includes(q) ||
          b.id.toString().includes(q),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (b) => b.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortKey) {
        case 'newest':
          return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
        case 'oldest':
          return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
        case 'startDate-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'price-desc':
          return b.totalPrice - a.totalPrice;
        case 'price-asc':
          return a.totalPrice - b.totalPrice;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [bookings, searchQuery, statusFilter, sortKey]);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedBookings.slice(start, end);
  }, [filteredAndSortedBookings, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedBookings.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleViewBooking = (booking: AdminBooking) => {
    const isManager = pathname?.startsWith('/manager');
    const baseRoute = isManager ? '/manager' : '/admin';
    router.push(`${baseRoute}/booking/${booking.id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <BookingHeader />

      <BookingTableControls
        onSearch={setSearchQuery}
        onStatusChange={setStatusFilter}
        onSortChange={setSortKey}
      />

      {loading ? (
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <BookingTable
          bookings={paginatedBookings}
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems: filteredAndSortedBookings.length,
            onPageChange: handlePageChange,
            pageSizeOptions: [...PAGE_SIZE_OPTIONS],
            onPageSizeChange: handlePageSizeChange,
          }}
          onViewBooking={handleViewBooking}
        />
      )}
    </div>
  );
}

