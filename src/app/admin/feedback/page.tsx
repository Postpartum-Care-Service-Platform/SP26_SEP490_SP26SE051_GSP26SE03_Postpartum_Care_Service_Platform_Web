'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Download, Upload, Eye } from 'lucide-react';

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
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';

import styles from './feedback.module.css';
import { FeedbackDetailModal } from './FeedbackDetailModal';

/* ── SVG icons ── */
const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <Eye size={size} />
);

const Trash2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill="currentColor">
    <g data-name="Layer 2"><g data-name="trash-2"><rect width="24" height="24" opacity="0"/><path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 1.98h-3c-1.2 0-2.4 1.08-2.4 2.35V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z"/><path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/><path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/></g></g>
  </svg>
);

const UndoOutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-undo-outline" fill="currentColor">
    <g data-name="Layer 2"><g data-name="undo"><rect width="24" height="24" opacity="0"/><path d="M19 19a1 1 0 0 1-1-1 7 7 0 1 0-7 7 1 1 0 0 1 0 2 9 9 0 1 1 9-9 1 1 0 0 1-1 1z"/><path d="M8.21 11.21L5.41 8.41l2.8-2.8a1 1 0 1 0-1.42-1.42l-3.5 3.5a1 1 0 0 0 0 1.42l3.5 3.5a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.4z"/></g></g>
  </svg>
);

const normalizeImages = (images: any): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return normalizeImages(parsed);
    } catch {
      return [images];
    }
  }
  if (typeof images === 'object') return Object.values(images) as string[];
  return [];
};

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
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M6.97942 1.25171L6.9585 1.30199L5.58662 4.60039C5.54342 4.70426 5.44573 4.77523 5.3336 4.78422L1.7727 5.0697L1.71841 5.07405L1.38687 5.10063L1.08608 5.12475C0.820085 5.14607 0.712228 5.47802 0.914889 5.65162L1.14406 5.84793L1.39666 6.06431L1.43802 6.09974L4.15105 8.42374C4.23648 8.49692 4.2738 8.61176 4.24769 8.72118L3.41882 12.196L3.40618 12.249L3.32901 12.5725L3.25899 12.866C3.19708 13.1256 3.47945 13.3308 3.70718 13.1917L3.9647 13.0344L4.24854 12.861L4.29502 12.8326L7.34365 10.9705C7.43965 10.9119 7.5604 10.9119 7.6564 10.9705L10.705 12.8326L10.7515 12.861L11.0354 13.0344L11.2929 13.1917C11.5206 13.3308 11.803 13.1256 11.7411 12.866L11.671 12.5725L11.5939 12.249L11.5812 12.196L10.7524 8.72118C10.7263 8.61176 10.7636 8.49692 10.849 8.42374L13.562 6.09974L13.6034 6.06431L13.856 5.84793L14.0852 5.65162C14.2878 5.47802 14.18 5.14607 13.914 5.12475L13.6132 5.10063L13.2816 5.07405L13.2274 5.0697L9.66645 4.78422C9.55432 4.77523 9.45663 4.70426 9.41343 4.60039L8.04155 1.30199L8.02064 1.25171L7.89291 0.944609L7.77702 0.665992C7.67454 0.419604 7.32551 0.419604 7.22303 0.665992L7.10715 0.944609L6.97942 1.25171ZM7.50003 2.60397L6.50994 4.98442C6.32273 5.43453 5.89944 5.74207 5.41351 5.78103L2.84361 5.98705L4.8016 7.66428C5.17183 7.98142 5.33351 8.47903 5.2204 8.95321L4.62221 11.461L6.8224 10.1171C7.23842 9.86302 7.76164 9.86302 8.17766 10.1171L10.3778 11.461L9.77965 8.95321C9.66654 8.47903 9.82822 7.98142 10.1984 7.66428L12.1564 5.98705L9.58654 5.78103C9.10061 5.74207 8.67732 5.43453 8.49011 4.98442L7.50003 2.60397Z" 
            fill={i < value ? '#f59e0b' : '#d1d5db'} 
            fillRule="evenodd" 
            clipRule="evenodd" 
          />
        </svg>
      ))}
    </div>
  );
};

