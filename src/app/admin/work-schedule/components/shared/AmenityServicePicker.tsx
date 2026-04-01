'use client';

import Image from 'next/image';
import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import amenityService from '@/services/amenity-service.service';
import type { AmenityService } from '@/types/amenity-service';

import styles from './amenity-service-picker.module.css';

type Props = {
  value: AmenityService | null;
  onChange: (value: AmenityService | null) => void;
  onClose: () => void;
};

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM1 7a6 6 0 1 1 10.244 4.244l2.256 2.256a.75.75 0 1 1-1.06 1.06l-2.256-2.256A6 6 0 0 1 1 7Z"
        fill="#6B778C"
      />
    </svg>
  );
}

export function AmenityServicePicker({
  value,
  onChange,
  onClose,
}: Props) {
  const [query, setQuery] = React.useState('');
  const [amenities, setAmenities] = React.useState<AmenityService[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    let mounted = true;

    async function fetchAmenities() {
      setIsLoading(true);
      try {
        const data = await amenityService.getAllAmenityServices();
        if (!mounted) return;
        setAmenities(data.filter(a => a.isActive));
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
        toast({ title: 'Không thể tải danh sách dịch vụ tiện ích', variant: 'error' });
        if (!mounted) return;
        setAmenities([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchAmenities();

    return () => {
      mounted = false;
    };
  }, [toast]);

  const filteredAmenities = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return amenities;
    return amenities.filter((a) => 
      a.name.toLowerCase().includes(q) || 
      a.description?.toLowerCase().includes(q)
    );
  }, [amenities, query]);

  function handleSelect(a: AmenityService) {
    onChange(a);
    onClose();
  }

  return (
    <div
      className={styles.popoverContent}
      role="dialog"
      aria-label="Chọn dịch vụ tiện ích"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.searchWrapper}>
        <div className={styles.searchInputWrapper}>
          <SearchIcon />
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm dịch vụ..."
          />
          {query && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className={styles.amenityList}>
        {isLoading && <div className={styles.amenityItem}>Đang tải...</div>}
        {!isLoading && (
          <>
            {!query && (
              <div
                className={`${styles.amenityItem} ${value === null ? styles.selected : ''}`}
                onClick={() => {
                  onChange(null);
                  onClose();
                }}
                role="button"
                tabIndex={0}
              >
                <div className={styles.iconWrapper}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
                <div className={styles.amenityInfo}>
                  <div className={styles.amenityName}>Tất cả tiện ích</div>
                </div>
              </div>
            )}
            {filteredAmenities.map((a) => {
              const selected = value?.id === a.id;

              return (
                <div
                  key={a.id}
                  className={`${styles.amenityItem} ${selected ? styles.selected : ''}`}
                  onClick={() => handleSelect(a)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.iconWrapper}>
                    {a.imageUrl ? (
                      <Image 
                        src={a.imageUrl} 
                        alt="" 
                        width={24} 
                        height={24} 
                        className={styles.amenityImage} 
                      />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    )}
                  </div>

                  <div className={styles.amenityInfo}>
                    <div className={styles.amenityName}>{a.name}</div>
                    {a.description && (
                      <div className={styles.amenityDescription}>{a.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
            {!isLoading && filteredAmenities.length === 0 && query && (
               <div className={styles.amenityItem} style={{ color: '#6B778C', fontSize: '12px' }}>
                 Không tìm thấy dịch vụ nào
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
