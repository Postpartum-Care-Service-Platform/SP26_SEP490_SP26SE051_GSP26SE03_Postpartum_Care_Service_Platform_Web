import React from 'react';

type EditIconProps = {
  fill?: string;
  size?: number;
  className?: string;
};

export function EditIcon({ fill = '#A47BC8', size = 16, className = '' }: EditIconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={`eva eva-edit-2-outline ${className}`} 
      fill={fill}
    >
      <g data-name="Layer 2">
        <g data-name="edit-2">
          <rect width="24" height="24" opacity="0" />
          <path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z" />
          <path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zM6.37 12.91l5.6-5.6 2.7 2.7-5.6 5.6-3 .28z" />
        </g>
      </g>
    </svg>
  );
}