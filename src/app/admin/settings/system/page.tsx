'use client';

import { CreditCard, Briefcase, ShieldCheck, Monitor, Bot, Lock } from 'lucide-react';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';

import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import apiClient from '@/services/apiClient';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown';
import { ChevronDownIcon } from '@radix-ui/react-icons';

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

// Internal Premium Skeleton Component
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

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
  const [tabLoading, setTabLoading] = useState(false);
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
      // Premium 2s initial delay
      await new Promise(resolve => setTimeout(resolve, 2000));
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

  const handleTabChange = useCallback(async (key: string) => {
    if (key === activeTab) return;
    setTabLoading(true);
    setActiveTab(key);
    // Smooth transition
    await new Promise(resolve => setTimeout(resolve, 800));
    setTabLoading(false);
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]); // Reset page when tab or search changes

  // Filter states
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');

  const filteredSettings = useMemo(() => {
    let filtered = settings.filter((s) => s.group === activeTab);
    
    if (dataTypeFilter !== 'all') {
      filtered = filtered.filter(s => s.dataType.toLowerCase() === dataTypeFilter.toLowerCase());
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.key.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => a.key.localeCompare(b.key));
  }, [settings, activeTab, searchQuery, dataTypeFilter]);

  const totalPages = Math.ceil(filteredSettings.length / pageSize);

  const paginatedSettings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSettings.slice(start, start + pageSize);
  }, [filteredSettings, currentPage, pageSize]);

  const handleEdit = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingSetting(null);
    }
  };

  const breadcrumbs = [{ label: 'Cài đặt hệ thống' }];

  const pagination = !loading && !tabLoading && !error && filteredSettings.length > 0 && totalPages > 0 ? (
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
  ) : null;

  const dataTypeLabel = {
    all: 'Kiểu dữ liệu (Tất cả)',
    string: 'Chuỗi (String)',
    int: 'Số nguyên (Int)',
    decimal: 'Số thập phân (Decimal)',
    boolean: 'Logic (Boolean)',
  }[dataTypeFilter] || 'Kiểu dữ liệu (Tất cả)';

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
        
        <DropdownMenu>
          <DropdownMenuTrigger className={styles.filterButton}>
            <span>{dataTypeLabel}</span>
            <ChevronDownIcon className={styles.chevronIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={styles.dropdownContent}>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setDataTypeFilter('all')}>Kiểu dữ liệu (Tất cả)</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setDataTypeFilter('string')}>Chuỗi (String)</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setDataTypeFilter('int')}>Số nguyên (Int)</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setDataTypeFilter('decimal')}>Số thập phân (Decimal)</DropdownMenuItem>
            <DropdownMenuItem className={styles.dropdownItem} onClick={() => setDataTypeFilter('boolean')}>Logic (Boolean)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const skeletonControlPanel = (
    <div className={styles.controls}>
      <div className={styles.controlsLeft}>
        <SkeletonBone width={320} height={42} />
        <SkeletonBone width={220} height={42} />
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
      <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
      {[...Array(pageSize)].map((_, i) => (
        <div key={i} style={{ height: '64px', borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '24px' }}>
          <div style={{ width: '60px' }}><SkeletonBone width={30} height={16} /></div>
          <div style={{ width: '200px' }}><SkeletonBone width="80%" height={16} /></div>
          <div style={{ flex: 2 }}><SkeletonBone width="90%" height={16} /></div>
          <div style={{ flex: 3 }}><SkeletonBone width="85%" height={16} /></div>
          <div style={{ width: '120px' }}><SkeletonBone width={80} height={24} /></div>
          <div style={{ width: '100px' }}><SkeletonBone width={80} height={16} /></div>
          <div style={{ width: '80px' }}><SkeletonBone width={32} height={32} /></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <div className="flex-shrink-0">
          <WorkScheduleHeader breadcrumbs={breadcrumbs} tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <AdminPageLayout controlPanel={skeletonControlPanel} pagination={null}>
          {renderTableSkeleton()}
        </AdminPageLayout>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-white">
      <div className="flex-shrink-0">
        <WorkScheduleHeader
          breadcrumbs={breadcrumbs}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <AdminPageLayout
        controlPanel={tabLoading ? skeletonControlPanel : controlPanel}
        pagination={pagination}
      >
        {tabLoading ? (
          <div style={{ padding: '0px' }}>
             <style>{`
              @keyframes skeleton-shimmer-run {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
            {renderTableSkeleton()}
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
