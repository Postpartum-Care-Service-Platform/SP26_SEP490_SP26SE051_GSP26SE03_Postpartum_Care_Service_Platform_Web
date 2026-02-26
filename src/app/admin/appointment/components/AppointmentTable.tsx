'use client';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

import { Pagination } from '@/components/ui/pagination';

import styles from './appointment-table.module.css';

import type { Appointment } from './types';

type Props = {
  appointments: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

const getStatusClass = (status: Appointment['status']) => {
  switch (status) {
    case 'Upcoming':
      return styles.statusUpcoming;
    case 'Pending':
      return styles.statusPending;
    case 'Completed':
      return styles.statusCompleted;
    case 'Cancelled':
      return styles.statusCancelled;
    case 'Rescheduled':
      return styles.statusRescheduled;
    default:
      return '';
  }
};

const getStatusLabel = (status: Appointment['status']) => {
  switch (status) {
    case 'Upcoming':
      return 'Sắp diễn ra';
    case 'Pending':
      return 'Đang chờ';
    case 'Completed':
      return 'Hoàn thành';
    case 'Cancelled':
      return 'Đã hủy';
    case 'Rescheduled':
      return 'Đã dời lịch';
    default:
      return status;
  }
};

export function AppointmentTable({ appointments, onEdit, onDelete, pagination }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã lịch hẹn</th>
            <th>Khách hàng</th>
            <th>Nhân viên phụ trách</th>
            <th>Loại lịch hẹn</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className={styles.appointmentId}>{appointment.id}</td>
              <td>
                <div className={styles.patientName}>
                  {appointment.patientAvatar ? (
                    <Image
                      src={appointment.patientAvatar}
                      alt={appointment.patientName}
                      width={32}
                      height={32}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatar}>
                      {appointment.patientName.charAt(0)}
                    </div>
                  )}
                  <span>{appointment.patientName}</span>
                </div>
              </td>
              <td>{appointment.doctor}</td>
              <td>{appointment.department}</td>
              <td>{appointment.dateTime}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => onEdit?.(appointment)}
                    aria-label={`Chỉnh sửa ${appointment.id}`}
                  >
                    <Pencil1Icon />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete?.(appointment)}
                    aria-label={`Xóa ${appointment.id}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && pagination.totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}

