import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem } from '../types';
import { FOOD_ITEMS } from '../data/mockData';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistItems: FoodItem[];
  toggleWishlist: (food: FoodItem) => void;
  isInWishlist: (foodId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freshbite_wishlist');
      return saved ? JSON.parse(saved) : ['food-1', 'food-4', 'food-8'];
    } catch {
      return ['food-1', 'food-4', 'food-8'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('freshbite_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlistIds]);

  const toggleWishlist = (food: FoodItem) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(food.id);
      if (exists) {
        showToast(`Removed "${food.name}" from your wishlist`, 'info');
        return prev.filter((id) => id !== food.id);
      } else {
        showToast(`Saved "${food.name}" to your wishlist!`, 'success');
        return [...prev, food.id];
      }
    });
  };

  const isInWishlist = (foodId: string) => wishlistIds.includes(foodId);

  const clearWishlist = () => {
    setWishlistIds([]);
    showToast('Wishlist cleared', 'info');
  };

  const wishlistItems = FOOD_ITEMS.filter((item) => wishlistIds.includes(item.id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
