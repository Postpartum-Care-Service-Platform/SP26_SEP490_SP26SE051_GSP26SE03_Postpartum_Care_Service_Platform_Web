'use client';

import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import appointmentService from '@/services/appointment.service';
import type { CreateCustomerAppointmentRequest } from '@/types/appointment';

import { DatePicker } from '../../work-schedule/components/DatePicker';
import styles from '../../work-schedule/components/list/work-schedule-list.module.css';
import { AssigneePicker, type Assignee } from '../../work-schedule/components/shared/AssigneePicker';
import { TaskTypePicker, type TaskType } from '../../work-schedule/components/shared/TaskTypePicker';
import TaskFe16Icon from '../../work-schedule/components/list/artifacts/glyph/task-fe/16';

type QuickCreateAppointmentProps = {
  onCreated?: () => void;
};

type Customer = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  color?: string;
};

export function QuickCreateAppointment({ onCreated }: QuickCreateAppointmentProps) {
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [isNameActive, setIsNameActive] = React.useState(false);
  const datePickerRef = React.useRef<HTMLDivElement | null>(null);
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
        if (mappedTypes.length > 0 && !selectedTaskType) {
          setSelectedTaskType(mappedTypes[0]);
        }
      } catch (error) {
        const message =
          typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : '';
        toast({ title: message || 'Không thể tải loại lịch hẹn', variant: 'error' });
      }
    }

    fetchAppointmentTypes();
  }, [toast, selectedTaskType]);

  const canSubmit = name.trim() && formattedDate && time && selectedCustomer && selectedTaskType && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedCustomer || !selectedTaskType) return;

    setIsSubmitting(true);
    try {
      const payload: CreateCustomerAppointmentRequest = {
        customerId: selectedCustomer.id,
        name: name.trim(),
        date: formattedDate,
        time,
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
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : '';
      toast({ title: message || 'Tạo lịch hẹn thất bại. Vui lòng thử lại.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!showDatePicker) return;

    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
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

  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowDatePicker(false);
        setShowTaskTypePicker(false);
        setShowCustomerPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) {
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
      }}
    >
      <div className={styles.createTaskInner}>
        {/* Appointment type - UI giống TaskTypePicker */}
        <div
          ref={typePickerRef}
          className={styles.typeDropdown}
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
          {selectedTaskType ? (
            selectedTaskType.imageUrl ? (
              <Image
                src={selectedTaskType.imageUrl}
                alt={selectedTaskType.label}
                width={16}
                height={16}
                className={styles.workIconImg}
              />
            ) : (
              <span className={styles.taskTypeSvg}>{selectedTaskType.icon}</span>
            )
          ) : null}
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
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

        {/* Tên lịch hẹn với line cam ở dưới khi focus */}
        <div className={styles.nameFieldWrapper}>
          <input
            type="text"
            placeholder="Tên lịch hẹn"
            className={styles.createInput}
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
          <div className={isNameActive ? styles.nameFieldLineActive : styles.nameFieldLine} />
        </div>

        {/* Ngày giờ & khách hàng */}
        <div className={styles.createActions}>
          <div ref={datePickerRef} style={{ position: 'relative' }}>
            <div
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
              <span className={!formattedDateTimeLabel ? styles.dateTimeDisplayPlaceholder : undefined}>
                {formattedDateTimeLabel || 'Chọn ngày & giờ'}
              </span>
              <span className={styles.dateTimeIcon}>
                <svg fill="none" viewBox="0 0 16 16" width="16" height="16">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M4.5 2.5v2H6v-2h4v2h1.5v-2H13a.5.5 0 0 1 .5.5v3h-11V3a.5.5 0 0 1 .5-.5zm-2 5V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V7.5zm9-6.5H13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h1.5V0H6v1h4V0h1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            {showDatePicker && (
              <DatePicker
                value={date}
                onChange={(d) => {
                  setDate(d);
                }}
                withTime
                timeValue={time}
                onTimeChange={(t) => setTime(t)}
              />
            )}
          </div>

          {/* Chọn khách hàng (tái sử dụng UI AssigneePicker) */}
          <Popover.Root open={showCustomerPicker} onOpenChange={setShowCustomerPicker}>
            <Popover.Trigger asChild>
              <div
                className={`${styles.dateTimeDisplay} ${styles.customerDisplay}`}
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
                {selectedCustomer && (
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
                )}
                <span
                  className={`${styles.customerName} ${
                    !selectedCustomer ? styles.dateTimeDisplayPlaceholder : ''
                  }`}
                >
                  {selectedCustomer?.name || 'Chọn khách hàng'}
                </span>
                <span className={styles.dateTimeIcon}>
                  <svg fill="none" viewBox="-4 -4 24 24" width="16" height="16">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M8 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4 4a4 4 0 1 1 8 0 4 4 0 0 1-8 0m-2 9a3.75 3.75 0 0 1 3.75-3.75h4.5A3.75 3.75 0 0 1 14 13v2h-1.5v-2a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 3.5 13v2H2z"
                      clipRule="evenodd"
                    />
                  </svg>
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

          {/* Submit button */}
          <div className={styles.submitBtnGroup}>
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

