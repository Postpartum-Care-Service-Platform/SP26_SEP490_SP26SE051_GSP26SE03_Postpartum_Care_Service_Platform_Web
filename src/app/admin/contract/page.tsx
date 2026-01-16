'use client';

import { useState, useEffect, useMemo } from 'react';
import { ContractListHeader } from './components/ContractListHeader';
import { ContractTableControls } from './components/ContractTableControls';
import { ContractList } from './components/ContractList';
import { ContractCustomerInfo } from './components/ContractCustomerInfo';
import { AddContractModal } from './components/AddContractModal';
import contractService from '@/services/contract.service';
import type { Contract } from '@/types/contract';
import styles from './contract.module.css';

export default function AdminContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('date-newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contractService.getAllContracts();
      setContracts(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const sortedContracts = useMemo(() => {
    const sorted = [...contracts];

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
  }, [contracts, sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
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
          />
          <ContractList
            contracts={sortedContracts}
            selectedContractId={selectedContract?.id || null}
            onSelectContract={handleSelectContract}
            onEdit={(contract) => {
              console.log('Edit contract:', contract);
            }}
            onDelete={(contract) => {
              console.log('Delete contract:', contract);
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
    </div>
  );
}
