'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import appointmentService from '@/services/appointment.service';
import type { UpdateAppointmentRequest } from '@/types/appointment';
import type { AppointmentTypeDetail } from '@/types/appointment-type';

import TaskFe16Icon from '../../work-schedule/components/list/artifacts/glyph/task-fe/16';
import wsStyles from '../../work-schedule/components/list/work-schedule-list.module.css';
import { DatePicker } from '../../work-schedule/components/DatePicker';
import { TaskTypePicker, type TaskType } from '../../work-schedule/components/shared/TaskTypePicker';
import styles from '../../package/components/new-package-modal.module.css';
import type { Appointment } from './types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  onSuccess?: () => void;
};

type FormValues = {
  name: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export function EditAppointmentModal({ open, onOpenChange, appointment, onSuccess }: Props) {
  const { toast } = useToast();
  const [values, setValues] = React.useState<FormValues>({ name: '' });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [appointmentTypes, setAppointmentTypes] = React.useState<TaskType[]>([]);
  const [selectedTaskType, setSelectedTaskType] = React.useState<TaskType | null>(null);

  const [date, setDate] = React.useState<Date | null>(null);
  const [time, setTime] = React.useState('');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTaskTypePicker, setShowTaskTypePicker] = React.useState(false);
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

  // Fetch appointment types from API (same as QuickCreateAppointment)
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
      } catch (error) {
        const message =
          typeof error === 'object' && error && 'message' in error ? String((error as { message?: unknown }).message) : '';
        toast({ title: message || 'Không thể tải loại lịch hẹn', variant: 'error' });
      }
    }

    void fetchAppointmentTypes();
  }, [open, toast]);

  React.useEffect(() => {
    if (!open || !appointment) return;

    if (appointment.rawDateTime) {
      const d = new Date(appointment.rawDateTime);
      if (!Number.isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        setDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
        setTime(`${hh}:${min}`);
      }
    }

    setValues({
      name: appointment.name || '',
    });
    setErrors({});
  }, [open, appointment]);

  // Init selected appointment type once we have both appointment + appointmentTypes
  React.useEffect(() => {
    if (!open || !appointment) return;
    if (appointmentTypes.length === 0) return;

    const found = appointment.appointmentTypeId
      ? appointmentTypes.find((t) => Number(t.id) === appointment.appointmentTypeId)
      : undefined;
    setSelectedTaskType(found ?? appointmentTypes[0] ?? null);
  }, [open, appointment, appointmentTypes]);

  const handleChange =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const canSubmit = !!(formattedDate && time && selectedTaskType && !isSubmitting);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    if (!formattedDate || !time || !selectedTaskType) return;

    const payload: UpdateAppointmentRequest = {
      date: formattedDate,
      time,
      name: values.name.trim() || undefined,
      appointmentTypeId: Number(selectedTaskType.id),
    };

    try {
      setIsSubmitting(true);
      await appointmentService.updateAppointment(appointment.id, payload);
      toast({ title: 'Cập nhật lịch hẹn thành công', variant: 'success' });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Cập nhật lịch hẹn thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !appointment) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        style={{ overflow: 'visible', maxWidth: 720 }}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chỉnh sửa lịch hẹn</h2>
          <button onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Close">
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
                    aria-label="Appointment type"
                    onClick={() => setShowTaskTypePicker((v) => !v)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        setShowTaskTypePicker((v) => !v);
                      }
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      {selectedTaskType ? <span className={wsStyles.taskTypeSvg}>{selectedTaskType.icon}</span> : null}
                      <span className={!selectedTaskType ? wsStyles.dateTimeDisplayPlaceholder : undefined}>
                        {selectedTaskType?.label || 'Chọn loại lịch hẹn'}
                      </span>
                    </span>
                    <span className={wsStyles.dateTimeIcon} aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
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
                <label htmlFor="appointmentName">Tên lịch hẹn</label>
                <input
                  id="appointmentName"
                  className={styles.formControl}
                  value={values.name}
                  onChange={handleChange('name')}
                />
                {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
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
                    aria-label="Ngày giờ"
                    onClick={() => setShowDatePicker((v) => !v)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        setShowDatePicker((v) => !v);
                      }
                    }}
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
              {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

