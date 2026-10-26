/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Navbar, NavPage } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ProductDetailModal } from './components/food/ProductDetailModal';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { OffersPage } from './pages/OffersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import { FoodCategory, FoodItem, Restaurant } from './types';

function FreshBiteApp() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orderConfirmationId, setOrderConfirmationId] = useState<string | null>(null);
  const [menuInitialCategory, setMenuInitialCategory] = useState<FoodCategory | undefined>(undefined);

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setMenuInitialCategory(undefined);
    setCurrentPage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category: FoodCategory) => {
    setSelectedRestaurant(null);
    setMenuInitialCategory(category);
    setCurrentPage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderId: string) => {
    setOrderConfirmationId(orderId);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromAccount = (orderId: string) => {
    setOrderConfirmationId(orderId);
    setCurrentPage('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-[#2D1B12]">
      {/* Global Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectFood={(food) => setSelectedFoodForDetail(food)}
            onSelectRestaurant={handleSelectRestaurant}
            onSelectCategory={handleSelectCategory}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentPage === 'restaurants' && (
          <RestaurantsPage onSelectRestaurant={handleSelectRestaurant} />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            selectedRestaurant={selectedRestaurant}
            onClearSelectedRestaurant={() => setSelectedRestaurant(null)}
            onSelectRestaurant={handleSelectRestaurant}
            onOpenProductDetail={(food) => setSelectedFoodForDetail(food)}
            initialCategory={menuInitialCategory}
          />
        )}

        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order-confirmation' && (
          <OrderConfirmationPage
            orderId={orderConfirmationId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'account' && (
          <UserAccountPage
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackOrderFromAccount}
            onOpenProductDetail={(food) => setSelectedFoodForDetail(food)}
          />
        )}

        {currentPage === 'offers' && <OffersPage onNavigate={handleNavigate} />}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Slide-out Quick Cart Drawer */}
      <CartDrawer
        onNavigateToCart={() => handleNavigate('cart')}
        onNavigateToCheckout={() => handleNavigate('checkout')}
      />

      {/* Global Authentication Modal (Simulated) */}
      <AuthModal />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectFood={(food) => setSelectedFoodForDetail(food)}
        onSelectRestaurant={handleSelectRestaurant}
      />

      {/* Global Food Item Detail Modal */}
      <ProductDetailModal
        food={selectedFoodForDetail}
        onClose={() => setSelectedFoodForDetail(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>
              <FreshBiteApp />
            </OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
