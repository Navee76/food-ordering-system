import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Coupon, FoodItem } from '../types';
import { COUPONS } from '../data/mockData';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: FoodItem, quantity?: number, instructions?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  coupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  deliveryTip: number;
  setDeliveryTip: (tip: number) => void;
  deliverySlot: string;
  setDeliverySlot: (slot: string) => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  finalTotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load cart from LocalStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshbite_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load coupon from LocalStorage
  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('freshbite_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [deliveryTip, setDeliveryTip] = useState<number>(0);
  const [deliverySlot, setDeliverySlot] = useState<string>('Standard (25-35 min)');

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('freshbite_cart_items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('freshbite_applied_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('freshbite_applied_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [coupon]);

  const addToCart = (item: FoodItem, quantity: number = 1, instructions?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          instructions: instructions || next[existingIndex].instructions,
        };
        showToast(`Updated "${item.name}" quantity to ${newQty}`, 'success');
        return next;
      } else {
        showToast(`Added "${item.name}" to your cart!`, 'success');
        return [...prev, { item, quantity, instructions }];
      }
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => {
      const target = prev.find((ci) => ci.item.id === itemId);
      if (target) {
        showToast(`Removed "${target.item.name}" from cart`, 'info');
      }
      return prev.filter((ci) => ci.item.id !== itemId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    showToast('Your cart has been cleared', 'info');
  };

  const getItemQuantity = (itemId: string) => {
    const found = items.find((ci) => ci.item.id === itemId);
    return found ? found.quantity : 0;
  };

  // Calculations
  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, ci) => sum + ci.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 499 ? 0 : 35;
  }, [subtotal]);

  const platformFee = useMemo(() => {
    return subtotal > 0 ? 5 : 0;
  }, [subtotal]);

  const taxes = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.round(subtotal * 0.05); // 5% GST
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!coupon || subtotal === 0) return 0;
    if (subtotal < coupon.minOrder) return 0;

    let disc = 0;
    if (coupon.discountType === 'percentage') {
      disc = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && disc > coupon.maxDiscount) {
        disc = coupon.maxDiscount;
      }
    } else {
      disc = coupon.discountValue;
    }
    return Math.min(disc, subtotal);
  }, [coupon, subtotal]);

  const finalTotal = useMemo(() => {
    if (subtotal === 0) return 0;
    const calc = subtotal + deliveryFee + taxes + platformFee + deliveryTip - discount;
    return Math.max(0, calc);
  }, [subtotal, deliveryFee, taxes, platformFee, deliveryTip, discount]);

  // Check coupon validity if cart subtotal changes
  useEffect(() => {
    if (coupon && subtotal < coupon.minOrder) {
      setCoupon(null);
      showToast(`Coupon ${coupon.code} removed (Minimum order ₹${coupon.minOrder})`, 'info');
    }
  }, [subtotal, coupon, showToast]);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) {
      showToast(`Invalid coupon code "${cleanCode}"`, 'error');
      return { success: false, message: 'Invalid coupon code. Try WELCOME10 or FLAT50.' };
    }

    if (subtotal < found.minOrder) {
      showToast(`Minimum order of ₹${found.minOrder} required for ${found.code}`, 'error');
      return {
        success: false,
        message: `Add items worth ₹${found.minOrder - subtotal} more to apply this coupon.`,
      };
    }

    setCoupon(found);
    showToast(`Coupon ${found.code} applied! Saved discount applied.`, 'success');
    return { success: true, message: `Coupon ${found.code} successfully applied!` };
  };

  const removeCoupon = () => {
    if (coupon) {
      showToast(`Coupon ${coupon.code} removed`, 'info');
      setCoupon(null);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        coupon,
        applyCoupon,
        removeCoupon,
        deliveryTip,
        setDeliveryTip,
        deliverySlot,
        setDeliverySlot,
        totalItemsCount,
        subtotal,
        deliveryFee,
        platformFee,
        taxes,
        discount,
        finalTotal,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
