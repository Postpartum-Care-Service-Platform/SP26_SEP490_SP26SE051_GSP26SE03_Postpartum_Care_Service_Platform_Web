'use client';

import { useEffect, useMemo, useState } from 'react';

import { Pagination } from '@/components/ui/pagination';
import contractService from '@/services/contract.service';
import type { Contract } from '@/types/contract';

import { AddContractModal } from './components/AddContractModal';
import { ContractCustomerInfo } from './components/ContractCustomerInfo';
import { ContractList } from './components/ContractList';
import { ContractListHeader } from './components/ContractListHeader';
import { ContractTableControls } from './components/ContractTableControls';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

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

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <ContractListHeader />
        <div className={styles.loading}>Đang tải danh sách hợp đồng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <ContractListHeader />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <ContractListHeader />
      <div className={`${styles.columnsContainer} ${selectedContract ? styles.withSidebar : ''}`}>
        <div className={styles.contentColumn}>
          <ContractTableControls
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onAddContract={handleAddContract}
            searchQuery={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
          />
          <ContractList
            contracts={paginatedContracts}
            selectedContractId={selectedContract?.id || null}
            onSelectContract={handleSelectContract}
            onEdit={(contract) => {
              console.log('Edit contract:', contract);
            }}
            onDelete={(contract) => {
              console.log('Delete contract:', contract);
            }}
          />
          {sortedContracts.length > 0 && totalPages > 1 && (
            <div className={styles.paginationWrapper}>
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
            </div>
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
    </div>
  );
}
