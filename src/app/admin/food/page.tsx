'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import foodService from '@/services/food.service';
import foodTypeService from '@/services/food-type.service';
import type { Food } from '@/types/food';
import type { FoodType } from '@/types/food-type';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { Pagination } from '@/components/ui/pagination';

import {
  FoodListHeader,
  FoodTable,
  FoodTableControls,
  NewFoodModal,
  FoodGalleryView,
  FoodGalleryControls,
  ImportFoodModal
} from './components';
import styles from './food.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
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
      return arr.sort((a, b) => (a.foodType || '').localeCompare(b.foodType || ''));
    case 'type-desc':
      return arr.sort((a, b) => (b.foodType || '').localeCompare(a.foodType || ''));
    default:
      return arr;
  }
};

// Internal Premium Skeleton Component for consistent look
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

export default function AdminFoodPage() {
  const { toast } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
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

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);

  const [view, setView] = useState<'table' | 'ui'>('table');
  const [selectedTypeId, setSelectedTypeId] = useState<number | 'all'>('all');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const [foodsData, typesData] = await Promise.all([
        foodService.getAllFoods(),
        foodTypeService.getAllFoodTypes(),
      ]);
      setFoods(foodsData);
      setFoodTypes(typesData);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải dữ liệu'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const galleryCounts = useMemo(() => {
    const map: Record<number | string, number> = { all: foods.length };
    foodTypes.forEach((t) => {
      if (t.id) map[Number(t.id)] = 0;
    });

    foods.forEach((f) => {
      let tid = Number(f.foodTypeId);
      if (!tid && f.foodType) {
        const matched = foodTypes.find(t => t.name === f.foodType);
        if (matched) tid = matched.id;
      }
      if (tid) {
        map[tid] = (map[tid] || 0) + 1;
      }
    });
    return map;
  }, [foods, foodTypes]);

  const filteredFoods = useMemo(() => {
    let filtered = [...foods];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) => f.name.toLowerCase().includes(q) || (f.foodType || '').toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q),
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

  const totalPages = Math.ceil(filteredFoods.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollArea = document.querySelector('[class*="scrollArea"]');
    scrollArea?.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleDelete = (food: Food) => {
    setFoodToDelete(food);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!foodToDelete) return;
    try {
      setDeletingId(foodToDelete.id);
      await foodService.deleteFood(foodToDelete.id);
      toast({ title: 'Xóa món ăn thành công', variant: 'success' });
      await fetchData();
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa món ăn thất bại'),
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
      setFoodToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await foodService.exportFoods();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Danh_sach_mon_an_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Xuất dữ liệu thất bại', description: err.message, variant: 'error' });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast({ title: 'Đang tải file mẫu...', variant: 'default' });
      const blob = await foodService.downloadTemplateFoods();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_mon_an.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Tải file mẫu thất bại', description: err.message, variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-white">
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <AdminPageLayout
          noCard={view === 'ui'}
          header={<FoodListHeader view={view} onViewChange={setView} />}
          controlPanel={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <SkeletonBone width={320} height={42} />
                <SkeletonBone width={180} height={42} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <SkeletonBone width={120} height={42} />
                <SkeletonBone width={100} height={42} />
                <SkeletonBone width={120} height={42} />
              </div>
            </div>
          }
        >
          <div style={{ 
            backgroundColor: '#ffffff', 
            overflow: 'hidden',
            padding: '0 16px'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize || 10)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === (pageSize || 10) - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </AdminPageLayout>
      </div>
    );
  }


  if (error) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      noCard={view === 'ui'}
      hideScrollbar={view === 'ui'}
      isLoading={loading}
      header={<FoodListHeader view={view} onViewChange={setView} />}
      controlPanel={
        view === 'table' ? (
          <FoodTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewFood={() => setIsModalOpen(true)}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExport}
            onDownloadTemplate={handleDownloadTemplate}
          />
        ) : (
          <FoodGalleryControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTypeId={selectedTypeId}
            onTypeChange={setSelectedTypeId}
            foodTypes={foodTypes}
            counts={galleryCounts}
            onNewFood={() => setIsModalOpen(true)}
          />
        )
      }
      pagination={
        view === 'table' && filteredFoods.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredFoods.length}
            onPageChange={handlePageChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            showResultCount={true}
          />
        ) : null
      }
    >
      <div className={styles.pageContainer}>
        {view === 'table' ? (
          <FoodTable
            foods={paginatedFoods}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        ) : (
          <FoodGalleryView
            foods={foods}
            foodTypes={foodTypes}
            searchQuery={searchQuery}
            selectedTypeId={selectedTypeId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <NewFoodModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchData}
        foodToEdit={editingFood}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa món ăn"
        message={`Bạn có chắc chắn muốn xóa món ăn "${foodToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />

      <ImportFoodModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchData}
      />
    </AdminPageLayout>
  );
}
