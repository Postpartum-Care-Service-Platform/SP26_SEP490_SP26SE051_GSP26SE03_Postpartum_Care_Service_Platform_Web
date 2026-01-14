'use client';

import { useState, useEffect } from 'react';
import { Pencil1Icon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import { truncateText } from '@/utils/text';
import { useToast } from '@/components/ui/toast/use-toast';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import familyProfileService from '@/services/family-profile.service';
import type { FamilyProfile } from '@/types/family-profile';

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
    case 'true':
      return styles.statusStable;
    case 'false':
      return styles.statusCritical;
    default:
      return '';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'true':
      return 'Đã xác thực';
    case 'false':
      return 'Chưa xác thực';
    default:
      return 'Không rõ';
  }
};

export function PatientTable({ patients, onEdit, onDelete, pagination }: Props) {
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [profilesMap, setProfilesMap] = useState<Record<string, FamilyProfile[]>>({});
  const [isLoadingAllProfiles, setIsLoadingAllProfiles] = useState(false);

  // Fetch all profiles once when component mounts
  useEffect(() => {
    const fetchAllProfiles = async () => {
      setIsLoadingAllProfiles(true);
      try {
        const allProfiles = await familyProfileService.getAllFamilyProfiles();
        // Group profiles by customerId
        const groupedProfiles: Record<string, FamilyProfile[]> = {};
        allProfiles.forEach((profile) => {
          if (profile.customerId) {
            if (!groupedProfiles[profile.customerId]) {
              groupedProfiles[profile.customerId] = [];
            }
            groupedProfiles[profile.customerId].push(profile);
          }
        });
        setProfilesMap(groupedProfiles);
      } catch (err) {
        toast({
          title: 'Lỗi tải danh sách profile',
          variant: 'error',
        });
      } finally {
        setIsLoadingAllProfiles(false);
      }
    };

    fetchAllProfiles();
  }, [toast]);

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

  const handleRowClick = (patient: Patient, e: React.MouseEvent) => {
    // Prevent expanding when clicking on action buttons
    if ((e.target as HTMLElement).closest('.actions') || (e.target as HTMLElement).closest('.copyableId')) {
      return;
    }

    const isExpanded = expandedRows.has(patient.id);

    if (isExpanded) {
      // Collapse
      setExpandedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(patient.id);
        return newSet;
      });
    } else {
      // Expand - profiles are already loaded in profilesMap
      setExpandedRows((prev) => new Set(prev).add(patient.id));
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Tên tài khoản</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Trạng thái email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const isExpanded = expandedRows.has(patient.id);
            const profiles = profilesMap[patient.accountId] || [];

            return (
              <>
                <tr
                  key={patient.id}
                  className={styles.expandableRow}
                  onClick={(e) => handleRowClick(patient, e)}
                >
                  <td>
                    <div className={styles.expandIcon}>
                      {isExpanded ? (
                        <ChevronDownIcon width={16} height={16} />
                      ) : (
                        <ChevronRightIcon width={16} height={16} />
                      )}
                    </div>
                  </td>
                  <td
                    title={patient.id}
                    className={`${styles.truncateCell} ${styles.copyableId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyId(patient.id);
                    }}
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
                  <td>{patient.username}</td>
                  <td>{patient.email}</td>
                  <td>{patient.dateOfBirth ?? 'N/A'}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contact}</td>
                  <td title={patient.address} className={styles.truncateCell}>
                    {truncateText(patient.address, 30)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(patient.status)}`}>
                      {getStatusLabel(patient.status)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.editButton}
                        onClick={() => onEdit?.(patient)}
                        aria-label={`Edit ${patient.name}`}
                      >
                        <Pencil1Icon />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.deleteButton}
                        onClick={() => onDelete?.(patient)}
                        aria-label={`Delete ${patient.name}`}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className={styles.expandedRow}>
                    <td colSpan={11}>
                      <div className={styles.profilesContainer}>
                        <h4 className={styles.profilesTitle}>Danh sách Profile ({profiles.length})</h4>
                        {isLoadingAllProfiles ? (
                          <div className={styles.loading}>Đang tải...</div>
                        ) : profiles.length === 0 ? (
                          <div className={styles.noProfiles}>Không có profile nào</div>
                        ) : (
                          <div className={styles.profilesList}>
                            {profiles.map((profile) => (
                              <div key={profile.id} className={styles.profileItem}>
                                <div className={styles.profileAvatar}>
                                  {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.fullName} />
                                  ) : (
                                    <span>{profile.fullName.charAt(0)}</span>
                                  )}
                                </div>
                                <div className={styles.profileInfo}>
                                  <div className={styles.profileName}>{profile.fullName}</div>
                                  <div className={styles.profileDetails}>
                                    <span>Ngày sinh: {profile.dateOfBirth ?? 'N/A'}</span>
                                    <span>Giới tính: {profile.gender ?? 'N/A'}</span>
                                    <span>SĐT: {profile.phoneNumber ?? 'N/A'}</span>
                                    <span>Địa chỉ: {profile.address ?? 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
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

