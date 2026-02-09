'use client';

import { useState, useMemo, useEffect } from 'react';

import { Pagination } from '@/components/ui/pagination';
import userService from '@/services/user.service';

import {
  PatientListHeader,
  PatientStatsCards,
  PatientTableControls,
  PatientTable,
  NewAccountModal,
} from './components';
import { mapAccountToPatient } from './components/patientUtils';
import type { Patient } from './components/patientTypes';
import type { PatientStats } from './components/types';

const PAGE_SIZE = 10;

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPatients = async () => {
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
    };

    fetchPatients();
  }, []);

  const stats: PatientStats = useMemo(() => {
    const total = patients.length;
    const stable = patients.filter((p) => p.status === 'Stable').length;
    const observation = patients.filter((p) => p.status === 'Under Observation').length;
    const recovering = patients.filter((p) => p.status === 'Recovering').length;
    const critical = patients.filter((p) => p.status === 'Critical').length;

    return {
      total,
      admitted: stable + observation,
      discharged: recovering,
      pending: observation,
      critical,
      appointmentsToday: 0,
    };
  }, [patients]);

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

    if (statusFilter !== 'all') {
      filtered = filtered.filter((patient) => patient.status === statusFilter);
    }

    if (roleFilter !== null) {
      filtered = filtered.filter((patient) => patient.roleId === roleFilter);
    }

    return filtered;
  }, [patients, searchQuery, statusFilter, roleFilter]);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredPatients.slice(start, end);
  }, [filteredPatients, currentPage]);

  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
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

  const handleEdit = (patient: Patient) => {
    console.log('Edit patient:', patient);
  };

  const handleDelete = (patient: Patient) => {
    console.log('Delete patient:', patient);
  };

  const handleNewPatient = () => {
    console.log('New patient');
  };

  const handleFilter = () => {
    console.log('Filter');
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

  return (
    <div>
      <PatientListHeader />
      <PatientStatsCards stats={stats} />
      <PatientTableControls
        onSearch={handleSearch}
        onFilter={handleFilter}
        onStatusChange={handleStatusChange}
        onRoleChange={handleRoleChange}
        onNewPatient={handleNewPatient}
      />
      <PatientTable
        patients={paginatedPatients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={
          totalPages > 0
            ? {
                currentPage,
                totalPages,
                pageSize: PAGE_SIZE,
                totalItems: filteredPatients.length,
                onPageChange: handlePageChange,
              }
            : undefined
        }
      />
    </div>
  );
}
