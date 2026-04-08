import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';

import { AssigneePicker } from '../shared/AssigneePicker';
import type { StaffSchedule as StaffListMember } from '@/services/contract.service';
import { AmenityServicePicker } from '../shared/AmenityServicePicker';
import type { AmenityService } from '@/types/amenity-service';
import styles from './timeline-control-panel.module.css';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM1 7a6 6 0 1 1 10.244 4.244l2.256 2.256a.75.75 0 1 1-1.06 1.06l-2.256-2.256A6 6 0 0 1 1 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.99999 9.36362L11.1818 6.18181C11.3575 6.00608 11.6424 6.00608 11.8182 6.18181C11.9939 6.35755 11.9939 6.64247 11.8182 6.81821L8.35355 10.2828C8.15829 10.4781 7.84171 10.4781 7.64645 10.2828L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 2.375C3 1.615 3.616 1 4.375 1h1.75c.76 0 1.375.616 1.375 1.375v4.25C7.5 7.385 6.884 8 6.125 8h-1.75C3.615 8 3 7.384 3 6.625V5.25H0v-1.5h3zm1.5.125v4H6v-4zM16 5.25H8.5v-1.5H16zM8.5 9.375C8.5 8.615 9.116 8 9.875 8h1.75C12.385 8 13 8.616 13 9.375v1.375h3v1.5h-3v1.375c0 .76-.616 1.375-1.375 1.375h-1.75c-.76 0-1.375-.616-1.375-1.375zM10 9.5v4h1.5v-4zM0 12.25v-1.5h7.5v1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg fill="none" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M3.5 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3zm2 1v8h8V4H4zm1 2h6v1H5V6zm0 2h6v1H5V8zm0 2h4v1H5v-1z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  epicLabel?: string;
  assigneeOnly?: boolean;
  onAssigneeOnlyChange?: (value: boolean) => void;
  assigneeValue?: any;
  onAssigneeChange?: (value: any) => void;
  staffList?: StaffListMember[];
  amenityValue?: AmenityService | null;
  onAmenityChange?: (value: AmenityService | null) => void;
  onAmenityBrowse?: () => void;
};

