'use client';

import { CreditCard, Briefcase, ShieldCheck, Monitor, Bot, Lock, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useToast } from '@/components/ui/toast/use-toast';
import apiClient from '@/services/apiClient';
import roleService from '@/services/role.service';
import type { Role } from '@/types/role';

import { SystemSettingsList, SystemSettingsModal } from './components';
import styles from './system.module.css';

export type SystemSetting = {
  id: number;
  key: string;
  value: string;
  description: string;
  group: string;
  dataType: string;
  isEditable: boolean;
  updatedAt: string;
};

const tabs = [
  { key: 'Payment', label: 'Thanh toan', icon: <CreditCard size={16} /> },
  { key: 'Business', label: 'Kinh doanh', icon: <Briefcase size={16} /> },
  { key: 'Validation', label: 'Rang buoc du lieu', icon: <ShieldCheck size={16} /> },
  { key: 'App', label: 'Ung dung', icon: <Monitor size={16} /> },
  { key: 'AI', label: 'AI & tro ly ao', icon: <Bot size={16} /> },
  { key: 'Auth', label: 'Xac thuc & bao mat', icon: <Lock size={16} /> },
  { key: 'Role', label: 'Vai tro', icon: <User size={16} /> },
];

export default function AdminSystemSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [settingsData, rolesData] = await Promise.all([
        apiClient.get('/SystemSetting') as Promise<SystemSetting[]>,
        roleService.getAllRoles(),
      ]);
      setSettings(settingsData);
      setRoles(rolesData);
    } catch (_err) {
      setError('Khong the tai cau hinh he thong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settingsByGroup = useMemo(() => {
    const grouped: Record<string, SystemSetting[]> = {};

    for (const item of settings) {
      const group = item.group || 'Khac';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(item);
    }

    grouped.Role = roles.map((role, idx) => ({
      id: role.id,
      key: `Role.${role.roleName}`,
      value: role.roleName,
      description: role.description || `Vai tro ${idx + 1}`,
      group: 'Role',
      dataType: 'string',
      isEditable: true,
      updatedAt: new Date().toISOString(),
    }));

    Object.keys(grouped).forEach((g) => grouped[g].sort((a, b) => a.key.localeCompare(b.key)));
    return grouped;
  }, [settings, roles]);

  const currentSettings = settingsByGroup[activeTab] || [];

  const handleEdit = (setting: SystemSetting) => {
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingSetting(null);
    }
  };

  const handleUpdateRole = async (role: Role, newRoleName: string) => {
    try {
      await roleService.updateRole(role.id, {
        roleName: newRoleName,
        description: role.description,
      });
      toast({ title: 'Cap nhat vai tro thanh cong', variant: 'success' });
      await fetchData();
    } catch (_err) {
      toast({ title: 'Cap nhat vai tro that bai', variant: 'error' });
    }
  };

  const currentTab = tabs.find((t) => t.key === activeTab);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Cài đặt hệ thống</h4>
        <Breadcrumbs
          items={[{ label: 'Cài đặt hệ thống' }]}
          homeHref="/admin"
        />
      </div>

      <div className={styles.tabs} role="tablist" aria-label="System settings tabs">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className={styles.content}>
          <p>Dang tai du lieu...</p>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <p>{error}</p>
        </div>
      ) : (
        <SystemSettingsList
          settings={currentSettings}
          groupDisplayName={currentTab?.label || activeTab}
          onEdit={handleEdit}
          onUpdateRole={handleUpdateRole}
          roles={roles}
        />
      )}

      <SystemSettingsModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={fetchData}
        settingToEdit={editingSetting}
      />
    </div>
  );
}
