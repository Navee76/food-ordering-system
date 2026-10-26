import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavedAddress, UserProfile } from '../types';
import { DEFAULT_USER } from '../data/mockData';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('freshbite_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('freshbite_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('freshbite_user');
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [currentUser]);

  const login = (email: string) => {
    // Simulated authentication
    const user: UserProfile = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      phone: '+91 98765 12345',
      avatar: DEFAULT_USER.avatar,
      savedAddresses: [...DEFAULT_USER.savedAddresses],
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}! (Simulated login)`, 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string) => {
    const user: UserProfile = {
      id: 'usr-' + Date.now(),
      name,
      email,
      phone,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      savedAddresses: [
        {
          id: 'addr-' + Date.now(),
          label: 'Home',
          address: 'Flat 101, Green Heights, Outer Ring Road',
          city: 'Bengaluru',
          pincode: '560103',
          isDefault: true,
        },
      ],
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`Account created successfully! Welcome to FreshBite, ${name}.`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out (Simulated session)', 'info');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    showToast('Profile information updated successfully', 'success');
  };

  const addAddress = (addressData: Omit<SavedAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddress: SavedAddress = {
      ...addressData,
      id: 'addr-' + Date.now(),
    };
    const updatedAddresses = addressData.isDefault
      ? currentUser.savedAddresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
      : [...currentUser.savedAddresses, newAddress];

    setCurrentUser({
      ...currentUser,
      savedAddresses: updatedAddresses,
    });
    showToast(`New ${addressData.label} address saved`, 'success');
  };

  const removeAddress = (addressId: string) => {
    if (!currentUser) return;
    const filtered = currentUser.savedAddresses.filter((a) => a.id !== addressId);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    setCurrentUser({
      ...currentUser,
      savedAddresses: filtered,
    });
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const updated = currentUser.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    setCurrentUser({
      ...currentUser,
      savedAddresses: updated,
    });
    showToast('Default delivery address changed', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
