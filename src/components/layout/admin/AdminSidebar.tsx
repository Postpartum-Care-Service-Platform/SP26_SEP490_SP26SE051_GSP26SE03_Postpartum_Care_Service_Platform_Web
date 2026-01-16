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
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={`${styles.item} ${isActive ? styles.itemActive : ''} ${item.children && item.children.length > 0 ? styles.itemWithChildren : ''}`}
                        title={collapsed ? item.label : undefined}
                      >
                        {Icon ? <Icon className={styles.itemIcon} size={18} /> : null}
                        <span className={collapsed ? styles.collapsedHide : ''}>{item.label}</span>
                        {item.children && item.children.length > 0 && !collapsed ? (
                          <span className={styles.itemChevron}>
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        ) : null}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.item} ${isActive ? styles.itemActive : ''} ${item.children && item.children.length > 0 ? styles.itemWithChildren : ''}`}
                        onClick={() => toggleGroup(item.key)}
                        title={collapsed ? item.label : undefined}
                      >
                        {Icon ? <Icon className={styles.itemIcon} size={18} /> : null}
                        <span className={collapsed ? styles.collapsedHide : ''}>{item.label}</span>
                        {item.children && item.children.length > 0 && !collapsed ? (
                          <span className={styles.itemChevron}>
                            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                          </span>
                        ) : null}
                      </button>
                    )}

                    {item.children?.length && !collapsed ? (
                      <div className={`${styles.submenu} ${isOpen ? styles.submenuOpen : ''}`}>
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <div key={child.key} className={styles.submenuItem}>
                              <div className={styles.submenuLine}>
                                <div className={`${styles.submenuDot} ${childActive ? styles.submenuDotActive : ''}`} />
                              </div>
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

