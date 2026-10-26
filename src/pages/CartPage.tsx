import React, { useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { useCart } from '../context/CartContext';
import { COUPONS } from '../data/mockData';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  Percent,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { DietaryBadge } from '../components/common/DietaryBadge';

interface CartPageProps {
  onNavigate: (page: NavPage) => void;
}

const DELIVERY_SLOTS = [
  { id: 'standard', title: 'Standard Delivery', time: '25-35 mins', fee: 0 },
  { id: 'express', title: 'Priority Express', time: '15-20 mins', fee: 20 },
  { id: 'dinner', title: 'Evening Dinner Slot', time: '7:30 PM - 8:30 PM', fee: 0 },
];

const TIP_OPTIONS = [0, 20, 30, 50];

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    platformFee,
    taxes,
    discount,
    finalTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    deliveryTip,
    setDeliveryTip,
    deliverySlot,
    setDeliverySlot,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-28 h-28 rounded-full bg-[#FFF0E1] text-[#FF6B35] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-14 h-14 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#2D1B12]">Your Cart is Empty</h2>
          <p className="text-sm text-[#2D1B12]/60 max-w-md mx-auto">
            You haven't added any dishes yet. Explore our royal biryanis, woodfired pizzas, and street specials!
          </p>
        </div>
        <button
          onClick={() => onNavigate('menu')}
          className="px-8 py-3.5 rounded-2xl bg-[#FF6B35] text-white text-sm font-extrabold shadow-xl hover:bg-[#E85A27] transition-all inline-flex items-center gap-2 active:scale-95"
        >
          <span>Explore FreshBite Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-3xl font-black text-[#2D1B12]">Shopping Cart</h1>
          <p className="text-xs text-[#2D1B12]/60 font-medium">
            Review your dishes, apply discount coupons, and proceed to checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="self-start sm:self-auto text-xs text-rose-600 font-bold px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items & Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items Container */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#2D1B12] text-base border-b border-[#2D1B12]/8 pb-3">
              Order Items ({items.length})
            </h3>

            <div className="divide-y divide-[#2D1B12]/5">
              {items.map(({ item, quantity, instructions }) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary} isGlutenFree={item.isGlutenFree} size="sm" />
                        <h4 className="font-extrabold text-sm sm:text-base text-[#2D1B12]">
                          {item.name}
                        </h4>
                      </div>

                      <p className="text-xs text-[#2D1B12]/60">
                        from <strong className="text-[#2D1B12]">{item.restaurantName}</strong>
                      </p>

                      {instructions && (
                        <p className="text-xs text-[#FFA62B] italic">
                          Note: "{instructions}"
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-black text-[#2D1B12]">
                          ₹{item.price * quantity}
                        </span>
                        <span className="text-xs text-[#2D1B12]/50">
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Remove Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                    <div className="flex items-center bg-[#FFF8F0] border border-[#2D1B12]/15 rounded-2xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white text-[#2D1B12] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-[#2D1B12]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center hover:bg-white text-[#2D1B12] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Slot Selection */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#2D1B12]">
              <Clock className="w-4 h-4 text-[#FF6B35]" />
              <span>Select Delivery Time Window</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DELIVERY_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setDeliverySlot(`${slot.title} (${slot.time})`)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliverySlot.includes(slot.title)
                      ? 'border-[#FF6B35] bg-[#FFF0E1] text-[#2D1B12] ring-1 ring-[#FF6B35]'
                      : 'border-[#2D1B12]/10 bg-white hover:border-[#FF6B35]/40 text-[#2D1B12]/80'
                  }`}
                >
                  <p className="font-bold text-xs text-[#2D1B12]">{slot.title}</p>
                  <p className="text-xs font-semibold text-[#FF6B35] mt-0.5">{slot.time}</p>
                  <p className="text-[10px] text-[#2D1B12]/50 mt-1">
                    {slot.fee === 0 ? 'Standard charge' : `+₹${slot.fee} priority`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Partner Tip Selector */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-sm text-[#2D1B12]">
                <HeartHandshake className="w-4 h-4 text-rose-500" />
                <span>Tip your delivery partner</span>
              </div>
              <span className="text-xs font-bold text-[#FF6B35]">
                {deliveryTip > 0 ? `₹${deliveryTip} added` : 'Optional'}
              </span>
            </div>
            <p className="text-xs text-[#2D1B12]/60">
              100% of the tip goes directly to your rider for braving the weather and traffic!
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {TIP_OPTIONS.map((tip) => (
                <button
                  key={tip}
                  onClick={() => setDeliveryTip(tip)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                    deliveryTip === tip
                      ? 'bg-[#FF6B35] text-white shadow-xs'
                      : 'bg-[#FFF8F0] border border-[#2D1B12]/10 text-[#2D1B12] hover:bg-[#FFF0E1]'
                  }`}
                >
                  {tip === 0 ? 'No tip' : `₹${tip}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Coupon & Bill Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#2D1B12]">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#FF6B35]" />
                Promo Code & Discounts
              </span>
              {coupon && (
                <button
                  onClick={removeCoupon}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Remove
                </button>
              )}
            </div>

            {coupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-700" />
                  <div>
                    <p className="font-extrabold text-emerald-900">{coupon.code} Applied</p>
                    <p className="text-[11px] text-emerald-700">{coupon.description}</p>
                  </div>
                </div>
                <span className="font-black text-emerald-900 text-sm">-₹{discount}</span>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError('');
                  }}
                  placeholder="Enter code (e.g. FLAT50)"
                  className="flex-1 px-3.5 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-xs font-bold text-[#2D1B12] placeholder-[#2D1B12]/40 uppercase outline-none focus:border-[#FF6B35]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-[#2D1B12] text-white text-xs font-bold hover:bg-[#FF6B35] transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-rose-600 font-semibold">{couponError}</p>
            )}

            {/* Quick Coupon Codes */}
            {!coupon && (
              <div className="pt-1">
                <p className="text-[11px] font-bold text-[#2D1B12]/50 uppercase tracking-wider mb-2">
                  Available for You:
                </p>
                <div className="space-y-1.5">
                  {COUPONS.slice(0, 3).map((c) => (
                    <div
                      key={c.code}
                      onClick={() => applyCoupon(c.code)}
                      className="p-2 rounded-xl bg-[#FFF8F0] hover:bg-[#FFF0E1] border border-[#FF6B35]/20 cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-black text-[#FF6B35]">{c.code}</span>
                        <p className="text-[10px] text-[#2D1B12]/70">{c.description}</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#FF6B35]">Apply</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#2D1B12] text-base border-b border-[#2D1B12]/8 pb-3">
              Bill Details
            </h3>

            <div className="space-y-2.5 text-xs text-[#2D1B12]/80">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-[#2D1B12]">₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  Delivery Fee
                  {subtotal >= 499 && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-sm">
                      FREE
                    </span>
                  )}
                </span>
                <span className="font-bold text-[#2D1B12]">
                  {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-bold text-[#2D1B12]">₹{platformFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Govt. Taxes & GST (5%)</span>
                <span className="font-bold text-[#2D1B12]">₹{taxes}</span>
              </div>

              {deliveryTip > 0 && (
                <div className="flex justify-between text-[#FF6B35]">
                  <span>Delivery Partner Tip</span>
                  <span className="font-bold">₹{deliveryTip}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#2D1B12]/10 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-[#2D1B12] block">To Pay</span>
                  <span className="text-[10px] text-[#2D1B12]/50">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-[#2D1B12]">₹{finalTotal}</span>
              </div>
            </div>

            {/* Savings Banner */}
            {discount > 0 && (
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                🎉 Woohoo! You are saving ₹{discount} on this order!
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 rounded-2xl bg-[#FF6B35] text-white text-sm font-extrabold shadow-xl hover:bg-[#E85A27] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
