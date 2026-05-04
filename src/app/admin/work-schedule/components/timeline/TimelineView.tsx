'use client';

import React from 'react';
import { format, parseISO, differenceInMinutes, startOfDay, isSameDay } from 'date-fns';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { StaffScheduleAllResponse } from '@/types/staff-schedule';

import Epic16Icon from '../list/artifacts/glyph/epic/16';

import styles from './timeline-view.module.css';

interface TimelineViewProps {
  staffData?: StaffScheduleAllResponse[];
}

function EpicIcon() {
  return (
    <span className={styles.epicIconImg} aria-label="Thunder Icon">
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

const FIVE_MIN_WIDTH = 60; 
const DAY_WIDTH = 40;
const MONTH_WIDTH = 200;
const BEFORE_DAYS = 7;
const AFTER_DAYS = 21;

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
  const base = startOfDay(start);
  for (let i = -before; i <= after; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    result.push(d);
  }
  return result;
};

const generateSlots = (start: Date, before: number, after: number) => {
  const result: Date[] = [];
  const base = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), 0, 0, 0);
  for (let i = -before; i <= after; i++) {
    const d = new Date(base.getTime() + i * 5 * 60 * 1000);
    result.push(d);
  }
  return result;
};

export function TimelineView({ staffData = [] }: TimelineViewProps) {
  const [range, setRange] = React.useState<'Days' | 'Weeks' | 'Months'>('Days');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  const [months, setMonths] = React.useState(() => {
    const today = new Date();
    return generateMonths(today.getFullYear(), today.getMonth() + 1, 12);
  });
  const [days] = React.useState(() => generateDays(new Date(), BEFORE_DAYS, AFTER_DAYS));
  const [slots] = React.useState(() => generateSlots(new Date(), 12, 24 * 12 * 2));

  const rightHeaderRef = React.useRef<HTMLDivElement>(null);
  const rightBodyRef = React.useRef<HTMLDivElement>(null);

  // Sync horizontal scrolling between header and body
  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (rightHeaderRef.current) {
      rightHeaderRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
    // Infinite load for months
    if (range === 'Months') {
      const el = e.currentTarget;
      if (el.scrollWidth - el.scrollLeft - el.clientWidth < 200) {
        const lastMonthKey = months[months.length - 1];
        const [y, m] = lastMonthKey.split('-').map(Number);
        setMonths([...months, ...generateMonths(y, m + 1, 6)]);
      }
    }
  };

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentMonthKey = format(currentTime, 'yyyy-MM');
  const todayKey = format(currentTime, 'yyyy-MM-dd');

  const activityRows = React.useMemo(() => {
    const rows: any[] = [];
    staffData.forEach(staff => {
      staff.bookings?.forEach(booking => {
        booking.activities?.forEach(activity => {
          const actWorkDate = parseISO(activity.workDate);
          const actStart = parseISO(`${activity.workDate}T${activity.startTime}`);
          const actEnd = parseISO(`${activity.workDate}T${activity.endTime}`);

          let left = -2000;
          let width = 0;

          if (range === 'Days') {
            const firstSlot = slots[0];
            const diffMin = differenceInMinutes(actStart, firstSlot);
            left = (diffMin / 5) * FIVE_MIN_WIDTH;
            width = (differenceInMinutes(actEnd, actStart) / 5) * FIVE_MIN_WIDTH;
          } else if (range === 'Weeks') {
            const dayIndex = days.findIndex(d => isSameDay(d, actWorkDate));
            if (dayIndex !== -1) {
              left = dayIndex * DAY_WIDTH + (differenceInMinutes(actStart, startOfDay(actStart)) / 1440) * DAY_WIDTH;
              width = (differenceInMinutes(actEnd, actStart) / 1440) * DAY_WIDTH;
            }
          } else if (range === 'Months') {
            const actMonthKey = format(actWorkDate, 'yyyy-MM');
            const monthIndex = months.indexOf(actMonthKey);
            if (monthIndex !== -1) {
              left = monthIndex * MONTH_WIDTH + (actWorkDate.getDate() / 31) * MONTH_WIDTH;
              width = 10;
            }
          }

          if (left > -1000) {
            rows.push({
              id: activity.staffScheduleId,
              title: activity.activity,
              staffName: staff.staffFullName,
              packageName: booking.packageName,
              left,
              width: Math.max(width, 4),
              status: activity.status,
              workDate: activity.workDate,
              startTime: activity.startTime,
              endTime: activity.endTime
            });
          }
        });
      });
    });
    return rows.sort((a, b) => (a.workDate + a.startTime).localeCompare(b.workDate + b.startTime));
  }, [staffData, range, slots, days, months]);

  const canvasWidth = range === 'Days' ? slots.length * FIVE_MIN_WIDTH : range === 'Weeks' ? days.length * DAY_WIDTH : months.length * MONTH_WIDTH;

  const todayPos = React.useMemo(() => {
    if (range === 'Days') {
      return (differenceInMinutes(currentTime, slots[0]) / 5) * FIVE_MIN_WIDTH;
    } else if (range === 'Months') {
      const first = months[0].split('-').map(Number);
      const startMs = new Date(first[0], first[1]-1, 1).getTime();
      return ((currentTime.getTime() - startMs) / (1000*60*60*24*30)) * MONTH_WIDTH;
    } else {
      return (differenceInMinutes(currentTime, startOfDay(days[0])) / 1440) * DAY_WIDTH;
    }
  }, [days, months, range, slots, currentTime]);

  React.useEffect(() => {
    if (rightBodyRef.current) {
      rightBodyRef.current.scrollLeft = todayPos - (rightBodyRef.current.clientWidth / 2);
    }
  }, [range, todayPos]);

  return (
    <div className={styles.wrap}>
      {/* HEADER ROW - ALWAYS VISIBLE */}
      <div className={styles.topHeaderRow} style={{ height: range === 'Months' ? 40 : 60 }}>
        <div className={styles.leftHeader}>Công việc</div>
        <div className={styles.rightHeaderOuter} ref={rightHeaderRef}>
          {range === 'Months' ? (
            <div className={styles.monthHeader} style={{ width: canvasWidth }}>
              {months.map((key, i) => {
                const [y, m] = key.split('-').map(Number);
                return (
                  <div key={key} className={`${styles.monthCell} ${key === currentMonthKey ? styles.monthCellCurrent : ''}`} style={{ width: MONTH_WIDTH }}>
                    {(i === 0 || m === 1) ? `Tháng ${m} năm ${y}` : `Tháng ${m}`}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.weekHeaderWrap} style={{ width: canvasWidth }}>
              <div className={styles.weekHeaderTop}>
                {(range === 'Weeks' ? 
                  Array.from({ length: Math.ceil(days.length / 7) }).map((_, i) => ({ label: format(days[i*7], 'MMM'), count: 7 })) :
                  Array.from({ length: slots.length / 12 }).map((_, i) => ({ label: format(slots[i*12], 'dd/MM'), count: 12 }))
                ).map((g, i) => (
                  <div key={i} className={styles.headerGroup} style={{ width: g.count * (range === 'Weeks' ? DAY_WIDTH : FIVE_MIN_WIDTH) }}>{g.label}</div>
                ))}
              </div>
              <div className={styles.weekHeaderBottom}>
                {range === 'Weeks' ? days.map((d, i) => (
                  <div key={i} className={`${styles.dayCell} ${format(d, 'yyyy-MM-dd') === todayKey ? styles.dayCellCurrent : ''}`} style={{ width: DAY_WIDTH }}>{d.getDate()}</div>
                )) : slots.filter((_, i) => i % 12 === 0).map((s, i) => (
                  <div key={i} className={styles.dayCell} style={{ width: 12 * FIVE_MIN_WIDTH, justifyContent: 'flex-start', paddingLeft: 4, fontSize: 10 }}>{format(s, 'HH:mm')}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BODY SECTION - SCROLLABLE */}
      <div className={styles.scrollingContent}>
        <div className={styles.leftBodyFixed}>
          <div className={styles.sectionTitle}>Danh sách hoạt động</div>
          {activityRows.map(row => (
            <div key={row.id} className={styles.row}>
              <input type="checkbox" className={styles.checkbox} />
              <EpicIcon />
              <div className={styles.activityInfo}>
                <div className={styles.epicText}>{row.title}</div>
                <div className={styles.subText}>{row.staffFullName || row.staffName} • {row.packageName}</div>
              </div>
            </div>
          ))}
          <div className={styles.createRow}><PlusIcon /><span>Tạo mới</span></div>
        </div>

        <div className={styles.rightBodyScroll} ref={rightBodyRef} onScroll={handleBodyScroll}>
          <div className={styles.canvas} style={{ 
            width: canvasWidth, 
            height: 40 + activityRows.length * 44, // Calculate exact height of content
            background: range === 'Months' 
              ? `repeating-linear-gradient(to right, transparent, transparent ${MONTH_WIDTH-1}px, #dfe1e6 ${MONTH_WIDTH}px)`
              : range === 'Weeks'
              ? `repeating-linear-gradient(to right, transparent, transparent ${DAY_WIDTH-1}px, #dfe1e6 ${DAY_WIDTH}px)`
              : `repeating-linear-gradient(to right, transparent, transparent ${FIVE_MIN_WIDTH*12-1}px, #dfe1e6 ${FIVE_MIN_WIDTH*12}px)`
          }}>
            <div className={styles.sectionTitleTrack} />
            {activityRows.map((row, i) => (
              <div key={row.id} className={styles.rowTrack} style={{ top: 40 + i * 44 }}>
                <div 
                  className={styles.bar} 
                  style={{ 
                    left: row.left, width: row.width,
                    backgroundColor: row.status === 'Done' ? '#36B37E' : row.status === 'InProgress' ? '#00B8D9' : '#FFAB00'
                  }}
                  title={`${row.title} (${row.startTime} - ${row.endTime})`}
                />
              </div>
            ))}
            <div className={styles.todayLine} style={{ left: todayPos }}>
              <div className={styles.todayMarker} />
              {range === 'Days' && <div className={styles.currentTimeLabel}>{format(currentTime, 'HH:mm')}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* SWITCHER - FLOATING FIXED */}
      <div className={`${styles.bottomSwitcher} ${isCollapsed ? styles.bottomSwitcherCollapsed : ''}`}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className={styles.switchBtn} onClick={() => rightBodyRef.current?.scrollTo({ left: todayPos - 200, behavior: 'smooth' })}>Hôm nay</button>
            <div className={styles.divider} />
            <button className={`${styles.switchBtn} ${range === 'Days' ? styles.switchBtnActive : ''}`} onClick={() => setRange('Days')}>Giờ/Phút</button>
            <button className={`${styles.switchBtn} ${range === 'Weeks' ? styles.switchBtnActive : ''}`} onClick={() => setRange('Weeks')}>Tuần</button>
            <button className={`${styles.switchBtn} ${range === 'Months' ? styles.switchBtnActive : ''}`} onClick={() => setRange('Months')}>Tháng</button>
          </div>
        )}
        <button className={styles.collapseBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
