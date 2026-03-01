'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useState, useEffect, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown';
import { useToast } from '@/components/ui/toast/use-toast';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

import styles from './patient-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  // sort: date-newest, date-oldest, name-asc, name-desc
  onSortChange?: (sort: string) => void;
  onStatusChange?: (status: string) => void;
  onRoleChange?: (roleId: number | null) => void;
  onNewPatient?: () => void;
};

const FILTER_OPTIONS = [
  { value: 'date-newest', label: 'Ngày tạo: mới nhất' },
  { value: 'date-oldest', label: 'Ngày tạo: cũ nhất' },
  { value: 'name-asc', label: 'Tên khách hàng A-Z' },
  { value: 'name-desc', label: 'Tên khách hàng Z-A' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'true', label: 'Đã xác thực email' },
  { value: 'false', label: 'Chưa xác thực email' },
];

const getRoleLabel = (role: Role | null | undefined) => {
  if (!role) return 'Tất cả vai trò';

  const normalized = role.roleName.toLowerCase().trim();

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
      // Nếu backend đã trả sẵn tên tiếng Việt thì dùng luôn
      return role.roleName || 'Vai trò';
  }
};

export function PatientTableControls({
  onSearch,
  onSortChange,
  onStatusChange,
  onRoleChange,
  onNewPatient,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('date-newest');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    try {
      setLoadingRoles(true);
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (_err) {
      toast({ title: 'Không thể tải danh sách vai trò', variant: 'error' });
    } finally {
      setLoadingRoles(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleRoleSelect = (roleId: number | null) => {
    setSelectedRoleId(roleId);
    onRoleChange?.(roleId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    onSortChange?.(value);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    onStatusChange?.(value);

     // Nếu chọn "Tất cả" thì reset luôn filter vai trò để không lọc gì nữa
     if (value === 'all') {
       setSelectedRoleId(null);
       onRoleChange?.(null);
     }
  };

  const selectedRoleLabel = selectedRoleId
    ? getRoleLabel(roles.find((r) => r.id === selectedRoleId))
    : 'Tất cả vai trò';

  return (
    <div className={styles.controls}>
      <div className={styles.left}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.filterButton}>
              <MixerHorizontalIcon className={styles.filterIcon} />
              Lọc
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            <div className={styles.sectionLabel}>Sắp xếp</div>
            {FILTER_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedFilter === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleFilterSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className={styles.sectionLabel}>Trạng thái email</div>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedStatus === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleStatusSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.roleButton}>
              {selectedRoleLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.roleDropdownContent}>
            <DropdownMenuItem
              className={`${styles.dropdownItem} ${selectedRoleId === null ? styles.dropdownItemActive : ''}`}
              onClick={() => handleRoleSelect(null)}
            >
              Tất cả vai trò
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {loadingRoles ? (
              <div className={styles.loadingRoles}>Đang tải...</div>
            ) : roles.length === 0 ? (
              <div className={styles.loadingRoles}>Chưa có vai trò nào. Quản lý tại trang Cài đặt.</div>
            ) : (
              roles.map((role) => (
                <DropdownMenuItem
                  key={role.id}
                  className={`${styles.roleItem} ${selectedRoleId === role.id ? styles.dropdownItemActive : ''}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <span className={styles.roleItemName}>{getRoleLabel(role)}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.right}>
        <Button variant="primary" size="sm" className={styles.newPatientButton} onClick={onNewPatient}>
          <PlusIcon className={styles.plusIcon} />
          Tài khoản mới
        </Button>
      </div>
    </div>
  );
}

