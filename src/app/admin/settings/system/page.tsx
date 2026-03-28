'use client';

import { CreditCard, Briefcase, ShieldCheck, Monitor, Bot, Lock } from 'lucide-react';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import apiClient from '@/services/apiClient';

import { WorkScheduleHeader } from '../../work-schedule/components/WorkScheduleHeader';

import { SystemSettingsList, SystemSettingsModal } from './components';
import styles from './system.module.css';

export type SystemSetting = {
  id: number;
  key: string;
  value: string;
  description: string;
  group: string;
  dataType: string;
  isEditable: boolean;
  updatedAt: string;
};

const tabs = [
  { key: 'Payment', label: 'Thanh toán', icon: <CreditCard size={16} /> },
  { key: 'Business', label: 'Kinh doanh', icon: <Briefcase size={16} /> },
  { key: 'Validation', label: 'Ràng buộc dữ liệu', icon: <ShieldCheck size={16} /> },
  { key: 'App', label: 'Ứng dụng', icon: <Monitor size={16} /> },
  { key: 'AI', label: 'AI & trợ lý ảo', icon: <Bot size={16} /> },
  { key: 'Auth', label: 'Xác thực & bảo mật', icon: <Lock size={16} /> },
];

export default function AdminSystemSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const settingsData = await apiClient.get('/SystemSetting') as any;
      setSettings(settingsData as SystemSetting[]);
    } catch (_err) {
      setError('Không thể tải cấu hình hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]); // Reset page when tab or search changes

  const filteredSettings = useMemo(() => {
    let filtered = settings.filter((s) => s.group === activeTab); // Assuming 'group' matches 'activeTab'
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.key.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => a.key.localeCompare(b.key)); // Sort filtered settings
  }, [settings, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredSettings.length / pageSize);

  const paginatedSettings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSettings.slice(start, start + pageSize);
  }, [filteredSettings, currentPage, pageSize]);

  const handleEdit = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingSetting(null); // Clear any previous editing state
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingSetting(null);
    }
  };

  const currentTab = tabs.find((t) => t.key === activeTab);

  const pathname = usePathname();
  const isManager = pathname?.startsWith('/manager');
  const homeHref = isManager ? '/manager' : '/admin';

  const breadcrumbs = [{ label: 'Cài đặt hệ thống' }];

  const pagination = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      totalItems={filteredSettings.length}
      onPageChange={(page) => setCurrentPage(page)}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setCurrentPage(1);
      }}
      showResultCount={true}
    />
  );

  const controlPanel = (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm cài đặt..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.controlsRight}>
        <Button variant="primary" size="sm" onClick={handleOpenCreate} className={styles.createButton}>
          <PlusIcon className={styles.plusIcon} />
          Cài đặt mới
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <div className="flex-shrink-0">
        <WorkScheduleHeader
          breadcrumbs={breadcrumbs}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <AdminPageLayout
        controlPanel={controlPanel}
        pagination={pagination}
      >
        {loading ? (
          <div className={styles.content}>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className={styles.content}>
            <p>{error}</p>
          </div>
        ) : (
          <SystemSettingsList
            settings={paginatedSettings}
            onEdit={handleEdit}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}

        <SystemSettingsModal
          open={isModalOpen}
          onOpenChange={handleModalClose}
          onSuccess={fetchData}
          settingToEdit={editingSetting}
        />
      </AdminPageLayout>
    </div>
  );
}
