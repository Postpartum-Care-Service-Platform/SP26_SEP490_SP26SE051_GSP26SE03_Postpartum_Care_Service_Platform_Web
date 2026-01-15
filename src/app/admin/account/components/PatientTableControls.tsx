'use client';

import { MagnifyingGlassIcon, PlusIcon, MixerHorizontalIcon, ChevronDownIcon, Pencil1Icon, TrashIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useState, useEffect, useRef } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';
import { useToast } from '@/components/ui/toast/use-toast';

import styles from './patient-table-controls.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onFilter?: (filter: string) => void;
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

export function PatientTableControls({
  onSearch,
  onFilter,
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
  const [savingRoleId, setSavingRoleId] = useState<number | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [creatingRole, setCreatingRole] = useState(false);
  const [editRoleName, setEditRoleName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (err: any) {
      toast({ title: 'Không thể tải danh sách vai trò', variant: 'error' });
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleRoleSelect = (roleId: number | null) => {
    setSelectedRoleId(roleId);
    onRoleChange?.(roleId);
  };

  const handleStartEdit = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRoleId(role.id);
    setEditRoleName(role.roleName);
    setEditDescription(role.description || '');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditRoleName('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editingRoleId || !editRoleName.trim()) {
      return;
    }

    try {
      setSavingRoleId(editingRoleId);
      const updated = await roleService.updateRole(editingRoleId, {
        roleName: editRoleName.trim(),
        description: editDescription,
      });
      setRoles((prev) => prev.map((r) => (r.id === editingRoleId ? updated : r)));
      toast({ title: 'Cập nhật vai trò thành công', variant: 'success' });
      setEditingRoleId(null);
      setEditRoleName('');
      setEditDescription('');
    } catch (err: any) {
      toast({ title: err?.message || 'Cập nhật vai trò thất bại', variant: 'error' });
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleStartCreate = () => {
    setCreatingRole(true);
    setNewRoleName('');
    setNewDescription('');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleCancelCreate = () => {
    setCreatingRole(false);
    setNewRoleName('');
    setNewDescription('');
  };

  const handleSaveCreate = async () => {
    if (!newRoleName.trim()) {
      return;
    }

    try {
      const created = await roleService.createRole({
        roleName: newRoleName.trim(),
        description: newDescription,
      });
      setRoles((prev) => [created, ...prev]);
      toast({ title: 'Tạo vai trò thành công', variant: 'success' });
      setCreatingRole(false);
      setNewRoleName('');
      setNewDescription('');
    } catch (err: any) {
      toast({ title: err?.message || 'Tạo vai trò thất bại', variant: 'error' });
    }
  };

  const handleDeleteRole = async (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSavingRoleId(role.id);
      await roleService.deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      if (selectedRoleId === role.id) {
        setSelectedRoleId(null);
        onRoleChange?.(null);
      }
      toast({ title: 'Xóa vai trò thành công', variant: 'success' });
    } catch (err: any) {
      toast({ title: err?.message || 'Xóa vai trò thất bại', variant: 'error' });
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    onFilter?.(value);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    onStatusChange?.(value);
  };

  const selectedStatusLabel = STATUS_OPTIONS.find((opt) => opt.value === selectedStatus)?.label || 'Tất cả';
  const selectedRoleLabel = selectedRoleId
    ? roles.find((r) => r.id === selectedRoleId)?.roleName || 'Vai trò'
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
            {FILTER_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedFilter === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleFilterSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
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
            ) : (
              roles.map((role) => (
                <div key={role.id} className={styles.roleItemWrapper}>
                  {editingRoleId === role.id ? (
                    <div className={styles.roleEditForm} onClick={(e) => e.stopPropagation()}>
                      <input
                        ref={nameInputRef}
                        type="text"
                        className={styles.roleEditInput}
                        value={editRoleName}
                        onChange={(e) => setEditRoleName(e.target.value)}
                        placeholder="Tên vai trò"
                      />
                      <input
                        type="text"
                        className={styles.roleEditInput}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Mô tả"
                      />
                      <div className={styles.roleEditActions}>
                        <button
                          className={styles.roleSaveButton}
                          onClick={handleSaveEdit}
                          disabled={!editRoleName.trim() || savingRoleId === role.id}
                        >
                          <CheckIcon />
                        </button>
                        <button
                          className={styles.roleCancelButton}
                          onClick={handleCancelEdit}
                          disabled={savingRoleId === role.id}
                        >
                          <Cross2Icon />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <DropdownMenuItem
                      className={`${styles.roleItem} ${selectedRoleId === role.id ? styles.dropdownItemActive : ''}`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <span className={styles.roleItemName}>{role.roleName}</span>
                      <div className={styles.roleItemActions} onClick={(e) => e.stopPropagation()}>
                        <button
                          className={styles.roleActionButton}
                          onClick={(e) => handleStartEdit(role, e)}
                          disabled={savingRoleId === role.id || creatingRole}
                          aria-label={`Chỉnh sửa ${role.roleName}`}
                        >
                          <Pencil1Icon />
                        </button>
                        <button
                          className={styles.roleActionButton}
                          onClick={(e) => handleDeleteRole(role, e)}
                          disabled={savingRoleId === role.id || creatingRole}
                          aria-label={`Xóa ${role.roleName}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </DropdownMenuItem>
                  )}
                </div>
              ))
            )}
            <DropdownMenuSeparator />
            {creatingRole ? (
              <div className={styles.roleCreateForm} onClick={(e) => e.stopPropagation()}>
                <input
                  ref={nameInputRef}
                  type="text"
                  className={styles.roleEditInput}
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Tên vai trò"
                />
                <input
                  type="text"
                  className={styles.roleEditInput}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Mô tả"
                />
                <div className={styles.roleEditActions}>
                  <button
                    className={styles.roleSaveButton}
                    onClick={handleSaveCreate}
                    disabled={!newRoleName.trim()}
                  >
                    <CheckIcon />
                  </button>
                  <button
                    className={styles.roleCancelButton}
                    onClick={handleCancelCreate}
                  >
                    <Cross2Icon />
                  </button>
                </div>
              </div>
            ) : (
              <DropdownMenuItem className={styles.createRoleItem} onClick={handleStartCreate}>
                <PlusIcon className={styles.plusIcon} />
                Thêm vai trò mới
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.right}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.statusButton}>
              {selectedStatusLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${selectedStatus === option.value ? styles.dropdownItemActive : ''}`}
                onClick={() => handleStatusSelect(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="primary" size="sm" className={styles.newPatientButton} onClick={onNewPatient}>
          <PlusIcon className={styles.plusIcon} />
          Tài khoản mới
        </Button>
      </div>
    </div>
  );
}

