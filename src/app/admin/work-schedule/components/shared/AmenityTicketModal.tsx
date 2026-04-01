'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Check, CheckCircle, X, Loader2 } from 'lucide-react';
import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import amenityTicketService from '@/services/amenity-ticket.service';
import amenityServiceService from '@/services/amenity-service.service';
import userService from '@/services/user.service';
import type { AmenityTicket } from '@/types/amenity-ticket';
import type { AmenityService } from '@/types/amenity-service';
import type { Account } from '@/types/account';

import styles from './amenity-ticket-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Booked', label: 'Đã đặt' },
  { value: 'Accepted', label: 'Chấp nhận' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
];

export function AmenityTicketModal({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<AmenityTicket[]>([]);
  const [services, setServices] = useState<AmenityService[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketData, serviceData, accountData] = await Promise.all([
        amenityTicketService.getAllAmenityTickets(),
        amenityServiceService.getAllAmenityServices(),
        userService.getAllAccounts(),
      ]);
      setTickets(ticketData);
      setServices(serviceData);
      setAccounts(accountData);
    } catch (err: unknown) {
      setError('Không thể tải dữ liệu ticket tiện ích');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleAccept = async (id: number) => {
    try {
      await amenityTicketService.acceptAmenityTicket(id);
      toast({ title: 'Thành công', description: 'Đã chấp nhận yêu cầu của khách hàng.', variant: 'success' });
      fetchData();
    } catch (error) {
      toast({ title: 'Thất bại', description: 'Không thể chấp nhận yêu cầu.', variant: 'error' });
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await amenityTicketService.cancelAmenityTicket(id);
      toast({ title: 'Thành công', description: 'Đã hủy yêu cầu thành công.', variant: 'success' });
      fetchData();
    } catch (error) {
      toast({ title: 'Thất bại', description: 'Không thể hủy yêu cầu.', variant: 'error' });
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await amenityTicketService.completeAmenityTicket(id);
      toast({ title: 'Thành công', description: 'Đã đánh dấu hoàn thành yêu cầu.', variant: 'success' });
      fetchData();
    } catch (error) {
      toast({ title: 'Thất bại', description: 'Không thể đánh dấu hoàn thành.', variant: 'error' });
    }
  };

  const getServiceName = (id: number) => {
    return services.find(s => s.id === id)?.name || `Dịch vụ #${id}`;
  };

  const getCustomerName = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return `Khách hàng #${id.slice(0, 8)}`;
    return acc.ownerProfile?.fullName || acc.email || acc.username || `Khách hàng #${id.slice(0, 8)}`;
  };

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const serviceName = getServiceName(item.amenityServiceId).toLowerCase();
        const customerName = getCustomerName(item.customerId).toLowerCase();
        return (
          serviceName.includes(q) ||
          customerName.includes(q) ||
          item.id.toString().includes(q) ||
          item.status.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    return filtered.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.startTime}`).getTime();
      return dateTimeB - dateTimeA;
    });
  }, [tickets, searchQuery, statusFilter, services, accounts]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    // timeStr is "HH:mm:ss", take "HH:mm"
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  };

  if (!open) return null;

  return (
    <Tooltip.Provider delayDuration={400}>
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Duyệt yêu cầu tiện ích</h2>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className={styles.closeButton} onClick={() => onOpenChange(false)}>
                <Cross1Icon />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className={styles.tooltip} side="bottom" sideOffset={5}>
                Đóng
                <Tooltip.Arrow className={styles.tooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.controls}>
            <div className={styles.left}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={16} />
                <input
                  type="text"
                  placeholder="Tìm theo khách hàng, dịch vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={styles.filterButton}>
                    <span>{STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label}</span>
                    <ChevronDownIcon style={{ width: '14px', height: '14px', color: '#64748b' }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent} align="start" sideOffset={4}>
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`${styles.dropdownItem} ${statusFilter === option.value ? styles.dropdownItemActive : ''}`}
                      onClick={() => setStatusFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={styles.right}>
               {loading && <Loader2 size={20} className="animate-spin text-gray-400" />}
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.sttCol}>STT</th>
                  <th className={styles.codeCol}>Mã</th>
                  <th>Khách hàng</th>
                  <th>Tiện ích</th>
                  <th>Ngày</th>
                  <th>Giờ</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading && tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td>
                  </tr>
                ) : paginatedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Không có yêu cầu nào</td>
                  </tr>
                ) : (
                  paginatedTickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td className={styles.sttCol}>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className={styles.codeCol}>#{ticket.id}</td>
                      <td>{getCustomerName(ticket.customerId)}</td>
                      <td>{getServiceName(ticket.amenityServiceId)}</td>
                      <td>{formatDate(ticket.date)}</td>
                      <td>{formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[`status-${ticket.status}`]}`}>
                          {STATUS_OPTIONS.find(opt => opt.value === ticket.status)?.label || ticket.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {ticket.status === 'Booked' && (
                            <>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button 
                                    className={`${styles.actionButton} ${styles.acceptButton}`}
                                    onClick={() => handleAccept(ticket.id)}
                                  >
                                    <Check size={14} />
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                    Chấp nhận
                                    <Tooltip.Arrow className={styles.tooltipArrow} />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>

                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button 
                                    className={`${styles.actionButton} ${styles.cancelButton}`}
                                    onClick={() => handleCancel(ticket.id)}
                                  >
                                    <X size={14} />
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                    Hủy yêu cầu
                                    <Tooltip.Arrow className={styles.tooltipArrow} />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </>
                          )}
                          {ticket.status === 'Accepted' && (
                            <>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button 
                                    className={`${styles.actionButton} ${styles.completeButton}`}
                                    onClick={() => handleComplete(ticket.id)}
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                    Hoàn thành
                                    <Tooltip.Arrow className={styles.tooltipArrow} />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>

                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <button 
                                    className={`${styles.actionButton} ${styles.cancelButton}`}
                                    onClick={() => handleCancel(ticket.id)}
                                  >
                                    <X size={14} />
                                  </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                    Hủy yêu cầu
                                    <Tooltip.Arrow className={styles.tooltipArrow} />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.footer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredTickets.length}
            onPageChange={setCurrentPage}
            pageSizeOptions={[10, 20]}
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
    </Tooltip.Provider>
  );
}
