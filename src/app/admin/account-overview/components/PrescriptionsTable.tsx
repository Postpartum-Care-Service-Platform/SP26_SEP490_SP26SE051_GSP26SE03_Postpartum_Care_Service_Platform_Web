'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import amenityTicketService from '@/services/amenity-ticket.service';
import amenityServiceService from '@/services/amenity-service.service';
import type { AmenityTicket } from '@/types/amenity-ticket';
import type { AmenityService } from '@/types/amenity-service';

import styles from './prescriptions-table.module.css';

const EyeOutlineIcon = ({ fill = '#15803d', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-eye-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="eye">
        <rect width="24" height="24" opacity="0" />
        <path d="M21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 .01-1zM12.22 17c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.32-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.32 5z" />
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

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);


export function PrescriptionsTable({ customerId }: { customerId: string | null }) {
  const [data, setData] = useState<AmenityTicket[]>([]);
  const [services, setServices] = useState<AmenityService[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const PAGE_SIZE_OPTIONS = [5, 10, 20];

  const fetchData = async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      const [ticketRes, serviceRes] = await Promise.all([
        amenityTicketService.getAmenityTicketsByUserId(customerId),
        amenityServiceService.getAllAmenityServices()
      ]);
      setData(ticketRes);
      setServices(serviceRes);
    } catch (error) {
      console.error('Failed to fetch amenity tickets:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [customerId]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 0;

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getServiceName = (id: number) => {
    return services.find(s => s.id === id)?.name || `Dịch vụ #${id}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusLabelText = (status: string) => {
    switch (status) {
      case 'Booked': return 'Đã đặt';
      case 'Accepted': return 'Đã chấp nhận';
      case 'Completed': return 'Hoàn thành';
      case 'Pending': return 'Đang chờ';
      case 'Canceled': return 'Đã hủy';
      default: return status;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: number) => {
    console.log('View:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <div className={styles.tableWrapper}>
      <h5 className={styles.title}>Dịch vụ tiện ích</h5>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Dịch vụ</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className={styles.emptyState}>Đang tải...</td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyState}>Chưa có dữ liệu</td>
            </tr>
          ) : (
            paginatedData.map((ticket) => (
              <tr key={ticket.id} className={styles.tableRow}>
                <td className={styles.medicine}>{getServiceName(ticket.amenityServiceId)}</td>
                <td>{formatDateTime(ticket.startTime)}</td>
                <td>{formatDateTime(ticket.endTime)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${ticket.status === 'Completed' ? styles.statusRecovered : styles.statusOngoing}`}>
                    {getStatusLabelText(ticket.status)}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <div className={styles.tooltipWrapper}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.viewButton} btn-icon btn-sm`}
                        onClick={() => handleView(ticket.id)}
                        aria-label={`Xem chi tiết ticket #${ticket.id}`}
                      >
                        <EyeOutlineIcon fill="#15803d" size={16} />
                      </Button>
                      <span className={styles.tooltip}>Xem chi tiết</span>
                    </div>

                    <div className={styles.tooltipWrapper}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${styles.editButton} btn-icon btn-sm`}
                        onClick={() => handleEdit(ticket.id)}
                        aria-label={`Chỉnh sửa ticket #${ticket.id}`}
                      >
                        <Edit2OutlineIcon fill="#A47BC8" size={16} />
                      </Button>
                      <span className={styles.tooltip}>Chỉnh sửa</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
