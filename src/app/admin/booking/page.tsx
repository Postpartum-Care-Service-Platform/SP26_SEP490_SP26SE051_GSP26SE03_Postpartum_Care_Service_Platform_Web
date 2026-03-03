'use client';

import { useEffect, useMemo, useState } from 'react';

import styles from './booking.module.css';
import { BookingHeader } from './components/BookingHeader';
import { BookingTable } from './components/BookingTable';

import { useToast } from '@/components/ui/toast/use-toast';
import bookingService from '@/services/booking.service';
import type { AdminBooking } from '@/types/admin-booking';

const PAGE_SIZE = 10;

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
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

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

  const sortedBookings = useMemo(() => {
    const arr = [...bookings];
    return arr.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [bookings]);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return sortedBookings.slice(start, end);
  }, [sortedBookings, currentPage]);

  const totalPages = Math.ceil(sortedBookings.length / PAGE_SIZE) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.pageContainer}>
      <BookingHeader />

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
            pageSize: PAGE_SIZE,
            totalItems: sortedBookings.length,
            onPageChange: handlePageChange,
          }}
        />
      )}
    </div>
  );
}

