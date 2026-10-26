import React from 'react';
import { Restaurant } from '../../types';
import { RatingBadge } from '../common/RatingBadge';
import { Clock, IndianRupee, Bike, Sparkles, ArrowRight } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-[#2D1B12]/8 shadow-sm hover:shadow-xl hover:border-[#FF6B35]/30 transition-all duration-300 cursor-pointer"
    >
      <div>
        {/* Restaurant Banner Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-[#2D1B12]/5">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {restaurant.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FF6B35] text-white shadow-md">
                <Sparkles className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
            {restaurant.isPureVeg && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md">
                Pure Veg
              </span>
            )}
          </div>

          {/* Discount Badge on bottom of image */}
          {restaurant.discountBadge && (
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-white/95 text-[#2D1B12] text-xs font-black shadow-lg backdrop-blur-xs flex items-center gap-1">
              <span className="text-[#FF6B35]">%</span>
              {restaurant.discountBadge}
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-[#2D1B12] text-lg group-hover:text-[#FF6B35] transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <RatingBadge rating={restaurant.rating} reviewsCount={restaurant.reviewsCount} size="sm" />
          </div>

          <p className="text-xs text-[#2D1B12]/70 font-medium line-clamp-1">
            {restaurant.cuisine.join(' • ')}
          </p>

          <p className="text-xs text-[#2D1B12]/50 line-clamp-1">
            📍 {restaurant.address}
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex items-center justify-between text-xs text-[#2D1B12]/70 border-t border-[#2D1B12]/5">
            <div className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{restaurant.deliveryTime}</span>
            </div>

            <div className="flex items-center gap-1 font-semibold">
              <IndianRupee className="w-3.5 h-3.5 text-[#FFA62B]" />
              <span>₹{restaurant.priceForTwo} for two</span>
            </div>

            <div className="flex items-center gap-1 font-semibold">
              <Bike className="w-3.5 h-3.5 text-emerald-600" />
              <span>{restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Menu CTA Button */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(restaurant);
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#FFF8F0] border border-[#FF6B35]/30 text-[#FF6B35] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group-hover:bg-[#FF6B35] group-hover:text-white group-hover:border-[#FF6B35] transition-all shadow-xs"
        >
          <span>View Menu</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
