import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'outlineSecondary' | 'luxury' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  href?: string;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  className = '',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-gold shadow-gold',
    outline: 'btn-outline-primary',
    outlineSecondary: 'btn-outline-secondary',
    luxury: 'btn-luxury shadow-luxury',
    accent: 'btn-accent',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
