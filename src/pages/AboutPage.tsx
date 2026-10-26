import React from 'react';
import { NavPage } from '../components/layout/Navbar';
import {
  Flame,
  Award,
  Heart,
  ShieldCheck,
  Users,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: NavPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E1] text-[#FF6B35] text-xs font-bold border border-[#FF6B35]/30">
          <Flame className="w-4 h-4 fill-current" />
          <span>Our Culinary Journey</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#2D1B12]">
          Delivering Joy, One Hot Bite at a Time
        </h1>
        <p className="text-sm sm:text-base text-[#2D1B12]/70 leading-relaxed font-normal">
          Founded with a simple mission: bringing authentic, restaurant-quality culinary experiences directly to dining tables and workstations across the nation.
        </p>
      </div>

      {/* Story & Image Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            Our Story
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12]">
            From a Local Craving to a Trusted Food Network
          </h2>
          <p className="text-sm text-[#2D1B12]/80 leading-relaxed">
            FreshBite started when our passionate founders noticed a recurring dilemma: late-night study and work sessions often led to soggy, lukewarm delivery meals. We set out to change food delivery standards by prioritizing <strong>thermal packaging, lightning-quick local routing</strong>, and authentic artisan kitchens.
          </p>
          <p className="text-sm text-[#2D1B12]/80 leading-relaxed">
            Today, FreshBite connects tens of thousands of diners with iconic biryani masters, woodfired pizzerias, regional South Indian tiffins, and indie dessert bakeries.
          </p>

          <div className="pt-2 flex items-center gap-6">
            <div>
              <span className="text-2xl font-black text-[#FF6B35]">50,000+</span>
              <p className="text-xs text-[#2D1B12]/60">Meals Delivered</p>
            </div>
            <div>
              <span className="text-2xl font-black text-[#FF6B35]">150+</span>
              <p className="text-xs text-[#2D1B12]/60">Restaurant Partners</p>
            </div>
            <div>
              <span className="text-2xl font-black text-[#FF6B35]">4.8 ★</span>
              <p className="text-xs text-[#2D1B12]/60">Average Diner Rating</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant kitchen chef preparing fresh food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FFA62B]">Handcrafted with love</p>
              <h4 className="font-extrabold text-base">Freshness Guaranteed on Every Plate</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1B12]/8 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E1] text-[#FF6B35] flex items-center justify-center">
            <Award className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-xl font-black text-[#2D1B12]">Our Mission</h3>
          <p className="text-xs sm:text-sm text-[#2D1B12]/70 leading-relaxed">
            To provide diners with an effortless, delightful food ordering experience by championing hygiene, authentic regional recipes, transparent pricing, and swift delivery.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1B12]/8 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E1] text-[#FFA62B] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-xl font-black text-[#2D1B12]">Our Vision</h3>
          <p className="text-xs sm:text-sm text-[#2D1B12]/70 leading-relaxed">
            To become India's most beloved neighborhood food companion, supporting local chefs and small businesses while giving every customer a comforting taste of home.
          </p>
        </div>
      </div>

      {/* Food Quality Standards */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#2D1B12]/8 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            Safety & Freshness First
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1B12]">
            Our Strict Quality Checklist
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[#FFF8F0] space-y-2 text-center sm:text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto sm:mx-0" />
            <h4 className="font-bold text-sm text-[#2D1B12]">FSSAI Certified Kitchens</h4>
            <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
              Every restaurant on FreshBite is physically inspected for hygiene and clean cooking environments.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8F0] space-y-2 text-center sm:text-left">
            <UtensilsCrossed className="w-6 h-6 text-[#FF6B35] mx-auto sm:mx-0" />
            <h4 className="font-bold text-sm text-[#2D1B12]">Tamper-Proof Seals</h4>
            <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
              Orders are packaged in double-sealed eco-friendly containers to lock in heat and freshness.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8F0] space-y-2 text-center sm:text-left">
            <Heart className="w-6 h-6 text-rose-500 mx-auto sm:mx-0" />
            <h4 className="font-bold text-sm text-[#2D1B12]">No Artificial Additives</h4>
            <p className="text-xs text-[#2D1B12]/70 leading-relaxed">
              We encourage partners to use fresh dairy, whole spices, and zero harmful artificial colors.
            </p>
          </div>
        </div>
      </div>

      {/* Internship Project Note */}
      <div className="p-6 rounded-3xl bg-[#FFF0E1] border border-[#FF6B35]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider">
            Academic Project Milestone
          </span>
          <h4 className="text-base font-extrabold text-[#2D1B12]">
            Built for Data Alcott Systems Web Development Internship
          </h4>
          <p className="text-xs text-[#2D1B12]/70">
            A comprehensive simulation of a modern food delivery eCommerce platform using frontend best practices.
          </p>
        </div>

        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Explore Live Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
