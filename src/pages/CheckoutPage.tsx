import React, { useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  QrCode,
  Banknote,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: NavPage) => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderSuccess }) => {
  const { items, subtotal, deliveryFee, taxes, discount, coupon, deliveryTip, finalTotal, deliverySlot, clearCart } =
    useCart();
  const { currentUser } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  // Form Fields initialized from current user if available
  const defaultAddress = currentUser?.savedAddresses.find((a) => a.isDefault) || currentUser?.savedAddresses[0];

  const [name, setName] = useState(currentUser?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(
    defaultAddress?.address || 'Flat 402, Sunshine Apartments, 12th Main Road, HAL 2nd Stage'
  );
  const [city, setCity] = useState(defaultAddress?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(defaultAddress?.pincode || '560038');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>(
    defaultAddress?.label || 'Home'
  );
  const [instructions, setInstructions] = useState('Ring bell and leave at door step.');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('aarav@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  // Dummy Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardHolder, setCardHolder] = useState('Aarav Sharma');

  // Simulation Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#2D1B12]">No Items in Cart for Checkout</h2>
        <p className="text-xs text-[#2D1B12]/60">
          Your cart is currently empty. Please add items to checkout.
        </p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold"
        >
          Explore Food Menu
        </button>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Please enter your name';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!address.trim()) errs.address = 'Delivery address cannot be empty';
    if (!city.trim()) errs.city = 'City is required';
    if (!pincode.trim()) {
      errs.pincode = 'PIN Code is required';
    } else if (!/^[0-9]{6}$/.test(pincode.trim())) {
      errs.pincode = 'Please enter a valid 6-digit PIN code';
    }

    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        errs.upi = 'Please enter a valid UPI ID (e.g. name@okhdfcbank)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct the highlighted form errors', 'error');
      return;
    }

    setIsProcessing(true);
    setProcessingStage('Verifying delivery details & inventory...');

    setTimeout(() => {
      setProcessingStage(
        paymentMethod === 'cod'
          ? 'Confirming Cash on Delivery booking...'
          : paymentMethod === 'upi'
          ? 'Simulating secure UPI authorization...'
          : 'Simulating card payment gateway tokenization...'
      );
    }, 1000);

    setTimeout(() => {
      setProcessingStage('Generating order invoice & notifying kitchen...');
    }, 2200);

    setTimeout(() => {
      const newOrder = placeOrder({
        items: [...items],
        subtotal,
        deliveryFee,
        taxes,
        discount,
        couponApplied: coupon ? coupon.code : undefined,
        deliveryTip,
        totalAmount: finalTotal,
        customer: {
          name,
          phone,
          address,
          city,
          pincode,
          addressType,
          instructions,
        },
        deliverySlot,
        paymentMethod,
      });

      clearCart();
      setIsProcessing(false);
      onOrderSuccess(newOrder.id);
    }, 3200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title */}
      <div>
        <button
          onClick={() => onNavigate('cart')}
          className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1 mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-3xl font-black text-[#2D1B12]">Delivery & Checkout</h1>
        <p className="text-xs text-[#2D1B12]/60 font-medium">
          Confirm your delivery address and choose a simulated payment option.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Form & Payment Methods */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Details */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 font-extrabold text-[#2D1B12] text-base border-b border-[#2D1B12]/8 pb-3">
              <MapPin className="w-5 h-5 text-[#FF6B35]" />
              <span>1. Delivery Address</span>
            </div>

            {/* Address Type Badges */}
            <div className="flex items-center gap-2">
              {(['Home', 'Work', 'Other'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAddressType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    addressType === type
                      ? 'bg-[#FF6B35] text-white shadow-xs'
                      : 'bg-[#FFF8F0] border border-[#2D1B12]/10 text-[#2D1B12] hover:bg-[#FFF0E1]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Recipient Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D1B12]/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                      errors.name ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D1B12]/40" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                      errors.phone ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Complete Street Address *
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat number, apartment or society name, street, landmark"
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                    errors.address ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                    errors.city ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="6 digit PIN code (e.g. 560038)"
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border text-xs font-semibold text-[#2D1B12] outline-none ${
                    errors.pincode ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                  }`}
                />
                {errors.pincode && <p className="text-[11px] text-rose-600 mt-1">{errors.pincode}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Leave with security guard, don't ring bell, call upon arrival"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-xs font-semibold text-[#2D1B12] outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#2D1B12]/8 pb-3">
              <div className="flex items-center gap-2.5 font-extrabold text-[#2D1B12] text-base">
                <CreditCard className="w-5 h-5 text-[#FF6B35]" />
                <span>2. Payment Method (Simulated)</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Safe Demo
              </span>
            </div>

            {/* Clear Simulation Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Payment Gateway Simulation Notice</p>
                <p className="text-[11px] text-amber-800/90 mt-0.5">
                  This web application is a frontend simulator. No real money or card transaction will take place. Do not enter actual confidential credentials.
                </p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#FF6B35] bg-[#FFF0E1] text-[#2D1B12] ring-1 ring-[#FF6B35]'
                    : 'border-[#2D1B12]/10 bg-white hover:border-[#FF6B35]/40 text-[#2D1B12]'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs">
                  <QrCode className="w-4 h-4 text-[#FF6B35]" />
                  <span>UPI Payment</span>
                </div>
                <p className="text-[11px] text-[#2D1B12]/60 mt-1">
                  Google Pay, PhonePe, Paytm QR
                </p>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#FF6B35] bg-[#FFF0E1] text-[#2D1B12] ring-1 ring-[#FF6B35]'
                    : 'border-[#2D1B12]/10 bg-white hover:border-[#FF6B35]/40 text-[#2D1B12]'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs">
                  <CreditCard className="w-4 h-4 text-[#FF6B35]" />
                  <span>Credit / Debit Card</span>
                </div>
                <p className="text-[11px] text-[#2D1B12]/60 mt-1">
                  Visa, MasterCard, RuPay
                </p>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#FF6B35] bg-[#FFF0E1] text-[#2D1B12] ring-1 ring-[#FF6B35]'
                    : 'border-[#2D1B12]/10 bg-white hover:border-[#FF6B35]/40 text-[#2D1B12]'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-xs">
                  <Banknote className="w-4 h-4 text-[#FF6B35]" />
                  <span>Cash on Delivery</span>
                </div>
                <p className="text-[11px] text-[#2D1B12]/60 mt-1">
                  Pay cash or UPI at your door
                </p>
              </div>
            </div>

            {/* Dynamic Payment Options View */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/10 space-y-3">
                <p className="text-xs font-bold text-[#2D1B12]">Simulated UPI Flow:</p>
                <div className="flex items-center gap-2">
                  {(['gpay', 'phonepe', 'paytm'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        selectedUpiApp === app
                          ? 'bg-[#2D1B12] text-white'
                          : 'bg-white border border-[#2D1B12]/10 text-[#2D1B12]'
                      }`}
                    >
                      {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : 'Paytm'}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2D1B12]/70 uppercase mb-1">
                    Enter Virtual UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#2D1B12]/15 text-xs font-semibold text-[#2D1B12] outline-none focus:border-[#FF6B35]"
                  />
                  {errors.upi && <p className="text-[11px] text-rose-600 mt-1">{errors.upi}</p>}
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D1B12]">
                  <span>Simulated Card Credentials</span>
                  <span className="text-[10px] text-[#2D1B12]/50">Dummy Demo Form</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2D1B12]/70 uppercase mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 0000 0000 8821"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#2D1B12]/15 text-xs font-mono font-bold text-[#2D1B12] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B12]/70 uppercase mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#2D1B12]/15 text-xs font-mono font-bold text-[#2D1B12] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B12]/70 uppercase mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#2D1B12]/15 text-xs font-mono font-bold text-[#2D1B12] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/10 text-xs text-[#2D1B12]/80 space-y-1">
                <p className="font-bold text-[#2D1B12]">Cash / UPI on Delivery Selected</p>
                <p>
                  Please keep exact change of ₹{finalTotal} or scan the rider's QR code upon delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#2D1B12] text-base border-b border-[#2D1B12]/8 pb-3">
              Order Summary
            </h3>

            {/* Items Mini List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="font-bold text-[#FF6B35]">{quantity}x</span>
                    <span className="truncate text-[#2D1B12] font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#2D1B12]">₹{item.price * quantity}</span>
                </div>
              ))}
            </div>

            {/* Delivery Window summary */}
            <div className="p-3 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/8 text-xs space-y-0.5">
              <span className="text-[10px] font-bold text-[#2D1B12]/50 uppercase">Delivery Slot:</span>
              <p className="font-bold text-[#2D1B12]">{deliverySlot}</p>
            </div>

            {/* Bill Breakdown */}
            <div className="pt-2 border-t border-[#2D1B12]/10 space-y-2 text-xs text-[#2D1B12]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#2D1B12]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#2D1B12]">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Taxes (5%)</span>
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
                  <span>Coupon ({coupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#2D1B12]/10 flex justify-between items-baseline">
                <span className="text-sm font-black text-[#2D1B12]">Total Payable</span>
                <span className="text-2xl font-black text-[#FF6B35]">₹{finalTotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-[#FF6B35] text-white text-sm font-extrabold shadow-xl hover:bg-[#E85A27] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-75 disabled:pointer-events-none"
            >
              <Lock className="w-4 h-4" />
              <span>Place Order • ₹{finalTotal}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Processing Simulated Payment Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#FFF8F0] rounded-3xl p-8 text-center space-y-5 border border-[#FF6B35]/30 shadow-2xl">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-[#FF6B35]/20 border-t-[#FF6B35] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-[#FF6B35]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#2D1B12]">
                Processing Order...
              </h3>
              <p className="text-xs text-[#2D1B12]/70 font-medium">
                {processingStage}
              </p>
            </div>

            <p className="text-[11px] text-[#2D1B12]/40 italic">
              Simulated transaction — please do not close this window.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
