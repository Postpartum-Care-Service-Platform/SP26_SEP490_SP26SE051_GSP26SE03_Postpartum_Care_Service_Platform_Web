'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, CheckCircledIcon, Pencil2Icon, TrashIcon, Cross2Icon } from '@radix-ui/react-icons';
import React from 'react';

import type { AppointmentTypeDetail } from '@/types/appointment-type';
import toolbarStyles from '../../work-schedule/components/list/bulk-actions-toolbar.module.css';
import workListStyles from '../../work-schedule/components/list/work-schedule-list.module.css';
import typeTableStyles from './appointment-type-table.module.css';
import { QuickCreateAppointmentType } from './QuickCreateAppointmentType';

type Props = {
  items: AppointmentTypeDetail[];
  onRefresh?: () => void;
};

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
}: Props) {
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

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
                    {item.name}
                  </td>
                  <td className={workListStyles.td}>
                    <span
                      className={`${typeTableStyles.statusBadge} ${
                        item.isActive ? typeTableStyles.statusActive : typeTableStyles.statusInactive
                      }`}
                    >
                      {item.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
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

              <button type="button" className={toolbarStyles.actionBtn}>
                <span className={toolbarStyles.icon}>
                  <CheckIcon />
                </span>
                Đổi trạng thái
              </button>

              <button type="button" className={toolbarStyles.actionBtn}>
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

      <QuickCreateAppointmentType onCreated={onRefresh} />
    </div>
  );
}

