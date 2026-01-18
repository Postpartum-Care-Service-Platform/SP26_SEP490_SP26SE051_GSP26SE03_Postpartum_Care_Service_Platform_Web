'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'auth' | 'booking' | 'profile';
}

const AUTH_HEIGHT = '49.77px';
const BOOKING_HEIGHT = '35.77px';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, rightIcon, variant = 'default', ...props },
  ref
) {
  const hasRightIcon = rightIcon !== undefined;

  // Base classes no longer contain focus ring styles
  const baseClasses =
    'w-full bg-transparent font-body text-text-primary placeholder:text-[rgba(30,30,30,0.45)] focus:outline-none';

  let variantClasses = '';
  if (variant === 'auth') {
    variantClasses = cn(
      `h-[${AUTH_HEIGHT}] rounded-none border border-solid border-[rgba(0,0,0,0.55)] focus:border-brand-accent`,
      'px-[14px]',
      hasRightIcon ? 'pr-[44px]' : ''
    );
  } else if (variant === 'booking') {
    variantClasses = cn(
      `h-[${BOOKING_HEIGHT}] rounded-none border border-solid border-[rgba(0,0,0,0.55)] focus:border-brand-accent`,
      'px-[14px] text-[13px]'
    );
  } else if (variant === 'profile') {
    // Profile variant: chỉ có border-bottom, khi focus chuyển từ đen sang cam
    variantClasses = cn(
      'h-12 text-[16px] rounded-none border-0 border-b-2 border-solid border-[rgba(0,0,0,0.3)]',
      'px-0 pb-2',
      'focus:border-[#fa8314] transition-colors duration-200',
      'disabled:border-[rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:opacity-60',
      'placeholder:text-[rgba(0,0,0,0.4)]',
      hasRightIcon ? 'pr-10' : ''
    );
  } else {
    // Default variant now also handles its own focus border color
    variantClasses = cn(
      'h-10 rounded-sm border border-solid border-border-default focus:border-brand-accent',
      hasRightIcon ? 'pr-10 px-3' : 'px-3'
    );
  }

  return (
    <div className="relative w-full">
      <input ref={ref} type={type} className={cn(baseClasses, variantClasses, className)} {...props} />

      {hasRightIcon ? (
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex items-center',
            variant === 'auth' ? 'pr-[10px]' : 'pr-3'
          )}
        >
          {rightIcon}
        </div>
      ) : null}
    </div>
  );
});
