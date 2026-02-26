'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';

import styles from './appointments-list.module.css';

type Appointment = {
  id: string;
  patient: {
    name: string;
    age: number;
    avatar?: string;
    gender?: 'male' | 'female';
  };
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
    gender?: 'male' | 'female';
  };
  department: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  date: string;
  time: string;
};

type AppointmentsListProps = {
  appointments?: Appointment[];
};

const mockAppointments: Appointment[] = [
  {
    id: 'APT-1001',
    patient: {
      name: 'John Doe',
      age: 28,
      gender: 'male',
    },
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      gender: 'female',
    },
    department: 'Cardiology',
    status: 'Confirmed',
    date: '12 Sep, 2025',
    time: '10:30 AM',
  },
  {
    id: 'APT-1002',
    patient: {
      name: 'Emily Carter',
      age: 42,
      gender: 'female',
    },
    doctor: {
      name: 'Dr. Michael Lee',
      specialty: 'Neurology',
      gender: 'male',
    },
    department: 'Neurology',
    status: 'Pending',
    date: '13 Sep, 2025',
    time: '02:00 PM',
  },
  {
    id: 'APT-1003',
    patient: {
      name: 'William Brown',
      age: 50,
      gender: 'male',
    },
    doctor: {
      name: 'Dr. Olivia Martinez',
      specialty: 'Orthopedics',
      gender: 'female',
    },
    department: 'Orthopedics',
    status: 'Cancelled',
    date: '14 Sep, 2025',
    time: '09:00 AM',
  },
  {
    id: 'APT-1004',
    patient: {
      name: 'Sophia Wilson',
      age: 35,
      gender: 'female',
    },
    doctor: {
      name: 'Dr. Ethan Walker',
      specialty: 'Pediatrics',
      gender: 'male',
    },
    department: 'Pediatrics',
    status: 'Confirmed',
    date: '15 Sep, 2025',
    time: '11:15 AM',
  },
];

const EyeOutlineIcon = ({
  fill = '#A47BC8',
  size = 16,
}: {
  fill?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="eva eva-eye-outline"
    fill={fill}
  >
    <g data-name="Layer 2">
      <g data-name="eye">
        <rect width="24" height="24" opacity="0" />
        <path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zM12.22 17c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z" />
        <path d="M12 8.5a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 8.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
      </g>
    </g>
  </svg>
);

const Edit2OutlineIcon = ({
  fill = '#A47BC8',
  size = 16,
}: {
  fill?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="eva eva-edit-2-outline"
    fill={fill}
  >
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({
  fill = '#FD6161',
  size = 16,
}: {
  fill?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="eva eva-trash-2-outline"
    fill={fill}
  >
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 0 0 1-1 1H7a1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 0 0 0 1-1v-4a1 0 0 0-2 0v4a1 0 0 0 1 1z" />
        <path d="M15 17a1 0 0 0 1-1v-4a1 0 0 0-2 0v4a1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

const getStatusClass = (status: Appointment['status']) => {
  switch (status) {
    case 'Confirmed':
      return styles.statusConfirmed;
    case 'Pending':
      return styles.statusPending;
    case 'Cancelled':
      return styles.statusCancelled;
    default:
      return '';
  }
};

export function AppointmentsList({
  appointments = mockAppointments,
}: AppointmentsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Date');
  const itemsPerPage = 10;
  const totalItems = appointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Appointments List</h3>
        <div className={styles.headerRight}>
          <DropdownMenu>
            <DropdownMenuTrigger className={styles.sortButton}>
              Sort by: {sortBy}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={styles.chevron}
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent} align="end">
              <DropdownMenuItem
                className={styles.dropdownItem}
                onClick={() => setSortBy('Date')}
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                className={styles.dropdownItem}
                onClick={() => setSortBy('Status')}
              >
                Status
              </DropdownMenuItem>
              <DropdownMenuItem
                className={styles.dropdownItem}
                onClick={() => setSortBy('Patient')}
              >
                Patient
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={styles.body}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Chưa có lịch hẹn nào
                </td>
              </tr>
            ) : (
              currentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className={styles.appointmentId}>#{appointment.id}</td>
                  <td>
                    <div className={styles.personCell}>
                      <div className={styles.avatarContainer}>
                        {appointment.patient.avatar ? (
                          <Image
                            src={appointment.patient.avatar}
                            alt={appointment.patient.name}
                            width={32}
                            height={32}
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            <span>{appointment.patient.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.personInfo}>
                        <div className={styles.personName}>
                          {appointment.patient.name}
                        </div>
                        <div className={styles.personMeta}>
                          {appointment.patient.age} yrs
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.personCell}>
                      <div className={styles.avatarContainer}>
                        {appointment.doctor.avatar ? (
                          <Image
                            src={appointment.doctor.avatar}
                            alt={appointment.doctor.name}
                            width={32}
                            height={32}
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            <span>{appointment.doctor.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className={styles.personInfo}>
                        <div className={styles.personName}>
                          {appointment.doctor.name}
                        </div>
                        <div className={styles.personMeta}>
                          {appointment.doctor.specialty}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{appointment.department}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.actionButton} btn-icon btn-sm`}
                        aria-label={`View appointment ${appointment.id}`}
                      >
                        <EyeOutlineIcon fill="#A47BC8" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.actionButton} btn-icon btn-sm`}
                        aria-label={`Edit appointment ${appointment.id}`}
                      >
                        <Edit2OutlineIcon fill="#A47BC8" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.deleteButton} btn-icon btn-sm`}
                        aria-label={`Delete appointment ${appointment.id}`}
                      >
                        <Trash2OutlineIcon fill="#FD6161" size={16} />
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
