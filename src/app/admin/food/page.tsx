'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import foodService from '@/services/food.service';
import type { Food } from '@/types/food';

import { FoodListHeader, FoodTable, FoodTableControls, NewFoodModal } from './components';
import styles from './food.module.css';



const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

const sortFoods = (items: Food[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'name-asc':
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    case 'type-asc':
      return arr.sort((a, b) => a.type.localeCompare(b.type));
    case 'type-desc':
      return arr.sort((a, b) => b.type.localeCompare(a.type));
    default:
      return arr;
  }
};

export default function AdminFoodPage() {
  const { toast } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await foodService.getAllFoods();
      setFoods(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách món ăn'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    let filtered = [...foods];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) => f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((f) => (statusFilter === 'active' ? f.isActive : !f.isActive));
    }

    return sortFoods(filtered, sortKey);
  }, [foods, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedFoods = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredFoods.slice(start, end);
  }, [filteredFoods, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredFoods.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingFood(null);
    }
  };

  const handleDelete = async (food: Food) => {
    try {
      setDeletingId(food.id);
      await foodService.deleteFood(food.id);
      toast({ title: 'Xóa món ăn thành công', variant: 'success' });
      await fetchFoods();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa món ăn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <FoodListHeader />

      {loading ? (
        <div className={styles.content}>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <FoodTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewFood={() => setIsModalOpen(true)}
          />

          <FoodTable
            foods={paginatedFoods}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize,
                    totalItems: filteredFoods.length,
                    onPageChange: handlePageChange,
                    pageSizeOptions: PAGE_SIZE_OPTIONS,
                    onPageSizeChange: (size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    },
                  }
                : undefined
            }
          />
        </>
      )}

      <NewFoodModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchFoods}
        foodToEdit={editingFood}
      />
    </div>
  );
}
