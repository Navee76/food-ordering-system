import React, { useEffect, useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { useOrders } from '../context/OrderContext';
import { OrderStatus } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Bike,
  ChefHat,
  ShoppingBag,
  PackageCheck,
  Phone,
  Star,
  MapPin,
  ArrowRight,
  RotateCw,
  Play,
  Pause,
  Printer,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId?: string | null;
  onNavigate: (page: NavPage) => void;
}

const STAGES: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
  {
    status: 'Order Placed',
    label: 'Order Placed',
    icon: ShoppingBag,
    desc: 'We have received your order details and payment.',
  },
  {
    status: 'Order Confirmed',
    label: 'Order Confirmed',
    icon: PackageCheck,
    desc: 'Restaurant accepted your order and began setup.',
  },
  {
    status: 'Preparing Food',
    label: 'Preparing Food',
    icon: ChefHat,
    desc: 'Master chefs are cooking your meal with fresh ingredients.',
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    icon: Bike,
    desc: 'Delivery partner has picked up your meal and is on the way!',
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    icon: CheckCircle2,
    desc: 'Order reached your doorstep. Bon appétit!',
  },
];

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const { orders, activeOrder, advanceOrderStatus, isAutoTracking, setIsAutoTracking } = useOrders();

  // Find order
  const currentOrder = orderId
    ? orders.find((o) => o.id === orderId) || activeOrder || orders[0]
    : activeOrder || orders[0];

  useEffect(() => {
    // Fire festive celebratory confetti on page mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B35', '#FFA62B', '#2D1B12', '#10B981'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-[#2D1B12]">No Active Order Found</h2>
        <p className="text-xs text-[#2D1B12]/60">
          You haven't placed an order yet or the session has ended.
        </p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold"
        >
          Browse Delicious Menu
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.status === currentOrder.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner: Success Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#2D1B12]/8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Successfully Placed!
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2D1B12] mt-2">
            Order #{currentOrder.id}
          </h1>
          <p className="text-xs sm:text-sm text-[#2D1B12]/70 font-medium">
            Thank you for ordering with FreshBite! Your food is being prepared fresh.
          </p>
        </div>

        {/* Estimated Arrival Pill */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#FFF0E1] border border-[#FF6B35]/30 text-xs font-extrabold text-[#2D1B12]">
          <Clock className="w-4 h-4 text-[#FF6B35]" />
          <span>Estimated Delivery Time: 25 - 30 mins</span>
        </div>
      </div>

      {/* Live Order Tracking Interactive Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1B12]/8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D1B12]/8 pb-4">
          <div>
            <span className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
              Real-Time Tracking
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#2D1B12]">
              Live Order Status
            </h2>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAutoTracking(!isAutoTracking)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isAutoTracking
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {isAutoTracking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Auto-Progress: {isAutoTracking ? 'ON' : 'OFF'}</span>
            </button>

            {currentOrder.status !== 'Delivered' && (
              <button
                onClick={() => advanceOrderStatus(currentOrder.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Simulate Next Step</span>
              </button>
            )}
          </div>
        </div>

        {/* Tracking Timeline Progress Bar */}
        <div className="relative py-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isFuture = idx > currentStageIndex;

              return (
                <div key={stage.status} className="relative flex sm:flex-col items-center gap-4 sm:gap-2 text-left sm:text-center">
                  {/* Step Icon Node */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all z-10 shrink-0 ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : isCurrent
                        ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/40 ring-4 ring-[#FF6B35]/20 animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  {/* Text Details */}
                  <div className="space-y-0.5">
                    <p
                      className={`text-xs font-extrabold ${
                        isCurrent
                          ? 'text-[#FF6B35]'
                          : isPast
                          ? 'text-emerald-700'
                          : 'text-[#2D1B12]/40'
                      }`}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-[#2D1B12]/60 hidden sm:block leading-tight">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Card (Active when Out for Delivery or Delivered) */}
        {currentOrder.deliveryPartner && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F0] border border-[#FF6B35]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] text-white flex items-center justify-center shadow-md">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2D1B12]/60 uppercase tracking-wider">
                  Assigned Delivery Hero
                </span>
                <h4 className="font-extrabold text-sm text-[#2D1B12]">
                  {currentOrder.deliveryPartner.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#2D1B12]/70 mt-0.5">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-current" />
                    {currentOrder.deliveryPartner.rating}
                  </span>
                  <span>•</span>
                  <span>{currentOrder.deliveryPartner.vehicle}</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${currentOrder.deliveryPartner.phone}`}
              onClick={(e) => {
                e.preventDefault();
                alert(`Simulated Call to Delivery Partner (${currentOrder.deliveryPartner?.name}): ${currentOrder.deliveryPartner?.phone}`);
              }}
              className="px-4 py-2 rounded-xl bg-white border border-[#2D1B12]/15 text-[#2D1B12] text-xs font-bold hover:bg-[#2D1B12] hover:text-white transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Call Rider (Demo)</span>
            </a>
          </div>
        )}
      </div>

      {/* Order Details & Receipt Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ordered Food Items */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#2D1B12]/8 shadow-sm space-y-4">
          <h3 className="font-extrabold text-[#2D1B12] text-base border-b border-[#2D1B12]/8 pb-3">
            Items in Order ({currentOrder.items.length})
          </h3>

          <div className="divide-y divide-[#2D1B12]/5">
            {currentOrder.items.map(({ item, quantity }) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-[#2D1B12] text-sm">{item.name}</h5>
                    <p className="text-[11px] text-[#2D1B12]/50">{item.restaurantName}</p>
                    <span className="text-[11px] font-bold text-[#FF6B35]">
                      Qty: {quantity} × ₹{item.price}
                    </span>
                  </div>
                </div>
                <span className="font-black text-[#2D1B12] text-sm">
                  ₹{item.price * quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Bill Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#2D1B12]/8 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs text-[#2D1B12] uppercase tracking-wider">
              Delivery Details
            </h4>
            <div className="space-y-1 text-xs text-[#2D1B12]/80">
              <p className="font-bold text-[#2D1B12]">{currentOrder.customer.name}</p>
              <p>{currentOrder.customer.phone}</p>
              <p className="text-[11px] leading-relaxed text-[#2D1B12]/70">
                {currentOrder.customer.address}, {currentOrder.customer.city} - {currentOrder.customer.pincode}
              </p>
              {currentOrder.customer.instructions && (
                <p className="text-[11px] text-[#FFA62B] italic pt-1">
                  Note: "{currentOrder.customer.instructions}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#2D1B12]/10 space-y-1.5 text-xs text-[#2D1B12]/80">
              <div className="flex justify-between">
                <span>Payment</span>
                <span className="font-bold uppercase text-[#2D1B12]">
                  {currentOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid</span>
                <span className="font-black text-sm text-[#FF6B35]">
                  ₹{currentOrder.totalAmount}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="w-full py-3 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>Order More Food</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
