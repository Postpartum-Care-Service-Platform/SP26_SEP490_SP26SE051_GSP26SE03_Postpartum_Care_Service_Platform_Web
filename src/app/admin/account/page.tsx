'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import userService from '@/services/user.service';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';

import { PatientListHeader, PatientTableControls, PatientTable, NewAccountModal, ImportExcelModal } from './components';
import { mapAccountToPatient } from './components/patientUtils';

import type { Patient } from './components/patientTypes';

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

// Internal Premium Skeleton Component
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9', // slate-100
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

export default function AdminPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string>('date-newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for a smooth loading feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await userService.getAllAccounts();
      const mappedPatients = data.map((account, index) => mapAccountToPatient(account, index));
      setPatients(mappedPatients);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query) ||
          patient.address.toLowerCase().includes(query)
      );
    }

    if (statusFilter === 'true') {
      filtered = filtered.filter((patient) => patient.isEmailVerified === true);
    } else if (statusFilter === 'false') {
      filtered = filtered.filter((patient) => patient.isEmailVerified === false);
    }

    if (roleFilter !== null) {
      filtered = filtered.filter((patient) => patient.roleId === roleFilter);
    }

    const sorted = [...filtered];
    switch (sortKey) {
      case 'date-newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'date-oldest':
        sorted.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return sorted;
  }, [patients, searchQuery, statusFilter, roleFilter, sortKey]);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredPatients.slice(start, end);
  }, [filteredPatients, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPatients.length / pageSize);

  const handleSearch = (query: string) => { setSearchQuery(query); setCurrentPage(1); };
  const handleStatusChange = (status: string) => { setStatusFilter(status); setCurrentPage(1); };
  const handleRoleChange = (roleId: number | null) => { setRoleFilter(roleId); setCurrentPage(1); };
  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handlePageSizeChange = (size: number) => { setPageSize(size); setCurrentPage(1); };

  const handleViewProfile = (patient: Patient) => {
    const targetId = patient.customerId || patient.accountId;
    if (!targetId) {
      console.warn('Không tìm thấy ID hợp lệ để xem hồ sơ:', patient);
      return;
    }

    const currentPath = window.location.pathname;
    const baseRoute = currentPath.includes('/manager') ? '/manager/customers' : '/admin/account';

    // Staff, manager, admin, amenity_manager → trang hồ sơ nhân viên riêng
    const staffRoles = ['staff', 'manager', 'admin', 'amenity manager', 'amenity_manager', 'amenity-manager'];
    const isStaff = staffRoles.includes((patient.role || '').toLowerCase().trim());

    if (isStaff) {
      router.push(`${baseRoute}/${targetId}/staff`);
    } else {
      router.push(`${baseRoute}/${targetId}`);
    }
  };

  const handleChat = (patient: Patient) => console.log('Chat:', patient);
  const handleNewPatient = () => setIsNewAccountOpen(true);
  const handleImport = () => setIsImportModalOpen(true);
  const handleSortChange = (sort: string) => { setSortKey(sort); setCurrentPage(1); };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <PatientListHeader />
        
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Area */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBone width={300} height={40} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={100} height={40} />
              <SkeletonBone width={100} height={40} />
              <SkeletonBone width={100} height={40} />
            </div>
          </div>

          {/* Table Area */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '16px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Table Header Placeholder */}
            <div style={{ height: '56px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            
            {/* Table Rows */}
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} style={{ 
                height: '80px', 
                borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={20} />
                <SkeletonBone width={48} height={48} circle />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SkeletonBone width="60%" height={16} />
                  <SkeletonBone width="35%" height={12} />
                </div>
                <SkeletonBone width={150} height={16} />
                <SkeletonBone width={120} height={16} />
                <SkeletonBone width={100} height={36} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <PatientListHeader />
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const paginationConfig = totalPages > 0
    ? {
      currentPage,
      totalPages,
      pageSize,
      totalItems: filteredPatients.length,
      onPageChange: handlePageChange,
      pageSizeOptions: [...PAGE_SIZE_OPTIONS],
      onPageSizeChange: handlePageSizeChange,
    }
    : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff' }}>
      <AdminPageLayout
        header={<PatientListHeader />}
        controlPanel={
          <PatientTableControls
            onSearch={handleSearch}
            onSortChange={handleSortChange}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
            onNewPatient={handleNewPatient}
            onImport={handleImport}
          />
        }
        pagination={
          paginationConfig ? (
            <div style={{ padding: '0 16px' }}>
              <Pagination {...paginationConfig} />
            </div>
          ) : undefined
        }
      >
        <PatientTable
          patients={paginatedPatients}
          onViewProfile={handleViewProfile}
          onChat={handleChat}
          onRoleUpdated={fetchPatients}
          currentPage={currentPage}
          pageSize={pageSize}
        />
        <NewAccountModal open={isNewAccountOpen} onOpenChange={setIsNewAccountOpen} onSuccess={fetchPatients} />
        <ImportExcelModal open={isImportModalOpen} onOpenChange={setIsImportModalOpen} onSuccess={fetchPatients} />
      </AdminPageLayout>
    </div>
  );
}
