import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import {
  Flame,
  Search,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Percent,
  Clock,
  LogOut,
  ListOrdered,
  BookOpen,
  PhoneCall,
  Store,
} from 'lucide-react';

export type NavPage =
  | 'home'
  | 'restaurants'
  | 'menu'
  | 'offers'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenSearch: () => void;
}

const CITIES = [
  'Indiranagar, Bengaluru',
  'Koramangala, Bengaluru',
  'Bandra West, Mumbai',
  'Connaught Place, New Delhi',
  'Banjara Hills, Hyderabad',
  'T. Nagar, Chennai',
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { totalItemsCount, subtotal, setIsDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const { currentUser, isAuthenticated, setIsAuthModalOpen, setAuthModalMode, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(CITIES[0]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navLinks: { label: string; page: NavPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Restaurants', page: 'restaurants' },
    { label: 'Menu', page: 'menu' },
    { label: 'Offers', page: 'offers' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#2D1B12]/8">
      {/* Top micro banner for announcement */}
      <div className="bg-[#2D1B12] text-[#FFF8F0] text-xs py-1.5 px-4 text-center font-medium">
        <span>⚡ Super Fast Delivery in 30 mins or less! Use code </span>
        <button
          onClick={() => handleNavClick('offers')}
          className="text-[#FFA62B] font-bold underline hover:text-white transition-colors"
        >
          WELCOME10
        </button>
        <span> for 10% off</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-white shadow-md shadow-[#FF6B35]/30 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#2D1B12] block leading-none">
                  Fresh<span className="text-[#FF6B35]">Bite</span>
                </span>
                <span className="text-[10px] font-semibold text-[#2D1B12]/60 tracking-wider uppercase block mt-0.5">
                  Food Delivered
                </span>
              </div>
            </button>

            {/* Delivery Location Selector */}
            <div className="hidden lg:relative lg:block">
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#2D1B12]/10 text-xs font-semibold text-[#2D1B12]/80 hover:border-[#FF6B35] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                <span className="max-w-[140px] truncate">{selectedLocation}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#2D1B12]/50" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#2D1B12]/10 p-2 z-50 animate-in fade-in">
                  <p className="text-[11px] font-bold text-[#2D1B12]/50 uppercase px-3 py-1">
                    Select Delivery City
                  </p>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedLocation(city);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${
                        selectedLocation === city
                          ? 'bg-[#FFF0E1] text-[#FF6B35] font-bold'
                          : 'text-[#2D1B12] hover:bg-[#FFF8F0]'
                      }`}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === link.page
                    ? 'text-[#FF6B35] bg-[#FF6B35]/10 font-bold'
                    : 'text-[#2D1B12]/80 hover:text-[#FF6B35] hover:bg-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions: Search, Wishlist, Cart, User */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Bar / Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-[#2D1B12]/10 text-xs font-semibold text-[#2D1B12]/70 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all shadow-xs"
              title="Search dishes & restaurants"
            >
              <Search className="w-4 h-4 text-[#FF6B35]" />
              <span className="hidden sm:inline">Search food...</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => handleNavClick('account')}
              className="relative p-2.5 rounded-2xl bg-white border border-[#2D1B12]/10 text-[#2D1B12] hover:text-rose-500 hover:border-rose-300 transition-colors shadow-xs"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FF6B35] text-white hover:bg-[#E85A27] transition-all shadow-md shadow-[#FF6B35]/25 active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#2D1B12] text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FF6B35]">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs">
                {subtotal > 0 ? `₹${subtotal}` : 'Cart'}
              </span>
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated && currentUser ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white border border-[#2D1B12]/10 hover:border-[#FF6B35] transition-all shadow-xs"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-xl object-cover"
                    />
                    <span className="hidden xl:inline text-xs font-bold text-[#2D1B12] max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#2D1B12]/50" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#2D1B12]/10 p-2 z-50 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-[#2D1B12]/10 mb-1">
                        <p className="text-xs font-bold text-[#2D1B12] truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#2D1B12]/50 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleNavClick('account');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#2D1B12] hover:bg-[#FFF8F0] hover:text-[#FF6B35] transition-colors flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5" />
                        My Profile & Addresses
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleNavClick('account');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#2D1B12] hover:bg-[#FFF8F0] hover:text-[#FF6B35] transition-colors flex items-center gap-2"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                        Order History
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 mt-1 border-t border-[#2D1B12]/5 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out (Simulated)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-white border border-[#2D1B12]/15 text-xs font-bold text-[#2D1B12] hover:bg-[#2D1B12] hover:text-white transition-all shadow-xs"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-2xl bg-white border border-[#2D1B12]/10 text-[#2D1B12] md:hidden hover:bg-[#FFF0E1] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#2D1B12]/10 bg-[#FFF8F0] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentPage === link.page
                    ? 'bg-[#FF6B35] text-white'
                    : 'text-[#2D1B12] hover:bg-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#2D1B12]/10 flex flex-col gap-2">
            <button
              onClick={() => {
                handleNavClick('cart');
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#2D1B12]/10 text-xs font-bold text-[#2D1B12]"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FF6B35]" />
                Shopping Cart ({totalItemsCount} items)
              </span>
              <span>₹{subtotal}</span>
            </button>

            <button
              onClick={() => {
                handleNavClick('account');
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#2D1B12]/10 text-xs font-bold text-[#2D1B12]"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF6B35]" />
                User Account & Orders
              </span>
              <span className="text-[#2D1B12]/50">View</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
