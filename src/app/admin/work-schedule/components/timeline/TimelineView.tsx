'use client';

import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import Epic16Icon from '../list/artifacts/glyph/epic/16';

import styles from './timeline-view.module.css';

function EpicIcon() {
  return (
    <span className={styles.epicIconImg} aria-label="Epic">
      <Epic16Icon width={16} height={16} />
    </span>
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
  'ACSCM-7 Giai đoạn 1: Quản lý người dùng & Au...',
  'ACSCM-8 Giai đoạn 2: Kho hàng & Tồn kho...',
  'ACSCM-9 Giai đoạn 3: Mua sắm & Quản lý ngân sách...',
  'ACSCM-10 Giai đoạn 4: Công thức & Hệ thống nấu ăn...',
  'ACSCM-11 Giai đoạn 5: Lập kế hoạch thực đơn & Bữa ăn...',
  'ACSCM-16 Giai đoạn 6: Theo dõi Dinh dưỡng & Sức khỏe...',
  'ACSCM-12 Giai đoạn 7: AI & Tối ưu hóa thông minh',
  'ACSCM-13 Giai đoạn 8: Báo cáo & Phân tích',
  'ACSCM-14 Giai đoạn 9: Thông báo & Liên lạc...',
];

const INITIAL_MONTHS_COUNT = 12;
const DAY_WIDTH = 40;
const MONTH_WIDTH = 200;
const BEFORE_DAYS = 30;
const AFTER_DAYS = 60;

const generateMonths = (startYear: number, startMonth: number, count: number) => {
  const result = [];
  const date = new Date(startYear, startMonth - 1, 1);
  for (let i = 0; i < count; i++) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const key = `${y}-${String(m + 1).padStart(2, '0')}`;
    result.push(key);
    date.setMonth(date.getMonth() + 1);
  }
  return result;
};

const generateDays = (start: Date, before: number, after: number) => {
  const result: Date[] = [];
  const base = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
  for (let i = before; i <= after; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    result.push(d);
  }
  return result;
};

