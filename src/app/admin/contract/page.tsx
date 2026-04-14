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
            {loading ? (
              <div className={styles.loading}>Đang tải danh sách hợp đồng...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : (
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
            )}
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
