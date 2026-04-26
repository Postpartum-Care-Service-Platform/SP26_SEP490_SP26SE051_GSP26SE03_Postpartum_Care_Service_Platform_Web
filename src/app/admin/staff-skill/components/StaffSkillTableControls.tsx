'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from './staff-skill-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onNewSkill?: () => void;
};

export function StaffSkillTableControls({ onSearch, onNewSkill }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên hoặc kỹ năng..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <Button variant="outline" size="sm" className={styles.filterButton}>
          <MixerHorizontalIcon className={styles.filterIcon} />
          Bộ lọc kỹ năng
          <ChevronDownIcon className={styles.chevronIcon} />
        </Button>
      </div>

      <div className={styles.right}>
        <Button variant="primary" size="sm" className={styles.newSkillButton} onClick={onNewSkill}>
          <PlusIcon className={styles.plusIcon} />
          Cập nhật kỹ năng
        </Button>
      </div>
    </div>
  );
}