export function TimelineView() {
  const [range, setRange] = React.useState<'Weeks' | 'Months'>('Months');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [months, setMonths] = React.useState(() => generateMonths(2026, 3, INITIAL_MONTHS_COUNT));
  const [days, setDays] = React.useState(() => {
    const today = new Date(2026, 2, 1);
    return generateDays(today, -BEFORE_DAYS, AFTER_DAYS);
  });
  const rightRef = React.useRef<HTMLDivElement>(null);

  const colWidth = range === 'Weeks' ? DAY_WIDTH : MONTH_WIDTH;

  const currentMonthKey = React.useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  const todayKey = React.useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

  const handleScroll = () => {
    const el = rightRef.current;
    if (!el) return;

    if (range === 'Months') {
      const rightBuffer = el.scrollWidth - el.scrollLeft - el.clientWidth;
      if (rightBuffer < 200) {
        const lastMonthKey = months[months.length - 1];
        const [y, m] = lastMonthKey.split('-').map(Number);
        const nextDate = new Date(y, m, 1);
        setMonths([...months, ...generateMonths(nextDate.getFullYear(), nextDate.getMonth() + 1, 6)]);
      }
    } else {
      const sLeft = el.scrollLeft;
      const sWidth = el.scrollWidth;

      if (sLeft < 200) {
        const newDays = generateDays(days[0], -BEFORE_DAYS, -1);
        setDays([...newDays, ...days]);
        el.scrollLeft = sLeft + (BEFORE_DAYS * DAY_WIDTH);
      } else if (sWidth - sLeft - el.clientWidth < 400) {
        const lastDay = days[days.length - 1];
        const newDays = generateDays(lastDay, 1, AFTER_DAYS);
        setDays([...days, ...newDays]);
      }
    }
  };

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
      [index]: { left: x, width: colWidth * 2 }
    }));
  };

  const getLabel = (pixels: number) => {
    const start = new Date(2025, 10, 1);
    if (range === 'Months') {
      const totalDays = (pixels / MONTH_WIDTH) * 30;
      start.setDate(start.getDate() + Math.round(totalDays));
    } else {
      const totalDays = pixels / DAY_WIDTH;
      start.setDate(start.getDate() + Math.round(totalDays));
    }
    return start.toLocaleDateString('vi-VN', { month: 'numeric', day: '2-digit', year: 'numeric' });
  };

  const weekGroups = React.useMemo(() => {
    if (range !== 'Weeks') return [];
    const groups: { label: string; count: number }[] = [];
    
    for (let i = 0; i < days.length; i += 7) {
      const weekDays = days.slice(i, i + 7);
      if (weekDays.length === 0) break;
      
      const first = weekDays[0];
      const last = weekDays[weekDays.length - 1];
      
      let label = first.toLocaleDateString('en-US', { month: 'short' });
      if (first.getMonth() !== last.getMonth()) {
        label += ' / ' + last.toLocaleDateString('en-US', { month: 'short' });
      }
      
      groups.push({ label, count: weekDays.length });
    }
    return groups;
  }, [days, range]);

  const canvasWidth = range === 'Weeks' ? days.length * DAY_WIDTH : months.length * MONTH_WIDTH;

  const todayPos = React.useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    
    if (range === 'Months') {
      if (months.length === 0) return 0;
      const firstMonthKey = months[0];
      const [y, m] = firstMonthKey.split('-').map(Number);
      const startOfMonthOne = new Date(y, m - 1, 1, 0, 0, 0, 0).getTime();
      const diffDays = Math.round((todayStart - startOfMonthOne) / (1000 * 60 * 60 * 24));
      return (diffDays / 30) * MONTH_WIDTH;
    } else {
      if (days.length === 0) return 0;
      const firstDay = days[0];
      const firstDayStart = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate(), 0, 0, 0, 0).getTime();
      const diffDays = Math.round((todayStart - firstDayStart) / (1000 * 60 * 60 * 24));
      return diffDays * DAY_WIDTH;
    }
  }, [days, months, range]);

  React.useEffect(() => {
    if (range === 'Weeks') {
      const el = rightRef.current;
      if (el) {
        el.scrollLeft = todayPos - (el.clientWidth / 2) + (DAY_WIDTH / 2);
      }
    }
  }, [range, todayPos]);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.leftHeader} style={{ height: range === 'Weeks' ? '60px' : '40px' }}>
            Công việc
          </div>
          <div className={styles.leftBody}>
            <div className={styles.sectionTitle}>Giai đoạn</div>

            {EPICS.map((t, _i) => (
              <div key={t} className={styles.row}>
                <input className={styles.checkbox} type="checkbox" aria-label="Chọn" />
                <span className={styles.epicIcon} aria-hidden="true">
                  <EpicIcon />
                </span>
                <span className={styles.epicText}>{t}</span>
              </div>
            ))}

            <div className={styles.createRow} role="button" tabIndex={0}>
              <PlusIcon />
              <span>Tạo mới</span>
            </div>
          </div>
        </div>

        <div className={styles.right} ref={rightRef} onScroll={handleScroll}>
          {range === 'Months' ? (
            <div className={styles.monthHeader} style={{ gridAutoColumns: `${MONTH_WIDTH}px` }}>
              {months.map((keyOrObj, i) => {
                const key = typeof keyOrObj === 'string' ? keyOrObj : (keyOrObj as { key: string }).key;
                const [y, m] = key.split('-').map(Number);
                const label = (i === 0 || m === 1) ? `Tháng ${m} năm ${y}` : `Tháng ${m}`;
                return (
                  <div
                    key={key}
                    className={`${styles.monthCell} ${key === currentMonthKey ? styles.monthCellCurrent : ''}`}
                    style={{ width: `${MONTH_WIDTH}px` }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.weekHeaderWrap}>
              <div className={styles.weekHeaderTop}>
                {weekGroups.map((g, i) => (
                  <div key={i} className={styles.headerGroup} style={{ width: g.count * DAY_WIDTH }}>
                    {g.label}
                  </div>
                ))}
              </div>
              <div className={styles.weekHeaderBottom}>
                {days.map((d, i) => {
                  const dKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  const isLastDayOfWeek = (i + 1) % 7 === 0;
                  return (
                    <div 
                      key={i} 
                      className={`${styles.dayCell} ${dKey === todayKey ? styles.dayCellCurrent : ''} ${isLastDayOfWeek ? styles.dayCellLast : ''}`}
                      style={{ width: `${DAY_WIDTH}px` }}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.canvas} style={{ 
            width: canvasWidth,
            height: `calc(100% - ${range === 'Weeks' ? 60 : 40}px)`,
            background: range === 'Months' 
              ? `repeating-linear-gradient(to right, transparent, transparent ${MONTH_WIDTH - 1}px, rgba(9, 30, 66, 0.14) ${MONTH_WIDTH}px)`
              : `repeating-linear-gradient(to right, transparent, transparent ${(DAY_WIDTH * 7) - 1}px, rgba(9, 30, 66, 0.14) ${DAY_WIDTH * 7}px)`
          }}>
            <div className={styles.sectionTitleTrack} style={{ top: 0 }} />

            {EPICS.map((_, i) => (
              <div
                key={i}
                className={styles.rowTrack}
                style={{ top: 36 + (i * 44) }}
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
                      {getLabel(bars[i].left + bars[i].width)}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className={styles.todayLine} style={{ left: todayPos }} aria-hidden="true">
              <div className={styles.todayMarker} />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.bottomSwitcher} ${isCollapsed ? styles.bottomSwitcherCollapsed : ''}`} aria-label="Phạm vi thời gian">
        <div className={styles.switcherInner} style={{
          display: 'flex',
          alignItems: 'center',
          width: isCollapsed ? '36px' : 'auto',
          overflow: 'hidden',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <button 
                type="button" 
                className={styles.switchBtn}
                onClick={() => {
                  if (rightRef.current) rightRef.current.scrollLeft = todayPos - 200;
                }}
              >
                Hôm nay
              </button>
              <div className={styles.divider} />
              <button
                type="button"
                className={`${styles.switchBtn} ${range === 'Weeks' ? styles.switchBtnActive : ''}`}
                onClick={() => setRange('Weeks')}
              >
                Tuần
              </button>
              <button
                type="button"
                className={`${styles.switchBtn} ${range === 'Months' ? styles.switchBtnActive : ''}`}
                onClick={() => setRange('Months')}
              >
                Tháng
              </button>
            </div>
          )}
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ marginLeft: isCollapsed ? 0 : '4px' }}
          >
            {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
