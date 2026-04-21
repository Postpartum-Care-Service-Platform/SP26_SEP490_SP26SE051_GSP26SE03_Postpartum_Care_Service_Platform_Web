'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Check, CheckCircle, X, Loader2, Users, Inbox } from 'lucide-react';
import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';
import Image from 'next/image';

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

const COLOR_PALETTE = ['#DE350B', '#FF8B00', '#0C66E4', '#6554C0', '#00875A', '#0065FF'];

function getColorFromId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[idx] ?? '#6554C0';
}

export function AmenityTicketModal({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<AmenityTicket[]>([]);
  const [services, setServices] = useState<AmenityService[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [amenityStaff, setAmenityStaff] = useState<{ id: string; fullName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('AmenityTicketModal: Start fetching data...');

      const ticketData = await amenityTicketService.getAllAmenityTickets().catch(err => {
        console.error('AmenityTicketModal: AmenityTicket API failed', err);
        return null;
      });
      console.log('AmenityTicketModal: ticketData response:', ticketData);

      const serviceData = await amenityServiceService.getAllAmenityServices().catch(err => {
        console.error('AmenityTicketModal: AmenityService API failed', err);
        return null;
      });
      console.log('AmenityTicketModal: serviceData response:', serviceData);

      const accountData = await userService.getAllAccounts().catch(err => {
        console.error('AmenityTicketModal: Accounts API failed', err);
        return null;
      });
      console.log('AmenityTicketModal: accountData response:', accountData);

      const staffData = await amenityTicketService.getAllStaff().catch(err => {
        console.error('AmenityTicketModal: AmenityStaff API failed', err);
        return null;
      });
      console.log('AmenityTicketModal: staffData response:', staffData);

      setTickets(Array.isArray(ticketData) ? ticketData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
      setAccounts(Array.isArray(accountData) ? accountData : []);
      setAmenityStaff(Array.isArray(staffData) ? staffData : []);

      if (!ticketData) {
        setError('Lỗi kết nối API chính. Vui lòng kiểm tra lại quyền truy cập hoặc đường truyền.');
      }
    } catch (err: unknown) {
      setError('Đã xảy ra lỗi không xác định khi tải dữ liệu.');
      console.error('AmenityTicketModal: Global Error:', err);
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
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.Message || 'Không thể chấp nhận yêu cầu.';
      toast({ title: 'Thất bại', description: message, variant: 'error' });
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await amenityTicketService.cancelAmenityTicket(id);
      toast({ title: 'Thành công', description: 'Đã hủy yêu cầu thành công.', variant: 'success' });
      fetchData();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.Message || 'Không thể hủy yêu cầu.';
      toast({ title: 'Thất bại', description: message, variant: 'error' });
    }
  };

  const handleComplete = async (id: number, staffId: string) => {
    try {
      if (!staffId) {
        toast({ title: 'Cảnh báo', description: 'Vui lòng chọn nhân viên thực hiện.', variant: 'error' });
        return;
      }

      await amenityTicketService.completeAmenityTicket(id, staffId);
      toast({ title: 'Thành công', description: 'Đã đánh dấu hoàn thành yêu cầu.', variant: 'success' });
      fetchData();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.Message || 'Không thể đánh dấu hoàn thành.';
      toast({ title: 'Thất bại', description: message, variant: 'error' });
    }
  };

  const getServiceName = (ticket: AmenityTicket) => {
    if (ticket.amenityServiceName) return ticket.amenityServiceName;
    return services.find(s => s.id === ticket.amenityServiceId)?.name || `Dịch vụ #${ticket.amenityServiceId}`;
  };

  const getCustomerName = (ticket: AmenityTicket) => {
    if (ticket.customerName) return ticket.customerName;
    const id = ticket.customerId;
    const acc = accounts.find(a => a.id === id);
    if (!acc) return `Khách hàng #${id.slice(0, 8)}`;
    return acc.ownerProfile?.fullName || acc.email || acc.username || `Khách hàng #${id.slice(0, 8)}`;
  };

  const getStaffAvatarUrl = (ticket: AmenityTicket) => {
    const id = ticket.amenityStaffId || ticket.staffId;
    if (!id) return null;
    const acc = accounts.find(a => a.id === id);
    return acc?.ownerProfile?.avatarUrl;
  };

  const getStaffDisplayName = (ticket: AmenityTicket) => {
    if (ticket.amenityStaffName) return ticket.amenityStaffName;
    const id = ticket.amenityStaffId || ticket.staffId;
    if (!id) return 'Chưa phân công';
    // Try to find in specialized list first
    const amStaff = amenityStaff.find(s => s.id === id);
    if (amStaff) return amStaff.fullName;
    // Fallback to accounts list
    const acc = accounts.find(a => a.id === id);
    if (!acc) return 'N/A';
    return acc.ownerProfile?.fullName || acc.username || 'Staff';
  };

  const enrichedStaff = useMemo(() => {
    return amenityStaff.map(s => {
      const acc = accounts.find(a => a.id === s.id);
      return {
        ...s,
        email: acc?.email || 'N/A',
        avatarUrl: acc?.ownerProfile?.avatarUrl || '',
      };
    });
  }, [amenityStaff, accounts]);

  const filteredEnrichedStaff = useMemo(() => {
    const q = staffSearchQuery.toLowerCase().trim();
    if (!q) return enrichedStaff;
    return enrichedStaff.filter(s =>
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }, [enrichedStaff, staffSearchQuery]);

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const serviceName = getServiceName(item).toLowerCase();
        const customerName = getCustomerName(item).toLowerCase();
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
    <Tooltip.Provider delayDuration={100}>
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

                <div className={styles.filterGroup}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className={styles.filterButton}>
                        <span>{STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label}</span>
                        <ChevronDownIcon className={styles.filterChevron} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={styles.dropdownContent} align="start" sideOffset={6}>
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
              </div>
              <div className={styles.right}>
                {loading && <Loader2 size={20} className="animate-spin text-gray-400" />}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4 text-sm flex items-center gap-2">
                <X size={16} />
                {error}
              </div>
            )}

            <div className={styles.cardList}>
              {loading && tickets.length === 0 ? (
                <div className={styles.loadingState}>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Đang tải dữ liệu...</span>
                </div>
              ) : paginatedTickets.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrapper}>
                    <Inbox size={48} strokeWidth={1} />
                  </div>
                  <h3 className={styles.emptyTitle}>Không tìm thấy yêu cầu</h3>
                  <p className={styles.emptyDescription}>
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Không có yêu cầu nào khớp với bộ lọc hiện tại của bạn.' 
                      : 'Hiện chưa có yêu cầu dịch vụ tiện ích nào trong hệ thống.'}
                  </p>
                  {(searchQuery || statusFilter !== 'all') && (
                    <button 
                      className={styles.clearFiltersButton}
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                paginatedTickets.map((ticket) => {
                  const service = services.find(s => s.id === ticket.amenityServiceId);
                  const imageUrl = ticket.imageUrl || service?.imageUrl;

                  return (
                    <div key={ticket.id} className={styles.ticketCard}>
                      <div className={styles.cardImage}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={getServiceName(ticket)}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <Users size={32} />
                          </div>
                        )}
                      </div>
                      <div className={styles.cardInfo}>
                        <div className={styles.cardHeader}>
                          <div className={styles.mainInfo}>
                            <h3 className={styles.ticketBuyer}>{getCustomerName(ticket)}</h3>
                          </div>
                          <span className={`${styles.statusBadge} ${styles[`status-${ticket.status}`]}`}>
                            {STATUS_OPTIONS.find(opt => opt.value === ticket.status)?.label || ticket.status}
                          </span>
                        </div>

                        <div className={styles.cardDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.value}>{getServiceName(ticket)}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.value}>
                              {formatDate(ticket.date)} | {formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}
                            </span>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          <div className={styles.actions}>
                            {/* Actions for Booked or Accepted status */}
                            {(ticket.status === 'Booked' || ticket.status === 'Accepted') ? (
                              <>
                                {/* Primary Action */}
                                {ticket.status === 'Booked' ? (
                                  <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                      <button
                                        className={`${styles.actionButton} ${styles.acceptButton}`}
                                        onClick={() => handleAccept(ticket.id)}
                                      >
                                        <Check size={16} />
                                        <span>Chấp nhận</span>
                                      </button>
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                      <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                        Chấp nhận yêu cầu
                                        <Tooltip.Arrow className={styles.tooltipArrow} />
                                      </Tooltip.Content>
                                    </Tooltip.Portal>
                                  </Tooltip.Root>
                                ) : (
                                  <DropdownMenu>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <DropdownMenuTrigger asChild>
                                          <button className={`${styles.actionButton} ${styles.completeButton}`}>
                                            <CheckCircle size={16} />
                                            <span>Hoàn thành</span>
                                          </button>
                                        </DropdownMenuTrigger>
                                      </Tooltip.Trigger>
                                      <Tooltip.Portal>
                                        <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                          Hoàn thành & Chọn nhân viên
                                          <Tooltip.Arrow className={styles.tooltipArrow} />
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                    <DropdownMenuContent className={styles.staffPopoverContent} align="end" sideOffset={8}>
                                      <div className={styles.staffSearchWrapper}>
                                        <div className={styles.staffSearchInputWrapper}>
                                          <div className={styles.unassignedIcon} aria-hidden="true">
                                            <Users size={14} />
                                          </div>
                                          <input
                                            type="text"
                                            placeholder="Tìm nhân viên..."
                                            className={styles.staffSearchInput}
                                            value={staffSearchQuery}
                                            onChange={(e) => setStaffSearchQuery(e.target.value)}
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>
                                      <div className={styles.staffUserList}>
                                        {!staffSearchQuery && (
                                          <div className={styles.staffUserItem} role="button">
                                            <div className={styles.staffAvatar} style={{ background: '#7A869A' }} aria-hidden="true">
                                              <Users size={16} />
                                            </div>
                                            <div className={styles.staffUserInfo}>
                                              <div className={styles.staffUserName}>Tất cả nhân viên</div>
                                            </div>
                                          </div>
                                        )}
                                        {filteredEnrichedStaff.map(staff => (
                                          <DropdownMenuItem
                                            key={staff.id}
                                            className={styles.staffUserItem}
                                            onClick={() => handleComplete(ticket.id, staff.id)}
                                          >
                                            <div className={styles.staffAvatar} style={{ background: getColorFromId(staff.id) }} aria-hidden="true">
                                              {staff.avatarUrl ? (
                                                <Image 
                                                  src={staff.avatarUrl} 
                                                  alt="" 
                                                  width={24} 
                                                  height={24} 
                                                  className="rounded-full object-cover"
                                                  unoptimized
                                                />
                                              ) : (
                                                staff.fullName?.charAt(0).toUpperCase()
                                              )}
                                            </div>
                                            <div className={styles.staffUserInfo}>
                                              <div className={styles.staffUserName}>{staff.fullName}</div>
                                              {staff.email && <div className={styles.staffUserEmail}>{staff.email}</div>}
                                            </div>
                                          </DropdownMenuItem>
                                        ))}
                                      </div>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}

                                {/* Secondary Action */}
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      className={`${styles.actionButton} ${styles.cancelButton}`}
                                      onClick={() => handleCancel(ticket.id)}
                                    >
                                      <X size={16} />
                                      <span>{ticket.status === 'Booked' ? 'Từ chối' : 'Hủy bỏ'}</span>
                                    </button>
                                  </Tooltip.Trigger>
                                  <Tooltip.Portal>
                                    <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                                      {ticket.status === 'Booked' ? 'Từ chối yêu cầu' : 'Hủy bỏ yêu cầu'}
                                      <Tooltip.Arrow className={styles.tooltipArrow} />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              </>
                            ) : ticket.status === 'Completed' ? (
                              /* Show staff badge for completed tickets */
                              <div className={styles.completedBadge}>
                                <div className={styles.badgeIcon}>
                                  <Users size={14} />
                                </div>
                                <span className={styles.badgeLabel}>
                                  Nhân viên: {getStaffDisplayName(ticket)}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
