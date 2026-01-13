'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import styles from './patient-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
  onStatusChange?: (status: string) => void;
  onNewPatient?: () => void;
};

const FILTER_OPTIONS = [
  { value: 'date-newest', label: 'Date: Newest First' },
  { value: 'date-oldest', label: 'Date: Oldest First' },
  { value: 'name-asc', label: 'Customer Name A-Z' },
  { value: 'name-desc', label: 'Customer Name Z-A' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'Stable', label: 'Stable' },
  { value: 'Under Observation', label: 'Under Observation' },
  { value: 'Recovering', label: 'Recovering' },
  { value: 'Critical', label: 'Critical' },
];

export function PatientTableControls({
  onSearch,
  onFilter,
  onStatusChange,
  onNewPatient,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('date-newest');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'All Status';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search Patient..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className={styles.filterButton}>
              <MixerHorizontalIcon className={styles.filterIcon} />
              Filter
              <ChevronDownIcon className={styles.chevronIcon} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {FILTER_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedFilter === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleFilterSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.right}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className={styles.statusButton}>
              {selectedStatusLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedStatus === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleStatusSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button className={styles.newPatientButton} onClick={onNewPatient}>
          <PlusIcon className={styles.plusIcon} />
          New Patient
        </button>
      </div>
    </div>
  );
}

