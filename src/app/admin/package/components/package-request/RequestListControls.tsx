'use client';

import { Search } from 'lucide-react';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import styles from '../package-request-list-modal.module.css';

interface RequestListControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  statusOptions: { label: string; value: string }[];
}

export const RequestListControls: React.FC<RequestListControlsProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions,
}) => {
  return (
    <div className={styles.controlsRow}>
      <div className={styles.searchInputWrapper}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Tìm theo khách hàng, gói dịch vụ..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <CustomDropdown
        options={statusOptions}
        value={statusFilter}
        onChange={onStatusChange}
        triggerClassName={styles.statusDropdownTrigger}
      />
    </div>
  );
};
