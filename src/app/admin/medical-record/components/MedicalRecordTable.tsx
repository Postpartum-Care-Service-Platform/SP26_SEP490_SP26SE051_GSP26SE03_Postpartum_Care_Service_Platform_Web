'use client';

import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import styles from './medical-record-table.module.css';

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

const Trash2OutlineIcon = ({ fill = '#FD6161', size = 16 }: { fill?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" className="eva eva-trash-2-outline" fill={fill}>
    <g data-name="Layer 2">
      <g data-name="trash-2">
        <rect width="24" height="24" opacity="0" />
        <path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z" />
        <path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
        <path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z" />
      </g>
    </g>
  </svg>
);

type Record = {
  id: number;
  patientName: string;
  age: number;
  diagnosis: string;
  date: string;
  status: string;
  doctor: string;
};

type Props = {
  records: Record[];
  onEdit?: (r: Record) => void;
  onDelete?: (r: Record) => void;
};

export function MedicalRecordTable({ records, onEdit, onDelete }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttHeaderCell}>STT</th>
              <th>Bệnh nhân</th>
              <th>Chẩn đoán</th>
              <th>Ngày khám</th>
              <th>Trạng thái</th>
              <th>Bác sĩ phụ trách</th>
              <th className={styles.stickyColHeader}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const statusClass = 
                record.status === 'Hoàn thành' ? styles.statusCompleted : 
                record.status === 'Đang điều trị' ? styles.statusTreating : 
                styles.statusPending;

              return (
                <tr key={record.id}>
                  <td className={styles.sttDataCell}>
                    <span className={styles.sttCell}>{index + 1}</span>
                  </td>
                  <td>
                    <div className={styles.patientInfo}>
                      <div className={styles.avatar}>{record.patientName.charAt(0)}</div>
                      <div>
                        <div className={styles.patientName}>{record.patientName}</div>
                        <div className={styles.patientAge}>{record.age} tuổi</div>
                      </div>
                    </div>
                  </td>
                  <td>{record.diagnosis}</td>
                  <td>{record.date}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      <span className={styles.statusDot} />
                      {record.status}
                    </span>
                  </td>
                  <td>{record.doctor}</td>
                  <td className={styles.stickyCol}>
                    <div className={styles.actions}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit?.(record)}
                      >
                        <Edit2OutlineIcon />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => onDelete?.(record)}
                      >
                        <Trash2OutlineIcon />
                      </Button>
                      <Button variant="ghost" size="sm" className={`${styles.actionButton} ${styles.moreButton}`}>
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
