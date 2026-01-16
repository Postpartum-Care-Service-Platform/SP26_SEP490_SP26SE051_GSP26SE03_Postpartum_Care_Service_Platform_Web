'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';
import { Input } from '../Input';
import styles from './text-field.module.css';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'auth' | 'booking';
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, label, error, variant = 'booking', id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={cn(styles.fieldWrapper, className)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className={styles.label}
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <Input
          ref={ref}
          id={inputId}
          variant={variant}
          className={error ? styles.inputError : ''}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export { TextField };

