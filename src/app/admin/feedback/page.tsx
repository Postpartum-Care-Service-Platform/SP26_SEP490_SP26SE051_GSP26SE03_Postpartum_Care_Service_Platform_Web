'use client';

import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useToast } from '@/components/ui/toast/use-toast';
import feedbackService from '@/services/feedback.service';
import type { Feedback } from '@/types/feedback';

import styles from './feedback.module.css';
import { FeedbackCard } from './FeedbackCard';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await feedbackService.getAllFeedbacks();
        setFeedbacks(data);
      } catch (error: unknown) {
        setError(getErrorMessage(error, 'Không thể tải danh sách phản hồi'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditFeedback = async (feedback: Feedback) => {
    const nextTitle = window.prompt('Tiêu đề phản hồi', feedback.title || '');
    if (nextTitle == null) {
      return;
    }

    const nextContent = window.prompt('Nội dung phản hồi', feedback.content || '');
    if (nextContent == null) {
      return;
    }

    const ratingInput = window.prompt('Điểm đánh giá (0-10)', String(feedback.rating ?? 0));
    if (ratingInput == null) {
      return;
    }
    const rating = Number(ratingInput);
    if (Number.isNaN(rating) || rating < 0 || rating > 10) {
      toast({ title: 'Điểm đánh giá không hợp lệ (0-10)', variant: 'error' });
      return;
    }

    try {
      const updated = await feedbackService.updateFeedback(feedback.id, {
        title: nextTitle.trim(),
        content: nextContent.trim(),
        rating,
      });
      setFeedbacks((prev) => prev.map((f) => (f.id === feedback.id ? updated : f)));
      toast({ title: 'Cập nhật phản hồi thành công', variant: 'success' });
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Cập nhật phản hồi thất bại'),
        variant: 'error',
      });
    }
  };

  const handleDeleteFeedback = async (feedback: Feedback) => {
    try {
      await feedbackService.deleteFeedback(feedback.id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));
      toast({ title: 'Xóa phản hồi thành công', variant: 'success' });
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Xóa phản hồi thất bại'),
        variant: 'error',
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Quản lý phản hồi</h4>
        <Breadcrumbs
          items={[
            { label: 'Trang quản trị', href: '/admin' },
            { label: 'Phản hồi' },
          ]}
          homeHref="/admin"
        />
      </div>
      <div className={styles.contentCard}>
        {loading ? (
          <div className={styles.placeholderText}>Đang tải danh sách phản hồi...</div>
        ) : error ? (
          <div className={styles.placeholderText}>{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className={styles.placeholderText}>Chưa có phản hồi nào.</div>
        ) : (
          <div className={styles.cardsGrid}>
            {feedbacks.map((item) => (
              <FeedbackCard
                key={item.id}
                feedback={item}
                onEdit={handleEditFeedback}
                onDelete={handleDeleteFeedback}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
