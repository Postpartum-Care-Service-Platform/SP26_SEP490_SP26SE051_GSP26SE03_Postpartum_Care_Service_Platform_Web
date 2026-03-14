'use client';

import { useCallback, useEffect, useState } from 'react';
import { Cross1Icon, ChevronDownIcon } from '@radix-ui/react-icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import roomAllotmentService from '@/services/room-allotment.service';
import roomTypeService from '@/services/room-type.service';
import type { Room, RoomStatus, UpdateRoomRequest } from '@/types/room-allotment';
import type { RoomType } from '@/types/room-type';

import styles from './room-allotment-modal.module.css';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room | null;
  onSuccess?: () => void;
};

const STATUS_OPTIONS: { value: RoomStatus; label: string }[] = [
  { value: 'Available',          label: 'Có sẵn' },
  { value: 'Reserved',           label: 'Đã đặt' },
  { value: 'Occupied',           label: 'Đang sử dụng' },
  { value: 'Cleaning Scheduled', label: 'Lên lịch dọn dẹp' },
  { value: 'Needs Repair',       label: 'Cần sửa chữa' },
  { value: 'Maintenance',        label: 'Bảo trì' },
];

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

type FormErrors = { name?: string; floor?: string; roomTypeId?: string };

export function RoomAllotmentModal({ open, onOpenChange, room, onSuccess }: Props) {
  const { toast } = useToast();
  const isCreateMode = !room;

  const [name, setName]         = useState('');
  const [floor, setFloor]       = useState<number>(1);
  const [status, setStatus]     = useState<RoomStatus>('Available');
  const [isActive, setIsActive] = useState(true);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Room types for create mode
  const [roomTypes, setRoomTypes]           = useState<RoomType[]>([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  const fetchRoomTypes = useCallback(async () => {
    try {
      setLoadingRoomTypes(true);
      const data = await roomTypeService.getAdminRoomTypes();
      setRoomTypes(data.filter((rt) => rt.isActive));
    } catch {
      toast({ title: 'Không thể tải danh sách loại phòng', variant: 'error' });
    } finally {
      setLoadingRoomTypes(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!open) return;
    if (room) {
      // Edit mode
      setName(room.name);
      setFloor(room.floor);
      setStatus(room.status);
      setIsActive(room.isActive);
      setSelectedRoomTypeId(room.roomTypeId);
    } else {
      // Create mode
      setName('');
      setFloor(1);
      setStatus('Available');
      setIsActive(true);
      setSelectedRoomTypeId(null);
      void fetchRoomTypes();
    }
    setErrors({});
  }, [open, room, fetchRoomTypes]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Tên phòng không được để trống.';
    if (isNaN(floor) || floor < 0) e.floor = 'Số tầng không hợp lệ.';
    if (isCreateMode && selectedRoomTypeId === null) e.roomTypeId = 'Vui lòng chọn loại phòng.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      setIsSubmitting(true);
      if (isCreateMode) {
        await roomAllotmentService.createRoom({
          roomTypeId: selectedRoomTypeId as number,
          name: name.trim(),
          floor,
        });
        toast({ title: 'Thêm phòng thành công', variant: 'success' });
      } else {
        const payload: UpdateRoomRequest = {
          roomTypeId: room.roomTypeId,
          name: name.trim(),
          floor,
          status,
          isActive,
        };
        await roomAllotmentService.updateRoom(room.id, payload);
        toast({ title: 'Cập nhật phòng thành công', variant: 'success' });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      toast({ title: getErrorMessage(err, isCreateMode ? 'Thêm phòng thất bại' : 'Cập nhật phòng thất bại'), variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const selectedRoomType = roomTypes.find((rt) => rt.id === selectedRoomTypeId) ?? null;

  return (
    <div className={styles.modalOverlay} onClick={() => onOpenChange(false)}>
      <div className={styles.modalContent} role="dialog" aria-modal="true"
        aria-labelledby="room-allotment-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="room-allotment-modal-title" className={styles.modalTitle}>
            {isCreateMode ? 'Thêm phòng mới' : 'Chỉnh sửa phòng'}
          </h2>
          <button type="button" onClick={() => onOpenChange(false)} className={styles.closeButton} aria-label="Đóng">
            <Cross1Icon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Tên phòng */}
            <div className={styles.formGroup}>
              <label htmlFor="roomName">Tên phòng <span className={styles.required}>*</span></label>
              <input id="roomName" className={`${styles.formControl} ${errors.name ? styles.invalid : ''}`}
                value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                autoFocus placeholder="Ví dụ: P101" />
              {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
            </div>

            {/* Tầng */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="roomFloor">Tầng <span className={styles.required}>*</span></label>
                <input id="roomFloor" type="number" min={0} className={`${styles.formControl} ${errors.floor ? styles.invalid : ''}`}
                  value={floor} onChange={(e) => { setFloor(Number(e.target.value)); setErrors((p) => ({ ...p, floor: undefined })); }} />
                {errors.floor && <p className={styles.errorMessage}>{errors.floor}</p>}
              </div>

              {/* Trạng thái (chỉ edit mode) */}
              {!isCreateMode && (
                <div className={styles.formGroup}>
                  <label htmlFor="roomStatus">Trạng thái</label>
                  <select id="roomStatus" className={styles.formControl}
                    value={status} onChange={(e) => setStatus(e.target.value as RoomStatus)}>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Loại phòng */}
            {isCreateMode ? (
              /* Create mode: dropdown chọn loại phòng */
              <div className={styles.formGroup}>
                <label>Loại phòng <span className={styles.required}>*</span></label>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`${styles.dropdownTrigger} ${errors.roomTypeId ? styles.invalid : ''}`}
                    >
                      <span className={selectedRoomType ? styles.dropdownValueSelected : styles.dropdownPlaceholder}>
                        {loadingRoomTypes
                          ? 'Đang tải...'
                          : selectedRoomType
                            ? selectedRoomType.name
                            : 'Chọn loại phòng'}
                      </span>
                      <ChevronDownIcon className={styles.dropdownChevron} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={styles.dropdownContent} align="start">
                    {loadingRoomTypes ? (
                      <div className={styles.dropdownLoading}>
                        <Spinner size="sm" />
                        <span>Đang tải...</span>
                      </div>
                    ) : roomTypes.length === 0 ? (
                      <div className={styles.dropdownEmpty}>Chưa có loại phòng nào</div>
                    ) : (
                      roomTypes.map((rt) => (
                        <DropdownMenuItem
                          key={rt.id}
                          className={`${styles.dropdownItem} ${selectedRoomTypeId === rt.id ? styles.dropdownItemActive : ''}`}
                          onClick={() => { setSelectedRoomTypeId(rt.id); setErrors((p) => ({ ...p, roomTypeId: undefined })); }}
                        >
                          {rt.name}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.roomTypeId && <p className={styles.errorMessage}>{errors.roomTypeId}</p>}
              </div>
            ) : (
              /* Edit mode: readonly */
              <div className={styles.formGroup}>
                <label>Loại phòng</label>
                <input className={styles.formControl} value={room?.roomTypeName ?? ''} readOnly
                  style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed', color: '#868e96' }} />
              </div>
            )}

            {/* Toggle hoạt động (chỉ edit mode) */}
            {!isCreateMode && (
              <div className={styles.formGroup}>
                <div className={styles.toggleRow}>
                  <span className={styles.toggleLabel}>Trạng thái hoạt động</span>
                  <button type="button" role="switch" aria-checked={isActive}
                    onClick={() => setIsActive((v) => !v)}
                    className={`${styles.toggleSwitch} ${isActive ? styles.toggleOn : styles.toggleOff}`}>
                    <span className={styles.toggleThumb} />
                  </button>
                  <span className={isActive ? styles.toggleStatusOn : styles.toggleStatusOff}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => onOpenChange(false)} disabled={isSubmitting}>Hủy</button>
            <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : (isCreateMode ? 'Thêm mới' : 'Cập nhật')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
