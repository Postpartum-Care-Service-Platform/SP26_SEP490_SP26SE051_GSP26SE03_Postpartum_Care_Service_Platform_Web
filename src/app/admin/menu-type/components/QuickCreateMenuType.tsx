'use client';

import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import menuTypeService from '@/services/menu-type.service';
import type { CreateMenuTypeRequest } from '@/types/menu-type';

import styles from '../../work-schedule/components/list/work-schedule-list.module.css';

type Props = {
  onCreated?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

export function QuickCreateMenuType({ onCreated, open, onOpenChange, hideTrigger = false }: Props) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isNameActive, setIsNameActive] = React.useState(false);
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const isControlled = typeof open === 'boolean' && typeof onOpenChange === 'function';
  const isOpen = isControlled ? (open as boolean) : internalOpen;
  const setIsOpen = isControlled ? (onOpenChange as (open: boolean) => void) : setInternalOpen;

  const canSubmit = name.trim() && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload: CreateMenuTypeRequest = {
      name: name.trim(),
      isActive: true,
    };

    try {
      setIsSubmitting(true);
      await menuTypeService.createMenuType(payload);
      setName('');
      setIsOpen(false);
      onCreated?.();
      toast({ title: 'Tạo loại thực đơn thành công', variant: 'success' });
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: unknown }).message)
          : '';
      toast({ title: message || 'Tạo loại thực đơn thất bại. Vui lòng thử lại.', variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (footerRef.current && !footerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen && hideTrigger) {
    return null;
  }

  if (!isOpen) {
    return (
      <div
        className={styles.footer}
        style={{ border: 'none', marginTop: 0, justifyContent: 'center' }}
      >
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setIsOpen(true)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tạo loại thực đơn nhanh</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={footerRef}
      className={`${styles.footer} ${styles.footerHasInput}`}
      style={{
        marginTop: 0,
        border: 'none',
      }}
    >
      <div className={styles.createTaskInner}>
        <div className={styles.nameFieldWrapper}>
          <span className={styles.nameFieldIcon} aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4H20V6H4V4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 8H18V20H6V8Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tên loại thực đơn"
            className={styles.createInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsNameActive(true)}
            onBlur={(e) => setIsNameActive(!!e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            style={{ paddingLeft: 24 }}
          />
          <div className={isNameActive ? styles.nameFieldLineActive : styles.nameFieldLine} />
        </div>

        <div className={styles.createActions}>
          <div className={styles.submitBtnGroup}>
            <button
              type="button"
              className={styles.submitBtn}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <span>{isSubmitting ? 'Đang tạo...' : 'Tạo loại thực đơn'}</span>
              {!isSubmitting && (
                <span className={styles.enterIconWrapper}>
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 0C1.34315 0 0 1.34315 0 3V13C0 14.6569 1.34315 16 3 16H21C22.6569 16 24 14.6569 24 13V3C24 1.34315 22.6569 0 21 0H3Z"
                      fill="var(--ds-background-inverse-subtle, #00000029)"
                    />
                    <path
                      d="M15.5 5.75V6.75C15.5 8.26878 14.2688 9.5 12.75 9.5H8.75C8.33579 9.5 8 9.16421 8 8.75C8 8.33579 8.33579 8 8.75 8H12.75C13.4404 8 14 7.44036 14 6.75V5.75C14 5.33579 14.3358 5 14.75 5C15.1642 5 15.5 5.33579 15.5 5.75Z"
                      fill="var(--ds-text-inverse, #FFFFFF)"
                    />
                    <path
                      d="M9.28033 9.28033L11.0303 7.53033C11.3232 7.23744 11.3232 6.76256 11.0303 6.46967C10.7374 6.17678 10.2626 6.17678 9.96967 6.46967L8.21967 8.21967C7.92678 8.51256 7.92678 8.98744 8.21967 9.28033C8.51256 9.57322 8.98744 9.57322 9.28033 9.28033Z"
                      fill="var(--ds-text-inverse, #FFFFFF)"
                    />
                    <path
                      d="M9.28033 8.21967L11.0303 9.96967C11.3232 10.2626 11.3232 10.7374 11.0303 11.0303C10.7374 11.3232 10.2626 11.3232 9.96967 11.0303L8.21967 9.28033C7.92678 8.98744 7.92678 8.51256 8.21967 8.21967C8.51256 7.92678 8.98744 7.92678 9.28033 8.21967Z"
                      fill="var(--ds-text-inverse, #FFFFFF)"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

