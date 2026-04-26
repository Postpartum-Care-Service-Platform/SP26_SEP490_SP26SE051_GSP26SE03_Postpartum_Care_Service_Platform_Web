'use client';

import { useEffect, useMemo, useState } from 'react';

import { Pagination } from '@/components/ui/pagination';
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal';
import { useToast } from '@/components/ui/toast/use-toast';
import contractService from '@/services/contract.service';
import type { Contract } from '@/types/contract';

import { AddContractModal } from './components/AddContractModal';
import { ImportContractModal } from './ImportContractModal';
import { ContractCustomerInfo } from './components/ContractCustomerInfo';
import { ContractList } from './components/ContractList';
import { ContractTableControls } from './components/ContractTableControls';
import { ContractHeader } from './components/ContractHeader';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import styles from './contract.module.css';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallbackMessage;
};

// Internal Premium Skeleton Component for consistent look
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

export default function AdminContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('date-newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Contract | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await contractService.exportContracts();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setActionId(itemToDelete.id);
      await contractService.deleteContract(itemToDelete.id);
      await fetchContracts();
      toast({ title: 'Xóa hợp đồng thành công', variant: 'success' });
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xóa hợp đồng thất bại'), variant: 'error' });
    } finally {
      setActionId(null);
      setItemToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = await contractService.getAllContracts();
      setContracts(data);
      setCurrentPage(1);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Không thể tải danh sách hợp đồng'));
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = useMemo(() => {
    if (!searchQuery.trim()) return contracts;
    const lowerQuery = searchQuery.toLowerCase();
    return contracts.filter((c) =>
      c.contractCode.toLowerCase().includes(lowerQuery) ||
      c.customer?.username?.toLowerCase().includes(lowerQuery) ||
      c.customer?.email?.toLowerCase().includes(lowerQuery)
    );
  }, [contracts, searchQuery]);

  const sortedContracts = useMemo(() => {
    const sorted = [...filteredContracts];

    switch (sortBy) {
      case 'date-newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'date-oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'code-asc':
        return sorted.sort((a, b) => a.contractCode.localeCompare(b.contractCode));
      case 'code-desc':
        return sorted.sort((a, b) => b.contractCode.localeCompare(a.contractCode));
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sorted;
    }
  }, [filteredContracts, sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleAddContract = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    fetchContracts();
  };

  const handleSelectContract = (contract: Contract) => {
    if (selectedContract?.id === contract.id) {
      setSelectedContract(null);
    } else {
      setSelectedContract(contract);
    }
  };

  const handleCloseCustomerInfo = () => {
    setSelectedContract(null);
  };

  const paginatedContracts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedContracts.slice(start, end);
  }, [sortedContracts, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedContracts.length / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Area Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={320} height={42} />
              <SkeletonBone width={180} height={42} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={120} height={42} />
              <SkeletonBone width={100} height={42} />
              <SkeletonBone width={120} height={42} />
            </div>
          </div>

          {/* Table Area Placeholder */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="60%" height={16} />
                </div>
                <div style={{ flex: 2 }}>
                  <SkeletonBone width="80%" height={16} />
                </div>
                <SkeletonBone width={100} height={32} />
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
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<ContractHeader />}
        controlPanel={
          <ContractTableControls
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onAddContract={handleAddContract}
            onImportClick={() => setIsImportModalOpen(true)}
            onExportClick={handleExport}
            searchQuery={searchQuery}
            onSearchChange={(val: string) => { setSearchQuery(val); setCurrentPage(1); }}
          />
        }
        pagination={
          sortedContracts.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedContracts.length}
              onPageChange={handlePageChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              showResultCount={true}
            />
          ) : null
        }
      >
        <div className={`${styles.columnsContainer} ${selectedContract ? styles.withSidebar : ''}`}>
          <div className={styles.contentColumn}>
            <ContractList
              contracts={paginatedContracts}
              selectedContractId={selectedContract?.id || null}
              onSelectContract={handleSelectContract}
              onEdit={(contract) => {
                console.log('Edit contract:', contract);
              }}
              onDelete={(contract) => {
                setItemToDelete(contract);
                setIsConfirmModalOpen(true);
              }}
            />
          </div>
          {selectedContract && (
            <ContractCustomerInfo
              customer={selectedContract.customer}
              onClose={handleCloseCustomerInfo}
            />
          )}
        </div>

        <AddContractModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSuccess={handleAddSuccess}
        />

        <ImportContractModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchContracts}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa hợp đồng"
          message={`Bạn có chắc chắn muốn xóa hợp đồng "${itemToDelete?.contractCode}"? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa ngay"
          cancelLabel="Suy nghĩ lại"
          variant="danger"
        />
      </AdminPageLayout>
    </div>
  );
}
