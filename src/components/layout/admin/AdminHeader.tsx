'use client';

import { ChevronDown, Menu } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown/Dropdown';
import apiClient from '@/services/apiClient';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

import styles from './admin-layout.module.css';
import { AdminControlPanel } from './AdminControlPanel';
import AdminSettingsSidebar, { type SystemSetting } from './AdminSettingsSidebar';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenNotifications: () => void;
};

const viGroupNames: Record<string, string> = {
  Payment: 'Thanh toán',
  Business: 'Kinh doanh',
  Validation: 'Ràng buộc dữ liệu',
  App: 'Ứng dụng',
  AI: 'AI & trợ lý ảo',
  Auth: 'Xác thực & bảo mật',
  Role: 'Vai trò',
};

export function AdminHeader({ collapsed, onToggleCollapsed, onOpenNotifications }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);

  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [settingsData, rolesData] = await Promise.all([
          apiClient.get('/SystemSetting') as Promise<SystemSetting[]>,
          roleService.getAllRoles(),
        ]);

        if (isMounted) {
          setSettings(settingsData);
          setRoles(rolesData);
        }
      } catch (_err) {
        if (isMounted) {
          setError('Không thể tải cấu hình hệ thống.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const settingsByGroup = useMemo(() => {
    const grouped: Record<string, SystemSetting[]> = {};
    for (const item of settings) {
      const group = item.group || 'Khác';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(item);
    }

    // Gắn group Vai trò từ dữ liệu role của trang tài khoản
    grouped.Role = roles.map((role, idx) => ({
      id: role.id,
      key: `Role.${role.roleName}`,
      value: role.roleName,
      description: role.description || `Vai trò ${idx + 1}`,
      group: 'Role',
      dataType: 'string',
      isEditable: true,
      updatedAt: new Date().toISOString(),
    }));

    Object.keys(grouped).forEach((g) => grouped[g].sort((a, b) => a.key.localeCompare(b.key)));
    return grouped;
  }, [settings, roles]);

  const selectedSettings = useMemo(
    () => (selectedGroupKey ? settingsByGroup[selectedGroupKey] ?? [] : []),
    [selectedGroupKey, settingsByGroup]
  );

  const handleSelectGroup = (groupKey?: string) => {
    if (!groupKey) {
      setMenuOpen(false);
      return;
    }

    setSelectedGroupKey(groupKey);
    setMenuOpen(false);
    setSidebarOpen(true);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            {collapsed && (
              <button className={styles.headerToggleBtn} type="button" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
                <Menu size={18} />
              </button>
            )}
            <div className={styles.actionsGroup}>
              <DropdownMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className={styles.pillButton} type="button" aria-label="Cài đặt">
                    <span>Cài đặt</span>
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.controlDropdownContent} align="start" side="bottom" sideOffset={10}>
                  <AdminControlPanel
                    loading={loading}
                    error={error}
                    settingsByGroup={settingsByGroup}
                    onSelectGroup={handleSelectGroup}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.iconGroup}>
              <NotificationDropdown onViewAll={onOpenNotifications} />
            </div>

            <UserDropdown />
          </div>
        </div>
      </header>

      <AdminSettingsSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        groupKey={selectedGroupKey}
        groupDisplayName={selectedGroupKey ? viGroupNames[selectedGroupKey] ?? selectedGroupKey : ''}
        settings={selectedSettings}
      />
    </>
  );
}
