'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown/Dropdown';

import styles from './column-actions-dropdown.module.css';

type Props = {
  columnLabel: string;
};

function MoreIcon() {
  return (
    <svg fill="none" viewBox="0 0 16 16" role="presentation" width="11.99" height="11.99" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m6.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M13 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" clipRule="evenodd" />
    </svg>
  );
}

export function ColumnActionsDropdown({ columnLabel }: Props) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <DropdownMenu modal={false}>
          <Tooltip.Trigger asChild>
            <DropdownMenuTrigger asChild>
              <button type="button" className={styles.trigger} aria-label={`More actions for ${columnLabel}`}>
                <span className={styles.icon} aria-hidden="true">
                  <MoreIcon />
                </span>
              </button>
            </DropdownMenuTrigger>
          </Tooltip.Trigger>

          <Tooltip.Portal>
            <Tooltip.Content className={styles.tooltip} sideOffset={6}>
              More actions for {columnLabel}
              <Tooltip.Arrow className={styles.tooltipArrow} />
            </Tooltip.Content>
          </Tooltip.Portal>

          <DropdownMenuContent className={styles.menu} align="start" sideOffset={6}>
            <div className={styles.menuSectionTitle}>Sort by columns</div>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={styles.subTrigger}>Type</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className={styles.subMenu} sideOffset={6}>
                <DropdownMenuItem className={styles.menuItem}>Sort A to Z</DropdownMenuItem>
                <DropdownMenuItem className={styles.menuItem}>Sort Z to A</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={styles.subTrigger}>Work item key</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className={styles.subMenu} sideOffset={6}>
                <DropdownMenuItem className={styles.menuItem}>Sort A to Z</DropdownMenuItem>
                <DropdownMenuItem className={styles.menuItem}>Sort Z to A</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={styles.subTrigger}>Summary</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className={styles.subMenu} sideOffset={6}>
                <DropdownMenuItem className={styles.menuItem}>Sort A to Z</DropdownMenuItem>
                <DropdownMenuItem className={styles.menuItem}>Sort Z to A</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem className={styles.menuItem}>Freeze column</DropdownMenuItem>
            <DropdownMenuItem className={styles.menuItem}>Resize column</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
