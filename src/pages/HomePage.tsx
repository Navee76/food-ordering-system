import React, { useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { FOOD_ITEMS, RESTAURANTS, COUPONS, CUSTOMER_REVIEWS } from '../data/mockData';
import { FoodItem, Restaurant, CustomerReview, FoodCategory } from '../types';
import { FoodCard } from '../components/food/FoodCard';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { RatingBadge } from '../components/common/RatingBadge';
import { useToast } from '../context/ToastContext';
import {
  Flame,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Bike,
  UtensilsCrossed,
  Search,
  Star,
  Copy,
  Check,
  MessageSquarePlus,
  Percent,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: NavPage) => void;
  onSelectFood: (food: FoodItem) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSelectCategory: (category: FoodCategory) => void;
  onOpenSearch: () => void;
}

const CATEGORIES: { label: FoodCategory; icon: string; count: number }[] = [
  { label: 'Biryani', icon: '🍚', count: 12 },
  { label: 'Main Course', icon: '🍛', count: 24 },
  { label: 'Starters', icon: '🍢', count: 18 },
  { label: 'Pizza', icon: '🍕', count: 14 },
  { label: 'Burgers', icon: '🍔', count: 9 },
  { label: 'Desserts', icon: '🍨', count: 15 },
  { label: 'Beverages', icon: '🥤', count: 11 },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectFood,
  onSelectRestaurant,
  onSelectCategory,
  onOpenSearch,
}) => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Review submission modal state
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(CUSTOMER_REVIEWS);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const featuredDishes = FOOD_ITEMS.filter((f) => f.isBestseller).slice(0, 8);
  const popularRestaurants = RESTAURANTS.slice(0, 4);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please provide both name and review comment', 'error');
      return;
    }

    const newRev: CustomerReview = {
      id: 'rev-' + Date.now(),
      author: newReviewAuthor.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      targetType: 'general',
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsReviewModalOpen(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
    showToast('Thank you for sharing your review with FreshBite!', 'success');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#2D1B12] via-[#3D2519] to-[#2D1B12] text-white overflow-hidden shadow-2xl p-6 sm:p-12 lg:p-16 border border-[#FF6B35]/20">
            {/* Background ambient food pattern */}
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#FF6B35]/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#FFA62B]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline & Call To Action */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#FFA62B]">
                  <Sparkles className="w-4 h-4 fill-current text-[#FFA62B]" />
                  <span>The #1 Food Delivery Experience in Town</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Delicious Food, <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FFA62B]">
                    Delivered to Your Door.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Craving steaming Hyderabadi Dum Biryani, woodfired artisanal pizzas, creamy butter chicken, or fresh Mysore dosas? Order now and enjoy hot, hygienic meals in under 30 minutes!
                </p>

                {/* Search Bar & Order CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl mx-auto lg:mx-0">
                  <div
                    onClick={onOpenSearch}
                    className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white text-[#2D1B12] cursor-pointer shadow-lg hover:ring-2 hover:ring-[#FF6B35] transition-all"
                  >
                    <Search className="w-5 h-5 text-[#FF6B35] shrink-0" />
                    <span className="text-sm text-[#2D1B12]/60 font-medium">
                      Search dishes, biryani, burgers, pasta...
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('menu')}
                    className="px-8 py-3.5 rounded-2xl bg-[#FF6B35] text-white font-extrabold text-sm hover:bg-[#E85A27] transition-all shadow-xl shadow-[#FF6B35]/40 flex items-center justify-center gap-2 active:scale-95 shrink-0"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Trust Metrics */}
                <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                  <div>
                    <span className="text-2xl font-black text-white">30 min</span>
                    <p className="text-xs text-white/60">Average Delivery</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">4.8 ★</span>
                    <p className="text-xs text-white/60">50k+ Happy Diners</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white">100%</span>
                    <p className="text-xs text-white/60">Hygienic Packaging</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                    alt="Delicious hot cooked food spread"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Floating floating card: Hot Deal */}
                  <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md text-[#2D1B12] shadow-xl flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FFF0E1] text-[#FF6B35]">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#2D1B12]/60 uppercase">Trending Today</p>
                      <p className="text-xs font-black text-[#2D1B12]">Hyderabadi Dum Biryani</p>
                    </div>
                  </div>

                  {/* Floating floating card: Delivery status */}
                  <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-[#2D1B12]/90 backdrop-blur-md text-white shadow-xl flex items-center gap-3 border border-white/15">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-400">Order Dispatched</p>
                      <p className="text-xs font-bold text-white">Delivering in 24 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMO COUPONS BANNER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FFF0E1] border border-[#FF6B35]/25 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FF6B35] text-white">
                <Percent className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2D1B12]">
                  Special Promo Codes & Discounts
                </h3>
                <p className="text-xs text-[#2D1B12]/70">
                  Click any coupon code below to copy it instantly for your cart!
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('offers')}
              className="text-xs font-bold text-[#FF6B35] hover:text-[#2D1B12] transition-colors flex items-center gap-1"
            >
              <span>View All Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COUPONS.slice(0, 4).map((c) => (
              <div
                key={c.code}
                onClick={() => handleCopyCoupon(c.code)}
                className="group relative p-3.5 rounded-2xl bg-white border border-[#2D1B12]/10 hover:border-[#FF6B35] hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-black text-[#FF6B35] group-hover:underline">
                    {c.code}
                  </span>
                  <p className="text-[11px] text-[#2D1B12]/70 mt-0.5 line-clamp-1">
                    {c.description}
                  </p>
                </div>

                <div className="p-1.5 rounded-lg bg-[#FFF8F0] text-[#2D1B12]/60 group-hover:text-[#FF6B35] transition-colors">
                  {copiedCode === c.code ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. RESTAURANT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Explore Cravings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12] mt-1">
              Popular Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onSelectCategory(cat.label)}
              className="group p-4 rounded-3xl bg-white border border-[#2D1B12]/8 shadow-xs hover:border-[#FF6B35] hover:shadow-xl hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center"
            >
              <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-[#2D1B12] group-hover:text-[#FF6B35] transition-colors">
                {cat.label}
              </span>
              <span className="text-[10px] text-[#2D1B12]/50 font-medium mt-0.5">
                {cat.count}+ items
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED BESTSELLING DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Chef Curated & Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12] mt-1">
              Featured Dishes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Dishes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((food) => (
            <FoodCard key={food.id} food={food} onOpenDetails={onSelectFood} />
          ))}
        </div>
      </section>

      {/* 5. POPULAR RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Top Rated Eateries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12] mt-1">
              Popular Restaurants
            </h2>
          </div>
          <button
            onClick={() => onNavigate('restaurants')}
            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>See All Restaurants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onSelect={onSelectRestaurant}
            />
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE FRESHBITE (Feature Highlights) */}
      <section className="bg-white py-14 border-y border-[#2D1B12]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Our Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12] mt-1">
              Why Diners Love FreshBite
            </h2>
            <p className="text-sm text-[#2D1B12]/70 mt-2">
              We take pride in delivering restaurant-quality hot meals straight to your table with utmost hygiene and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#FFF8F0] border border-[#2D1B12]/8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2D1B12]">Lightning Fast Delivery</h3>
              <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
                Smart routing algorithms and dedicated fleet ensure food reaches within 30 minutes, piping hot!
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF8F0] border border-[#2D1B12]/8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2D1B12]">100% Hygienic Packaging</h3>
              <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
                Double-sealed food containers and sanitised contact-free drop-off for maximum customer peace of mind.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF8F0] border border-[#2D1B12]/8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFA62B] text-white flex items-center justify-center mx-auto shadow-md">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2D1B12]">Authentic Kitchens</h3>
              <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
                Handpicked top culinary legends from Royal Awadh Biryanis to South Indian tiffin masters.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFF8F0] border border-[#2D1B12]/8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#2D1B12] text-white flex items-center justify-center mx-auto shadow-md">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2D1B12]">Live Order Tracking</h3>
              <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
                Real-time simulated tracking from kitchen prep to doorstep with step-by-step milestone updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & RATINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Real Diners, Real Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12] mt-1">
              Customer Reviews & Ratings
            </h2>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-white border border-[#2D1B12]/8 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < rev.rating ? 'fill-current' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#2D1B12]/50 font-medium">{rev.date}</span>
                </div>

                <p className="text-xs text-[#2D1B12]/80 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {rev.targetName && (
                  <p className="text-[10px] font-bold text-[#FF6B35] mt-2">
                    Dish: {rev.targetName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#2D1B12]/5">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#2D1B12]">{rev.author}</h4>
                  <p className="text-[10px] text-emerald-600 font-semibold">Verified Diner</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. REVIEW SUBMISSION MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFF8F0] rounded-3xl shadow-2xl border border-[#FF6B35]/20 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#2D1B12]">Write a Review</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-xs font-bold text-[#2D1B12]/60 hover:text-[#2D1B12]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-amber-500"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#2D1B12] ml-2">
                    {newReviewRating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Radhika Sen"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#2D1B12]/15 text-sm text-[#2D1B12] outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Your Review & Food Experience
                </label>
                <textarea
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell us what you enjoyed about the flavors, delivery, or food presentation..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#2D1B12]/15 text-sm text-[#2D1B12] outline-none focus:border-[#FF6B35]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#FF6B35] text-white text-sm font-bold shadow-lg hover:bg-[#E85A27] transition-all"
              >
                Submit Review (Simulated)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
