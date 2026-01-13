'use client';

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { truncateText } from '@/utils/text';
import { useToast } from '@/components/ui/toast/use-toast';
import { Pagination } from '@/components/ui/pagination';

import type { Patient } from './patientTypes';

import styles from './patient-table.module.css';

type Props = {
  patients: Patient[];
  onEdit?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Stable':
      return styles.statusStable;
    case 'Under Observation':
      return styles.statusObservation;
    case 'Recovering':
      return styles.statusRecovering;
    case 'Critical':
      return styles.statusCritical;
    default:
      return '';
  }
};

export function PatientTable({ patients, onEdit, onDelete, pagination }: Props) {
  const { toast } = useToast();

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast({
        title: 'Đã sao chép ID',
        description: id,
        variant: 'success',
      });
    } catch (err) {
      toast({
        title: 'Sao chép thất bại',
        variant: 'error',
      });
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td
                title={patient.id}
                className={`${styles.truncateCell} ${styles.copyableId}`}
                onClick={() => handleCopyId(patient.id)}
              >
                {truncateText(patient.id, 20)}
              </td>
              <td>
                <div className={styles.patientName}>
                  {patient.avatar ? (
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatar}>
                      {patient.name.charAt(0)}
                    </div>
                  )}
                  <span>{patient.name}</span>
                </div>
              </td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.contact}</td>
              <td title={patient.address} className={styles.truncateCell}>
                {truncateText(patient.address, 30)}
              </td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(patient.status)}`}>
                  {patient.status}
                </span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => onEdit?.(patient)}
                    aria-label={`Edit ${patient.name}`}
                  >
                    <Pencil1Icon />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete?.(patient)}
                    aria-label={`Delete ${patient.name}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && pagination.totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={pagination.onPageChange}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}

