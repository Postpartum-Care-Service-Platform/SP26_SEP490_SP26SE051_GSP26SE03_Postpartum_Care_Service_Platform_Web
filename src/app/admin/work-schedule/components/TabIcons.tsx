'use client';

import React from 'react';

type Props = {
  className?: string;
};

// Summary / Overview Icon
export function SummaryIcon({ className }: Props) {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0A6.5 6.5 0 0 1 1.5 8zM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4zm0 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Timeline Icon
export function TimelineIcon({ className }: Props) {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M0 4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5zM3 11a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Board Icon
export function BoardIcon({ className }: Props) {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2zm2-.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5H3zM5 3a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Calendar Icon
export function CalendarIcon({ className }: Props) {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 0a1 1 0 0 1 1 1v1h6V1a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1V1a1 1 0 0 1 1-1zM2 4v2h12V4H2zm12 4H2v6h12V8z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// List Icon
export function ListIcon({ className }: Props) {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1 2a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1zm0 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1zm0 6a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Forms Icon
export function FormsIcon({ className }: Props) {
  return (
    <svg fill="none" viewBox="-4 -4 24 24" role="presentation" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2-.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5H4zM5 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
