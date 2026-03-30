'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Eye, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import roleService from '@/services/role.service';
import userService from '@/services/user.service';
import type { Role } from '@/types/role';

import styles from './patient-table.module.css';
import type { Patient } from './patientTypes';

type Props = {
  patients: Patient[];
  onViewProfile?: (patient: Patient) => void;
  onChat?: (patient: Patient) => void;
  onRoleUpdated?: () => void;
  currentPage?: number;
  pageSize?: number;
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


export function PatientTable({
  patients,
  onViewProfile,
  onChat,
  onRoleUpdated,
  currentPage = 1,
  pageSize = 10,
}: Props) {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [updatingRoleByAccountId, setUpdatingRoleByAccountId] = useState<Record<string, boolean>>({});
  const [updatingStatusByAccountId, setUpdatingStatusByAccountId] = useState<Record<string, boolean>>({});

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


  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th title="Số thứ tự">STT</th>
          <th className={styles.avatarHeader}></th>
          <th>Họ và tên</th>
          <th>Tên đăng nhập</th>
          <th>Email</th>
          <th>Ngày sinh</th>
          <th>Giới tính</th>
          <th>Số điện thoại</th>
          <th>Địa chỉ</th>
          <th>Vai trò</th>
          <th>Trạng thái</th>
          <th className={styles.stickyActionsCol}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient, patientIndex) => {
          const patientStt = (currentPage - 1) * pageSize + patientIndex + 1;

          return (
            <tr key={patient.id}>
              <td>{patientStt}</td>
              <td className={styles.avatarCell}>
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
              </td>
              <td className={styles.truncateCell} title={patient.name}>
                <span className={styles.patientNameText}>{patient.name}</span>
              </td>
              <td className={styles.truncateCell} title={patient.username}>
                {patient.username}
              </td>
              <td className={styles.truncateCell} title={patient.email}>
                {patient.email}
              </td>
              <td>{patient.dateOfBirth ?? 'Chưa cập nhật'}</td>
              <td>{getGenderLabel(patient.gender)}</td>
              <td>{patient.contact}</td>
              <td title={patient.address} className={styles.truncateCell}>
                {patient.address}
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
              <td data-stop-row-click="true" className={styles.centerCell}>
                <div className={styles.tooltipWrapper}>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`${styles.plainTrigger} ${patient.isActive ? styles.statusActive : styles.statusInactive}`}
                        disabled={updatingStatusByAccountId[patient.accountId]}
                      >
                        <div className={`${styles.statusIndicator} ${styles.statusAnimated}`}>
                          <span className={styles.statusCircle}></span>
                        </div>
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
                  <span className={styles.tooltip}>
                    {patient.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                  </span>
                </div>
              </td>
              <td className={styles.stickyActionsCol}>
                <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.tooltipWrapper}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.editButton}
                      onClick={() => onViewProfile?.(patient)}
                      aria-label={`Xem hồ sơ ${patient.name}`}
                    >
                      <Eye size={16} color="#3B82F6" />
                    </Button>
                    <span className={styles.tooltip}>Xem hồ sơ</span>
                  </div>
                  <div className={styles.tooltipWrapper}>
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.deleteButton}
                      onClick={() => onChat?.(patient)}
                      aria-label={`Chat với ${patient.name}`}
                    >
                      <MessageCircle size={16} color="#10B981" />
                    </Button>
                    <span className={styles.tooltip}>Chat</span>
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