export function TimelineControlPanel({
  searchValue = '',
  onSearchChange,
  epicLabel = 'Epic',
  assigneeOnly = false,
  onAssigneeOnlyChange,
  assigneeValue = null,
  onAssigneeChange,
  staffList = [],
  amenityValue = null,
  onAmenityChange,
  onAmenityBrowse,
}: Props) {
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = React.useState(false);
  const [isAmenityOpen, setIsAmenityOpen] = React.useState(false);
  const statusRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
    }
    if (isStatusOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStatusOpen]);

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Tooltip.Provider delayDuration={350}>
      <div className={styles.wrap}>
        <div className={styles.left}>
          <div className={styles.search}>
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
            <input
              className={styles.searchInput}
              placeholder="Tìm kiếm dòng thời gian"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>

          <div className={styles.avatars} aria-label="Assignees">
            {staffList.slice(0, 3).map((staff) => (
              <button
                key={staff.id}
                type="button"
                className={`${styles.avatar} ${assigneeValue?.id === staff.id ? styles.avatarActive : ''}`}
                title={staff.fullName}
                onClick={() => {
                  if (assigneeValue?.id === staff.id) {
                    onAssigneeChange?.(null);
                  } else {
                    onAssigneeChange?.({
                      id: staff.id,
                      name: staff.fullName,
                      avatarUrl: staff.avatarUrl,
                      initials: getInitials(staff.fullName),
                      type: 'user'
                    });
                  }
                }}
              >
                {staff.avatarUrl ? (
                  <img src={staff.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  getInitials(staff.fullName)
                )}
              </button>
            ))}
            {staffList.length > 3 && (
              <div className={styles.avatarMore}>
                +{staffList.length - 3}
              </div>
            )}
          </div>

          <Popover.Root open={isAssigneeOpen} onOpenChange={setIsAssigneeOpen}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Popover.Trigger asChild>
                  <button type="button" className={styles.filterBtn}>
                    {assigneeValue && (
                      <div className={styles.avatarCircle} style={{ background: '#ed8936', color: '#fff' }}>
                        {assigneeValue.avatarUrl ? (
                          <img src={assigneeValue.avatarUrl} alt="" className={styles.avatarImg} />
                        ) : (
                          getInitials(assigneeValue.name)
                        )}
                      </div>
                    )}
                    <span>{assigneeValue ? assigneeValue.name : 'Tất cả nhân viên'}</span>
                    <ChevronDownIcon />
                  </button>
                </Popover.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltip} side="top" sideOffset={5}>
                  Lọc theo nhân viên
                  <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
            <Popover.Portal>
              <Popover.Content
                className={styles.popoverContent}
                side="bottom"
                align="start"
                sideOffset={6}
                collisionPadding={12}
              >
                <AssigneePicker
                  value={assigneeValue}
                  onChange={(a) => {
                    onAssigneeChange?.(a);
                    setIsAssigneeOpen(false);
                  }}
                  onClose={() => setIsAssigneeOpen(false)}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <Popover.Root open={isAmenityOpen} onOpenChange={setIsAmenityOpen}>
            <Popover.Trigger asChild>
              <button type="button" className={styles.filterBtn}>
                <span>{amenityValue ? amenityValue.name : (epicLabel || 'Tất cả tiện ích')}</span>
                <ChevronDownIcon />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className={styles.popoverContent}
                side="bottom"
                align="start"
                sideOffset={6}
                collisionPadding={12}
              >
                <AmenityServicePicker
                  value={amenityValue}
                  onChange={(a) => {
                    onAmenityChange?.(a);
                    setIsAmenityOpen(false);
                  }}
                  onClose={() => setIsAmenityOpen(false)}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <div className={styles.statusWrap} ref={statusRef}>
            <button
              type="button"
              className={`${styles.filterBtn} ${isStatusOpen ? styles.filterBtnActive : ''}`}
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              <span>Trạng thái</span>
              <ChevronDownIcon />
            </button>

            {isStatusOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownSearch}>
                  <span className={styles.dropdownSearchIcon}><SearchIcon /></span>
                  <input
                    type="text"
                    className={styles.dropdownInput}
                    placeholder="Tìm kiếm trạng thái"
                    autoFocus
                  />
                </div>

                <div className={styles.dropdownList}>
                  <label className={styles.dropdownItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkText}>TẤT CẢ TRẠNG THÁI</span>
                  </label>
                  <label className={styles.dropdownItem}>
                    <input type="checkbox" />
                    <span className={`${styles.badge} ${styles.badgeScheduled}`}>ĐÃ LÊN LỊCH</span>
                  </label>
                  <label className={styles.dropdownItem}>
                    <input type="checkbox" />
                    <span className={`${styles.badge} ${styles.badgeCompleted}`}>HOÀN THÀNH</span>
                  </label>
                  <label className={styles.dropdownItem}>
                    <input type="checkbox" />
                    <span className={`${styles.badge} ${styles.badgeMissed}`}>ĐÃ BỎ LỠ</span>
                  </label>
                  <label className={styles.dropdownItem}>
                    <input type="checkbox" />
                    <span className={`${styles.badge} ${styles.badgeCancelled}`}>ĐÃ HỦY</span>
                  </label>
                </div>

                <div className={styles.dropdownFooter}>
                  5 trên 5
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <button type="button" className={styles.iconBtn} aria-label="Duyệt tiện ích" title="Duyệt tiện ích" onClick={onAmenityBrowse}>
            <ChecklistIcon />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Controls">
            <SlidersIcon />
          </button>
          <button type="button" className={styles.iconBtn} aria-label="More">
            <MoreIcon />
          </button>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
