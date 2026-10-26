import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Utensils, Store, ArrowRight, Plus } from 'lucide-react';
import { FOOD_ITEMS, RESTAURANTS } from '../../data/mockData';
import { FoodItem, Restaurant } from '../../types';
import { DietaryBadge } from './DietaryBadge';
import { RatingBadge } from './RatingBadge';
import { useCart } from '../../context/CartContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: (food: FoodItem) => void;
  onSelectRestaurant: (rest: Restaurant) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
  onSelectRestaurant,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  const matchedRestaurants = cleanQ
    ? RESTAURANTS.filter(
        (r) =>
          r.name.toLowerCase().includes(cleanQ) ||
          r.cuisine.some((c) => c.toLowerCase().includes(cleanQ)) ||
          r.tagline.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedFoods = cleanQ
    ? FOOD_ITEMS.filter(
        (f) =>
          f.name.toLowerCase().includes(cleanQ) ||
          f.category.toLowerCase().includes(cleanQ) ||
          f.description.toLowerCase().includes(cleanQ) ||
          f.ingredients.some((i) => i.toLowerCase().includes(cleanQ))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFF8F0] rounded-3xl shadow-2xl border border-[#FF6B35]/20 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2D1B12]/10 bg-white">
          <Search className="w-5 h-5 text-[#FF6B35] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dishes, biryani, pizza, or restaurants..."
            className="flex-1 text-base text-[#2D1B12] placeholder-[#2D1B12]/40 bg-transparent outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#2D1B12]/40 hover:text-[#2D1B12] hover:bg-[#FFF8F0]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FFF8F0] text-[#2D1B12]/70 hover:bg-[#2D1B12]/5 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!cleanQ ? (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-[#2D1B12]/60 uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Hyderabadi Biryani', 'Butter Chicken', 'Masala Dosa', 'Woodfired Pizza', 'Momos', 'Gulab Jamun', 'Filter Coffee'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#2D1B12]/10 text-[#2D1B12]/80 hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-[#FF6B35]/5 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <>
              {matchedRestaurants.length === 0 && matchedFoods.length === 0 && (
                <div className="py-12 text-center text-[#2D1B12]/60">
                  <p className="text-lg font-bold text-[#2D1B12]">No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try searching for Biryani, Pizza, North Indian, or Burger.</p>
                </div>
              )}

              {/* Matching Restaurants */}
              {matchedRestaurants.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1 text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
                    <Store className="w-4 h-4" />
                    Restaurants ({matchedRestaurants.length})
                  </div>
                  <div className="space-y-2">
                    {matchedRestaurants.map((rest) => (
                      <div
                        key={rest.id}
                        onClick={() => {
                          onSelectRestaurant(rest);
                          onClose();
                        }}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-[#2D1B12]/5 hover:border-[#FF6B35]/40 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={rest.image}
                            alt={rest.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[#2D1B12] text-sm group-hover:text-[#FF6B35] transition-colors">
                                {rest.name}
                              </h4>
                              {rest.isPureVeg && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-sm">
                                  PURE VEG
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#2D1B12]/60 line-clamp-1">
                              {rest.cuisine.join(' • ')} • {rest.deliveryTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RatingBadge rating={rest.rating} size="sm" />
                          <ArrowRight className="w-4 h-4 text-[#2D1B12]/30 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Dishes */}
              {matchedFoods.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1 text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
                    <Utensils className="w-4 h-4" />
                    Dishes & Drinks ({matchedFoods.length})
                  </div>
                  <div className="space-y-2">
                    {matchedFoods.map((food) => (
                      <div
                        key={food.id}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-[#2D1B12]/5 hover:border-[#FF6B35]/40 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          onSelectFood(food);
                          onClose();
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <DietaryBadge type={food.dietary} isGlutenFree={food.isGlutenFree} size="sm" />
                              <h4 className="font-bold text-[#2D1B12] text-sm truncate group-hover:text-[#FF6B35] transition-colors">
                                {food.name}
                              </h4>
                            </div>
                            <p className="text-xs text-[#2D1B12]/60 truncate">
                              from <span className="font-medium text-[#2D1B12]/80">{food.restaurantName}</span>
                            </p>
                            <span className="text-xs font-bold text-[#2D1B12]">₹{food.price}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(food, 1);
                          }}
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
