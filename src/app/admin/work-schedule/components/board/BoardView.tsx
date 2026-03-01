'use client';

import React from 'react';

import styles from './board-view.module.css';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M7.25 8.75V15h1.5V8.75H15v-1.5H8.75V1h-1.5v6.25H1v1.5z" clipRule="evenodd" />
    </svg>
  );
}

function DoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path fill="currentColor" d="m5.59 9.97-3 3.75a.75.75 0 0 1-1.16.01l-.05-.07L0 11.53l1.26-.81.81 1.25 2.35-2.94zm0-7.5-3 3.75a.75.75 0 0 1-1.16.01l-.05-.07L0 4.03l1.26-.81.81 1.25 2.35-2.94zM16.01 11v1.5h-9V11zm0-7.5V5h-9V3.5z" />
    </svg>
  );
}

export function BoardView() {
  return (
    <div className={styles.container}>
      {/* TO DO Column */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={styles.columnTitle}>TO DO</span>
        </div>
        <div className={styles.emptyState}>
          <button type="button" className={styles.backlogBtn}>Go to Backlog</button>
        </div>
      </div>

      {/* IN PROGRESS Column */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={styles.columnTitle}>IN PROGRESS</span>
        </div>
      </div>

      {/* DONE Column */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={styles.columnTitle}>DONE</span>
          <div className={styles.columnActions}>
            <span style={{ color: '#22a06b', display: 'flex' }}><DoneIcon /></span>
          </div>
        </div>
      </div>

      {/* Add Column Button */}
      <div className={styles.addColumn}>
        <button type="button" className={styles.addBtn} aria-label="Add column">
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
