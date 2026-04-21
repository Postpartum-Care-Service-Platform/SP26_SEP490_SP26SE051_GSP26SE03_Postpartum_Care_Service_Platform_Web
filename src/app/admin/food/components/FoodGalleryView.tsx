'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Food } from '@/types/food';
import type { FoodType } from '@/types/food-type';
import { FoodDetailDrawer } from './FoodDetailDrawer';
import styles from './food-gallery-view.module.css';

interface FoodGalleryViewProps {
  foods: Food[];
  foodTypes: FoodType[];
  searchQuery: string;
  selectedTypeId: number | 'all';
  onEdit?: (food: Food) => void;
  onDelete?: (food: Food) => void;
}

export function FoodGalleryView({ 
  foods, 
  foodTypes, 
  searchQuery, 
  selectedTypeId,
  onEdit,
  onDelete,
}: FoodGalleryViewProps) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const filteredFoods = useMemo(() => {
    let result = foods;

    if (selectedTypeId !== 'all') {
      result = result.filter((f) => {
        const tid = Number(f.foodTypeId);
        if (tid === Number(selectedTypeId)) return true;
        
        // Fallback matching by name
        if (!tid && f.foodType) {
          const type = foodTypes.find(t => t.id === Number(selectedTypeId));
          return type?.name === f.foodType;
        }
        
        return false;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.description || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [foods, selectedTypeId, searchQuery, foodTypes]);

  const groupedFoods = useMemo(() => {
    const groups: Record<string, Food[]> = {};
    
    filteredFoods.forEach((f) => {
      const typeName = f.foodType || 'Khác';
      if (!groups[typeName]) groups[typeName] = [];
      groups[typeName].push(f);
    });

    return groups;
  }, [filteredFoods]);

  return (
    <div className={styles.container}>
      {/* Gallery Section */}
      <div className={styles.gallery}>
        {Object.keys(groupedFoods).length > 0 ? (
          Object.entries(groupedFoods).map(([category, items]) => (
            <div key={category} className={styles.categoryGroup}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <div className={styles.itemsGrid}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.foodItem}
                    onClick={() => setSelectedFood(item)}
                  >
                    <div className={styles.imageWrapper}>
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className={styles.foodImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={styles.foodNameTooltipWrapper}>
                      <span className={styles.foodName}>{item.name}</span>
                      {item.name.length > 20 && (
                        <div className={styles.foodNameTooltip}>
                          {item.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            Không tìm thấy món ăn nào phù hợp với tiêu chí tìm kiếm.
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <FoodDetailDrawer
        food={selectedFood}
        allFoods={foods}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        onSelect={(newFood) => setSelectedFood(newFood)}
        onEdit={(food) => {
          setSelectedFood(null);
          onEdit?.(food);
        }}
        onDelete={(food) => {
          setSelectedFood(null);
          onDelete?.(food);
        }}
      />
    </div>
  );
}
