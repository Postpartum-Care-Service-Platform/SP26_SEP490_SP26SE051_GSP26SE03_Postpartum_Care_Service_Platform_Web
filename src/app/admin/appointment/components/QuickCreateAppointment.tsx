'use client';

import { CalendarIcon, ChevronDownIcon, PersonIcon, TextIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import React from 'react';
import { createPortal } from 'react-dom';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import appointmentService from '@/services/appointment.service';
import type { CreateCustomerAppointmentRequest } from '@/types/appointment';

import { DatePicker } from '../../work-schedule/components/DatePicker';
import TaskFe16Icon from '../../work-schedule/components/list/artifacts/glyph/task-fe/16';
import styles from '../../work-schedule/components/list/work-schedule-list.module.css';
import { AssigneePicker, type Assignee } from '../../work-schedule/components/shared/AssigneePicker';
import { TaskTypePicker, type TaskType } from '../../work-schedule/components/shared/TaskTypePicker';

import localStyles from './QuickCreateAppointment.module.css';

type QuickCreateAppointmentProps = {
  onCreated?: () => void;
  hideDefaultButton?: boolean; // Ẩn nút "Tạo lịch hẹn nhanh" mặc định
  isOpen?: boolean; // Điều khiển từ bên ngoài
  onOpenChange?: (open: boolean) => void; // Callback khi mở/đóng
};

type Customer = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  color?: string;
};

