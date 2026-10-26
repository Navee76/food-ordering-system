import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Order, OrderStatus } from '../types';
import { useToast } from './ToastContext';
import { FOOD_ITEMS } from '../data/mockData';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    couponApplied?: string;
    deliveryTip: number;
    totalAmount: number;
    customer: Order['customer'];
    deliverySlot: string;
    paymentMethod: 'cod' | 'upi' | 'card';
  }) => Order;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  isAutoTracking: boolean;
  setIsAutoTracking: (enabled: boolean) => void;
}

const ORDER_STAGES: OrderStatus[] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Food',
  'Out for Delivery',
  'Delivered',
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'FB-78241',
    date: 'Yesterday, 8:15 PM',
    timestamp: Date.now() - 86400000,
    items: [
      { item: FOOD_ITEMS[0], quantity: 1 }, // Hyderabadi Biryani
      { item: FOOD_ITEMS[21], quantity: 1 }, // Hot Gulab Jamun
    ],
    subtotal: 494,
    deliveryFee: 0,
    taxes: 25,
    discount: 50,
    couponApplied: 'FLAT50',
    deliveryTip: 20,
    totalAmount: 489,
    customer: {
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: 'Flat 402, Sunshine Apartments, 12th Main Road, HAL 2nd Stage',
      city: 'Bengaluru',
      pincode: '560038',
      addressType: 'Home',
      instructions: 'Leave at front door and ring bell.',
    },
    deliverySlot: 'Standard (25-35 min)',
    paymentMethod: 'upi',
    status: 'Delivered',
    statusHistory: [
      { status: 'Order Placed', time: '8:15 PM', completed: true },
      { status: 'Order Confirmed', time: '8:17 PM', completed: true },
      { status: 'Preparing Food', time: '8:24 PM', completed: true },
      { status: 'Out for Delivery', time: '8:36 PM', completed: true },
      { status: 'Delivered', time: '8:48 PM', completed: true },
    ],
    deliveryPartner: {
      name: 'Rajesh Kumar',
      phone: '+91 98111 22334',
      rating: 4.9,
      vehicle: 'Honda Activa (KA-03-EB-4192)',
    },
  },
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isAutoTracking, setIsAutoTracking] = useState(true);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('freshbite_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('freshbite_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('freshbite_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('freshbite_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('freshbite_active_order');
      }
    } catch (e) {
      console.error('Failed to save active order', e);
    }
  }, [activeOrder]);

  const placeOrder = (orderData: {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    couponApplied?: string;
    deliveryTip: number;
    totalAmount: number;
    customer: Order['customer'];
    deliverySlot: string;
    paymentMethod: 'cod' | 'upi' | 'card';
  }): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `FB-${randomNum}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: `Today, ${timeStr}`,
      timestamp: Date.now(),
      status: 'Order Placed',
      statusHistory: [
        { status: 'Order Placed', time: timeStr, completed: true },
        { status: 'Order Confirmed', time: 'In progress', completed: false },
        { status: 'Preparing Food', time: 'Pending', completed: false },
        { status: 'Out for Delivery', time: 'Pending', completed: false },
        { status: 'Delivered', time: 'Pending', completed: false },
      ],
      deliveryPartner: {
        name: 'Ramesh Patel',
        phone: '+91 98450 78912',
        rating: 4.85,
        vehicle: 'TVS Ntorq (KA-01-MJ-5582)',
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    showToast(`Order #${orderId} successfully placed!`, 'success');
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        const currentIndex = ORDER_STAGES.indexOf(order.status);
        if (currentIndex < ORDER_STAGES.length - 1) {
          const nextStatus = ORDER_STAGES[currentIndex + 1];
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const updatedHistory = order.statusHistory.map((step, idx) => {
            if (idx <= currentIndex + 1) {
              return {
                ...step,
                time: idx === currentIndex + 1 ? timeStr : step.time,
                completed: true,
              };
            }
            return step;
          });

          const updatedOrder: Order = {
            ...order,
            status: nextStatus,
            statusHistory: updatedHistory,
          };

          if (activeOrder?.id === orderId) {
            setActiveOrder(updatedOrder);
          }

          showToast(`Order update: ${nextStatus}!`, 'info');
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (activeOrder?.id === orderId) {
      setActiveOrder(null);
    }
    showToast(`Order #${orderId} has been cancelled`, 'info');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Simulated auto-progression for testing the tracking feature
  useEffect(() => {
    if (!isAutoTracking || !activeOrder) return;
    if (activeOrder.status === 'Delivered') return;

    const timer = setTimeout(() => {
      advanceOrderStatus(activeOrder.id);
    }, 12000); // Advances automatically every 12 seconds in live demo mode

    return () => clearTimeout(timer);
  }, [activeOrder, isAutoTracking]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        advanceOrderStatus,
        cancelOrder,
        getOrderById,
        isAutoTracking,
        setIsAutoTracking,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
