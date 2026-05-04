'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import healthConditionService from '@/services/health-condition.service';
import { HealthCondition, HealthConditionCategory } from '@/types/health-record';
import { 
  HealthConditionListHeader, 
  HealthConditionTableControls, 
  HealthConditionTable,
  HealthConditionModal,
  ImportHealthConditionModal 
} from './components';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';

const SkeletonBone = ({ width, height, margin = '0' }: { width?: string | number, height?: string | number, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: '4px',
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

export default function HealthConditionPage() {
  const { toast } = useToast();
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [categories, setCategories] = useState<HealthConditionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('name-asc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [appliesToFilter, setAppliesToFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<HealthCondition | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [conditionToDelete, setConditionToDelete] = useState<HealthCondition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 1.5s for premium feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      const [conditionsData, categoriesData] = await Promise.all([
        healthConditionService.getAll(),
        healthConditionService.getAllCategories()
      ]);
      setConditions(conditionsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredConditions = useMemo(() => {
    let filtered = [...conditions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    if (appliesToFilter !== 'all') {
      filtered = filtered.filter(c => c.appliesTo === appliesToFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortKey) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'createdAt-desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'createdAt-asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: return 0;
      }
    });

    return filtered;
  }, [conditions, searchQuery, sortKey, categoryFilter, appliesToFilter]);

  const paginatedConditions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredConditions.slice(start, start + pageSize);
  }, [filteredConditions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredConditions.length / pageSize);

  const handleEdit = (condition: HealthCondition) => {
    setEditingCondition(condition);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (condition: HealthCondition) => {
    setConditionToDelete(condition);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!conditionToDelete) return;
    
    try {
      setIsDeleting(true);
      await healthConditionService.delete(conditionToDelete.id);
      toast({ title: 'Xóa tình trạng sức khỏe thành công', variant: 'success' });
      fetchData();
    } catch (err: any) {
      toast({ title: err.message || 'Xóa thất bại', variant: 'error' });
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setConditionToDelete(null);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị xuất dữ liệu...', variant: 'default' });
      const blob = await healthConditionService.export();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tinh_trang_suc_khoe_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast({ title: 'Đang tải file mẫu...', variant: 'default' });
      const blob = await healthConditionService.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_tinh_trang_suc_khoe.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Tải file mẫu thất bại', variant: 'error' });
    }
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingCondition(null);
    }
  };

  const onSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <AdminPageLayout
        header={<HealthConditionListHeader />}
        controlPanel={
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
              <SkeletonBone width={300} height={40} />
              <SkeletonBone width={150} height={40} />
              <SkeletonBone width={150} height={40} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={120} height={40} />
              <SkeletonBone width={100} height={40} />
            </div>
          </div>
        }
      >
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div style={{ padding: '0 16px', backgroundColor: '#fff' }}>
          <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} style={{ height: '64px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '20px', padding: '0 16px' }}>
              <SkeletonBone width={40} height={16} />
              <SkeletonBone width={100} height={16} />
              <SkeletonBone width={200} height={16} />
              <SkeletonBone width={100} height={16} />
              <SkeletonBone width={300} height={16} />
            </div>
          ))}
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      header={<HealthConditionListHeader />}
      controlPanel={
        <HealthConditionTableControls
          onSearch={setSearchQuery}
          onSortChange={setSortKey}
          onCategoryChange={setCategoryFilter}
          onAppliesToChange={setAppliesToFilter}
          onNew={() => setIsModalOpen(true)}
          onImport={() => setIsImportModalOpen(true)}
          onExport={handleExport}
          onDownloadTemplate={handleDownloadTemplate}
          categories={categories}
        />
      }
      pagination={
        totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredConditions.length}
            onPageChange={setCurrentPage}
            pageSizeOptions={[10, 20, 50]}
            onPageSizeChange={setPageSize}
            showResultCount={true}
          />
        )
      }
    >
      <HealthConditionTable
        conditions={paginatedConditions}
        currentPage={currentPage}
        pageSize={pageSize}
        onEdit={handleEdit}
        onDelete={handleDeleteTrigger}
        deletingId={conditionToDelete?.id}
      />

      <HealthConditionModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={onSuccess}
        conditionToEdit={editingCondition}
        categories={categories}
      />

      <ImportHealthConditionModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={onSuccess}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa tình trạng sức khỏe "${conditionToDelete?.name}"?`}
        isLoading={isDeleting}
      />
    </AdminPageLayout>
  );
}
