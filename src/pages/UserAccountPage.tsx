import React, { useState } from 'react';
import { NavPage } from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FoodItem, Order, SavedAddress } from '../types';
import {
  User,
  ListOrdered,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Check,
  RotateCw,
  ShoppingBag,
  ExternalLink,
  Edit2,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Home,
  Briefcase,
} from 'lucide-react';
import { DietaryBadge } from '../components/common/DietaryBadge';

interface UserAccountPageProps {
  onNavigate: (page: NavPage) => void;
  onTrackOrder: (orderId: string) => void;
  onOpenProductDetail: (food: FoodItem) => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({
  onNavigate,
  onTrackOrder,
  onOpenProductDetail,
}) => {
  const {
    currentUser,
    updateProfile,
    addAddress,
    removeAddress,
    setDefaultAddress,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useAuth();
  const { orders } = useOrders();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('orders');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');

  // Add Address Modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newPin, setNewPin] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF0E1] text-[#FF6B35] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#2D1B12]">Account Sign In Required</h2>
        <p className="text-xs text-[#2D1B12]/60">
          Sign in or create a simulated account to view order history, saved addresses, and favorite dishes.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-6 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold shadow-md hover:bg-[#E85A27]"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    updateProfile({ name: profileName, phone: profilePhone });
    setIsEditingProfile(false);
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim() || !newPin.trim()) {
      showToast('Please fill all address fields', 'error');
      return;
    }
    addAddress({
      label: newLabel,
      address: newStreet.trim(),
      city: newCity.trim(),
      pincode: newPin.trim(),
      isDefault: isDefault,
    });
    setIsAddAddressOpen(false);
    setNewStreet('');
    setNewPin('');
    setIsDefault(false);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(({ item, quantity }) => {
      addToCart(item, quantity);
    });
    showToast(`Items from order #${order.id} added to cart!`, 'success');
    onNavigate('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1B12]/8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-3xl object-cover border-4 border-[#FFF8F0] shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-black text-[#2D1B12]">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0E1] text-[#FF6B35]">
                Foodie Member
              </span>
            </div>
            <p className="text-xs text-[#2D1B12]/60 mt-0.5 flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{currentUser.email}</span>
            </p>
            <p className="text-xs text-[#2D1B12]/60 mt-0.5 flex items-center gap-2 justify-center sm:justify-start">
              <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{currentUser.phone}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setProfileName(currentUser.name);
            setProfilePhone(currentUser.phone);
            setIsEditingProfile(true);
          }}
          className="px-4 py-2 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/15 text-[#2D1B12] text-xs font-bold hover:bg-[#2D1B12] hover:text-white transition-all flex items-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#2D1B12]/10 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'bg-white text-[#2D1B12]/70 hover:bg-[#FFF0E1]'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'bg-white text-[#2D1B12]/70 hover:bg-[#FFF0E1]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'bg-white text-[#2D1B12]/70 hover:bg-[#FFF0E1]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Addresses ({currentUser.savedAddresses.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#2D1B12]/8 p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#FF6B35] mx-auto" />
              <h3 className="text-lg font-bold text-[#2D1B12]">No Orders Yet</h3>
              <p className="text-xs text-[#2D1B12]/60">
                You haven't placed any food orders yet. Treat yourself to a warm meal!
              </p>
              <button
                onClick={() => onNavigate('menu')}
                className="mt-2 px-6 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#2D1B12]/8 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D1B12]/8 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-sm sm:text-base text-[#2D1B12]">
                        Order #{order.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#FFF0E1] text-[#FF6B35]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2D1B12]/50 mt-0.5">{order.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTrackOrder(order.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FFF8F0] border border-[#FF6B35]/30 text-[#FF6B35] text-xs font-bold hover:bg-[#FF6B35] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#2D1B12] text-white text-xs font-bold hover:bg-[#FF6B35] transition-colors flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {order.items.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FFF8F0] border border-[#2D1B12]/5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#2D1B12] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#2D1B12]/60">
                          Qty: {quantity} • ₹{item.price * quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-[#2D1B12]/70 pt-2 border-t border-[#2D1B12]/5">
                  <span>
                    Delivered to: <strong>{order.customer.addressType}</strong> ({order.customer.city})
                  </span>
                  <span className="font-extrabold text-[#2D1B12] text-sm">
                    Paid ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#2D1B12]/8 p-8 space-y-3">
              <Heart className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-[#2D1B12]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#2D1B12]/60">
                Click the heart icon on any dish to save it here for quick access later!
              </p>
              <button
                onClick={() => onNavigate('menu')}
                className="mt-2 px-6 py-2.5 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((food) => (
                <div
                  key={food.id}
                  className="bg-white rounded-3xl p-4 border border-[#2D1B12]/8 shadow-sm flex items-center justify-between gap-3"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 cursor-pointer"
                    onClick={() => onOpenProductDetail(food)}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <DietaryBadge type={food.dietary} isGlutenFree={food.isGlutenFree} size="sm" />
                      <h4
                        onClick={() => onOpenProductDetail(food)}
                        className="font-bold text-xs sm:text-sm text-[#2D1B12] truncate cursor-pointer hover:text-[#FF6B35]"
                      >
                        {food.name}
                      </h4>
                    </div>
                    <p className="text-[10px] text-[#2D1B12]/60 truncate">{food.restaurantName}</p>
                    <span className="text-xs font-black text-[#2D1B12]">₹{food.price}</span>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => addToCart(food, 1)}
                      className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => toggleWishlist(food)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors text-center text-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Delivery Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#2D1B12]">
              Saved Locations
            </h3>
            <button
              onClick={() => setIsAddAddressOpen(true)}
              className="px-4 py-2 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold hover:bg-[#E85A27] transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-3xl p-5 border border-[#2D1B12]/8 shadow-sm space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {addr.label === 'Home' ? (
                      <Home className="w-4 h-4 text-[#FF6B35]" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-[#FFA62B]" />
                    )}
                    <span className="font-extrabold text-sm text-[#2D1B12]">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        Default
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#2D1B12]/80 leading-relaxed">
                  {addr.address}, {addr.city} - {addr.pincode}
                </p>

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-xs font-bold text-[#FF6B35] hover:underline"
                  >
                    Set as default address
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFF8F0] rounded-3xl p-6 shadow-2xl border border-[#FF6B35]/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#2D1B12]">Edit Profile Info</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#2D1B12]/15 text-xs font-bold text-[#2D1B12] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#2D1B12]/15 text-xs font-bold text-[#2D1B12] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold shadow-md hover:bg-[#E85A27] transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[#FFF8F0] rounded-3xl p-6 shadow-2xl border border-[#FF6B35]/20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#2D1B12]">Add Delivery Address</h3>
              <button
                onClick={() => setIsAddAddressOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewAddress} className="space-y-3">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewLabel(lbl)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      newLabel === lbl
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-white border border-[#2D1B12]/10 text-[#2D1B12]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                  Street Address
                </label>
                <textarea
                  rows={2}
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="Flat, building, street, locality"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#2D1B12]/15 text-xs font-semibold text-[#2D1B12] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-4 py-2 rounded-2xl bg-white border border-[#2D1B12]/15 text-xs font-semibold text-[#2D1B12] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="560001"
                    className="w-full px-4 py-2 rounded-2xl bg-white border border-[#2D1B12]/15 text-xs font-semibold text-[#2D1B12] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="makeDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <label htmlFor="makeDefault" className="text-xs text-[#2D1B12]/80 font-medium">
                  Set as default delivery address
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#FF6B35] text-white text-xs font-bold shadow-md hover:bg-[#E85A27] transition-all"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
