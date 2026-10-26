import React, { useState } from 'react';
import { NavPage } from './Navbar';
import { Flame, Mail, Phone, MapPin, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to FreshBite Weekly Deals newsletter!', 'success');
  };

  return (
    <footer className="bg-[#2D1B12] text-[#FFF8F0] pt-16 pb-10 border-t border-[#FF6B35]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#FF6B35] to-[#FFA62B] p-6 sm:p-10 mb-14 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="space-y-1.5 text-center lg:text-left z-10">
            <span className="text-xs font-black tracking-widest uppercase bg-black/20 px-3 py-1 rounded-full">
              Stay Deliciously Updated
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Get ₹100 Off Your First Food Order!
            </h3>
            <p className="text-sm text-white/90 max-w-md">
              Subscribe to secret chef specials, weekly discount codes, and local foodie stories.
            </p>
          </div>

          <div className="w-full lg:w-auto z-10">
            {subscribed ? (
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-5 py-3 rounded-2xl text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>You're subscribed! Check your inbox for FEAST100.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-4 py-3 rounded-2xl bg-white text-[#2D1B12] placeholder-[#2D1B12]/50 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2D1B12]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#2D1B12] text-white font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-md shrink-0"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-white shadow-md">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Fresh<span className="text-[#FF6B35]">Bite</span>
              </span>
            </div>

            <p className="text-sm text-[#FFF8F0]/70 leading-relaxed max-w-sm">
              FreshBite connects food lovers with top chef-curated restaurants across India. Hot, hygienic, and comforting food delivered directly to your doorstep in 30 minutes.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#FFA62B] font-semibold">
              <Heart className="w-4 h-4 fill-current text-rose-500" />
              <span>Crafted for Web Development Internship Task</span>
            </div>
            <p className="text-xs text-[#FFF8F0]/50 font-medium">
              Data Alcott Systems – Virtual Experience Program
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF8F0]/70">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('restaurants')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  All Restaurants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Food Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Special Offers & Coupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Cuisines
            </h4>
            <ul className="space-y-2 text-sm text-[#FFF8F0]/70">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Hyderabadi Dum Biryani
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  North Indian & Tandoor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Crispy South Indian Dosas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Woodfired Sourdough Pizza
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#FF6B35] transition-colors"
                >
                  Gourmet Burgers & Shakes
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FFF8F0]/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                <span>Indiranagar 100ft Road, Bengaluru, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <span>+91 1800-419-BITE (Simulated)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <span>support@freshbite.example.com</span>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-xs font-bold text-[#FFA62B] hover:underline"
                >
                  Visit Contact Page →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF8F0]/50">
          <p>© {new Date().getFullYear()} FreshBite Online Food Delivery. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About Us
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Help & FAQ
            </button>
            <span className="text-[#FFF8F0]/30">•</span>
            <span>Task for Data Alcott Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
