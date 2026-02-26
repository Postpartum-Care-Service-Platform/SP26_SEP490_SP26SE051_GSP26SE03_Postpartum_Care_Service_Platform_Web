'use client';

import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import activityService from '@/services/activity.service';
import type { Activity } from '@/types/activity';

import styles from './activity.module.css';
import { ActivityStatsCards, ActivityTable, ActivityTableControls, NewActivityModal } from './components';
import { ActivityListHeader } from './components/ActivityListHeader';

import type { ActivityStats } from './components';

const PAGE_SIZE = 10;

const sortActivities = (items: Activity[], sort: string) => {
  const arr = [...items];
  switch (sort) {
    case 'createdAt-asc':
      return arr.sort((a, b) => new Date((a.createdAt as string) || 0).getTime() - new Date((b.createdAt as string) || 0).getTime());
    case 'createdAt-desc':
      return arr.sort((a, b) => new Date((b.createdAt as string) || 0).getTime() - new Date((a.createdAt as string) || 0).getTime());
    case 'name-asc':
      return arr.sort((a, b) => ((a.name as string) || '').localeCompare((b.name as string) || ''));
    case 'name-desc':
      return arr.sort((a, b) => ((b.name as string) || '').localeCompare((a.name as string) || ''));
    default:
      return arr;
  }
};

export default function AdminActivityPage() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getAllActivities();
      setActivities(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message ? err.message : 'Không thể tải danh sách hoạt động';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const stats: ActivityStats = useMemo(() => {
    const total = activities.length;
    const active = activities.filter((a) => (a.isActive as boolean) === true).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
    };
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) => ((a.name as string) || '').toLowerCase().includes(q) || ((a.description as string) || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => (statusFilter === 'active' ? (a.isActive as boolean) === true : (a.isActive as boolean) === false));
    }

    return sortActivities(filtered, sortKey);
  }, [activities, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredActivities.slice(start, end);
  }, [filteredActivities, currentPage]);

  const totalPages = Math.ceil(filteredActivities.length / PAGE_SIZE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingActivity(null);
    }
  };

  const handleDelete = async (activity: Activity) => {
    try {
      setDeletingId(activity.id);
      await activityService.deleteActivity(activity.id);
      toast({ title: 'Xóa hoạt động thành công', variant: 'success' });
      await fetchActivities();
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message ? err.message : 'Xóa hoạt động thất bại';
      toast({ title: message, variant: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <ActivityListHeader />

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
          <ActivityStatsCards stats={stats} />

          <ActivityTableControls
            onSearch={(q) => setSearchQuery(q)}
            onSortChange={(sort) => setSortKey(sort)}
            onStatusChange={(status) => setStatusFilter(status)}
            onNewActivity={() => setIsModalOpen(true)}
          />

          <ActivityTable
            activities={paginatedActivities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            pagination={
              totalPages > 0
                ? {
                    currentPage,
                    totalPages,
                    pageSize: PAGE_SIZE,
                    totalItems: filteredActivities.length,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </>
      )}

      <NewActivityModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchActivities}
        activityToEdit={editingActivity}
      />
    </div>
  );
}
