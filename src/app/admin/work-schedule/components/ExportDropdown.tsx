import React from 'react';

import styles from './export-dropdown.module.css';

const EXPORT_OPTIONS = [
  { label: 'Print details', value: 'print' },
  { label: 'Export XML', value: 'xml' },
  { label: 'Export RSS', value: 'rss' },
  { label: 'Export RSS (with comments)', value: 'rss_comments' },
  { label: 'Export Word', value: 'word' },
  { label: 'Export HTML report (all fields)', value: 'html_all' },
  { label: 'Export HTML report (my defaults)', value: 'html_defaults' },
  { label: 'Export CSV (all fields)', value: 'csv_all' },
  { label: 'Export CSV (my defaults)', value: 'csv_defaults' },
  { label: 'Export Excel CSV (all fields)', value: 'excel_csv_all' },
  { label: 'Export Excel CSV (my defaults)', value: 'excel_csv_defaults' },
  { label: 'Export XLSX (form data)', value: 'xlsx' },
  { type: 'divider' },
  { label: 'Create dashboard gadget', value: 'gadget' },
];

export function ExportDropdown({ onClose }: { onClose: () => void }) {
  React.useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className={styles.dropdown} onMouseDown={(e) => e.stopPropagation()}>
      <div className={styles.menu}>
        {EXPORT_OPTIONS.map((option, idx) => (
          option.type === 'divider' ? (
            <div key={idx} className={styles.divider} />
          ) : (
            <button
              key={idx}
              className={styles.menuItem}
              onClick={() => {
                console.log(`Exporting: ${option.value}`);
                onClose();
              }}
            >
              {option.label}
            </button>
          )
        ))}
      </div>
    </div>
  );
}
