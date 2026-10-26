import React from 'react';
import { DietaryType } from '../../types';
import { Leaf, ShieldCheck } from 'lucide-react';

interface DietaryBadgeProps {
  type: DietaryType;
  isGlutenFree?: boolean;
  size?: 'sm' | 'md';
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, isGlutenFree, size = 'md' }) => {
  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      {type === 'veg' && (
        <span
          title="Vegetarian"
          className={`inline-flex items-center justify-center border-2 border-emerald-600 bg-emerald-50 rounded-sm ${
            size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
          }`}
        >
          <span className={`rounded-full bg-emerald-600 ${size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`} />
        </span>
      )}

      {type === 'non-veg' && (
        <span
          title="Non-Vegetarian"
          className={`inline-flex items-center justify-center border-2 border-rose-700 bg-rose-50 rounded-sm ${
            size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
          }`}
        >
          <span
            className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-rose-700 ${
              size === 'sm' ? 'scale-75' : 'scale-90'
            }`}
          />
        </span>
      )}

      {type === 'vegan' && (
        <span
          title="100% Vegan (Plant Based)"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"
        >
          <Leaf className="w-3 h-3 text-emerald-600" />
          Vegan
        </span>
      )}

      {isGlutenFree && (
        <span
          title="Gluten Free"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300"
        >
          <ShieldCheck className="w-2.5 h-2.5 text-amber-700" />
          GF
        </span>
      )}
    </div>
  );
};
