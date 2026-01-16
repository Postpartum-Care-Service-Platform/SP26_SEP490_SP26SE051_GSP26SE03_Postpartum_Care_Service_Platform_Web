'use client';

import { useState, useEffect } from 'react';
import { FoodListHeader } from './components/FoodListHeader';
import { FoodList } from './components/FoodList';
import foodService from '@/services/food.service';
import type { Food } from '@/types/food';
import styles from './food.module.css';

export default function AdminFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodService.getAllFoods();
      setFoods(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (food: Food) => {
    console.log('Edit food:', food);
  };

  const handleDelete = (food: Food) => {
    console.log('Delete food:', food);
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <FoodListHeader />
        <div className={styles.loading}>Đang tải danh sách món ăn...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <FoodListHeader />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <FoodListHeader />
      <FoodList
        foods={foods}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

