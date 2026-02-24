'use client';

import React from 'react';

import styles from './timeline-view.module.css';

function EpicIcon() {
  return (
    <img
      src="https://vominhtien0511.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10307?size=medium"
      alt="Epic"
      aria-label="Epic"
      draggable={false}
      className={styles.epicIconImg}
    />
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M7.25 8.75V15h1.5V8.75H15v-1.5H8.75V1h-1.5v6.25H1v1.5z" clipRule="evenodd" />
    </svg>
  );
}

const EPICS = [
  'ACSCM-7 Epic 1: User Management & Au...',
  'ACSCM-8 Epic 2: Warehouse & Inventory...',
  'ACSCM-9 Epic 3: Shopping & Budget Ma...',
  'ACSCM-10 Epic 4: Recipe & Cooking Sys...',
  'ACSCM-11 Epic 5: Menu Planning & Meal ...',
  'ACSCM-16 Epic 6: Nutrition & Health Trac...',
  'ACSCM-12 Epic 7: AI & Smart Optimization',
  'ACSCM-13 Epic 8: Reporting & Analytics',
  'ACSCM-14 Epic 9: Notification & Commu...',
];

const MONTHS = [
  { key: '2025-11', label: "November '25" },
  { key: '2025-12', label: "December '25" },
  { key: '2026-01', label: 'January' },
  { key: '2026-02', label: 'February' },
  { key: '2026-03', label: 'March' },
  { key: '2026-04', label: 'April' },
  { key: '2026-05', label: 'May' },
];

export function TimelineView() {
  const [range, setRange] = React.useState<'Weeks' | 'Months' | 'Quarters'>('Months');

  const currentMonthKey = React.useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);
  const [bars, setBars] = React.useState<Record<number, { left: number; width: number }>>({
    1: { left: 450, width: 350 }, 
  });

  const [dragging, setDragging] = React.useState<{
    index: number;
    type: 'move' | 'left' | 'right';
    startX: number;
    startLeft: number;
    startWidth: number;
  } | null>(null);

  const handlePointerDown = (index: number, type: 'move' | 'left' | 'right', e: React.PointerEvent) => {
    e.stopPropagation();
    const bar = bars[index];
    if (!bar) return;

    setDragging({
      index,
      type,
      startX: e.clientX,
      startLeft: bar.left,
      startWidth: bar.width,
    });

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;

    const deltaX = e.clientX - dragging.startX;
    const { index, type, startLeft, startWidth } = dragging;

    setBars((prev) => {
      const bar = prev[index];
      if (!bar) return prev;

      let newLeft = bar.left;
      let newWidth = bar.width;

      if (type === 'move') {
        newLeft = startLeft + deltaX;
      } else if (type === 'left') {
        newLeft = startLeft + deltaX;
        newWidth = startWidth - deltaX;
      } else if (type === 'right') {
        newWidth = startWidth + deltaX;
      }

      // Clamping
      if (newWidth < 20) {
        if (type === 'left') {
          newLeft = startLeft + startWidth - 20;
        }
        newWidth = 20;
      }

      return {
        ...prev,
        [index]: { left: newLeft, width: newWidth },
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragging) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      setDragging(null);
    }
  };

  const handleTrackClick = (index: number, e: React.MouseEvent) => {
    if (bars[index] || dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    setBars(prev => ({
      ...prev,
      [index]: { left: x, width: 100 }
    }));
  };

  // Date mapping: 200px = 1 month (approx 30 days)
  const getLabel = (pixels: number) => {
    const totalDays = (pixels / 200) * 30;
    const date = new Date(2025, 10, 1); // Starting Nov 1 2025
    date.setDate(date.getDate() + Math.round(totalDays));
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.leftHeader}>Work</div>
          <div className={styles.leftBody}>
            <div className={styles.sectionTitle}>Sprints</div>

            {EPICS.map((t, i) => (
              <div key={t} className={styles.row}>
                <input className={styles.checkbox} type="checkbox" aria-label="Select" />
                <span className={styles.epicIcon} aria-hidden="true">
                  <EpicIcon />
                </span>
                <span className={styles.epicText}>{t}</span>
              </div>
            ))}

            <div className={styles.createRow} role="button" tabIndex={0}>
              <PlusIcon />
              <span>Create Epic</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.monthHeader}>
            {MONTHS.map((m) => (
              <div
                key={m.key}
                className={`${styles.monthCell} ${m.key === currentMonthKey ? styles.monthCellCurrent : ''}`}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className={styles.canvas}>
            {EPICS.map((_, i) => (
              <div 
                key={i} 
                className={styles.rowTrack} 
                style={{ top: 40 + (i * 44) }}
                onClick={(e) => handleTrackClick(i, e)}
              >
                {bars[i] && (
                  <div 
                    className={`${styles.bar} ${dragging?.index === i ? styles.barActive : ''}`}
                    style={{ left: bars[i].left, width: bars[i].width }}
                    onPointerDown={(e) => handlePointerDown(i, 'move', e)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                  >
                    <div 
                      className={`${styles.barHandle} ${styles.barHandleLeft}`}
                      onPointerDown={(e) => handlePointerDown(i, 'left', e)}
                    />
                    <div 
                      className={`${styles.barHandle} ${styles.barHandleRight}`}
                      onPointerDown={(e) => handlePointerDown(i, 'right', e)}
                    />
                    
                    <div className={`${styles.badge} ${styles.badgeLeft}`}>
                      {getLabel(bars[i].left)}
                    </div>
                    <div className={`${styles.badge} ${styles.badgeRight}`}>
                      {getLabel(bars[i].left + bars[i].width)} ({Math.round((bars[i].width / 200) * 30)} days)
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className={styles.todayLine} aria-hidden="true" />
          </div>

          <div className={styles.bottomSwitcher} aria-label="Timeline range">
            <button type="button" className={styles.switchBtn}>Today</button>
            <div className={styles.divider} />
            <button
              type="button"
              className={`${styles.switchBtn} ${range === 'Weeks' ? styles.switchBtnActive : ''}`}
              onClick={() => setRange('Weeks')}
            >
              Weeks
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${range === 'Months' ? styles.switchBtnActive : ''}`}
              onClick={() => setRange('Months')}
            >
              Months
            </button>
            <button
              type="button"
              className={`${styles.switchBtn} ${range === 'Quarters' ? styles.switchBtnActive : ''}`}
              onClick={() => setRange('Quarters')}
            >
              Quarters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
