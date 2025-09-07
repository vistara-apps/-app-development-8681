import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-muted-300 rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
      default:
        return 'rounded-md';
    }
  };

  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...getStyle(),
              width: index === lines - 1 ? '75%' : '100%'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={getStyle()}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 border border-muted-300 rounded-lg ${className}`}>
    <LoadingSkeleton variant="text" className="mb-2" width="60%" />
    <LoadingSkeleton variant="text" lines={2} className="mb-4" />
    <LoadingSkeleton height={120} className="mb-2" />
    <div className="flex justify-between">
      <LoadingSkeleton variant="text" width="30%" />
      <LoadingSkeleton variant="text" width="20%" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 border border-muted-300 rounded-lg">
        <LoadingSkeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <LoadingSkeleton variant="text" width="40%" className="mb-1" />
          <LoadingSkeleton variant="text" width="60%" />
        </div>
        <div className="text-right">
          <LoadingSkeleton variant="text" width={60} className="mb-1" />
          <LoadingSkeleton variant="text" width={40} />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 ${className}`}>
    <LoadingSkeleton variant="text" width="30%" className="mb-4" />
    <LoadingSkeleton height={200} className="mb-2" />
    <div className="flex justify-between">
      <LoadingSkeleton variant="text" width="15%" />
      <LoadingSkeleton variant="text" width="15%" />
      <LoadingSkeleton variant="text" width="15%" />
      <LoadingSkeleton variant="text" width="15%" />
    </div>
  </div>
);
