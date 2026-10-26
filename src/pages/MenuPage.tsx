import React, { useState, useMemo } from 'react';
import { FOOD_ITEMS, RESTAURANTS } from '../data/mockData';
import { FoodCategory, FoodItem, Restaurant, DietaryType } from '../types';
import { FoodCard } from '../components/food/FoodCard';
import { Search, X, Store, ArrowUpDown, Sparkles, Filter, Leaf } from 'lucide-react';

interface MenuPageProps {
  selectedRestaurant: Restaurant | null;
  onClearSelectedRestaurant: () => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenProductDetail: (food: FoodItem) => void;
  initialCategory?: FoodCategory;
}

const CATEGORIES: FoodCategory[] = [
  'Starters',
  'Main Course',
  'Biryani',
  'Pizza',
  'Burgers',
  'Desserts',
  'Beverages',
];

export const MenuPage: React.FC<MenuPageProps> = ({
  selectedRestaurant,
  onClearSelectedRestaurant,
  onSelectRestaurant,
  onOpenProductDetail,
  initialCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [isGlutenFreeOnly, setIsGlutenFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    return FOOD_ITEMS.filter((food) => {
      // Restaurant filter
      if (selectedRestaurant && food.restaurantId !== selectedRestaurant.id) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = food.name.toLowerCase().includes(q);
        const matchesDesc = food.description.toLowerCase().includes(q);
        const matchesRest = food.restaurantName.toLowerCase().includes(q);
        const matchesIng = food.ingredients.some((i) => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesRest && !matchesIng) return false;
      }

      // Category
      if (selectedCategory !== 'All' && food.category !== selectedCategory) {
        return false;
      }

      // Dietary
      if (selectedDietary !== 'All') {
        if (selectedDietary === 'veg' && food.dietary !== 'veg') return false;
        if (selectedDietary === 'non-veg' && food.dietary !== 'non-veg') return false;
        if (selectedDietary === 'vegan' && food.dietary !== 'vegan') return false;
      }

      // Gluten Free
      if (isGlutenFreeOnly && !food.isGlutenFree) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });
  }, [
    selectedRestaurant,
    searchQuery,
    selectedCategory,
    selectedDietary,
    isGlutenFreeOnly,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDietary('All');
    setIsGlutenFreeOnly(false);
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Selected Restaurant Header Banner (if filtering by restaurant) */}
      {selectedRestaurant ? (
        <div className="relative rounded-3xl overflow-hidden bg-[#2D1B12] text-white shadow-xl border border-[#FF6B35]/20">
          <div className="absolute inset-0">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B12] via-[#2D1B12]/90 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFA62B] uppercase tracking-wider">
                  Menu for
                </span>
                {selectedRestaurant.isPureVeg && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    Pure Veg
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
                {selectedRestaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                {selectedRestaurant.tagline} • {selectedRestaurant.cuisine.join(', ')}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 pt-1">
                <span>⏱ {selectedRestaurant.deliveryTime}</span>
                <span>•</span>
                <span>⭐ {selectedRestaurant.rating} ({selectedRestaurant.reviewsCount}+ ratings)</span>
                <span>•</span>
                <span>📍 {selectedRestaurant.address}</span>
              </div>
            </div>

            <button
              onClick={onClearSelectedRestaurant}
              className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Show All Restaurants</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            Curated Culinary Delights
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2D1B12]">
            Explore FreshBite Menu
          </h1>
          <p className="text-sm text-[#2D1B12]/70 max-w-2xl">
            Choose from authentic biryanis, sourdough pizzas, street chaats, rich gravies, and desserts prepared fresh upon your order.
          </p>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B35]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes, paneer, chicken, spices..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/10 text-sm text-[#2D1B12] placeholder-[#2D1B12]/40 outline-none focus:border-[#FF6B35]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/10 text-xs font-bold text-[#2D1B12]">
              <ArrowUpDown className="w-4 h-4 text-[#FF6B35]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold text-xs"
              >
                <option value="rating">Top Rated Dishes</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#FF6B35] text-white shadow-md'
                  : 'bg-[#FFF8F0] text-[#2D1B12]/70 hover:bg-[#FFF0E1] hover:text-[#2D1B12]'
              }`}
            >
              All Items
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#FF6B35] text-white shadow-md'
                    : 'bg-[#FFF8F0] text-[#2D1B12]/70 hover:bg-[#FFF0E1] hover:text-[#2D1B12]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Filters: All, Veg, Non-Veg, Vegan, Gluten-Free */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#2D1B12]/5 text-xs">
          <span className="text-[11px] font-bold text-[#2D1B12]/50 uppercase tracking-wider mr-1">
            Dietary:
          </span>

          <button
            onClick={() => setSelectedDietary('All')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedDietary === 'All'
                ? 'bg-[#2D1B12] text-white'
                : 'bg-[#FFF8F0] text-[#2D1B12]/70 hover:bg-[#FFF0E1]'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setSelectedDietary('veg')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border flex items-center gap-1.5 ${
              selectedDietary === 'veg'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Vegetarian
          </button>

          <button
            onClick={() => setSelectedDietary('non-veg')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border flex items-center gap-1.5 ${
              selectedDietary === 'non-veg'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-white text-rose-800 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Non-Veg
          </button>

          <button
            onClick={() => setSelectedDietary('vegan')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border flex items-center gap-1.5 ${
              selectedDietary === 'vegan'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Leaf className="w-3 h-3 text-current" />
            Vegan
          </button>

          <button
            onClick={() => setIsGlutenFreeOnly(!isGlutenFreeOnly)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
              isGlutenFreeOnly
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'
            }`}
          >
            Gluten-Free Only
          </button>

          {(searchQuery || selectedCategory !== 'All' || selectedDietary !== 'All' || isGlutenFreeOnly) && (
            <button
              onClick={resetAllFilters}
              className="ml-auto text-xs text-rose-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Dishes Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-[#2D1B12]/60 uppercase tracking-wider">
            Showing {filteredFoods.length} delicious dishes
          </p>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#2D1B12]/8 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FFF0E1] text-[#FF6B35] flex items-center justify-center mx-auto text-2xl">
              🍲
            </div>
            <h3 className="text-xl font-bold text-[#2D1B12]">No Dishes Match Your Search</h3>
            <p className="text-xs text-[#2D1B12]/60 max-w-sm mx-auto">
              We couldn't find any items matching your selected criteria. Try adjusting dietary filters or category.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onOpenDetails={onOpenProductDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
