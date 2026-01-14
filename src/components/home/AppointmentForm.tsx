'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { Form } from '@/components/forms/Form';
import { FormField } from '@/components/forms/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { appointmentService, type CreateAppointmentRequest } from '@/services/appointment.service';

import styles from './AppointmentForm.module.css';

// Schema validation cho form
const appointmentSchema = z
  .object({
    name: z.string().min(1, 'Vui lòng nhập tên của bạn'),
    date: z.string().min(1, 'Vui lòng chọn ngày'),
    time: z.string().min(1, 'Vui lòng chọn giờ'),
    appointmentTypeId: z.number().min(1, 'Vui lòng chọn loại tư vấn'),
  })
  .superRefine((data, ctx) => {
    const { date, time } = data;

    if (!date || !time) return;

    const [hourStr, minuteStr] = time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['time'],
        message: 'Định dạng giờ không hợp lệ.',
      });
      return;
    }

    const totalMinutes = hour * 60 + minute;
    const startMinutes = 8 * 60; // 08:00
    const endMinutes = 17 * 60; // 17:00

    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['time'],
        message: 'Vui lòng chọn giờ trong khung 08:00 - 17:00.',
      });
      return;
    }

    // Nếu đặt lịch trong ngày hôm nay thì giờ phải lớn hơn thời điểm hiện tại
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    if (date === todayStr) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      if (totalMinutes <= nowMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['time'],
          message: 'Vui lòng chọn thời gian muộn hơn thời điểm hiện tại.',
        });
      }
    }
  });

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Tạo danh sách giờ hành chính (8h - 16h)
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 8; hour <= 16; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 16) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Loại tư vấn (có thể lấy từ API sau)
const APPOINTMENT_TYPES = [
  { id: 1, label: 'Tư vấn tham quan' },
  { id: 2, label: 'Tư vấn dịch vụ' },
];

export const AppointmentForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo form với react-hook-form
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      date: '',
      time: '',
      appointmentTypeId: 1,
    },
  });

  // Đóng date picker khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Xử lý khi chọn ngày
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue('date', format(date, 'yyyy-MM-dd'));
      setShowDatePicker(false);
    }
  };

  // Xử lý submit form
  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const appointmentData: CreateAppointmentRequest = {
        name: data.name,
        date: data.date,
        time: data.time,
        appointmentTypeId: data.appointmentTypeId,
      };

      await appointmentService.createAppointment(appointmentData);
      setSubmitSuccess(true);
      form.reset();
      setSelectedDate(undefined);

      // Ẩn thông báo thành công sau 5 giây
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting appointment:', error);
      // Có thể thêm toast notification ở đây
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Form form={form} onSubmit={onSubmit} className={styles.form}>
        {/* Trường nhập tên */}
        <FormField
          name="name"
          label="Họ và tên *"
          render={({ value, onChange, onBlur, name, error }) => (
            <div>
              <Input
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Nhập họ và tên của bạn"
                variant="booking"
                className={error ? styles.inputError : ''}
              />
            </div>
          )}
        />

        {/* Trường chọn ngày */}
        <FormField
          name="date"
          label="Ngày *"
          render={({ value, onChange, onBlur, name, error }) => (
            <div className={styles.datePickerWrapper} ref={datePickerRef}>
              <div className={styles.dateInputContainer}>
                <Input
                  name={name}
                  value={value || (selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '')}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Chọn ngày"
                  readOnly
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  variant="booking"
                  className={error ? styles.inputError : ''}
                />
              </div>
              {showDatePicker && (
                <div className={styles.datePickerPopover}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className={styles.dayPicker}
                  />
                </div>
              )}
            </div>
          )}
        />

        {/* Trường chọn giờ */}
        <FormField
          name="time"
          label="Giờ hẹn *"
          render={({ value, onChange, onBlur, name, error }) => (
            <div className={styles.timePickerWrapper}>
              <div className={styles.timeInputContainer}>
                <Input
                  name={name}
                  type="time"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Chọn giờ (08:00 - 17:00)"
                  variant="booking"
                  className={error ? styles.inputError : ''}
                  min="08:00"
                  max="17:00"
                  step={1800}
                />
              </div>
            </div>
          )}
        />

        {/* Trường chọn loại tư vấn */}
        <FormField
          name="appointmentTypeId"
          label="Loại tư vấn *"
          render={({ value, onChange, onBlur, name, error }) => (
            <div>
              <select
                name={name}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onBlur={onBlur}
                className={`${styles.selectInput} ${error ? styles.inputError : ''}`}
              >
                {APPOINTMENT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        {/* Thông báo thành công */}
        {submitSuccess && (
          <div className={styles.successMessage}>
            Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
          </div>
        )}

        {/* Nút submit */}
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi...' : 'Đặt Lịch Ngay'}
        </Button>
      </Form>
    </div>
  );
};
