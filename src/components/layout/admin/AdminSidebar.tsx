'use client';

import { Plus, Minus, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import LogoSymbol from '@/assets/images/Symbol-Orange-32x32.png';

import styles from './admin-layout.module.css';

type NavItem = {
  key: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  children?: Array<{ 
    key: string; 
    label: string; 
    href: string;
    icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  }>;
};

type NavSection = {
  key: string;
  label?: string;
  items: NavItem[];
};

type Props = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  navSections: NavSection[];
  brandText: string;
};

export function AdminSidebar({ collapsed, onToggleCollapsed, navSections, brandText }: Props) {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({ dashboard: true });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true,
    operation: true,
    management: true,
    settings: true,
  });
  const [tooltipPos, setTooltipPos] = useState<{ top: number; label: string } | null>(null);

  // Auto-expand groups that have active children only when the path changes
  React.useEffect(() => {
    setOpenKeys((prev) => {
      const newOpenKeys = { ...prev };
      let changed = false;

      navSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.children) {
            const hasActiveChild = item.children.some((child: { href: string }) => pathname === child.href);
            if (hasActiveChild && !prev[item.key]) {
              newOpenKeys[item.key] = true;
              changed = true;
            }
          }
        });
      });

      return changed ? newOpenKeys : prev;
    });
  }, [pathname, navSections]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleGroup = (key: string) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isItemActive = (item: NavItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child) => pathname.startsWith(child.href));
    }
    return false;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, label: string) => {
    if (collapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + rect.height / 2,
        label: label,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipPos(null);
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.sidebarTop}>
        <div className={styles.brand}>
          <Image src={LogoSymbol} alt="thejoyfulnest" width={28} height={28} />
          {!collapsed && <span className={styles.brandText}>{brandText}</span>}
        </div>

        {!collapsed && (
          <button className={styles.iconBtn} type="button" onClick={onToggleCollapsed} aria-label="Toggle sidebar">
            <Menu size={18} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {navSections.map((section) => {
          const isSectionOpen = !!openSections[section.key];

          return (
            <div key={section.key} className={styles.section}>
              {section.label ? (
                <button
                  type="button"
                  className={`${styles.sectionHeader} ${collapsed ? styles.collapsedHide : ''}`}
                  onClick={() => toggleSection(section.key)}
                >
                  <span className={styles.sectionLabel}>{section.label}</span>
                  <span className={styles.sectionChevron}>
                    {isSectionOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
              ) : null}

              <div className={`${styles.sectionItems} ${isSectionOpen || collapsed ? styles.sectionItemsOpen : ''}`}>
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
                            onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                            onMouseLeave={handleMouseLeave}
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
                            onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                            onMouseLeave={handleMouseLeave}
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
                                    {child.icon && <child.icon size={14} className={styles.subItemIcon} />}
                                    <span>{child.label}</span>
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
            </div>
          );
        })}
      </nav>

      {/* Custom Tooltip */}
      {collapsed && tooltipPos && (
        <div
          className={styles.customTooltip}
          style={{ top: tooltipPos.top }}
        >
          <span>{tooltipPos.label}</span>
        </div>
      )}
    </aside>
  );
}

