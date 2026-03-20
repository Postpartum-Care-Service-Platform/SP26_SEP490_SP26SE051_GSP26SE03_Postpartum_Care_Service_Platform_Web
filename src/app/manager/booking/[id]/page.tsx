'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { BookingDetails } from '@/app/admin/booking/components/BookingDetails';

export default function ManagerBookingDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return <BookingDetails id={id} />;
}
