'use client';

import React from 'react';

export interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  length?: number;
  className?: string;
  cellClassName?: string;
  error?: boolean;
}

function clampOtp(v: string, length: number) {
  return v.replace(/\D/g, '').slice(0, length);
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  length = 6,
  className,
  cellClassName,
  error = false,
}: OtpInputProps) {
  const otpRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const digits = React.useMemo(() => {
    const v = clampOtp(value, length);
    return Array.from({ length }, (_, i) => v[i] ?? '');
  }, [value, length]);

  React.useEffect(() => {
    if (!disabled) otpRefs.current[0]?.focus();
  }, [disabled]);

  const setByPaste = (raw: string) => {
    const onlyNum = clampOtp(raw, length);
    if (!onlyNum) return;

    onChange(onlyNum);
    const nextFocus = onlyNum.length >= length ? length - 1 : onlyNum.length;
    otpRefs.current[nextFocus]?.focus();
  };

  return (
    <div className={className}>
      {digits.map((d, idx) => (
        <input
          key={idx}
          ref={(el) => {
            otpRefs.current[idx] = el;
          }}
          className={cellClassName}
          inputMode="numeric"
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          value={d}
          disabled={disabled}
          aria-invalid={error}
          onPaste={(e) => {
            e.preventDefault();
            setByPaste(e.clipboardData.getData('text'));
          }}
          onChange={(e) => {
            const raw = e.target.value;

            if (raw.length > 1) {
              setByPaste(raw);
              return;
            }

            const nextChar = raw.replace(/\D/g, '').slice(-1);
            const current = clampOtp(value, length);
            const arr = current.split('');
            while (arr.length < length) arr.push('');
            arr[idx] = nextChar;
            onChange(clampOtp(arr.join(''), length));
            if (nextChar && idx < length - 1) otpRefs.current[idx + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              const cur = clampOtp(value, length);
              if (cur[idx]) {
                const next = cur.slice(0, idx) + cur.slice(idx + 1);
                onChange(next);
              } else if (idx > 0) {
                const prev = idx - 1;
                const next = cur.slice(0, prev) + cur.slice(prev + 1);
                onChange(next);
                otpRefs.current[prev]?.focus();
              }
            }

            if (e.key === 'ArrowLeft' && idx > 0) otpRefs.current[idx - 1]?.focus();
            if (e.key === 'ArrowRight' && idx < length - 1) otpRefs.current[idx + 1]?.focus();
          }}
        />
      ))}
    </div>
  );
}

