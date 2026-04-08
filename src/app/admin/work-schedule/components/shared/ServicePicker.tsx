'use client';

import Image from 'next/image';
import React from 'react';

import { useToast } from '@/components/ui/toast/use-toast';
import activityService from '@/services/activity.service';
import amenityService from '@/services/amenity-service.service';
import type { Activity } from '@/types/activity';
import type { AmenityService } from '@/types/amenity-service';

import styles from './service-picker.module.css';

type Props = {
  amenityValue: AmenityService | null;
  activityValue: Activity | null;
  onAmenityChange: (value: AmenityService | null) => void;
  onActivityChange: (value: Activity | null) => void;
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

function ActivityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function ServicePicker({
  amenityValue,
  activityValue,
  onAmenityChange,
  onActivityChange,
  onClose,
}: Props) {
  const [query, setQuery] = React.useState('');
  const [amenities, setAmenities] = React.useState<AmenityService[]>([]);
  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [amenityData, activityData] = await Promise.all([
          amenityService.getAllAmenityServices(),
          activityService.getAllActivities()
        ]);
        if (!mounted) return;
        setAmenities(amenityData.filter(a => a.isActive));
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({ title: 'Không thể tải danh sách dịch vụ', variant: 'error' });
        if (!mounted) return;
        setAmenities([]);
        setActivities([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [toast]);

  const groupedActivities = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = activities.filter(a =>
      !q || a.name.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
    );

    const groups: Record<string, Activity[]> = {};
    filtered.forEach(a => {
      const type = a.activityTypeName || 'Khác';
      if (!groups[type]) groups[type] = [];
      groups[type].push(a);
    });
    return groups;
  }, [activities, query]);

  const filteredAmenities = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return amenities;
    return amenities.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    );
  }, [amenities, query]);

  // Phân chia activities thành 3 cột cố định: Center&Home, Home, Center
  const activityCols = React.useMemo(() => {
    const cols: [string, Activity[]][] = [
      ['Center&Home', groupedActivities['Center&Home'] || []],
      ['Home', groupedActivities['Home'] || []],
      ['Center', groupedActivities['Center'] || []],
    ];

    // Xử lý các nhóm khác nếu có
    const otherGroups = Object.entries(groupedActivities).filter(
      ([name]) => !['Center&Home', 'Home', 'Center'].includes(name)
    );

    otherGroups.forEach((entry, idx) => {
      // Thêm vào cột có ít item nhất hoặc chia đều
      const shortestColIdx = cols.reduce((minIdx, col, curIdx) =>
        col[1].length < cols[minIdx][1].length ? curIdx : minIdx, 0
      );
      cols[shortestColIdx][1].push(...entry[1]);
    });

    return cols;
  }, [groupedActivities]);

  return (
    <div
      className={styles.popoverContent}
      role="dialog"
      aria-label="Chọn dịch vụ"
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

      <div className={styles.megaContainer}>
        {/* Left: Activities (3 Columns) */}
        <div className={styles.activitiesSection}>
          <div className={styles.sectionHeader}>HOẠT ĐỘNG CHĂM SÓC</div>
          <div className={styles.activitiesGrid}>
            {activityCols.map(([groupName, items], colIdx) => (
              <div key={colIdx} className={styles.activityColumn}>
                <div key={groupName} className={styles.groupWrapper}>
                  <div className={styles.groupName}>{groupName}</div>
                  {items.map((item: Activity) => (
                    <div
                      key={item.id}
                      className={`${styles.activityItem} ${activityValue?.id === item.id ? styles.selected : ''}`}
                      onClick={() => {
                        onActivityChange(item);
                        onAmenityChange(null);
                        onClose();
                      }}
                    >
                      <ActivityIcon />
                      <span className={styles.itemName}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Amenities (1 Column) */}
        <div className={styles.amenitiesSection}>
          <div className={styles.sectionHeader}>DỊCH VỤ TIỆN ÍCH</div>
          <div className={styles.amenityList}>
            <div
              className={`${styles.amenityItemCompact} ${!amenityValue && !activityValue ? styles.selected : ''}`}
              onClick={() => {
                onAmenityChange(null);
                onActivityChange(null);
                onClose();
              }}
            >
              Tất cả dịch vụ
            </div>
            {filteredAmenities.map((a) => (
              <div
                key={a.id}
                className={`${styles.amenityItemCompact} ${amenityValue?.id === a.id ? styles.selected : ''}`}
                onClick={() => {
                  onAmenityChange(a);
                  onActivityChange(null);
                  onClose();
                }}
              >
                {a.imageUrl ? (
                  <Image src={a.imageUrl} alt="" width={20} height={20} className={styles.amenityImg} />
                ) : (
                  <div className={styles.amenityIconPlaceholder}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                  </div>
                )}
                <div className={styles.amenityText}>
                  <div className={styles.amenityName}>{a.name}</div>
                  <div className={styles.amenityDesc}>{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
