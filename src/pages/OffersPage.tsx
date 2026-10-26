import React, { useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { COUPONS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { Percent, Copy, Check, Sparkles, Tag, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface OffersPageProps {
  onNavigate: (page: NavPage) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon "${code}" copied! You can paste it on cart.`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApplyAndOrder = (code: string) => {
    applyCoupon(code);
    onNavigate('menu');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#2D1B12] to-[#452718] text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-[#FF6B35]/30">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-[#FF6B35]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FFA62B]">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Exclusive Foodie Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Save Big On Every Meal!
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Apply verified discount coupons, enjoy free delivery vouchers, and indulge in your favourite dishes without breaking the bank.
          </p>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-[#2D1B12]">
          Available Promo Coupons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUPONS.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl p-6 border border-[#2D1B12]/8 shadow-sm hover:shadow-xl hover:border-[#FF6B35]/30 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Decorative dash line */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF0E1] text-[#FF6B35] flex items-center justify-center font-black">
                      %
                    </div>
                    <span className="font-mono text-base font-black text-[#FF6B35]">
                      {coupon.code}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#2D1B12]">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% Instant Discount`
                      : `Flat ₹${coupon.discountValue} OFF`}
                  </h3>
                  <p className="text-xs text-[#2D1B12]/70 mt-1 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-[#2D1B12]/60 pt-2 border-t border-[#2D1B12]/5">
                  <p>• Minimum order amount: ₹{coupon.minOrder}</p>
                  {coupon.maxDiscount && (
                    <p>• Maximum savings cap: ₹{coupon.maxDiscount}</p>
                  )}
                  <p>• Valid on all participating restaurants</p>
                </div>
              </div>

              {/* Actions: Copy Code & Apply */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-[#2D1B12] text-xs font-bold hover:bg-[#FFF0E1] transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyAndOrder(coupon.code)}
                  className="py-2.5 px-4 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Everyday Perks Section */}
      <div className="bg-[#FFF0E1] rounded-3xl p-6 sm:p-8 border border-[#FF6B35]/25">
        <h3 className="font-extrabold text-base text-[#2D1B12] mb-3">
          FreshBite Member Perks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#2D1B12]/80">
          <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#2D1B12]/5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2D1B12]">Free Delivery on ₹499+</p>
              <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">Automatically unlocked at checkout, no coupon required.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#2D1B12]/5">
            <Clock className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2D1B12]">On-Time Guarantee</p>
              <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">If delayed by 15+ minutes, get a ₹50 apology coupon.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#2D1B12]/5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2D1B12]">Surprise Weekend Treats</p>
              <p className="text-[11px] text-[#2D1B12]/60 mt-0.5">Complimentary desserts with partner restaurant orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
