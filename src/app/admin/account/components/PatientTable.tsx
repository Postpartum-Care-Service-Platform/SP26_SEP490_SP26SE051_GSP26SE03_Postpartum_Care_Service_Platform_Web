'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Eye, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/toast/use-toast';
import familyProfileService from '@/services/family-profile.service';
import roleService from '@/services/role.service';
import userService from '@/services/user.service';
import type { FamilyProfile } from '@/types/family-profile';
import type { Role } from '@/types/role';
import { truncateText } from '@/utils/text';

import { EditFamilyProfileModal } from './EditFamilyProfileModal';
import styles from './patient-table.module.css';
import type { Patient } from './patientTypes';

type Props = {
  patients: Patient[];
  onViewProfile?: (patient: Patient) => void;
  onChat?: (patient: Patient) => void;
  onRoleUpdated?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
};

// Map trạng thái email dựa trên isEmailVerified (true/false) và text status
const getStatusClass = (status: string) => {
  const normalized = status.toLowerCase().trim();

  // Đã xác thực email
  if (normalized === 'true' || normalized === 'stable') {
    return styles.statusStable; // màu tím
  }

  // Chưa xác thực email
  if (normalized === 'false' || normalized === 'under observation') {
    return styles.statusCritical; // màu cam
  }

  return '';
};

// Nhãn hiển thị cho cột trạng thái email
const getStatusLabel = (status: string) => {
  const normalized = status.toLowerCase().trim();

  if (normalized === 'true' || normalized === 'stable') {
    return 'Đã xác thực';
  }

  if (normalized === 'false' || normalized === 'under observation') {
    return 'Chưa xác thực';
  }

  return 'Không rõ';
};

const getRoleLabel = (role: string | null | undefined) => {
  const normalized = (role || '').toLowerCase().trim();
  switch (normalized) {
    case 'admin':
      return 'Quản trị viên';
    case 'staff':
      return 'Nhân viên';
    case 'customer':
      return 'Khách hàng';
    case 'manager':
      return 'Quản lý';
    case 'amenity manager':
    case 'amenity_manager':
    case 'amenity-manager':
      return 'Quản lý tiện ích';
    default:
      return role || 'Chưa cập nhật';
  }
};

const getGenderLabel = (gender: Patient['gender']) => {
  switch (gender) {
    case 'Male':
      return 'Nam';
    case 'Female':
      return 'Nữ';
    default:
      return 'Chưa cập nhật';
  }
};

const getRoleBadgeClass = (role: string | null | undefined) => {
  const normalized = (role || '').toLowerCase().trim();

  switch (normalized) {
    case 'admin':
      return styles.roleBadgeAdmin;
    case 'staff':
      return styles.roleBadgeStaff;
    case 'customer':
      return styles.roleBadgeCustomer;
    case 'manager':
      return styles.roleBadgeManager;
    case 'amenity manager':
    case 'amenity_manager':
    case 'amenity-manager':
      return styles.roleBadgeAmenity;
    default:
      return styles.roleBadgeDefault;
  }
};

const getProfileValue = (value: string | null | undefined) => {
  const normalized = (value || '').trim();
  if (!normalized || normalized.toLowerCase() === 'string') {
    return 'Chưa cập nhật';
  }
  return normalized;
};

const getProfileGenderLabel = (gender: string | null | undefined) => {
  const normalized = (gender || '').toLowerCase().trim();
  if (!normalized) return 'Chưa cập nhật';

  if (normalized === 'male' || normalized === 'nam') return 'Nam';
  if (normalized === 'female' || normalized === 'nu' || normalized === 'nữ') return 'Nữ';

  return 'Chưa cập nhật';
};