export default function AdminFeedbackPage() {
  const pathname = usePathname();
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

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;

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
    <AdminPageLayout
      header={
        <div className={styles.header}>
          <Breadcrumbs 
            items={[{ label: 'Phản hồi' }]} 
            homeHref={pathname?.startsWith('/manager') ? '/manager' : '/admin'} 
          />
        </div>
      }
      controlPanel={
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
                <Button variant="outline" size="sm" className={styles.exportButton}>
                  <Download size={16} className={styles.exportIcon} />
                  Nhập/Xuất
                  <ChevronDownIcon className={styles.chevronIcon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={styles.dropdownContent} align="end">
                <DropdownMenuItem className={styles.dropdownItem} onClick={() => console.log('Import')}>
                  <Upload size={16} className={styles.itemIcon} />
                  Nhập từ Excel
                </DropdownMenuItem>
                <DropdownMenuItem className={styles.dropdownItem} onClick={() => console.log('Export')}>
                  <Download size={16} className={styles.itemIcon} />
                  Xuất ra Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
      }
      pagination={
        filteredItems.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredItems.length}
            onPageChange={(page) => { 
              setCurrentPage(page); 
              const scrollArea = document.querySelector(`.${styles.pageContainer}`)?.closest('[class*="scrollArea"]');
              scrollArea?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            showResultCount={true}
          />
        ) : null
      }
    >
      <div className={styles.pageContainer}>
        {loading ? (
          <div className={styles.placeholder}>Đang tải dữ liệu...</div>
        ) : error ? (
          <div className={styles.placeholder}>{error}</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.stickySTTCol}>STT</th>
                  <th>Khách hàng</th>
                  <th>Loại phản hồi</th>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Đánh giá</th>
                  <th>Hình ảnh</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th className={styles.stickyActionsCol}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.length === 0 ? (
                  <tr><td colSpan={10} className={styles.emptyState}>
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
                        <td className={styles.stickySTTCol}><span className={styles.sttCell} title={`ID gốc: ${item.id}`}>{stt}</span></td>
                        <td>{item.customerName || '—'}</td>
                        <td>{item.feedbackTypeName || '—'}</td>
                        <td className={styles.nameCell}>{item.title || '—'}</td>
                        <td className={styles.contentCell}>
                          {item.content ? (
                            <div className={styles.textTooltipWrapper}>
                              <span className={styles.contentTruncate}>{item.content}</span>
                              <span className={styles.tooltip}>{item.content}</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td>{renderStars(item.rating)}</td>
                        <td className={styles.imageCell}>
                          {(() => {
                            const images = normalizeImages(item.images);
                            if (images.length === 0) return '—';
                            return (
                              <div className={styles.imageStack}>
                                {images.slice(0, 2).map((img, i) => (
                                  <div key={i} className={styles.imageWrapper} style={{ zIndex: images.length - i }}>
                                    <img src={img} alt="Feedback" className={styles.imagePreview} />
                                  </div>
                                ))}
                                {images.length > 2 && (
                                  <span className={styles.imageCountBadge}>+{images.length - 2}</span>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className={styles.dateCell}>{date}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${item.isDeleted ? styles.statusDeleted : styles.statusActive}`}>
                            {item.isDeleted ? 'Đã ẩn' : 'Hiển thị'}
                          </span>
                        </td>
                        <td className={styles.stickyActionsCol}>
                          <div className={styles.actions}>
                            {!item.isDeleted ? (
                              <div className={styles.tooltipWrapper}>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(item)} disabled={actionId === item.id}>
                                  <Trash2OutlineIcon size={16} />
                                </button>
                                <span className={styles.tooltip}>Ẩn</span>
                              </div>
                            ) : (
                              <div className={styles.tooltipWrapper}>
                                <button className={`${styles.actionButton} ${styles.restoreButton}`}
                                    onClick={() => handleRestore(item)} disabled={actionId === item.id}>
                                  <UndoOutlineIcon size={16} />
                                </button>
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
      </div>

      <FeedbackDetailModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        feedback={viewingItem}
      />
    </AdminPageLayout>
  );
}
