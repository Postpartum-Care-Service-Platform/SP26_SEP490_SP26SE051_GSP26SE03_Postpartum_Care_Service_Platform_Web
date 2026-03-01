'use client';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

import styles from './medical-history-table.module.css';

const Edit2OutlineIcon = ({ fill = '#A47BC8', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-edit-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="edit-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
        <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z" />
      </g>
    </g>
  </svg>
);

type MedicalHistory = {
  id: number;
  date: string;
  diagnosis: string;
  treatment: string;
  status: 'ongoing' | 'follow-up' | 'recovered';
  doctor: string;
};

const mockData: MedicalHistory[] = [
  {
    id: 1,
    date: '12 Sep 2025',
    diagnosis: 'Type 2 Diabetes',
    treatment: 'Insulin Therapy',
    status: 'ongoing',
    doctor: 'Dr. Neha Patel',
  },
  {
    id: 2,
    date: '15 Aug 2025',
    diagnosis: 'Hypertension',
    treatment: 'Beta Blockers',
    status: 'follow-up',
    doctor: 'Dr. Amit Sharma',
  },
  {
    id: 3,
    date: '20 Jul 2025',
    diagnosis: 'Asthma',
    treatment: 'Inhaler',
    status: 'recovered',
    doctor: 'Dr. Neha Patel',
  },
  {
    id: 4,
    date: '05 Jun 2025',
    diagnosis: 'Migraine',
    treatment: 'Pain Management Therapy',
    status: 'ongoing',
    doctor: 'Dr. Amit Sharma',
  },
  {
    id: 5,
    date: '18 May 2025',
    diagnosis: 'Fractured Arm',
    treatment: 'Cast + Physiotherapy',
    status: 'recovered',
    doctor: 'Dr. Neha Patel',
  },
];

const getStatusBadgeClass = (status: MedicalHistory['status']) => {
  switch (status) {
    case 'ongoing':
      return styles.statusOngoing;
    case 'follow-up':
      return styles.statusFollowUp;
    case 'recovered':
      return styles.statusRecovered;
    default:
      return '';
  }
};

const getStatusLabel = (status: MedicalHistory['status']) => {
  switch (status) {
    case 'ongoing':
      return 'Ongoing';
    case 'follow-up':
      return 'Follow-up';
    case 'recovered':
      return 'Recovered';
    default:
      return status;
  }
};

export function MedicalHistoryTable() {
  const currentPage = 1;
  const totalPages = 3;
  const pageSize = 5;
  const totalItems = 12;

  const handlePageChange = (page: number) => {
    console.log('Page changed:', page);
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  return (
    <div className={styles.tableWrapper}>
      <h5 className={styles.title}>Medical History</h5>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Diagnosis</th>
            <th>Treatment</th>
            <th>Status</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockData.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.emptyState}>
                Chưa có dữ liệu
              </td>
            </tr>
          ) : (
            mockData.map((record) => (
              <tr key={record.id} className={styles.tableRow}>
                <td>{record.date}</td>
                <td className={styles.diagnosis}>{record.diagnosis}</td>
                <td>{record.treatment}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(record.status)}`}>
                    {getStatusLabel(record.status)}
                  </span>
                </td>
                <td>{record.doctor}</td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${styles.editButton} btn-icon btn-sm`}
                      onClick={() => handleEdit(record.id)}
                      aria-label={`Chỉnh sửa ${record.diagnosis}`}
                    >
                      <Edit2OutlineIcon fill="#A47BC8" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 0 && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            showResultCount={true}
          />
        </div>
      )}
    </div>
  );
}
