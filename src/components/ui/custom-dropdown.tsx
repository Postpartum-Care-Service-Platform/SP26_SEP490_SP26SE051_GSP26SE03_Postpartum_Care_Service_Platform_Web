'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  children?: ReactNode;
  selectedColor?: string;
  selectedBgColor?: string;
}

export function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  triggerClassName,
  contentClassName,
  itemClassName,
  selectedColor = 'var(--color-brand-accent)',
  selectedBgColor = 'rgba(250,131,20,0.1)',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between gap-2 px-3 py-2 min-h-[36px] h-[36px]',
          'border border-[rgba(30,30,30,0.1)] rounded-[var(--radius-sm)]',
          'bg-[#f0f0f0] text-sm font-medium text-[var(--color-text-primary)]',
          'cursor-pointer transition-all duration-200',
          'hover:bg-[#e6e6e6]',
          triggerClassName
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDownIcon
          className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 top-full left-0 mt-1 min-w-[200px]',
            'bg-white border border-[rgba(30,30,30,0.1)] rounded-[var(--radius-sm)]',
            'shadow-[var(--shadow-md)] p-1',
            contentClassName
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex items-center w-full px-3 py-2 min-h-[36px] h-[36px]',
                'text-sm cursor-pointer rounded-[var(--radius-sm)] transition-colors duration-150',
                value === option.value
                  ? 'bg-[#fff0e6] !text-[#ff6600] font-medium'
                  : 'bg-[#f0f0f0] text-[var(--color-text-primary)] hover:bg-[#e6e6e6]',
                itemClassName
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
