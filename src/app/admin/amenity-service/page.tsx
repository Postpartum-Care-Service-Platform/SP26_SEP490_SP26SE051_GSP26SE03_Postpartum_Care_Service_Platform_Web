'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Upload } from 'lucide-react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/toast/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import amenityServiceService from '@/services/amenity-service.service';
import type { AmenityService } from '@/types/amenity-service';
import { AmenityServiceListHeader } from './components/AmenityServiceListHeader';
import { AmenityServiceModal } from './components/AmenityServiceModal';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import styles from './amenity-service.module.css';


const Edit2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill="currentColor">
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

const Trash2OutlineIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill="currentColor">
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Ngày tạo: mới nhất' },
  { value: 'createdAt-asc', label: 'Ngày tạo: cũ nhất' },
  { value: 'name-asc', label: 'Tên A-Z' },
  { value: 'name-desc', label: 'Tên Z-A' },
  { value: 'duration-asc', label: 'Thời lượng: tăng dần' },
  { value: 'duration-desc', label: 'Thời lượng: giảm dần' },
];

const STATUS_OPTIONS: Array<{ value: 'all' | 'active' | 'inactive'; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
];

const sortAmenityServices = (items: AmenityService[], sort: string) => {
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
    case 'duration-asc':
      return arr.sort((a, b) => (parseInt(a.duration || '0') || 0) - (parseInt(b.duration || '0') || 0));
    case 'duration-desc':
      return arr.sort((a, b) => (parseInt(b.duration || '0') || 0) - (parseInt(a.duration || '0') || 0));
    default:
      return arr;
  }
};

export default function AdminAmenityServicePage() {
  const { toast } = useToast();
  const [amenityServices, setAmenityServices] = useState<AmenityService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey, setSortKey] = useState<string>('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<AmenityService | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const fetchAmenityServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await amenityServiceService.getAllAmenityServices();
      setAmenityServices(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'message' in err &&
              typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Không thể tải danh sách tiện ích';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenityServices();
  }, []);

  const filteredAmenityServices = useMemo(() => {
    let filtered = [...amenityServices];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) => item.name.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => (statusFilter === 'active' ? item.isActive : !item.isActive));
    }

    return sortAmenityServices(filtered, sortKey);
  }, [amenityServices, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedAmenityServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAmenityServices.slice(start, end);
  }, [filteredAmenityServices, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAmenityServices.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleNew = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: AmenityService) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await amenityServiceService.deleteAmenityService(deleteId);
      toast({ title: 'Xóa tiện ích thành công', variant: 'success' });
      fetchAmenityServices();
    } catch (err: any) {
      toast({ title: 'Xóa thất bại: ' + (err.message || 'Lỗi hệ thống'), variant: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<AmenityServiceListHeader />}
        controlPanel={
          <div className={styles.controls}>
            <div className={styles.left}>
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm tiện ích..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={styles.filterButton}>
                    <span>{STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Tất cả'}</span>
                    <ChevronDownIcon className={styles.chevronIcon} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent}>
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`${styles.dropdownItem} ${statusFilter === option.value ? styles.dropdownItemActive : ''}`}
                      onClick={() => setStatusFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={styles.filterButton}>
                    <span>{SORT_OPTIONS.find(opt => opt.value === sortKey)?.label || 'Sắp xếp'}</span>
                    <ChevronDownIcon className={styles.chevronIcon} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent}>
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`${styles.dropdownItem} ${sortKey === option.value ? styles.dropdownItemActive : ''}`}
                      onClick={() => setSortKey(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className={styles.right}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className={styles.exportButton}>
                    <Download className={styles.exportIcon} />
                    Nhập/Xuất
                    <ChevronDownIcon className={styles.chevronIcon} />
                  </button>
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

              <button type="button" className={styles.newButton} onClick={handleNew}>
                <Plus size={16} />
                <span>Tạo mới</span>
              </button>
            </div>
          </div>
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredAmenityServices.length}
            onPageChange={handlePageChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            showResultCount={true}
          />
        }
      >
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sttHeaderCell}>STT</th>
                <th>Hình ảnh</th>
                <th>Tên tiện ích</th>
                <th>Mô tả</th>
                <th>Thời lượng (phút)</th>
                <th className={styles.dateCol}>Ngày tạo</th>
                <th className={styles.statusCol}>Trạng thái</th>
                <th className={styles.stickyActionsCol}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={8} className={styles.loadingCell}>Đang tải dữ liệu...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className={styles.errorCell}>{error}</td>
                </tr>
              ) : paginatedAmenityServices.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    <div className={styles.emptyState}>
                      <p>Không có dữ liệu khớp với tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAmenityServices.map((item, index) => (
                  <tr key={item.id}>
                    <td className={styles.sttDataCell}>
                      <span className={styles.sttCell}>
                        {(currentPage - 1) * pageSize + index + 1}
                      </span>
                    </td>
                    <td>
                      {item.imageUrl ? (
                        <div className={styles.tooltipWrapper}>
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className={styles.amenityImage} 
                            onClick={() => setPreviewImage({ url: item.imageUrl!, title: item.name })}
                          />
                          <span className={styles.tooltip}>Xem ảnh lớn</span>
                        </div>
                      ) : (
                        <div className={styles.amenityImagePlaceholder}>-</div>
                      )}
                    </td>
                    <td className={styles.nameCell}>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate}>{item.name}</span>
                        <span className={styles.tooltip}>{item.name}</span>
                      </div>
                    </td>
                    <td className={styles.descriptionCell}>
                      {item.description ? (
                        <div className={styles.tooltipWrapper}>
                          <span className={styles.textTruncate}>{item.description}</span>
                          <span className={styles.tooltip}>{item.description}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td>{item.duration || '-'}</td>
                    <td className={styles.dateCol}>{formatDate(item.createdAt)}</td>
                    <td className={styles.statusCol}>
                      <span className={`${styles.statusBadge} ${item.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {item.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className={styles.stickyActionsCol}>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <button 
                            className={`${styles.actionButton} ${styles.editButton}`} 
                            type="button"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2OutlineIcon size={16} />
                          </button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>
                        <div className={styles.tooltipWrapper}>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`} 
                            type="button"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2OutlineIcon size={16} />
                          </button>
                          <span className={styles.tooltip}>Xóa</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AmenityServiceModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={fetchAmenityServices}
          itemToEdit={itemToEdit}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa tiện ích"
          message="Bạn có chắc chắn muốn xóa tiện ích này? Dữ liệu đã xóa sẽ không thể phục hồi."
          confirmLabel="Xóa ngay"
          cancelLabel="Suy nghĩ lại"
          variant="danger"
        />

        {previewImage && (
          <div className={styles.imageModalOverlay} onClick={() => setPreviewImage(null)}>
            <div className={styles.imageModalContent}>
              <img src={previewImage.url} alt={previewImage.title} className={styles.fullImage} />
              <div className={styles.imageModalTitle}>{previewImage.title}</div>
            </div>
          </div>
        )}
      </AdminPageLayout>
    </div>
  );
}
