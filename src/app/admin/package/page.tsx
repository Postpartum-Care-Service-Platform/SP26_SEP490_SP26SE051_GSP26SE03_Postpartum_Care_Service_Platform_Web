'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import packageService from '@/services/package.service';
import type { Package } from '@/types/package';

import { NewPackageModal, PackageStatsCards, PackageTable, PackageTableControls } from './components';
import { PackageListHeader } from './components/PackageListHeader';
import styles from './package.module.css';

import type { PackageStats } from './components';



const PAGE_SIZE = 10;

const sortPackages = (items: Package[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'price-asc':
      return arr.sort((a, b) => a.basePrice - b.basePrice);
    case 'price-desc':
      return arr.sort((a, b) => b.basePrice - a.basePrice);
    case 'duration-asc':
      return arr.sort((a, b) => a.durationDays - b.durationDays);
    case 'duration-desc':
      return arr.sort((a, b) => b.durationDays - a.durationDays);
    case 'name-asc':
      return arr.sort((a, b) => a.packageName.localeCompare(b.packageName));
    case 'name-desc':
      return arr.sort((a, b) => b.packageName.localeCompare(a.packageName));
    default:
      return arr;
  }
};

export default function AdminPackagePage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);


  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await packageService.getAllPackages();
      setPackages(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách gói dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
     
  }, []);

  const stats: PackageStats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.isActive).length;
    const inactive = total - active;

    const avgDuration = total > 0 ? Math.round(packages.reduce((sum, p) => sum + p.durationDays, 0) / total) : 0;
    const avgPrice = total > 0 ? Math.round(packages.reduce((sum, p) => sum + p.basePrice, 0) / total) : 0;
    const highestPrice = total > 0 ? Math.max(...packages.map((p) => p.basePrice)) : 0;

    return {
      total,
      active,
      inactive,
      avgDuration,
      avgPrice,
      highestPrice,
    };
  }, [packages]);

  const filteredPackages = useMemo(() => {
    let filtered = [...packages];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.packageName.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => (statusFilter === 'active' ? p.isActive : !p.isActive));
    }

    return sortPackages(filtered, sortKey);
  }, [packages, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPackages.slice(start, end);
  }, [filteredPackages, currentPage]);

  const totalPages = Math.ceil(filteredPackages.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingPackage(null);
    }
  };

  const handleDelete = async (pkg: Package) => {
    try {
      setDeletingId(pkg.id);
      await packageService.deletePackage(pkg.id);
      toast({ title: 'Xóa gói dịch vụ thành công', variant: 'success' });
      await fetchPackages();
    } catch (err: any) {
      toast({ title: err?.message || 'Xóa gói dịch vụ thất bại', variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PackageListHeader />

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
          <PackageStatsCards stats={stats} />

          <PackageTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewPackage={() => setIsModalOpen(true)}
          />

          <PackageTable
            packages={paginatedPackages}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredPackages.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />


        </>
      )}

      <NewPackageModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchPackages}
        packageToEdit={editingPackage}
      />
    </div>
  );
}
