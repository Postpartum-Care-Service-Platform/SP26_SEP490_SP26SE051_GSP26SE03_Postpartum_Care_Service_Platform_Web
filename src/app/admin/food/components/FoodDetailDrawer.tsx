'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Edit2, Trash2 } from 'lucide-react';
import type { Food } from '@/types/food';
import styles from './food-detail-drawer.module.css';

interface FoodDetailDrawerProps {
  food: Food | null;
  allFoods: Food[];
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (food: Food) => void;
  onDelete?: (food: Food) => void;
  onSelect: (food: Food) => void;
}

export function FoodDetailDrawer({
  food,
  allFoods,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onSelect,
}: FoodDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setMounted(false), 300); // Wait for transition
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Chi tiết món ăn</h2>
          <div className={styles.tooltipWrapper}>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
              <X size={24} />
            </button>
            <span className={styles.tooltip}>Đóng</span>
          </div>
        </div>

        {food && (
          <div className={styles.content}>
            <div className={styles.imageSection}>
              {food.imageUrl ? (
                <div className={styles.imageWrapper}>
                  <Image 
                    src={food.imageUrl} 
                    alt={food.name} 
                    fill 
                    className={styles.image}
                  />
                </div>
              ) : (
                <div className={styles.placeholder}>
                  {food.name.charAt(0)}
                </div>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoGroup}>
                <div className={styles.badge}>{food.foodType || 'Chưa phân loại'}</div>
              </div>

              <div className={`${styles.infoGroup} ${styles.nameGroup}`}>
                <label>Tên món:</label>
                <div className={styles.nameTooltipWrapper}>
                  <div className={styles.value}>
                    {food.name}
                  </div>
                  {food.name.length > 20 && (
                    <div className={styles.nameFullTooltip}>
                      {food.name}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.infoGroup}>
                <label>Mô tả</label>
                <div className={styles.descriptionTooltipWrapper}>
                  <div className={styles.description}>
                    {food.description || 'Không có mô tả cho món ăn này.'}
                  </div>
                  {food.description && food.description.length > 60 && (
                    <div className={styles.descriptionFullTooltip}>
                      {food.description}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.actionsInline}>
                <button 
                  className={`${styles.actionButton} ${styles.editButton}`}
                  onClick={() => onEdit?.(food)}
                >
                  <Edit2 size={18} />
                  Chỉnh sửa
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => onDelete?.(food)}
                >
                  <Trash2 size={18} />
                  Xóa món
                </button>
              </div>

              <div className={styles.relatedSection}>
                <label className={styles.relatedLabel}>Món ăn khác</label>
                <div className={styles.relatedGrid}>
                  {allFoods
                    .filter((f) => f.id !== food.id && (f.foodTypeId === food.foodTypeId || f.foodType === food.foodType))
                    .slice(0, 8)
                    .map((other) => (
                    <div 
                      key={other.id} 
                      className={styles.relatedItem}
                      onClick={() => onSelect(other)}
                    >
                      <div className={styles.relatedImageWrapper}>
                        {other.imageUrl ? (
                          <Image src={other.imageUrl} alt={other.name} fill className={styles.relatedImage} />
                        ) : (
                          <div className={styles.relatedPlaceholder}>{other.name.charAt(0)}</div>
                        )}
                      </div>
                      <span className={styles.relatedName}>{other.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
