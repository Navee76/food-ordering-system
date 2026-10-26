import React from 'react';
import { FoodItem } from '../../types';
import { DietaryBadge } from '../common/DietaryBadge';
import { RatingBadge } from '../common/RatingBadge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  onOpenDetails: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onOpenDetails }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const quantity = getItemQuantity(food.id);
  const isFav = isInWishlist(food.id);

  return (
    <div
      onClick={() => onOpenDetails(food)}
      className="group relative flex flex-col justify-between bg-white rounded-3xl p-4 border border-[#2D1B12]/8 shadow-sm hover:shadow-xl hover:border-[#FF6B35]/30 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Media & Badges */}
      <div>
        <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden mb-3.5 bg-[#FFF8F0]">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            {food.isBestseller && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B35] text-white shadow-md">
                <Sparkles className="w-3 h-3 fill-current" />
                Bestseller
              </span>
            )}
            {food.spicyLevel && food.spicyLevel > 1 && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs">
                <Flame className="w-2.5 h-2.5 fill-current" />
                Spicy
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(food);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFav
                ? 'bg-white text-rose-500 shadow-rose-500/20'
                : 'bg-white/80 text-[#2D1B12]/70 hover:bg-white hover:text-rose-500'
            }`}
            aria-label={isFav ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : ''}`} />
          </button>

          {/* Prep time chip */}
          {food.prepTime && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
              ⏱ {food.prepTime}
            </span>
          )}
        </div>

        {/* Info Content */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <DietaryBadge type={food.dietary} isGlutenFree={food.isGlutenFree} size="sm" />
            <RatingBadge rating={food.rating} reviewsCount={food.reviewsCount} size="sm" />
          </div>

          <h3 className="text-base font-bold text-[#2D1B12] group-hover:text-[#FF6B35] transition-colors line-clamp-1 leading-snug">
            {food.name}
          </h3>

          <p className="text-xs text-[#2D1B12]/60 line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          <p className="text-[11px] font-semibold text-[#FF6B35] uppercase tracking-wide">
            {food.restaurantName}
          </p>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="pt-3.5 mt-2 border-t border-[#2D1B12]/5 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-extrabold text-[#2D1B12]">₹{food.price}</span>
          {food.originalPrice && (
            <span className="text-xs text-[#2D1B12]/40 line-through font-medium">
              ₹{food.originalPrice}
            </span>
          )}
        </div>

        {/* Quantity Controls / Add Button */}
        {quantity > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center bg-[#FF6B35] text-white rounded-xl px-2 py-1 shadow-sm gap-2"
          >
            <button
              onClick={() => updateQuantity(food.id, -1)}
              className="p-0.5 hover:bg-black/15 rounded-md transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => updateQuantity(food.id, 1)}
              className="p-0.5 hover:bg-black/15 rounded-md transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(food, 1);
            }}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#FFF8F0] border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            ADD
          </button>
        )}
      </div>
    </div>
  );
};
