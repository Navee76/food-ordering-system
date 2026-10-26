export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export type FoodCategory =
  | 'Starters'
  | 'Main Course'
  | 'Biryani'
  | 'Pizza'
  | 'Burgers'
  | 'Desserts'
  | 'Beverages';

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: FoodCategory;
  dietary: DietaryType;
  isGlutenFree?: boolean;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  };
  spicyLevel?: 1 | 2 | 3;
  prepTime?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string[];
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  deliveryFee: number;
  priceRange: '₹' | '₹₹' | '₹₹₹';
  priceForTwo: number;
  image: string;
  featured?: boolean;
  isPureVeg?: boolean;
  address: string;
  discountBadge?: string;
  openingHours?: string;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  instructions?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  description: string;
  maxDiscount?: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  targetType: 'restaurant' | 'food' | 'general';
  targetId?: string;
  targetName?: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing Food'
  | 'Out for Delivery'
  | 'Delivered';

export interface Order {
  id: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  couponApplied?: string;
  deliveryTip: number;
  totalAmount: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    instructions?: string;
    addressType: 'Home' | 'Work' | 'Other';
  };
  deliverySlot: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    time: string;
    completed: boolean;
  }[];
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
  };
}

export interface SavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedAddresses: SavedAddress[];
}
