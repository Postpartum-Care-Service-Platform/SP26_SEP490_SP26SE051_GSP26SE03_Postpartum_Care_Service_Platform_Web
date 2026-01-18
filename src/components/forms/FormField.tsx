'use client';

import * as React from 'react';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';

type FormFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  render: (props: {
    value: any;
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
    error?: string;
  }) => React.ReactElement;
};

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  render,
}: FormFieldProps<TFieldValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = (errors as any)?.[name]?.message as string | undefined;

  return (
    <div className="mb-md">
      <label htmlFor={name} className="ui-text text-text-primary block mb-xs" style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 500, color: '#111', marginBottom: '12px', lineHeight: '1.3' }}>
        {label}
      </label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => render({ ...field, error })}
      />

      {error ? (
        <p className="ui-text mt-xs" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-brand-accent)', marginTop: '8px', lineHeight: '1.4' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