export function QuickCreateAppointment({ 
  onCreated, 
  hideDefaultButton = false,
  isOpen: controlledIsOpen,
  onOpenChange
}: QuickCreateAppointmentProps) {
  const [appointmentTypes, setAppointmentTypes] = React.useState<TaskType[]>([]);
  const [selectedTaskType, setSelectedTaskType] = React.useState<TaskType | null>(null);
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState<Date | null>(null);
  const [time, setTime] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTaskTypePicker, setShowTaskTypePicker] = React.useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  
  // Sử dụng controlled state nếu có, nếu không thì dùng internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = React.useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  }, [onOpenChange]);
  const [isNameActive, setIsNameActive] = React.useState(false);
  const [datePickerPosition, setDatePickerPosition] = React.useState<{ top: number; right: number } | null>(null);
  const datePickerRef = React.useRef<HTMLDivElement | null>(null);
  const datePickerTriggerRef = React.useRef<HTMLDivElement | null>(null);
  const typePickerRef = React.useRef<HTMLDivElement | null>(null);
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const formattedDate = React.useMemo(() => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, [date]);

  const formattedDateTimeLabel = React.useMemo(() => {
    if (!date || !time) return '';

    const d = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${d}, ${time}`;
  }, [date, time]);

  // Fetch appointment types from API
  React.useEffect(() => {
    async function fetchAppointmentTypes() {
      try {
        const types = await appointmentTypeService.getAllAppointmentTypes();
        const activeTypes = types.filter((t) => t.isActive);
        const mappedTypes: TaskType[] = activeTypes.map((type) => ({
          id: String(type.id),
          label: type.name,
          icon: <TaskFe16Icon />,
          imageUrl: undefined,
        }));
        setAppointmentTypes(mappedTypes);
        setSelectedTaskType(mappedTypes[0] ?? null);
      } catch (error) {
        const message =
          typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : '';
        toast({ title: message || 'Không thể tải loại lịch hẹn', variant: 'error' });
      }
    }

    void fetchAppointmentTypes();
  }, [toast]);

  const canSubmit = name.trim() && formattedDate && time && selectedCustomer && selectedTaskType && !isSubmitting;

  const normalizeTimeForApi = (rawTime: string): string => {
    if (!rawTime) return rawTime;
    // API chấp nhận string, ưu tiên chuẩn HH:mm:ss
    return /^\d{2}:\d{2}$/.test(rawTime) ? `${rawTime}:00` : rawTime;
  };

  const handleSubmit = async () => {
    if (!canSubmit || !selectedCustomer || !selectedTaskType) return;

    setIsSubmitting(true);
    try {
      const payload: CreateCustomerAppointmentRequest = {
        customerId: selectedCustomer.id,
        name: name.trim(),
        date: formattedDate,
        time: normalizeTimeForApi(time),
        appointmentTypeId: Number(selectedTaskType.id),
      };

      await appointmentService.createAppointmentForCustomer(payload);

      setName('');
      setDate(null);
      setTime('');
      setSelectedCustomer(null);
      if (appointmentTypes.length > 0) {
        setSelectedTaskType(appointmentTypes[0]);
      }
      setIsOpen(false);
      onCreated?.();
      toast({ title: 'Tạo lịch hẹn thành công', variant: 'success' });
      
      // Reset form
      setName('');
      setDate(null);
      setTime('');
      setSelectedCustomer(null);
      if (appointmentTypes.length > 0) {
        setSelectedTaskType(appointmentTypes[0]);
      }
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : '';
      toast({ title: message || 'Tạo lịch hẹn thất bại. Vui lòng thử lại.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán vị trí cho DatePicker khi mở
  React.useEffect(() => {
    if (!showDatePicker || !datePickerTriggerRef.current) {
      setDatePickerPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!datePickerTriggerRef.current) return;
      
      const trigger = datePickerTriggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const datePickerWidth = 520; // Width của DatePicker với time
      
      // Tính toán vị trí: hiển thị phía trên trigger, căn phải
      let right = window.innerWidth - rect.right;
      
      // Đảm bảo DatePicker không bị overflow bên phải
      if (right < 0) {
        right = 16; // Margin từ edge
      }
      
      // Đảm bảo DatePicker không bị overflow bên trái
      if (right + datePickerWidth > window.innerWidth) {
        right = window.innerWidth - datePickerWidth - 16;
      }
      
      setDatePickerPosition({
        top: rect.top - 8, // 8px offset phía trên
        right: Math.max(16, right), // Ít nhất 16px từ edge
      });
    };

    updatePosition();
    
    // Update position khi scroll hoặc resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        datePickerTriggerRef.current?.contains(target) ||
        datePickerRef.current?.contains(target)
      ) {
        return;
      }
      setShowDatePicker(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  React.useEffect(() => {
    if (!showTaskTypePicker) return;

    function handleClickOutside(event: MouseEvent) {
      if (typePickerRef.current && !typePickerRef.current.contains(event.target as Node)) {
        setShowTaskTypePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTaskTypePicker]);

  // Reset form khi đóng
  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setDate(null);
      setTime('');
      setSelectedCustomer(null);
      setShowDatePicker(false);
      setShowTaskTypePicker(false);
      setShowCustomerPicker(false);
      if (appointmentTypes.length > 0) {
        setSelectedTaskType(appointmentTypes[0]);
      }
    }
  }, [isOpen, appointmentTypes]);

  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Nếu hideDefaultButton = true, không hiển thị nút mặc định, chỉ hiển thị form khi isOpen = true
  if (!isOpen) {
    if (hideDefaultButton) {
      return null; // Ẩn hoàn toàn khi hideDefaultButton = true
    }
    return (
      <div
        className={styles.footer}
        style={{ border: 'none', marginTop: 0, justifyContent: 'center' }}
      >
        <button type="button" className={styles.createBtn} onClick={() => setIsOpen(true)}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tạo lịch hẹn nhanh</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={footerRef}
      className={`${styles.footer} ${styles.footerHasInput}`}
      style={{
        marginTop: 0,
        border: 'none',
        position: 'relative',
        zIndex: 9999, // Z-index cao để DatePicker có thể hiển thị trên header admin (1000)
      }}
    >
      <div className={localStyles.container}>
        {/* Appointment type - 180px với label text truncate */}
        <div ref={typePickerRef} className={localStyles.appointmentTypeWrapper}>
          <div
            className={localStyles.appointmentTypeTrigger}
            role="button"
            tabIndex={0}
            aria-label="Appointment type"
            onClick={() => setShowTaskTypePicker((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowTaskTypePicker((v) => !v);
              }
            }}
          >
            <span className={localStyles.appointmentTypeInner}>
              {selectedTaskType ? (
                selectedTaskType.imageUrl ? (
                  <Image
                    src={selectedTaskType.imageUrl}
                    alt={selectedTaskType.label}
                    width={16}
                    height={16}
                    className={localStyles.appointmentTypeIcon}
                  />
                ) : (
                  <span className={localStyles.appointmentTypeIcon}>{selectedTaskType.icon}</span>
                )
              ) : null}
              <span
                className={`${localStyles.appointmentTypeLabel} ${
                  !selectedTaskType ? localStyles.appointmentTypePlaceholder : ''
                }`}
                title={selectedTaskType?.label}
              >
                {selectedTaskType?.label || 'Chọn loại lịch hẹn'}
              </span>
            </span>
            <span className={localStyles.appointmentTypeArrow} aria-hidden="true">
              <ChevronDownIcon width={16} height={16} />
            </span>
            {showTaskTypePicker && appointmentTypes.length > 0 && (
              <TaskTypePicker
                selectedId={selectedTaskType?.id ?? ''}
                onSelect={(t) => {
                  setSelectedTaskType(t);
                  setShowTaskTypePicker(false);
                }}
                types={appointmentTypes}
              />
            )}
          </div>
        </div>

        {/* Tên lịch hẹn - flex-1 chiếm phần còn lại */}
        <div className={localStyles.nameFieldWrapper}>
          <span className={localStyles.fieldLeadingIcon} aria-hidden="true">
            <TextIcon width={16} height={16} />
          </span>
          <input
            type="text"
            placeholder="Nhập tên lịch hẹn"
            className={`${styles.createInput} ${localStyles.nameInput}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsNameActive(true)}
            onBlur={(e) => setIsNameActive(!!e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSubmit();
              }
            }}
          />
          <div className={isNameActive ? localStyles.nameFieldLineActive : localStyles.nameFieldLine} />
        </div>

        {/* Actions group - Date/Time (200px), Customer (180px), Button (auto) */}
        <div className={localStyles.actionsGroup}>
          <div className={localStyles.dateTimeWrapper}>
            <div
              ref={datePickerTriggerRef}
              className={styles.dateTimeDisplay}
              role="button"
              tabIndex={0}
              aria-label="Ngày giờ"
              onClick={() => setShowDatePicker((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowDatePicker((v) => !v);
                }
              }}
            >
              <span className={localStyles.fieldLeadingIcon} aria-hidden="true">
                <CalendarIcon width={16} height={16} />
              </span>
              <span className={!formattedDateTimeLabel ? styles.dateTimeDisplayPlaceholder : undefined}>
                {formattedDateTimeLabel || 'Chọn ngày và giờ khám'}
              </span>
            </div>
            {/* Render DatePicker qua Portal để tránh stacking context conflict */}
            {showDatePicker && datePickerPosition && typeof window !== 'undefined' && createPortal(
              <div
                ref={datePickerRef}
                className={localStyles.datePickerPortalContainer}
                style={{
                  position: 'fixed',
                  top: `${datePickerPosition.top}px`,
                  right: `${datePickerPosition.right}px`,
                  zIndex: 10000,
                }}
              >
                <DatePicker
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                  }}
                  withTime
                  timeValue={time}
                  onTimeChange={(t) => setTime(t)}
                />
              </div>,
              document.body
            )}
          </div>

          {/* Chọn khách hàng - 180px */}
          <Popover.Root open={showCustomerPicker} onOpenChange={setShowCustomerPicker}>
            <Popover.Trigger asChild>
              <div
                className={`${styles.dateTimeDisplay} ${styles.customerDisplay} ${localStyles.customerWrapper}`}
                role="button"
                tabIndex={0}
                aria-label="Khách hàng"
                onClick={() => setShowCustomerPicker((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowCustomerPicker((v) => !v);
                  }
                }}
              >
                {selectedCustomer ? (
                  <div className={styles.customerAvatar}>
                    {selectedCustomer.avatarUrl ? (
                      <Image
                        src={selectedCustomer.avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div
                        className={styles.avatar}
                        style={{ background: selectedCustomer.color || '#6554C0' }}
                      >
                        {selectedCustomer.initials || '?'}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className={localStyles.fieldLeadingIcon} aria-hidden="true">
                    <PersonIcon width={16} height={16} />
                  </span>
                )}
                <span
                  className={`${styles.customerName} ${
                    !selectedCustomer ? styles.dateTimeDisplayPlaceholder : ''
                  }`}
                >
                  {selectedCustomer?.name || 'Chọn khách hàng'}
                </span>
              </div>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content
                side="top"
                align="end"
                sideOffset={8}
                collisionPadding={12}
                onOpenAutoFocus={(e) => e.preventDefault()}
                style={{ zIndex: 10000 }} // Z-index cao hơn header admin (1000)
              >
                <AssigneePicker
                  value={
                    selectedCustomer
                      ? {
                          id: selectedCustomer.id,
                          name: selectedCustomer.name,
                          avatarUrl: selectedCustomer.avatarUrl,
                          initials: selectedCustomer.initials,
                          color: selectedCustomer.color,
                          type: 'user',
                        }
                      : null
                  }
                  hideSpecialOptions
                  roleNameFilter={['customer']}
                  onChange={(a: Assignee | null) => {
                    if (!a) {
                      setSelectedCustomer(null);
                    } else {
                      setSelectedCustomer({
                        id: a.id,
                        name: a.name,
                        avatarUrl: a.avatarUrl,
                        initials: a.initials,
                        color: a.color,
                      });
                    }
                  }}
                  onClose={() => setShowCustomerPicker(false)}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          {/* Submit button - auto width */}
          <div className={`${styles.submitBtnGroup} ${localStyles.submitButtonWrapper}`}>
            <button
              type="button"
              className={styles.submitBtn}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <span>{isSubmitting ? 'Đang tạo...' : 'Tạo lịch hẹn'}</span>
              {!isSubmitting && (
                <span className={styles.enterIconWrapper}>
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 0C1.34315 0 0 1.34315 0 3V13C0 14.6569 1.34315 16 3 16H21C22.6569 16 24 14.6569 24 13V3C24 1.34315 22.6569 0 21 0H3Z"
                      fill="#00000029"
                    />
                    <path
                      d="M15.5 5.75V6.75C15.5 8.26878 14.2688 9.5 12.75 9.5H8.75C8.33579 9.5 8 9.16421 8 8.75C8 8.33579 8.33579 8 8.75 8H12.75C13.4404 8 14 7.44036 14 6.75V5.75C14 5.33579 14.3358 5 14.75 5C15.1642 5 15.5 5.33579 15.5 5.75Z"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M9.28033 9.28033L11.0303 7.53033C11.3232 7.23744 11.3232 6.76256 11.0303 6.46967C10.7374 6.17678 10.2626 6.17678 9.96967 6.46967L8.21967 8.21967C7.92678 8.51256 7.92678 8.98744 8.21967 9.28033C8.51256 9.57322 8.98744 9.57322 9.28033 9.28033Z"
                      fill="#FFFFFF"
                    />
                    <path
                      d="M9.28033 8.21967L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.7374 11.3232 10.2626 11.3232 9.96967 11.0303L8.21967 9.28033C7.92678 8.98744 7.92678 8.51256 8.21967 8.21967C8.51256 7.92678 8.98744 7.92678 9.28033 8.21967Z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

