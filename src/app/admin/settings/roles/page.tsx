'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

import { RoleListHeader, RoleModal, RoleTable, RoleTableControls } from './components';
import styles from './roles.module.css';




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
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];
  const [deletingId, setDeletingId] = useState<number | null>(null);


  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
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

  const handleDelete = async (role: Role) => {
    try {
      setDeletingId(role.id);
      await roleService.deleteRole(role.id);
      toast({ title: 'Xoa vai tro thanh cong', variant: 'success' });
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
            : 'Xoa vai tro that bai';
      toast({ title: message, variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <RoleListHeader />

      {loading ? (
        <div className={styles.content}>
          <p> Dang tai du lieu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <RoleTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onNewRole={() => setIsModalOpen(true)}
          />

          <RoleTable
            roles={paginatedRoles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize,
                    totalItems: filteredRoles.length,
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

      <RoleModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchRoles}
        roleToEdit={editingRole}
      />
    </div>
  );
}
