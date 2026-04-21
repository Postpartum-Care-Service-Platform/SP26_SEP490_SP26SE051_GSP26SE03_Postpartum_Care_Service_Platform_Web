'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';
import { PlusIcon } from '@radix-ui/react-icons';
import type { FoodType } from '@/types/food-type';
import styles from './food-gallery-view.module.css';

interface FoodGalleryControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTypeId: number | 'all';
  onTypeChange: (typeId: number | 'all') => void;
  foodTypes: FoodType[];
  counts: Record<number | string, number>;
  onNewFood: () => void;
}

export function FoodGalleryControls({
  searchQuery,
  onSearchChange,
  selectedTypeId,
  onTypeChange,
  foodTypes,
  counts,
  onNewFood,
}: FoodGalleryControlsProps) {
  return (
    <div className={styles.stickyHeader}>
      <div className={styles.searchSection}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Nhập tên món ăn cần tìm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className={styles.newFoodButton} onClick={onNewFood}>
          <PlusIcon className={styles.plusIcon} />
          Món mới
        </button>
      </div>

      <div className={styles.filterSection}>
        <button
          className={`${styles.filterButton} ${
            selectedTypeId === 'all' ? styles.filterButtonActive : ''
          }`}
          onClick={() => onTypeChange('all')}
        >
          Tất cả ({counts.all})
        </button>
        {foodTypes
          .filter((t) => t.name && t.name.trim() && t.name.toLowerCase() !== 'updated')
          .map((type) => (
          <button
            key={type.id}
            className={`${styles.filterButton} ${
              Number(selectedTypeId) === Number(type.id) ? styles.filterButtonActive : ''
            }`}
            onClick={() => onTypeChange(type.id)}
          >
            {type.name} ({counts[Number(type.id)] || 0})
          </button>
        ))}
      </div>
    </div>
  );
}
