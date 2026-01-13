'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

import styles from './breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
  homeHref?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  showHomeIcon = true,
  homeHref = '/',
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn(styles.nav, className)}>
      <ol className={styles.list}>
        {showHomeIcon && (
          <>
            <li className={styles.item}>
              <Link href={homeHref} className={styles.homeLink}>
                <Home className={styles.homeIcon} size={16} />
              </Link>
            </li>
            {items.length > 0 && (
              <li className={styles.separator}>
                <ChevronRight size={14} />
              </li>
            )}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active !== false && isLast;
          const Icon = item.icon;

          return (
            <React.Fragment key={index}>
              <li className={styles.item}>
                {item.href && !isActive ? (
                  <Link href={item.href} className={styles.link}>
                    {Icon && <Icon className={styles.itemIcon} size={16} />}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(styles.text, isActive && styles.textActive)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && <Icon className={styles.itemIcon} size={16} />}
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li className={styles.separator}>
                  <ChevronRight size={14} />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
