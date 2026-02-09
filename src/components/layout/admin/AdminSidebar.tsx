'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Plus, Minus, Menu } from 'lucide-react';

import LogoSymbol from '@/assets/images/Symbol-Orange-32x32.png';
import { adminNav, type AdminNavItem } from '@/configs/adminNav';

import styles from './admin-layout.module.css';

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

export function AdminSidebar({ collapsed, onToggleCollapsed }: Props) {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = React.useState<Record<string, boolean>>({ dashboard: true });

  // Auto-expand groups that have active children
  React.useEffect(() => {
    const newOpenKeys = { ...openKeys };
    let changed = false;

    adminNav.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children && !openKeys[item.key]) {
          const hasActiveChild = item.children.some((child) => pathname === child.href);
          if (hasActiveChild) {
            newOpenKeys[item.key] = true;
            changed = true;
          }
        }
      });
    });

    if (changed) {
      setOpenKeys(newOpenKeys);
    }
  }, [pathname]);

  const toggleGroup = (key: string) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemActive = (item: AdminNavItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child) => pathname.startsWith(child.href));
    }
    return false;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarTop}>
        <div className={styles.brand}>
          <Image src={LogoSymbol} alt="Serena Postnatal" width={28} height={28} />
          {!collapsed && <span className={styles.brandText}>Serena Postnatal</span>}
        </div>

        {!collapsed && (
          <button className={styles.iconBtn} type="button" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
            <Menu size={18} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {adminNav.map((section) => (
          <div key={section.key}>
            {section.label ? (
              <div className={collapsed ? styles.collapsedHide : styles.sectionLabel}>{section.label}</div>
            ) : null}

            <div style={{ display: 'grid', gap: 6 }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item);
                const isOpen = !!openKeys[item.key];

                return (
                  <div key={item.key}>
                    {item.children && item.children.length > 0 ? (
                      <button
                        type="button"
                        className={`${styles.item} ${isActive ? styles.itemActive : ''} ${styles.itemWithChildren}`}
                        onClick={() => toggleGroup(item.key)}
                        title={collapsed ? item.label : undefined}
                      >
                        {Icon ? <Icon className={styles.itemIcon} size={18} /> : null}
                        <span className={collapsed ? styles.collapsedHide : ''}>{item.label}</span>
                        {!collapsed ? (
                          <span className={styles.itemChevron}>
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        ) : null}
                      </button>
                    ) : item.href ? (
                      <Link
                        href={item.href}
                        className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                        title={collapsed ? item.label : undefined}
                      >
                        {Icon ? <Icon className={styles.itemIcon} size={18} /> : null}
                        <span className={collapsed ? styles.collapsedHide : ''}>{item.label}</span>
                      </Link>
                    ) : null}

                    {item.children?.length && !collapsed ? (
                      <div className={`${styles.submenu} ${isOpen ? styles.submenuOpen : ''}`}>
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <div key={child.key} className={styles.submenuItem}>
                              <Link
                                href={child.href}
                                className={`${styles.subitem} ${childActive ? styles.subitemActive : ''}`}
                              >
                                {child.label}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

