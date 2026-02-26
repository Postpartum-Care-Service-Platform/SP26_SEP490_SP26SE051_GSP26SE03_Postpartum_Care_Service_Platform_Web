'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-xs whitespace-nowrap ui-text rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(250,131,20,0.35)] disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-brand-accent text-text-inverse hover:bg-[color-mix(in_srgb,var(--color-brand-accent),#000_10%)]',
        outline:
          'bg-transparent border border-border-default text-text-primary hover:bg-[rgba(30,30,30,0.03)]',
        ghost: 'bg-transparent text-text-primary hover:bg-[rgba(30,30,30,0.03)]',
        booking: 'bg-[rgb(250,131,20)] text-white rounded-none hover:bg-[#0e256b]',
      },
      size: {
        sm: 'h-9 px-sm',
        md: 'h-10 px-md',
        lg: 'h-11 px-lg',
        booking: 'h-[35.77px]',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});
