import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, reviewsCount, size = 'md' }) => {
  const isHigh = rating >= 4.5;

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 font-bold text-white rounded-lg shadow-xs ${
          isHigh ? 'bg-emerald-600' : 'bg-[#FF6B35]'
        } ${
          size === 'sm'
            ? 'px-1.5 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3 py-1 text-base'
            : 'px-2 py-0.5 text-xs'
        }`}
      >
        <span>{rating.toFixed(1)}</span>
        <Star className={`fill-current ${size === 'sm' ? 'w-2.5 h-2.5' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`} />
      </span>
      {reviewsCount !== undefined && (
        <span className={`text-[#2D1B12]/60 font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          ({reviewsCount > 999 ? `${(reviewsCount / 1000).toFixed(1)}k+` : reviewsCount})
        </span>
      )}
    </div>
  );
};
