'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import React from 'react';

import styles from './custom-dropdown.module.css';

interface Option {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  isInvalid?: boolean;
  className?: string;
  showSearch?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn một tùy chọn...',
  isInvalid = false,
  className = '',
  showSearch = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles.dropdownContainer} ${className}`} ref={dropdownRef}>
      <div
        className={`${styles.dropdownHeader} ${isOpen ? styles.isOpen : ''} ${
          isInvalid ? styles.isInvalid : ''
        }`}
        onClick={toggleDropdown}
      >
        <span className={!selectedOption ? styles.placeholder : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} />
      </div>

      {isOpen && (
        <div className={styles.dropdownList}>
          {showSearch && options.length > 5 && (
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}
          
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`${styles.dropdownOption} ${
                  option.value === value ? styles.isSelected : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className={styles.noOptions}>Không có kết quả</div>
          )}
        </div>
      )}
    </div>
  );
};
