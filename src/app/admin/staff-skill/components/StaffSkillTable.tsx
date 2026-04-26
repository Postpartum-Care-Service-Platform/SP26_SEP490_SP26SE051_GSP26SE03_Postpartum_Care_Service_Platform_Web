'use client';

import { Button } from '@/components/ui/button';
import { Edit, Trash2, CheckCircle2 } from 'lucide-react';
import styles from './staff-skill-table.module.css';

type StaffSkill = {
  id: number;
  staffName: string;
  role: string;
  skill: string;
  level: string;
  lastUpdated: string;
  progress: number;
};

type Props = {
  skills: StaffSkill[];
  onEdit?: (s: StaffSkill) => void;
  onDelete?: (s: StaffSkill) => void;
  onConfirm?: (s: StaffSkill) => void;
};

export function StaffSkillTable({ skills, onEdit, onDelete, onConfirm }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.scrollContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.sttHeaderCell}>STT</th>
              <th>Nhân viên</th>
              <th>Kỹ năng chuyên môn</th>
              <th>Cấp độ</th>
              <th>Đánh giá năng lực</th>
              <th className={styles.stickyColHeader}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((item, index) => {
              const levelClass = 
                item.level === 'Expert' ? styles.levelExpert : 
                item.level === 'Advanced' ? styles.levelAdvanced : 
                styles.levelBasic;

              return (
                <tr key={item.id}>
                  <td className={styles.sttDataCell}>
                    <span className={styles.sttCell}>{index + 1}</span>
                  </td>
                  <td>
                    <div className={styles.staffInfo}>
                      <div className={styles.avatar}>{item.staffName.split(' ').pop()?.charAt(0)}</div>
                      <div>
                        <div className={styles.staffName}>{item.staffName}</div>
                        <div className={styles.staffRole}>{item.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.skillInfo}>
                      <div className={styles.skillName}>{item.skill}</div>
                      <div className={styles.skillUpdated}>Cập nhật: {item.lastUpdated}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.levelBadge} ${levelClass}`}>
                      {item.level}
                    </span>
                  </td>
                  <td>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className={styles.progressText}>{item.progress}%</span>
                    </div>
                  </td>
                  <td className={styles.stickyCol}>
                    <div className={styles.actions}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${styles.actionButton} ${styles.confirmButton}`}
                        onClick={() => onConfirm?.(item)}
                        title="Xác nhận đánh giá"
                      >
                        <CheckCircle2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => onEdit?.(item)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => onDelete?.(item)}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
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
