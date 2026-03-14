'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import feedbackService from '@/services/feedback.service';
import type { Feedback } from '@/types/feedback';

import styles from './feedback.module.css';
import { FeedbackDetailModal } from './FeedbackDetailModal';

/* ── SVG icons ── */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <g data-name="Layer 2"><g data-name="trash-2">
      <rect width="24" height="24" opacity="0" />
      <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
      <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
    </g></g>
  </svg>
);

const RestoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </svg>
);

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type StatusFilter = 'all' | 'active' | 'deleted';
type SortKey = 'id-desc' | 'id-asc' | 'rating-desc' | 'rating-asc' | 'date-desc' | 'date-asc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc', label: 'STT: giảm dần' },
  { value: 'id-asc', label: 'STT: tăng dần' },
  { value: 'rating-desc', label: 'Đánh giá cao nhất' },
  { value: 'rating-asc', label: 'Đánh giá thấp nhất' },
  { value: 'date-desc', label: 'Mới nhất' },
  { value: 'date-asc', label: 'Cũ nhất' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Hiển thị' },
  { value: 'deleted', label: 'Đã ẩn' },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error &&
    typeof (error as { message?: unknown }).message === 'string')
    return (error as { message: string }).message;
  return fallback;
};

const sortItems = (items: Feedback[], key: SortKey) => {
  const arr = [...items];
  switch (key) {
    case 'id-asc': return arr.sort((a, b) => a.id - b.id);
    case 'id-desc': return arr.sort((a, b) => b.id - a.id);
    case 'rating-desc': return arr.sort((a, b) => b.rating - a.rating);
    case 'rating-asc': return arr.sort((a, b) => a.rating - b.rating);
    case 'date-desc': return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'date-asc': return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    default: return arr;
  }
};

const renderStars = (rating: number) => {
  const max = 5;
  const value = Math.round(Math.min(Math.max(rating / 2, 0), max));
  return (
    <span style={{ letterSpacing: 1 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < value ? '#f59e0b' : '#d1d5db', fontSize: 14 }}>★</span>
      ))}
    </span>
  );
};

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [viewingItem, setViewingItem] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackService.getAllFeedbacks();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Không thể tải danh sách phản hồi'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        (item.title?.toLowerCase().includes(q)) ||
        (item.customerName?.toLowerCase().includes(q)) ||
        (item.feedbackTypeName?.toLowerCase().includes(q)) ||
        (item.content?.toLowerCase().includes(q)),
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => statusFilter === 'active' ? !item.isDeleted : item.isDeleted);
    }
    return sortItems(filtered, sortKey);
  }, [items, searchQuery, statusFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handleView = (item: Feedback) => { setViewingItem(item); setIsModalOpen(true); };
  const handleModalClose = (open: boolean) => { setIsModalOpen(open); if (!open) setViewingItem(null); };

  const handleDelete = async (item: Feedback) => {
    if (!window.confirm(`Bạn có chắc muốn ẩn phản hồi "${item.title || `#${item.id}`}"?`)) return;
    try {
      setActionId(item.id);
      await feedbackService.deleteFeedback(item.id);
      await fetchData();
      toast({ title: 'Ẩn phản hồi thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Ẩn phản hồi thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const handleRestore = async (item: Feedback) => {
    try {
      setActionId(item.id);
      await feedbackService.restoreFeedback(item.id);
      await fetchData();
      toast({ title: 'Khôi phục phản hồi thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Khôi phục phản hồi thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
    }
  };

  const selectedSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';
  const selectedStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'Tất cả';

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h4 className={styles.title}>Quản lý phản hồi</h4>
        <Breadcrumbs items={[{ label: 'Phản hồi' }]} homeHref="/admin" />
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề, khách hàng, loại..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.filterButton}>
                <MixerHorizontalIcon className={styles.filterIcon} />
                {selectedSortLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value}
                  className={`${styles.dropdownItem} ${sortKey === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setSortKey(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className={styles.controlsRight}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={styles.statusButton}>
                {selectedStatusLabel}
                <ChevronDownIcon className={styles.chevronIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={styles.dropdownContent}>
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value}
                  className={`${styles.dropdownItem} ${statusFilter === opt.value ? styles.dropdownItemActive : ''}`}
                  onClick={() => setStatusFilter(opt.value)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.placeholder}>Đang tải dữ liệu...</div>
        ) : error ? (
          <div className={styles.placeholder}>{error}</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th title="Số thứ tự">STT</th>
                  <th>Tiêu đề</th>
                  <th>Khách hàng</th>
                  <th>Loại phản hồi</th>
                  <th>Đánh giá</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr><td colSpan={8} className={styles.emptyState}>
                    {searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có phản hồi nào.'}
                  </td></tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const stt = (currentPage - 1) * pageSize + index + 1;
                    const date = item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                      : '—';
                    return (
                      <tr key={item.id}>
                        <td><span className={styles.sttCell} title={`ID gốc: ${item.id}`}>{stt}</span></td>
                        <td className={styles.nameCell}>{item.title || '—'}</td>
                        <td>{item.customerName || '—'}</td>
                        <td>{item.feedbackTypeName || '—'}</td>
                        <td>{renderStars(item.rating)}</td>
                        <td className={styles.dateCell}>{date}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.isDeleted ? styles.statusDeleted : styles.statusActive}`}>
                            {item.isDeleted ? 'Đã ẩn' : 'Hiển thị'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <div className={styles.tooltipWrapper}>
                            <Button variant="outline" size="sm" className={styles.viewButton}
                                onClick={() => handleView(item)}>
                              <EyeIcon />
                            </Button>
                              <span className={styles.tooltip}>Xem chi tiết</span>
                            </div>
                            {!item.isDeleted ? (
                              <div className={styles.tooltipWrapper}>
                              <Button variant="outline" size="sm" className={styles.deleteButton}
                                  onClick={() => handleDelete(item)} disabled={actionId === item.id}>
                                <TrashIcon />
                              </Button>
                                <span className={styles.tooltip}>Ẩn</span>
                              </div>
                            ) : (
                              <div className={styles.tooltipWrapper}>
                              <Button variant="outline" size="sm" className={styles.restoreButton}
                                  onClick={() => handleRestore(item)} disabled={actionId === item.id}>
                                <RestoreIcon />
                              </Button>
                                <span className={styles.tooltip}>Khôi phục</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredItems.length > 0 && totalPages > 0 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredItems.length}
              onPageChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              showResultCount={true}
            />
          </div>
        )}
      </div>



      <FeedbackDetailModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        feedback={viewingItem}
      />
    </div>
  );
}
