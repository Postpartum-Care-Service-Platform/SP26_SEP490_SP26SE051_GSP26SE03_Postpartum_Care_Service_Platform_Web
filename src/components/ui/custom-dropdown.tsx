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
          'flex items-center justify-between gap-2 px-3 py-2 min-h-[40px] w-full',
          'border border-[var(--color-border-default)] rounded-[var(--radius-sm)]',
          'text-sm font-medium text-[var(--color-text-primary)]',
          'cursor-pointer transition-all duration-200',
          'hover:bg-[#f8f9fa] hover:border-[var(--color-brand-accent)]',
          triggerClassName
        )}
        style={{ backgroundColor: '#ffffff' }}
      >
        <span>{selectedLabel}</span>
        <ChevronDownIcon
          className={cn('w-4 h-4 text-slate-500 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-[10010] top-full left-0 mt-1 min-w-[200px] w-full',
            'border border-[var(--color-border-default)] rounded-[var(--radius-sm)]',
            'shadow-[var(--shadow-md)] p-1 animate-in fade-in zoom-in-95 duration-200',
            contentClassName
          )}
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="max-h-[250px] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex items-center w-full px-3 py-2 min-h-[36px] border-none outline-none text-left',
                  'text-sm cursor-pointer rounded-[var(--radius-sm)] transition-colors duration-150',
                  value === option.value
                    ? 'bg-[rgba(250,131,20,0.1)] text-[var(--color-brand-accent)] font-medium'
                    : 'bg-transparent text-[var(--color-text-primary)] hover:bg-[rgba(250,131,20,0.05)] hover:text-[var(--color-brand-accent)]',
                  itemClassName
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
