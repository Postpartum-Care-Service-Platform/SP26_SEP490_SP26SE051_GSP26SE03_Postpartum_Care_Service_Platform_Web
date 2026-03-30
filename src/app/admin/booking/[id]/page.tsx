'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { BookingDetails } from '../components/BookingDetails';

export default function AdminBookingDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return <BookingDetails id={id} />;
}
