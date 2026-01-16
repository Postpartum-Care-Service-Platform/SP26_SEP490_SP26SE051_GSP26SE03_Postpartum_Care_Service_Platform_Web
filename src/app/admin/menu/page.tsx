'use client';

import { useState, useEffect } from 'react';
import { MenuListHeader } from './components/MenuListHeader';
import { MenuList } from './components/MenuList';
import menuService from '@/services/menu.service';
import type { Menu } from '@/types/menu';
import styles from './menu.module.css';

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách thực đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu: Menu) => {
    console.log('Edit menu:', menu);
  };

  const handleDelete = (menu: Menu) => {
    console.log('Delete menu:', menu);
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <MenuListHeader />
        <div className={styles.loading}>Đang tải danh sách thực đơn...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <MenuListHeader />
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <MenuListHeader />
      <MenuList
        menus={menus}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

