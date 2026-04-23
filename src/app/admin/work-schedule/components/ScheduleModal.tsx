'use client';

import {
  Cross1Icon,
  CalendarIcon,
  MobileIcon,
  EnvelopeClosedIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  CheckIcon
} from '@radix-ui/react-icons';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import contractService from '@/services/contract.service';
import { fetchStaffSchedules, createStaffScheduleRange, type StaffSchedule } from '@/services/staffScheduleService';
import bookingService from '@/services/booking.service';
import type { Booking } from '@/types/booking';
import type { Contract } from '@/types/contract';
import { useToast } from '@/components/ui/toast/use-toast';

import styles from './schedule-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getInitials(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch (error) {
    return dateStr;
  }
};

export function ScheduleModal({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [staffs, setStaffs] = useState<StaffSchedule[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const [loadingStaffs, setLoadingStaffs] = useState(false);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      void loadData();
    } else {
      document.body.style.overflow = 'unset';
      setSelectedStaffIds([]);
      setSelectedContract(null);
      setSelectedBooking(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    if (selectedContract) {
      void loadBookingDetails(selectedContract.bookingId);
    } else {
      setSelectedBooking(null);
    }
  }, [selectedContract]);

  const loadData = async () => {
    setLoadingStaffs(true);
    setLoadingContracts(true);
    try {
      const [staffData, contractData] = await Promise.all([
        fetchStaffSchedules(),
        contractService.getNoScheduleContracts()
      ]);
      
      // Sort: Available staff first, then Busy staff
      const sortedStaffs = [...staffData].sort((a, b) => {
        if (a.isScheduled === b.isScheduled) return 0;
        return a.isScheduled ? 1 : -1;
      });
      
      setStaffs(sortedStaffs);
      setContracts(contractData);
      if (contractData.length > 0) {
        setSelectedContract(contractData[0] || null);
      }
    } catch (error) {
      console.error('Failed to fetch modal data:', error);
      toast({ title: 'Lỗi', description: 'Không thể tải dữ liệu.', variant: 'error' });
    } finally {
      setLoadingStaffs(false);
      setLoadingContracts(false);
    }
  };

  const loadBookingDetails = async (bookingId: number) => {
    setLoadingBooking(true);
    try {
      const booking = await bookingService.getBookingById(bookingId);
      setSelectedBooking(booking);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    } finally {
      setLoadingBooking(false);
    }
  };

  const handleStaffToggle = (staffId: string) => {
    setSelectedStaffIds(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSave = async () => {
    if (!selectedContract) {
      toast({ title: 'Cảnh báo', description: 'Vui lòng chọn hợp đồng.', variant: 'error' });
      return;
    }
    if (selectedStaffIds.length === 0) {
      toast({ title: 'Cảnh báo', description: 'Vui lòng chọn ít nhất một nhân viên.', variant: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      await createStaffScheduleRange({
        staffIds: selectedStaffIds,
        contractId: selectedContract.id
      });
      toast({ title: 'Thành công', description: 'Đã phân công lịch làm việc thành công.', variant: 'success' });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to create range schedule:', error);

      let errorMsg = 'Không thể tạo lịch làm việc. Vui lòng thử lại.';

      // Handle the specific error message with raw ID
      const rawMessage = error?.response?.data || error?.message || '';
      const idMatch = rawMessage.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);

      if (idMatch) {
        const staffId = idMatch[0];
        const staffName = staffs.find(s => s.id === staffId)?.fullName || staffId;
        errorMsg = rawMessage.replace(staffId, `"${staffName}"`);
      } else if (typeof rawMessage === 'string' && rawMessage.length > 0 && rawMessage.length < 200) {
        errorMsg = rawMessage;
      }

      toast({
        title: 'Lỗi phân công',
        description: errorMsg,
        variant: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon width={20} height={20} color="#fa8314" />
            <h2 className={styles.modalTitle}>Phân lịch làm việc</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => onOpenChange(false)}
            aria-label="Đóng"
          >
            <Cross1Icon />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Booking Summary Header */}
          <div className={styles.bookingSummary}>
            {loadingBooking ? (
              <div style={{ color: '#64748b', fontSize: '14px' }}>Đang tải thông tin chi tiết...</div>
            ) : selectedContract ? (
              <>
                <div className={styles.customerInfo}>
                  <div className={styles.customerAvatar} style={{
                    backgroundColor: !selectedBooking?.customer?.avatarUrl ? '#e2e8f0' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    width: '52px',
                    height: '52px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    {selectedBooking?.customer?.avatarUrl ? (
                      <Image
                        src={selectedBooking.customer.avatarUrl}
                        alt="Customer"
                        width={52}
                        height={52}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      getInitials(selectedBooking?.customer?.username || 'Khách hàng')
                    )}
                  </div>
                  <div className={styles.customerDetails}>
                    <h4 className={styles.lexendFont}>{selectedBooking?.customer?.username || 'Khách hàng'}</h4>
                    <p>{selectedBooking?.customer?.phone || 'N/A'}</p>
                    {selectedBooking?.targetBookings && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {selectedBooking.targetBookings.map((target) => (
                          <span key={target.id} className={styles.badge} style={{ fontSize: '9px', padding: '2px 6px', background: '#f1f5f9', color: '#64748b' }}>
                            <PersonIcon style={{ width: '10px', verticalAlign: 'middle', marginRight: '2px' }} />
                            {target.fullName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.bookingMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Gói dịch vụ</span>
                    <span className={styles.metaValue} style={{ color: '#fa8314' }}>
                      {selectedBooking?.package?.packageName || '---'}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Thời hạn</span>
                    <span className={styles.metaValue}>
                      {selectedBooking ? `${formatDate(selectedBooking.startDate)} - ${formatDate(selectedBooking.endDate)}` : '---'}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Hợp đồng</span>
                    <span className={styles.metaValue}>{selectedContract.contractCode}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Loại phòng</span>
                    <span className={styles.metaValue}>
                      {selectedBooking?.package?.roomTypeName || 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Chọn hợp đồng từ danh sách bên trái để xem chi tiết và phân công.</div>
            )}
          </div>

          <div className={styles.mainContent}>
            {/* Left Sidebar: Pending Contract List */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <div className={styles.searchBox}>
                  <span className={styles.searchIcon}><MagnifyingGlassIcon /></span>
                  <input type="text" placeholder="Tìm hợp đồng..." className={styles.searchInput} />
                </div>
              </div>

              <div className={styles.contractList}>
                {loadingContracts ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Đang tải...</div>
                ) : contracts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Không có hợp đồng mới</div>
                ) : (
                  contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className={`${styles.contractCard} ${selectedContract?.id === contract.id ? styles.contractCardActive : ''}`}
                      onClick={() => setSelectedContract(contract)}
                    >
                      <div className={styles.contractID}>{contract.contractCode}</div>
                      <div className={styles.contractCustomer}>Lịch cho {formatDate(contract.effectiveFrom)}</div>
                      <div className={styles.contractDates}>
                        <CalendarIcon style={{ width: '12px', height: '12px' }} />
                        {formatDate(contract.effectiveFrom)} - {formatDate(contract.effectiveTo)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* Main Area: Staff Assignment */}
            <main className={styles.mainArea}>
              <div className={styles.mainHeader}>
                <h3 className={styles.mainTitle}>
                  Nhân viên thực hiện
                </h3>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Đã chọn: <span style={{ fontWeight: 700, color: '#fa8314' }}>{selectedStaffIds.length}</span> nhân viên
                </div>
              </div>

              {loadingStaffs ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
                  Đang tải danh sách nhân viên...
                </div>
              ) : (
                <div className={styles.staffGrid}>
                  {staffs.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      Không tìm thấy nhân viên phù hợp.
                    </div>
                  ) : (
                    staffs.map((staff) => {
                      const isActive = selectedStaffIds.includes(staff.id);
                      const isBusy = staff.isScheduled;
                      return (
                        <div
                          key={staff.id}
                          className={`${styles.staffCard} ${isActive ? styles.staffCardActive : ''} ${isBusy ? styles.staffCardDisabled : ''}`}
                          onClick={() => !isBusy && handleStaffToggle(staff.id)}
                        >
                          <div className={styles.staffInfo}>
                            <div className={styles.staffAvatar}>
                              {staff.avatarUrl ? (
                                <Image
                                  src={staff.avatarUrl}
                                  alt={staff.fullName}
                                  width={48}
                                  height={48}
                                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                                />
                              ) : (
                                getInitials(staff.fullName)
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div className={styles.staffNameRow}>
                                <div className={styles.staffName}>{staff.fullName}</div>
                                {isBusy && <span className={styles.busyLabel}>Đã có lịch</span>}
                              </div>
                              <div className={styles.staffRole}>{staff.memberTypeName}</div>
                            </div>
                          </div>

                          <div className={styles.staffMeta}>
                            <div className={styles.metaRow}>
                              <MobileIcon style={{ color: isBusy ? '#94a3b8' : '#fa8314' }} /> {staff.phone}
                            </div>
                            <div className={styles.metaRow}>
                              <EnvelopeClosedIcon style={{ color: isBusy ? '#94a3b8' : '#fa8314' }} /> {staff.email}
                            </div>
                          </div>
                          {isBusy && staff.scheduledAt && staff.scheduledUntil && (
                            <div className={styles.busyTimeInfo}>
                              <CalendarIcon style={{ width: '12px', height: '12px' }} />
                              {formatDate(staff.scheduledAt)} - {formatDate(staff.scheduledUntil)}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </main>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Hủy bỏ
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSave}
            disabled={isSaving || !selectedContract || selectedStaffIds.length === 0}
          >
            {isSaving ? 'Đang lưu...' : 'Xác nhận phân công'}
          </button>
        </div>
      </div>
    </div>
  );
}
