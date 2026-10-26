import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Percent,
} from 'lucide-react';
import { COUPONS } from '../../data/mockData';

interface CartDrawerProps {
  onNavigateToCart: () => void;
  onNavigateToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCart,
  onNavigateToCheckout,
}) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    finalTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8F0] shadow-2xl flex flex-col border-l border-[#FF6B35]/20 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#2D1B12]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFF8F0] text-[#FF6B35]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#2D1B12] text-lg">Your Cart</h3>
                <p className="text-xs text-[#2D1B12]/60 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full text-[#2D1B12]/60 hover:text-[#2D1B12] hover:bg-[#FFF8F0] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart items list or empty state */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-[#FFF0E1] flex items-center justify-center text-[#FF6B35] mb-4">
                <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h4 className="text-xl font-bold text-[#2D1B12]">Your Cart is Empty</h4>
              <p className="text-sm text-[#2D1B12]/60 mt-1.5 max-w-xs leading-relaxed">
                Looks like you haven't added anything delicious yet. Browse our curated menu and satisfy your hunger!
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  onNavigateToCart();
                }}
                className="mt-6 px-6 py-3 rounded-2xl bg-[#FF6B35] text-white text-sm font-bold shadow-lg hover:bg-[#E85A27] transition-all"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.map(({ item, quantity, instructions }) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#2D1B12]/8 shadow-xs flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-[#2D1B12] truncate">{item.name}</h5>
                      <p className="text-xs text-[#2D1B12]/50 truncate">{item.restaurantName}</p>
                      {instructions && (
                        <p className="text-[11px] text-[#FFA62B] italic truncate">
                          "{instructions}"
                        </p>
                      )}
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xs font-extrabold text-[#2D1B12]">
                          ₹{item.price * quantity}
                        </span>
                        <span className="text-[10px] text-[#2D1B12]/50">
                          (₹{item.price} each)
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-rose-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Quantity toggle */}
                      <div className="flex items-center bg-[#FFF8F0] border border-[#2D1B12]/10 rounded-xl p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white text-[#2D1B12] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#2D1B12]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white text-[#2D1B12] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free Delivery tracker */}
                <div className="p-3 rounded-2xl bg-white border border-[#2D1B12]/8 text-xs">
                  {subtotal >= 499 ? (
                    <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      Yay! You unlocked FREE Delivery!
                    </p>
                  ) : (
                    <p className="text-[#2D1B12]/80">
                      Add items worth <span className="font-bold text-[#FF6B35]">₹{499 - subtotal}</span> more for <span className="font-bold text-emerald-700">FREE Delivery</span>!
                    </p>
                  )}
                </div>

                {/* Quick Coupon Section */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#2D1B12]/8 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#2D1B12]">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
                      Apply Promo Coupon
                    </span>
                    {coupon && (
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {coupon ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-emerald-700" />
                        <div>
                          <p className="font-bold text-emerald-800">{coupon.code} Applied</p>
                          <p className="text-[10px] text-emerald-600">{coupon.description}</p>
                        </div>
                      </div>
                      <span className="font-bold text-emerald-800">-₹{discount}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => {
                          setInputCoupon(e.target.value);
                          setCouponError('');
                        }}
                        placeholder="Enter coupon (e.g. FLAT50)"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-xs text-[#2D1B12] placeholder-[#2D1B12]/40 uppercase outline-none focus:border-[#FF6B35]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-xl bg-[#2D1B12] text-white text-xs font-bold hover:bg-[#FF6B35] transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}

                  {/* Quick Coupon Chips */}
                  {!coupon && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {COUPONS.slice(0, 2).map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => applyCoupon(c.code)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#FFF8F0] text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35] hover:text-white transition-colors"
                        >
                          Use {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Summary & Checkout */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#2D1B12]/10 space-y-3">
                <div className="space-y-1.5 text-xs text-[#2D1B12]/80">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-[#2D1B12]">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Govt. Taxes (5% GST)</span>
                    <span className="font-semibold">₹{taxes}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#2D1B12]/10 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-[#2D1B12]">To Pay</span>
                    <span className="text-xl font-black text-[#2D1B12]">₹{finalTotal}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onNavigateToCart();
                    }}
                    className="py-3 px-3 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-[#2D1B12] text-xs font-bold hover:bg-[#2D1B12]/5 transition-all text-center"
                  >
                    View Full Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onNavigateToCheckout();
                    }}
                    className="py-3 px-4 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold shadow-lg hover:bg-[#E85A27] transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
