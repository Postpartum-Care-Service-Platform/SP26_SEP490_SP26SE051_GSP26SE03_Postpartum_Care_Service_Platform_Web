'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useToast } from '@/components/ui/toast/use-toast';
import styles from './feedback-types.module.css';
import feedbackTypeService from '@/services/feedback-type.service';
import type { FeedbackType } from '@/types/feedback-type';
import { FeedbackTypeCard } from './FeedbackTypeCard';

export default function AdminFeedbackTypesPage() {
  const [items, setItems] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await feedbackTypeService.getAllFeedbackTypes();
        setItems(data);
      } catch (err: any) {
        setError(err?.message || 'Không thể tải danh sách loại phản hồi');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    const name = window.prompt('Tên loại phản hồi');
    if (!name || !name.trim()) {
      return;
    }

    const description = window.prompt('Mô tả', '') ?? '';

    try {
      const created = await feedbackTypeService.createFeedbackType({
        name: name.trim(),
        description,
      });
      setItems((prev) => [created, ...prev]);
      toast({ title: 'Thêm loại phản hồi thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: err?.message || 'Thêm loại phản hồi thất bại', variant: 'error' });
    }
  };

  const handleEdit = async (item: FeedbackType) => {
    const name = window.prompt('Tên loại phản hồi', item.name);
    if (name == null || !name.trim()) {
      return;
    }

    const description = window.prompt('Mô tả', item.description ?? '') ?? '';

    try {
      const updated = await feedbackTypeService.updateFeedbackType(item.id, {
        name: name.trim(),
        description,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      toast({ title: 'Cập nhật loại phản hồi thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: err?.message || 'Cập nhật loại phản hồi thất bại', variant: 'error' });
    }
  };

  const handleDelete = async (item: FeedbackType) => {
    try {
      await feedbackTypeService.deleteFeedbackType(item.id);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isDeleted: true } : i)));
      toast({ title: 'Ẩn loại phản hồi thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: err?.message || 'Ẩn loại phản hồi thất bại', variant: 'error' });
    }
  };

  const handleRestore = async (item: FeedbackType) => {
    try {
      const restored = await feedbackTypeService.restoreFeedbackType(item.id);
      setItems((prev) => prev.map((i) => (i.id === item.id ? restored : i)));
      toast({ title: 'Khôi phục loại phản hồi thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: err?.message || 'Khôi phục loại phản hồi thất bại', variant: 'error' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Loại phản hồi</h4>
        <Breadcrumbs
          items={[
            { label: 'Trang quản trị', href: '/admin' },
            { label: 'Loại phản hồi' },
          ]}
          homeHref="/admin"
        />
      </div>
      <div className={styles.contentCard}>
        <button type="button" onClick={handleCreate} style={{ marginBottom: 12 }}>
          Thêm loại phản hồi
        </button>
        {loading ? (
          <div className={styles.placeholderText}>Đang tải danh sách loại phản hồi...</div>
        ) : error ? (
          <div className={styles.placeholderText}>{error}</div>
        ) : items.length === 0 ? (
          <div className={styles.placeholderText}>Chưa có loại phản hồi nào.</div>
        ) : (
          <div className={styles.cardsGrid}>
            {items.map((item) => (
              <FeedbackTypeCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestore={handleRestore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


