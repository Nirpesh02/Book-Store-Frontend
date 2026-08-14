import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate, size = 'md', showCount, count }) {
  const [hovered, setHovered] = useState(0);
  const isInteractive = !!onRate;

  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const starSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillValue = isInteractive ? (hovered || rating) : rating;
        const isFull = star <= Math.floor(fillValue);
        const isHalf = !isFull && star === Math.ceil(fillValue) && fillValue % 1 >= 0.25;

        return (
          <button
            key={star}
            type="button"
            disabled={!isInteractive}
            onClick={() => isInteractive && onRate(star)}
            onMouseEnter={() => isInteractive && setHovered(star)}
            onMouseLeave={() => isInteractive && setHovered(0)}
            className={`relative p-0 border-0 bg-transparent transition-transform ${
              isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
          >
            {/* Background (empty) star */}
            <Star className={`${starSize} text-slate-200`} fill="currentColor" />

            {/* Filled overlay */}
            {(isFull || isHalf) && (
              <Star
                className={`${starSize} absolute inset-0 text-amber-400`}
                fill="currentColor"
                style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              />
            )}
          </button>
        );
      })}
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-400 font-medium ml-1.5">({count})</span>
      )}
    </div>
  );
}