export function PatientTable({ patients, onViewProfile, onChat, onRoleUpdated, pagination }: Props) {
  const { toast } = useToast();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [profilesMap, setProfilesMap] = useState<Record<string, FamilyProfile[]>>({});
  const [isLoadingAllProfiles, setIsLoadingAllProfiles] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [updatingRoleByAccountId, setUpdatingRoleByAccountId] = useState<Record<string, boolean>>({});
  const [updatingStatusByAccountId, setUpdatingStatusByAccountId] = useState<Record<string, boolean>>({});
  const [editingProfile, setEditingProfile] = useState<FamilyProfile | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

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
      } catch (_err) {
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.getAllRoles();
        setRoles(data);
      } catch (_err) {
        toast({
          title: 'Không thể tải vai trò',
          variant: 'error',
        });
      }
    };

    fetchRoles();
  }, [toast]);

  const handleSetRole = async (patient: Patient, roleId: number) => {
    if (!patient.accountId || updatingRoleByAccountId[patient.accountId]) return;

    try {
      setUpdatingRoleByAccountId((prev) => ({ ...prev, [patient.accountId]: true }));
      await userService.setRole(patient.accountId, roleId);
      toast({
        title: 'Đổi vai trò thành công',
        variant: 'success',
      });
      onRoleUpdated?.();
    } catch (_err) {
      toast({
        title: 'Đổi vai trò thất bại',
        variant: 'error',
      });
    } finally {
      setUpdatingRoleByAccountId((prev) => ({ ...prev, [patient.accountId]: false }));
    }
  };

  const handleSetAccountStatus = async (patient: Patient, isActive: boolean) => {
    if (!patient.accountId || updatingStatusByAccountId[patient.accountId]) return;

    // Nếu chọn cùng trạng thái hiện tại thì không gọi API
    if ((patient.isActive ?? false) === isActive) return;

    try {
      setUpdatingStatusByAccountId((prev) => ({ ...prev, [patient.accountId]: true }));
      await userService.toggleAccountStatus(patient.accountId);
      toast({
        title: 'Cập nhật trạng thái tài khoản thành công',
        variant: 'success',
      });
      onRoleUpdated?.();
    } catch (_err) {
      toast({
        title: 'Cập nhật trạng thái tài khoản thất bại',
        variant: 'error',
      });
    } finally {
      setUpdatingStatusByAccountId((prev) => ({ ...prev, [patient.accountId]: false }));
    }
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast({
        title: 'Đã sao chép ID',
        description: id,
        variant: 'success',
      });
    } catch (_err) {
      toast({
        title: 'Sao chép thất bại',
        variant: 'error',
      });
    }
  };

  const handleRowClick = (patient: Patient, e: React.MouseEvent) => {
    // Prevent expanding when clicking on interactive cells/actions
    if ((e.target as HTMLElement).closest('[data-stop-row-click="true"]')) {
      return;
    }

    const isExpanded = expandedRows.has(patient.id);

    if (isExpanded) {
      // Nếu đang mở thì đóng lại
      setExpandedRows(new Set());
    } else {
      // Chỉ cho phép 1 hàng mở tại một thời điểm (accordion)
      setExpandedRows(new Set([patient.id]));
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScrollArea}>
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
              <th>Vai trò</th>
              <th>Trạng thái email</th>
              <th>Trạng thái tài khoản</th>
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
                      data-stop-row-click="true"
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
                          <Image
                            src={patient.avatar}
                            alt={patient.name}
                            className={styles.avatarImage}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className={styles.avatar}>
                            {patient.name.charAt(0)}
                          </div>
                        )}
                        <span className={styles.patientNameText}>{patient.name}</span>
                      </div>
                    </td>
                    <td>{patient.username}</td>
                    <td>{patient.email}</td>
                    <td>{patient.dateOfBirth ?? 'Chưa cập nhật'}</td>
                    <td>{getGenderLabel(patient.gender)}</td>
                    <td>{patient.contact}</td>
                    <td title={patient.address} className={styles.truncateCell}>
                      {truncateText(patient.address, 30)}
                    </td>
                    <td data-stop-row-click="true">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={`${styles.roleTrigger} ${getRoleBadgeClass(patient.role)}`}
                            disabled={updatingRoleByAccountId[patient.accountId]}
                          >
                            <span>{getRoleLabel(patient.role)}</span>
                            <ChevronDownIcon width={14} height={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={styles.roleMenu} align="start" sideOffset={4}>
                          {roles.map((role) => (
                            <DropdownMenuItem
                              key={role.id}
                              className={`${styles.roleMenuItem} ${patient.roleId === role.id ? styles.roleMenuItemActive : ''}`}
                              onClick={() => handleSetRole(patient, role.id)}
                            >
                              <span className={`${styles.roleOptionBadge} ${getRoleBadgeClass(role.roleName)}`}>
                                {getRoleLabel(role.roleName)}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(patient.status)}`}>
                        {getStatusLabel(patient.status)}
                      </span>
                    </td>
                    <td data-stop-row-click="true">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className={`${styles.roleTrigger} ${
                              patient.isActive ? styles.statusActive : styles.statusInactive
                            }`}
                            disabled={updatingStatusByAccountId[patient.accountId]}
                          >
                            <span>{patient.isActive ? 'Đang hoạt động' : 'Đã khóa'}</span>
                            <ChevronDownIcon width={14} height={14} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={styles.roleMenu} align="start" sideOffset={4}>
                          <DropdownMenuItem
                            className={styles.roleMenuItem}
                            onClick={() => handleSetAccountStatus(patient, true)}
                          >
                            Đang hoạt động
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={styles.roleMenuItem}
                            onClick={() => handleSetAccountStatus(patient, false)}
                          >
                            Đã khóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td>
                      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.editButton}
                          onClick={() => onViewProfile?.(patient)}
                          aria-label={`Xem hồ sơ ${patient.name}`}
                        >
                          <Eye size={16} color="#3B82F6" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={styles.deleteButton}
                          onClick={() => onChat?.(patient)}
                          aria-label={`Chat với ${patient.name}`}
                        >
                          <MessageCircle size={16} color="#10B981" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={13}>
                        <div className={styles.profilesContainer}>
                          <h4 className={styles.profilesTitle}>Danh sách người giám hộ ({profiles.length})</h4>
                          {isLoadingAllProfiles ? (
                            <div className={styles.loading}>Đang tải...</div>
                          ) : profiles.length === 0 ? (
                            <div className={styles.noProfiles}>Không có profile nào</div>
                          ) : (
                            <div className={styles.profilesTableScrollArea}>
                              <table className={styles.profilesTable}>
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>ID khách hàng</th>
                                    <th>Họ và tên</th>
                                    <th>Vai trò thành viên</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th>Chủ tài khoản</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {profiles.map((profile) => (
                                    <tr key={profile.id}>
                                      <td
                                        title={String(profile.id)}
                                        className={`${styles.truncateCell} ${styles.copyableId}`}
                                        data-stop-row-click="true"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyId(String(profile.id));
                                        }}
                                      >
                                        {truncateText(String(profile.id), 20)}
                                      </td>
                                      <td
                                        title={profile.customerId}
                                        className={`${styles.truncateCell} ${styles.copyableId}`}
                                        data-stop-row-click="true"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyId(profile.customerId);
                                        }}
                                      >
                                        {truncateText(profile.customerId, 20)}
                                      </td>
                                      <td>
                                        <div className={styles.profileNameCell}>
                                          <div className={styles.profileAvatar}>
                                            {profile.avatarUrl ? (
                                              <Image src={profile.avatarUrl} alt={profile.fullName} width={32} height={32} />
                                            ) : (
                                              <span>{getProfileValue(profile.fullName).charAt(0)}</span>
                                            )}
                                          </div>
                                          <span className={styles.profileNameText}>{getProfileValue(profile.fullName)}</span>
                                        </div>
                                      </td>
                                      <td>{getProfileValue(profile.memberTypeName)}</td>
                                      <td>{getProfileValue(profile.dateOfBirth)}</td>
                                      <td>{getProfileGenderLabel(profile.gender)}</td>
                                      <td>{getProfileValue(profile.phoneNumber)}</td>
                                      <td title={getProfileValue(profile.address)} className={styles.truncateCell}>
                                        {truncateText(getProfileValue(profile.address), 40)}
                                      </td>
                                      <td>{profile.isOwner ? 'Có' : 'Không'}</td>
                                      <td>{profile.isDeleted ? 'Đã xóa' : 'Đang hoạt động'}</td>
                                      <td>
                                        <div className={styles.profileActions}>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className={styles.editButton}
                                            aria-label={`Xem profile ${profile.fullName}`}
                                          >
                                            <Eye size={16} color="#3B82F6" />
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className={styles.editButton}
                                            aria-label={`Sửa profile ${profile.fullName}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingProfile(profile);
                                              setEditProfileOpen(true);
                                            }}
                                          >
                                            <Pencil size={16} color="#f59e0b" />
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className={styles.deleteButton}
                                            aria-label={`Xóa profile ${profile.fullName}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteProfile(profile);
                                            }}
                                          >
                                            <Trash2 size={16} color="#ef4444" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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
      </div>
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
      {editingProfile && (
        <EditFamilyProfileModal
          open={editProfileOpen}
          onOpenChange={(open) => {
            setEditProfileOpen(open);
            if (!open) setEditingProfile(null);
          }}
          profile={editingProfile}
          onSuccess={(updated) => {
            setProfilesMap((prev) => {
              const next = { ...prev };
              const key = updated.customerId;
              if (next[key]) {
                next[key] = next[key].map((p) => (p.id === updated.id ? updated : p));
              }
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
