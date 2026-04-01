'use client';

import { Cross1Icon, ChevronDownIcon, PersonIcon } from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import React from 'react';
import Image from 'next/image';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import appointmentService from '@/services/appointment.service';
import type { CreateCustomerAppointmentRequest } from '@/types/appointment';
import type { AppointmentTypeDetail } from '@/types/appointment-type';

import TaskFe16Icon from '../../work-schedule/components/list/artifacts/glyph/task-fe/16';
import wsStyles from '../../work-schedule/components/list/work-schedule-list.module.css';
import { DatePicker } from '../../work-schedule/components/DatePicker';
import { TaskTypePicker, type TaskType } from '../../work-schedule/components/shared/TaskTypePicker';
import { AssigneePicker, type Assignee } from '../../work-schedule/components/shared/AssigneePicker';
import styles from '../../package/components/new-package-modal.module.css';
import localStyles from './QuickCreateAppointment.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

type FormValues = {
  name: string;
};

type Customer = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  color?: string;
};

export function NewAppointmentModal({ open, onOpenChange, onSuccess }: Props) {
  const { toast } = useToast();
  const [values, setValues] = React.useState<FormValues>({ name: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [appointmentTypes, setAppointmentTypes] = React.useState<TaskType[]>([]);
  const [selectedTaskType, setSelectedTaskType] = React.useState<TaskType | null>(null);

  const [date, setDate] = React.useState<Date | null>(null);
  const [time, setTime] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTaskTypePicker, setShowTaskTypePicker] = React.useState(false);
  const [showCustomerPicker, setShowCustomerPicker] = React.useState(false);

  const datePickerRef = React.useRef<HTMLDivElement | null>(null);
  const typePickerRef = React.useRef<HTMLDivElement | null>(null);

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

  // Fetch appointment types
  React.useEffect(() => {
    if (!open) return;

    async function fetchAppointmentTypes() {
      try {
        const types = await appointmentTypeService.getAllAppointmentTypes();
        const activeTypes = types.filter((t) => t.isActive);
        const mappedTypes: TaskType[] = activeTypes.map((type: AppointmentTypeDetail) => ({
          id: String(type.id),
          label: type.name,
          icon: <TaskFe16Icon />,
          imageUrl: undefined,
        }));
        setAppointmentTypes(mappedTypes);
        if (mappedTypes.length > 0) {
          setSelectedTaskType(mappedTypes[0]);
        }
      } catch (error) {
        console.error('Failed to load appointment types', error);
      }
    }

    void fetchAppointmentTypes();
  }, [open]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setValues({ name: '' });
      setDate(null);
      setTime('');
      setSelectedCustomer(null);
    }
  }, [open]);

  const canSubmit = !!(formattedDate && time && selectedTaskType && selectedCustomer && !isSubmitting);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedCustomer || !selectedTaskType) return;

    const payload: CreateCustomerAppointmentRequest = {
      customerId: selectedCustomer.id,
      name: values.name.trim(),
      date: formattedDate,
      time: time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time,
      appointmentTypeId: Number(selectedTaskType.id),
    };

    try {
      setIsSubmitting(true);
      await appointmentService.createAppointmentForCustomer(payload);
      toast({ title: 'Tạo lịch hẹn thành công', variant: 'success' });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast({ 
        title: err?.message || 'Tạo lịch hẹn thất bại', 
        variant: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close pickers on outside click
  React.useEffect(() => {
    if (!showDatePicker) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker]);

  React.useEffect(() => {
    if (!showTaskTypePicker) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (typePickerRef.current && !typePickerRef.current.contains(event.target as Node)) {
        setShowTaskTypePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTaskTypePicker]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        style={{ overflow: 'visible', maxWidth: 720 }}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Thêm lịch hẹn mới</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close" title="Đóng">
            <Cross1Icon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  Loại lịch hẹn <span className={styles.required}>*</span>
                </label>
                <div ref={typePickerRef} style={{ position: 'relative' }}>
                  <div
                    className={wsStyles.dateTimeDisplay}
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowTaskTypePicker((v) => !v)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      {selectedTaskType ? <span className={wsStyles.taskTypeSvg}>{selectedTaskType.icon}</span> : null}
                      <span className={!selectedTaskType ? wsStyles.dateTimeDisplayPlaceholder : undefined}>
                        {selectedTaskType?.label || 'Chọn loại lịch hẹn'}
                      </span>
                    </span>
                    <span className={wsStyles.dateTimeIcon}>
                      <ChevronDownIcon width={16} height={16} />
                    </span>
                  </div>
                  {showTaskTypePicker && appointmentTypes.length > 0 && (
                    <TaskTypePicker
                      side="bottom"
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

              <div className={styles.formGroup}>
                <label htmlFor="customer">
                  Khách hàng <span className={styles.required}>*</span>
                </label>
                <Popover.Root open={showCustomerPicker} onOpenChange={setShowCustomerPicker}>
                  <Popover.Trigger asChild>
                    <div
                      className={`${wsStyles.dateTimeDisplay} ${selectedCustomer ? '' : wsStyles.dateTimeDisplayPlaceholder}`}
                      role="button"
                      tabIndex={0}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        {selectedCustomer ? (
                          <>
                            {selectedCustomer.avatarUrl ? (
                              <Image
                                src={selectedCustomer.avatarUrl}
                                alt=""
                                width={24}
                                height={24}
                                style={{ borderRadius: '50%' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  background: selectedCustomer.color || '#6554C0',
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 10,
                                  fontWeight: 600,
                                }}
                              >
                                {selectedCustomer.initials || '?'}
                              </div>
                            )}
                            <span>{selectedCustomer.name}</span>
                          </>
                        ) : (
                          <>
                            <PersonIcon width={16} height={16} />
                            <span>Chọn khách hàng</span>
                          </>
                        )}
                      </span>
                      <span className={wsStyles.dateTimeIcon}>
                        <ChevronDownIcon width={16} height={16} />
                      </span>
                    </div>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content side="bottom" align="start" sideOffset={4} style={{ zIndex: 10001 }}>
                      <AssigneePicker
                        value={selectedCustomer ? {
                          id: selectedCustomer.id,
                          name: selectedCustomer.name,
                          avatarUrl: selectedCustomer.avatarUrl,
                          initials: selectedCustomer.initials,
                          color: selectedCustomer.color,
                          type: 'user'
                        } : null}
                        hideSpecialOptions
                        roleNameFilter={['customer']}
                        onChange={(a) => {
                          if (a) {
                            setSelectedCustomer({
                              id: a.id,
                              name: a.name,
                              avatarUrl: a.avatarUrl,
                              initials: a.initials,
                              color: a.color
                            });
                          } else {
                            setSelectedCustomer(null);
                          }
                        }}
                        onClose={() => setShowCustomerPicker(false)}
                      />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>

              <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                <label htmlFor="appointmentName">Tên lịch hẹn</label>
                <input
                  id="appointmentName"
                  className={styles.formControl}
                  placeholder="Nhập tên lịch hẹn"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  Ngày hẹn <span className={styles.required}>*</span>
                </label>
                <div ref={datePickerRef} style={{ position: 'relative' }}>
                  <div
                    className={wsStyles.dateTimeDisplay}
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowDatePicker((v) => !v)}
                  >
                    <span className={!formattedDateTimeLabel ? wsStyles.dateTimeDisplayPlaceholder : undefined}>
                      {formattedDateTimeLabel || 'Chọn ngày & giờ'}
                    </span>
                    <span className={wsStyles.dateTimeIcon}>
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
                      onChange={(d) => setDate(d)}
                      withTime
                      timeValue={time}
                      onTimeChange={(t) => setTime(t)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={!canSubmit}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
