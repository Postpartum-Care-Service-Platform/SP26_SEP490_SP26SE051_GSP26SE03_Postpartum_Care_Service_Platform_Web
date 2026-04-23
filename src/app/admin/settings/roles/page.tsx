'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';

import { RoleImportModal, RoleListHeader, RoleModal, RoleTable, RoleTableControls } from './components';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import styles from './roles.module.css';

// Internal Premium Skeleton Component
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

const sortRoles = (items: Role[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    case 'name-asc':
      return arr.sort((a, b) => a.roleName.localeCompare(b.roleName));
    case 'name-desc':
      return arr.sort((a, b) => b.roleName.localeCompare(a.roleName));
    default:
      return arr;
  }
};

export default function AdminRolesPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // States for confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      // Premium 2s delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Khong the tai danh sach vai tro';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    let filtered = [...roles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) => r.roleName.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q),
      );
    }

    return sortRoles(filtered, sortKey);
  }, [roles, searchQuery, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortKey]);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredRoles.slice(start, end);
  }, [filteredRoles, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRoles.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingRole(null);
    }
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleDeleteTrigger = (role: Role) => {
    setRoleToDelete(role);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      setDeletingId(roleToDelete.id);
      await roleService.deleteRole(roleToDelete.id);
      toast({ title: 'Xóa vai trò thành công', variant: 'success' });
      await fetchRoles();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Xóa vai trò thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setDeletingId(null);
      setRoleToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const breadcrumbs = [
    { label: 'Vai trò' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div className="flex-shrink-0">
          <RoleListHeader />
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={320} height={42} />
              <SkeletonBone width={180} height={42} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={120} height={42} />
              <SkeletonBone width={100} height={42} />
            </div>
          </div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} style={{ height: '64px', borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '24px' }}>
                <div style={{ width: '40px' }}><SkeletonBone width={30} height={16} /></div>
                <div style={{ width: '200px' }}><SkeletonBone width="70%" height={16} /></div>
                <div style={{ flex: 1 }}><SkeletonBone width="80%" height={16} /></div>
                <div style={{ width: '120px' }}><SkeletonBone width={80} height={16} /></div>
                <div style={{ width: '80px' }}><SkeletonBone width={64} height={32} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<RoleListHeader />}
        controlPanel={
          <RoleTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onNewRole={() => setIsModalOpen(true)}
            onImport={handleImport}
          />
        }
        pagination={
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredRoles.length}
              onPageChange={handlePageChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(size: number) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showResultCount={true}
            />
          ) : null
        }
      >
        {error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : (
          <RoleTable
            roles={paginatedRoles}
            onEdit={handleEdit}
            onDelete={handleDeleteTrigger}
            deletingId={deletingId}
            pagination={{
              currentPage,
              pageSize,
            }}
          />
        )}

        <RoleModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          onSuccess={fetchRoles}
          roleToEdit={editingRole}
        />

        <RoleImportModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchRoles}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa vai trò"
          message={`Bạn có chắc chắn muốn xóa vai trò "${roleToDelete?.roleName}"? Hành động này không thể hoàn tác.`}
        />
      </AdminPageLayout>
    </div>
  );
}
