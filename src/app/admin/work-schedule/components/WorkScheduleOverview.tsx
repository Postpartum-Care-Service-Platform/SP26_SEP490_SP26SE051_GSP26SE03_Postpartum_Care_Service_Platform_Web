'use client';

import React from 'react';

import layoutStyles from './work-schedule-layout.module.css';
import styles from './work-schedule-overview.module.css';

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.filterIcon}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15 3.5H1V2h14zm-2 5.25H3v-1.5h10zM11 14H5v-1.5h6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.iconSvg}
    >
      <path
        fill="currentColor"
        d="M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0m-2.174-2.52-5 6a.75.75 0 0 1-1.152 0l-2.5-3 1.152-.96L6.75 9.828l4.424-5.308zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"
      />
    </svg>
  );
}

function UpdatedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.iconSvg}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 1.75A.75.75 0 0 1 1.75 1h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5A.75.75 0 0 1 1 4.25zm1.5.75v1h1v-1zm9.836.104a2 2 0 0 1 2.828 0l.232.232a2 2 0 0 1 0 2.828l-4.848 4.849a2 2 0 0 1-1.022.547l-2.129.425a.75.75 0 0 1-.882-.882l.425-2.129a2 2 0 0 1 .547-1.022zm1.768 1.06a.5.5 0 0 0-.708 0L13.061 4l.939.94.336-.336a.5.5 0 0 0 0-.708zM12.939 6 12 5.06 8.548 8.514a.5.5 0 0 0-.137.255l-.205 1.026 1.026-.205a.5.5 0 0 0 .255-.137zM1 6.75A.75.75 0 0 1 1.75 6h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5A.75.75 0 0 1 1 9.25zm1.5.75v1h1v-1zM1 11.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75zm1.5.75v1h1v-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CreatedIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.iconSvg}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zm6.426 1.517 1.148.966-4 4.75a.75.75 0 0 1-1.148 0l-2-2.375 1.148-.966L6 8.086z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 6v6.75A3.25 3.25 0 0 1 12.75 16H6v-1.5h6.75a1.75 1.75 0 0 0 1.75-1.75V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DueSoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.iconSvg}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.5 2.5v2H6v-2h4v2h1.5v-2H13a.5.5 0 0 1 .5.5v3h-11V3a.5.5 0 0 1 .5-.5zm-2 5V13a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V7.5zm9-6.5H13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1.5V0H6v1h4V0h1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function StatCard({ icon, title, description }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
}

export function WorkScheduleOverview() {
  return (
    <div className={styles.wrap}>
      <div className={layoutStyles.pageContainer}>
        <div className={styles.filterRow}>
          <button type="button" className={styles.filterBtn}>
            <FilterIcon />
            <span>Filter</span>
          </button>
        </div>

        <div className={styles.row}>
          <StatCard
            icon={<CompletedIcon />}
            title="0 completed"
            description="in the last 7 days"
          />
          <StatCard
            icon={<UpdatedIcon />}
            title="0 updated"
            description="in the last 7 days"
          />
          <StatCard
            icon={<CreatedIcon />}
            title="0 created"
            description="in the last 7 days"
          />
          <StatCard
            icon={<DueSoonIcon />}
            title="0 due soon"
            description="in the next 7 days"
          />
        </div>
      </div>
    </div>
  );
}

