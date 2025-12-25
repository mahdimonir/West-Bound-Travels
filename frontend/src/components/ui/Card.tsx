import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  luxury?: boolean;
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Card({
  children,
  className = '',
  luxury = false,
  hover = true,
  onClick,
  style,
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl overflow-hidden transition-all duration-300';
  const luxuryStyles = luxury ? 'card-gold' : 'card-luxury';
  const hoverStyles = hover ? 'hover-lift' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseStyles} ${luxuryStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
