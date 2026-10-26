import React, { useState, useMemo } from 'react';
import { RESTAURANTS } from '../data/mockData';
import { Restaurant } from '../types';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

interface RestaurantsPageProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

const CUISINES = [
  'All',
  'Biryani',
  'North Indian',
  'South Indian',
  'Pizza',
  'Chinese',
  'Burgers',
  'Desserts',
];

export const RestaurantsPage: React.FC<RestaurantsPageProps> = ({ onSelectRestaurant }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All');
  const [isPureVegOnly, setIsPureVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'priceAsc'>('rating');

  // Filter & sort logic
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter((rest) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rest.name.toLowerCase().includes(q);
        const matchesCuisine = rest.cuisine.some((c) => c.toLowerCase().includes(q));
        const matchesTagline = rest.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesCuisine && !matchesTagline) return false;
      }

      // Cuisine
      if (selectedCuisine !== 'All') {
        const matchesCuisine = rest.cuisine.some(
          (c) => c.toLowerCase() === selectedCuisine.toLowerCase()
        );
        if (!matchesCuisine) return false;
      }

      // Rating
      if (minRating > 0 && rest.rating < minRating) return false;

      // Price Range
      if (selectedPriceRange !== 'All' && rest.priceRange !== selectedPriceRange) return false;

      // Pure Veg
      if (isPureVegOnly && !rest.isPureVeg) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'delivery') {
        const timeA = parseInt(a.deliveryTime);
        const timeB = parseInt(b.deliveryTime);
        return timeA - timeB;
      }
      if (sortBy === 'priceAsc') {
        return a.priceForTwo - b.priceForTwo;
      }
      return 0;
    });
  }, [searchQuery, selectedCuisine, minRating, selectedPriceRange, isPureVegOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setMinRating(0);
    setSelectedPriceRange('All');
    setIsPureVegOnly(false);
    setSortBy('rating');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCuisine !== 'All' ||
    minRating > 0 ||
    selectedPriceRange !== 'All' ||
    isPureVegOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
          Handpicked Kitchens Near You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2D1B12]">
          Discover Top Restaurants
        </h1>
        <p className="text-sm text-[#2D1B12]/70 max-w-2xl">
          Order from the finest restaurants, cloud kitchens, and heritage dhabas delivering steaming hot food with express arrival.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
        {/* Top Search Input & Sorter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B35]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant name, cuisine, or specialty..."
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
                <option value="rating">Sort: Highest Rated</option>
                <option value="delivery">Sort: Fastest Delivery</option>
                <option value="priceAsc">Sort: Price (Low to High)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-3 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Cuisines Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCuisine === cuisine
                  ? 'bg-[#FF6B35] text-white shadow-xs'
                  : 'bg-[#FFF8F0] text-[#2D1B12]/70 hover:bg-[#FFF0E1] hover:text-[#2D1B12]'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Secondary Filter Chips: Pure Veg, Rating, Price */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2D1B12]/5 text-xs">
          {/* Pure Veg Toggle */}
          <button
            onClick={() => setIsPureVegOnly(!isPureVegOnly)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
              isPureVegOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            Pure Veg Only
          </button>

          {/* Rating Filters */}
          <div className="flex items-center gap-1 bg-[#FFF8F0] p-1 rounded-xl border border-[#2D1B12]/10">
            <span className="text-[11px] font-semibold text-[#2D1B12]/50 px-1.5">Rating:</span>
            {[0, 4.0, 4.5].map((val) => (
              <button
                key={val}
                onClick={() => setMinRating(val)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                  minRating === val
                    ? 'bg-[#FF6B35] text-white'
                    : 'text-[#2D1B12]/70 hover:text-[#2D1B12]'
                }`}
              >
                {val === 0 ? 'All' : `${val}+ ★`}
              </button>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-1 bg-[#FFF8F0] p-1 rounded-xl border border-[#2D1B12]/10">
            <span className="text-[11px] font-semibold text-[#2D1B12]/50 px-1.5">Budget:</span>
            {['All', '₹', '₹₹', '₹₹₹'].map((val) => (
              <button
                key={val}
                onClick={() => setSelectedPriceRange(val)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${
                  selectedPriceRange === val
                    ? 'bg-[#FF6B35] text-white'
                    : 'text-[#2D1B12]/70 hover:text-[#2D1B12]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-[#2D1B12]/60 uppercase tracking-wider">
            Showing {filteredRestaurants.length} restaurants
          </p>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#2D1B12]/8 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FFF0E1] text-[#FF6B35] flex items-center justify-center mx-auto text-2xl">
              🍽️
            </div>
            <h3 className="text-xl font-bold text-[#2D1B12]">No Restaurants Found</h3>
            <p className="text-xs text-[#2D1B12]/60 max-w-sm mx-auto">
              No restaurants match your selected filter criteria. Try clearing some filters or searching for something else.
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRestaurants.map((rest) => (
              <RestaurantCard
                key={rest.id}
                restaurant={rest}
                onSelect={onSelectRestaurant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
