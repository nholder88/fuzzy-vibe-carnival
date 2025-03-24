import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? 'preset-filled-primary-500'
    : 'preset-outlined-primary-500';

  const sizeClass =
    size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : 'btn-base';

  return (
    <button type='button' className={cn('btn', sizeClass, mode)} {...props}>
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
