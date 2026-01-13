'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'booking';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rightIcon, variant = 'default', ...props },
  ref
) {
  const hasRightIcon = rightIcon !== undefined;

  // Base classes without any focus ring/shadow styles
  const baseClasses =
    'w-full bg-white font-body text-[14px] text-text-primary placeholder:text-[rgba(30,30,30,0.45)] focus:outline-none';

  let variantClasses = '';
  if (variant === 'booking') {
    variantClasses = cn(
      'h-[160px] rounded-none border border-solid border-[rgba(0,0,0,0.55)] p-[12px_14px] text-[13px] resize-none focus:border-brand-accent'
    );
  } else {
    variantClasses = cn('rounded-sm border border-solid border-border-default focus:border-brand-accent', hasRightIcon ? 'pr-10' : '');
  }

  return (
    <div className="relative w-full">
      <textarea ref={ref} className={cn(baseClasses, variantClasses, className)} {...props} />

      {hasRightIcon ? (
        <div className="absolute top-2 right-0 flex items-start pr-3">{rightIcon}</div>
      ) : null}
    </div>
  );
});
