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

    // Sắp xếp
    const sorted = [...filtered];
    switch (sortKey) {
      case 'date-newest':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case 'date-oldest':
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    // status: 'all' | 'true' | 'false'
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRoleChange = (roleId: number | null) => {
    setRoleFilter(roleId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

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

  const handleChat = (patient: Patient) => {
    console.log('Open chat with patient:', patient);
  };

  const handleNewPatient = () => {
    setIsNewAccountOpen(true);
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleSortChange = (sort: string) => {
    setSortKey(sort);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div>
        <PatientListHeader />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Đang tải dữ liệu tài khoản...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PatientListHeader />
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
          Lỗi: {error}
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
    <div className="flex flex-col flex-1 h-full min-h-0">
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
        <NewAccountModal
          open={isNewAccountOpen}
          onOpenChange={setIsNewAccountOpen}
          onSuccess={fetchPatients}
        />
        <ImportExcelModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchPatients}
        />
      </AdminPageLayout>
    </div>
  );
}
