import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  isVerified: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function VerificationBadge({
  isVerified,
  className,
  size = 'md',
  showText = false,
}: VerificationBadgeProps) {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="relative">
        <CheckCircle
          className={cn(
            sizeClasses[size],
            'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]',
          )}
          fill="currentColor"
        />
        {/* Glowing effect */}
        <div
          className={cn(
            sizeClasses[size],
            'absolute top-0 left-0 text-blue-400 animate-pulse blur-sm opacity-50',
          )}
        >
          <CheckCircle fill="currentColor" />
        </div>
      </div>
      {showText && (
        <span className={cn(textSizeClasses[size], 'font-semibold text-blue-400')}>VERIFIED</span>
      )}
    </div>
  );
}
