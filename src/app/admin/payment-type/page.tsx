'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { Download, Upload, FileIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import paymentTypeService from '@/services/payment-type.service';
import type { PaymentType } from '@/types/payment-type';

import { ImportPaymentTypeModal } from './components/ImportPaymentTypeModal';
import { PaymentTypeModal } from './components/PaymentTypeModal';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import styles from './payment-type.module.css';

/* ── SVG icons ── */
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
    <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4z" />
  </svg>
);

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
type StatusFilter = 'all' | 'active' | 'inactive';
type SortKey      = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id-desc',   label: 'STT: giảm dần' },
  { value: 'id-asc',    label: 'STT: tăng dần' },
  { value: 'name-asc',  label: 'Tên A → Z' },
  { value: 'name-desc', label: 'Tên Z → A' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'active',   label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm dừng' },
];

export default function AdminPaymentTypePage() {
  const [items, setItems]         = useState<PaymentType[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey]           = useState<SortKey>('id-desc');
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(DEFAULT_PAGE_SIZE);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentType | null>(null);

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Confirm Modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PaymentType | null>(null);

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentTypeService.getAll().catch(() => [
        { id: 1, name: 'Tiền mặt', description: 'Thanh toán trực tiếp bằng tiền mặt', isActive: true, createdAt: new Date().toISOString() },
        { id: 2, name: 'Chuyển khoản', description: 'Chuyển khoản qua ngân hàng', isActive: true, createdAt: new Date().toISOString() },
        { id: 3, name: 'VNPay', description: 'Cổng thanh toán VNPay', isActive: true, createdAt: new Date().toISOString() },
      ]);
      setItems(data);
    } catch (err: unknown) {
      setError('Không thể tải danh sách loại thanh toán');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => statusFilter === 'active' ? item.isActive : !item.isActive);
    }
    
    const arr = [...filtered];
    switch (sortKey) {
      case 'id-asc':    arr.sort((a, b) => a.id - b.id); break;
      case 'id-desc':   arr.sort((a, b) => b.id - a.id); break;
      case 'name-asc':  arr.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': arr.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return arr;
  }, [items, searchQuery, statusFilter, sortKey]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, sortKey]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const handleOpenCreate = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleOpenEdit   = (item: PaymentType) => { setEditingItem(item); setIsModalOpen(true); };
  const handleModalClose = (open: boolean) => { setIsModalOpen(open); if (!open) setEditingItem(null); };

  const handleDeleteTrigger = (item: PaymentType) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setDeletingId(itemToDelete.id);
      await paymentTypeService.delete(itemToDelete.id);
      await fetchData();
      toast({ title: 'Xóa loại thanh toán thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xóa loại thanh toán thất bại', variant: 'error' });
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị file xuất...', variant: 'default' });
      const blob = await paymentTypeService.exportPaymentTypes();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Loai_thanh_toan_${new Date().getTime()}.xlsx`);
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
      const blob = await paymentTypeService.downloadTemplatePaymentTypes();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Mau_nhap_loai_thanh_toan.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Tải file mẫu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Tải file mẫu thất bại', variant: 'error' });
    }
  };

  const selectedSortLabel   = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Sắp xếp';
  const selectedStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'Tất cả';

  const controlPanel = (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm loại thanh toán..."
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
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setIsImportModalOpen(true)}>
              <Upload size={16} className={styles.itemIcon} />
              Nhập từ Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={handleExport}>
              <Download size={16} className={styles.itemIcon} />
              Xuất ra Excel
            </DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={handleDownloadTemplate}>
              <FileIcon size={16} className={styles.itemIcon} />
              Tải file mẫu
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
        <Button variant="primary" size="sm" className={styles.createButton} onClick={handleOpenCreate}>
          <PlusIcon className={styles.plusIcon} />
          Loại mới
        </Button>
      </div>
    </div>
  );

  const pagination = !loading && !error && filteredItems.length > 0 && totalPages > 0 ? (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={filteredItems.length}
      onPageChange={(page) => { setCurrentPage(page); }}
      pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
      onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
      showResultCount={true}
    />
  ) : null;

  return (
    <AdminPageLayout
      controlPanel={controlPanel}
      pagination={pagination}
    >
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>STT</th>
              <th>Tên loại thanh toán</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className={styles.placeholder}>Đang tải dữ liệu...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className={styles.placeholder}>{error}</td></tr>
            ) : paginatedItems.length === 0 ? (
              <tr><td colSpan={5} className={styles.emptyState}>Không tìm thấy kết quả.</td></tr>
            ) : (
              paginatedItems.map((item, index) => {
                const stt = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr key={item.id}>
                    <td><span className={styles.sttCell}>{stt}</span></td>
                    <td className={styles.nameCell}>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${item.isActive ? styles.statusActive : styles.statusInactive}`}>
                        {item.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <Button variant="outline" size="sm" className={styles.editButton} onClick={() => handleOpenEdit(item)}>
                            <EditIcon />
                          </Button>
                          <span className={styles.tooltip}>Chỉnh sửa</span>
                        </div>
                        <div className={styles.tooltipWrapper}>
                          <Button variant="outline" size="sm" className={styles.deleteButton} onClick={() => handleDeleteTrigger(item)}>
                            <TrashIcon />
                          </Button>
                          <span className={styles.tooltip}>Xóa</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PaymentTypeModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        item={editingItem}
        onSuccess={fetchData}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa loại thanh toán"
        message={`Bạn có chắc chắn muốn xóa loại thanh toán "${itemToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa ngay"
        cancelLabel="Suy nghĩ lại"
        variant="danger"
      />

      <ImportPaymentTypeModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchData}
      />
    </AdminPageLayout>
  );
}
