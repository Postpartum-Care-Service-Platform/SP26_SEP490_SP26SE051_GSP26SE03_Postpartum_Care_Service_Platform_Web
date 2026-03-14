'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, CheckCircledIcon, Pencil2Icon, TrashIcon, Cross2Icon } from '@radix-ui/react-icons';
import React from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown/Dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import appointmentTypeService from '@/services/appointment-type.service';
import type { AppointmentTypeDetail } from '@/types/appointment-type';
import toolbarStyles from '../../work-schedule/components/list/bulk-actions-toolbar.module.css';
import workListStyles from '../../work-schedule/components/list/work-schedule-list.module.css';
import typeTableStyles from './appointment-type-table.module.css';
import { QuickCreateAppointmentType } from './QuickCreateAppointmentType';

type Props = {
  items: AppointmentTypeDetail[];
  onRefresh?: () => void;
  quickCreateOpen?: boolean;
  onQuickCreateOpenChange?: (open: boolean) => void;
};

type LocalStatus = 'active' | 'inactive';

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export function AppointmentTypeListTable({
  items,
  onRefresh,
  quickCreateOpen,
  onQuickCreateOpenChange,
}: Props) {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [rowStatuses, setRowStatuses] = React.useState<Record<number, LocalStatus>>({});
  const [updatingIds, setUpdatingIds] = React.useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editingNames, setEditingNames] = React.useState<Record<number, string>>({});
  const [savingNameIds, setSavingNameIds] = React.useState<Set<number>>(new Set());

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const toggleRow = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const getStatusFromItem = (item: AppointmentTypeDetail): LocalStatus => {
    return item.isActive ? 'active' : 'inactive';
  };

  const getStatusLabel = (status: LocalStatus) => (status === 'active' ? 'Hoạt động' : 'Tạm dừng');

  const getTriggerClass = (status: LocalStatus) =>
    status === 'active' ? typeTableStyles.statusTriggerActive : typeTableStyles.statusTriggerInactive;

  const handleStatusChange = async (id: number, value: LocalStatus, item: AppointmentTypeDetail) => {
    // Cập nhật UI lạc quan
    setRowStatuses((prev) => ({
      ...prev,
      [id]: value,
    }));
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const isActive = value === 'active';

    try {
      await appointmentTypeService.updateAppointmentType(id, { isActive });
      toast({ title: 'Cập nhật trạng thái loại lịch hẹn thành công', variant: 'success' });
      onRefresh?.();
    } catch (error: unknown) {
      // Rollback UI on error
      setRowStatuses((prev) => ({
        ...prev,
        [id]: getStatusFromItem(item),
      }));

      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Cập nhật trạng thái thất bại';

      toast({ title: message, variant: 'error' });
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0 || isDeleting) return;

    try {
      setIsDeleting(true);
      await Promise.all(Array.from(selectedIds).map((id) => appointmentTypeService.deleteAppointmentType(id)));
      toast({ title: 'Xóa loại lịch hẹn thành công', variant: 'success' });
      setSelectedIds(new Set());
      onRefresh?.();
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Xóa loại lịch hẹn thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getNameForRow = (item: AppointmentTypeDetail) =>
    Object.prototype.hasOwnProperty.call(editingNames, item.id) ? editingNames[item.id] : item.name;

  const handleNameChange = (id: number, value: string) => {
    setEditingNames((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNameSubmit = async (item: AppointmentTypeDetail) => {
    const current = getNameForRow(item).trim();
    const original = item.name.trim();

    if (!current || current === original || savingNameIds.has(item.id)) {
      return;
    }

    try {
      setSavingNameIds((prev) => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });

      await appointmentTypeService.updateAppointmentType(item.id, { name: current });
      toast({ title: 'Cập nhật tên loại lịch hẹn thành công', variant: 'success' });
      onRefresh?.();
    } catch (error: unknown) {
      setEditingNames((prev) => ({
        ...prev,
        [item.id]: original,
      }));

      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message)
          : 'Cập nhật tên loại lịch hẹn thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setSavingNameIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  return (
    <div className={workListStyles.wrap}>
      <div className={workListStyles.tableScroll}>
        <table className={workListStyles.table}>
          <thead>
            <tr className={workListStyles.headerRow}>
              <th className={workListStyles.thCheckbox}>
                <div className={workListStyles.checkboxCenter}>
                  <Checkbox.Root
                    className={workListStyles.CheckboxRoot}
                    checked={selectedIds.size === items.length && items.length > 0}
                    onCheckedChange={toggleAll}
                  >
                    <Checkbox.Indicator className={workListStyles.CheckboxIndicator}>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
              </th>
              <th className={workListStyles.th}>
                <div className={workListStyles.thInner}>
                  <span>ID</span>
                </div>
              </th>
              <th className={workListStyles.th}>
                <div className={workListStyles.thInner}>
                  <span>Tên loại lịch hẹn</span>
                </div>
              </th>
              <th className={workListStyles.th}>
                <div className={workListStyles.thInner}>
                  <span>Trạng thái</span>
                </div>
              </th>
              <th className={workListStyles.th}>
                <div className={workListStyles.thInner}>
                  <span>Ngày tạo</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className={typeTableStyles.emptyState}>
                  Chưa có loại lịch hẹn nào
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className={`${workListStyles.row} ${
                    selectedIds.has(item.id) ? workListStyles.rowSelected : ''
                  }`}
                >
                  <td className={workListStyles.tdCheckbox}>
                    <div className={workListStyles.checkboxCenter}>
                      <Checkbox.Root
                        className={workListStyles.CheckboxRoot}
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleRow(item.id)}
                      >
                        <Checkbox.Indicator className={workListStyles.CheckboxIndicator}>
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                    </div>
                  </td>
                  <td className={workListStyles.td}>{item.id}</td>
                  <td
                    className={workListStyles.td}
                    style={{
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      textOverflow: 'clip',
                    }}
                  >
                    <input
                      type="text"
                      className={typeTableStyles.inlineNameInput}
                      value={getNameForRow(item)}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          void handleNameSubmit(item);
                        }
                        if (e.key === 'Escape') {
                          setEditingNames((prev) => ({
                            ...prev,
                            [item.id]: item.name,
                          }));
                        }
                      }}
                    />
                  </td>
                  <td className={workListStyles.td}>
                    {(() => {
                      const currentStatus = rowStatuses[item.id] ?? getStatusFromItem(item);
                      const isUpdating = updatingIds.has(item.id);

                      return (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={`${typeTableStyles.statusTrigger} ${getTriggerClass(currentStatus)}`}
                              disabled={isUpdating}
                            >
                              <span>{getStatusLabel(currentStatus)}</span>
                              <span className={typeTableStyles.statusCaret}>
                                <svg
                                  width="12"
                                  height="12"
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
                              </span>
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent className={typeTableStyles.statusMenu} align="start" sideOffset={4}>
                            <DropdownMenuItem
                              className={typeTableStyles.statusItem}
                              onClick={() => handleStatusChange(item.id, 'active', item)}
                            >
                              <span className={`${typeTableStyles.statusPill} ${typeTableStyles.statusPillActive}`}>
                                Hoạt động
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={typeTableStyles.statusItem}
                              onClick={() => handleStatusChange(item.id, 'inactive', item)}
                            >
                              <span className={`${typeTableStyles.statusPill} ${typeTableStyles.statusPillInactive}`}>
                                Tạm dừng
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    })()}
                  </td>
                  <td className={workListStyles.td}>{formatDate(item.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedIds.size > 0 && (
        <div className={toolbarStyles.toolbarWrap}>
          <div className={toolbarStyles.toolbar}>
            <div className={toolbarStyles.countSection}>
              <span className={toolbarStyles.countBadge}>{selectedIds.size}</span>
              <span className={toolbarStyles.countText}>đã chọn</span>
            </div>

            <div className={toolbarStyles.actionsSection}>
              <button
                type="button"
                className={toolbarStyles.actionBtn}
                onClick={toggleAll}
              >
                <span className={toolbarStyles.icon}>
                  <CheckCircledIcon />
                </span>
                Chọn tất cả
              </button>

              <div className={toolbarStyles.divider} />

              <button type="button" className={toolbarStyles.actionBtn}>
                <span className={toolbarStyles.icon}>
                  <Pencil2Icon />
                </span>
                Sửa nhanh
              </button>

              <button
                type="button"
                className={toolbarStyles.actionBtn}
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                <span className={toolbarStyles.icon}>
                  <TrashIcon />
                </span>
                Xóa
              </button>
            </div>

            <div className={toolbarStyles.divider} />

            <div className={toolbarStyles.closeSection}>
              <button
                type="button"
                className={toolbarStyles.closeBtn}
                onClick={() => setSelectedIds(new Set())}
              >
                <span className={toolbarStyles.icon}>
                  <Cross2Icon />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickCreateAppointmentType
        onCreated={onRefresh}
        open={quickCreateOpen}
        onOpenChange={onQuickCreateOpenChange}
        hideTrigger
      />
    </div>
  );
}

