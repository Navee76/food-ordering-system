import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { DietaryBadge } from '../common/DietaryBadge';
import { RatingBadge } from '../common/RatingBadge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  X,
  Plus,
  Minus,
  Heart,
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
  Info,
  Check,
} from 'lucide-react';

interface ProductDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!food) return null;

  const isFav = isInWishlist(food.id);

  const handleAddToCart = () => {
    addToCart(food, quantity, instructions);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFF8F0] rounded-3xl shadow-2xl border border-[#FF6B35]/20 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#2D1B12] hover:bg-white hover:text-[#FF6B35] transition-all shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative aspect-16/9 sm:aspect-2/1 w-full bg-[#2D1B12]">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Badges on image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <DietaryBadge type={food.dietary} isGlutenFree={food.isGlutenFree} size="md" />
                {food.isBestseller && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#FF6B35] text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Bestseller
                  </span>
                )}
                {food.spicyLevel && food.spicyLevel > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Level {food.spicyLevel} Spicy
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleWishlist(food)}
                className={`p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all ${
                  isFav
                    ? 'bg-white text-rose-500'
                    : 'bg-white/80 text-[#2D1B12] hover:bg-white hover:text-rose-500'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
                  {food.category} • {food.restaurantName}
                </span>
                <RatingBadge rating={food.rating} reviewsCount={food.reviewsCount} size="md" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B12] leading-tight">
                {food.name}
              </h2>

              <p className="text-sm text-[#2D1B12]/80 mt-2 leading-relaxed">
                {food.description}
              </p>
            </div>

            {/* Preparation and Dietary Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#2D1B12]/8">
                <Clock className="w-5 h-5 text-[#FF6B35]" />
                <div>
                  <p className="text-[10px] text-[#2D1B12]/60 font-semibold uppercase">Prep Time</p>
                  <p className="text-xs font-bold text-[#2D1B12]">{food.prepTime || '15-20 min'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#2D1B12]/8">
                <Info className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-[10px] text-[#2D1B12]/60 font-semibold uppercase">Dietary Type</p>
                  <p className="text-xs font-bold text-[#2D1B12] capitalize">
                    {food.dietary} {food.isGlutenFree ? '• Gluten Free' : ''}
                  </p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#2D1B12]/8">
                <Flame className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-[10px] text-[#2D1B12]/60 font-semibold uppercase">Energy</p>
                  <p className="text-xs font-bold text-[#2D1B12]">{food.nutrition.calories} kcal</p>
                </div>
              </div>
            </div>

            {/* Nutritional Info breakdown */}
            <div className="bg-white rounded-2xl p-4 border border-[#2D1B12]/8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D1B12]/70 mb-3">
                Nutritional Values (Approx per serving)
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#FFF8F0]">
                  <p className="text-[11px] text-[#2D1B12]/60 font-medium">Calories</p>
                  <p className="text-sm font-extrabold text-[#2D1B12] mt-0.5">{food.nutrition.calories}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFF8F0]">
                  <p className="text-[11px] text-[#2D1B12]/60 font-medium">Protein</p>
                  <p className="text-sm font-extrabold text-[#2D1B12] mt-0.5">{food.nutrition.protein}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFF8F0]">
                  <p className="text-[11px] text-[#2D1B12]/60 font-medium">Carbs</p>
                  <p className="text-sm font-extrabold text-[#2D1B12] mt-0.5">{food.nutrition.carbs}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFF8F0]">
                  <p className="text-[11px] text-[#2D1B12]/60 font-medium">Fats</p>
                  <p className="text-sm font-extrabold text-[#2D1B12] mt-0.5">{food.nutrition.fats}</p>
                </div>
              </div>
            </div>

            {/* Ingredients list */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D1B12]/70 mb-2">
                Fresh Ingredients Used
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {food.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#2D1B12]/10 text-[#2D1B12]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Cooking instructions note */}
            <div>
              <label
                htmlFor="instructions"
                className="block text-xs font-bold uppercase tracking-wider text-[#2D1B12]/70 mb-1.5"
              >
                Special Cooking Instructions (Optional)
              </label>
              <input
                id="instructions"
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Extra spicy, less oil, pack chutney separately..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#2D1B12]/15 text-sm text-[#2D1B12] placeholder-[#2D1B12]/40 focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer with Quantity & Add to Cart */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#2D1B12]/10 flex flex-wrap items-center justify-between gap-4">
          {/* Price & Quantity Selector */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-semibold text-[#2D1B12]/50 uppercase">Total Price</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#2D1B12]">
                  ₹{food.price * quantity}
                </span>
                {food.originalPrice && (
                  <span className="text-xs text-[#2D1B12]/40 line-through">
                    ₹{food.originalPrice * quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity +/- Buttons */}
            <div className="flex items-center bg-[#FFF8F0] border border-[#2D1B12]/15 rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white text-[#2D1B12] transition-colors"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#2D1B12]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white text-[#2D1B12] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add To Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF6B35] text-white hover:bg-[#E85A27] shadow-[#FF6B35]/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Add to Cart • ₹{food.price * quantity}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
