import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Eye, EyeOff, Lock, Mail, User, Phone, ShieldAlert, Sparkles, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (authModalMode === 'register') {
      if (!name.trim()) {
        errs.name = 'Full name is required';
      }
      if (!phone.trim()) {
        errs.phone = 'Phone number is required';
      } else if (!/^\+?[0-9\s-]{10,14}$/.test(phone.trim())) {
        errs.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (authModalMode === 'login') {
      login(email, password);
    } else {
      register(name, email, phone, password);
    }
  };

  const handleQuickDemoLogin = () => {
    login('aarav.sharma@example.com', 'password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FFF8F0] rounded-3xl shadow-2xl border border-[#FF6B35]/20 overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-[#2D1B12]/60 hover:text-[#2D1B12] hover:bg-white transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 bg-white border-b border-[#2D1B12]/10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFF0E1] text-[#FF6B35] mb-3">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-2xl font-black text-[#2D1B12]">
            {authModalMode === 'login' ? 'Welcome Back!' : 'Join FreshBite'}
          </h3>
          <p className="text-xs text-[#2D1B12]/60 mt-1">
            {authModalMode === 'login'
              ? 'Log in to track orders, save favorites & reorder fast.'
              : 'Sign up to unlock delicious food discounts and easy checkout.'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-[#FFF8F0] p-1 mt-4 border border-[#2D1B12]/10">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-[#FF6B35] shadow-xs'
                  : 'text-[#2D1B12]/60 hover:text-[#2D1B12]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authModalMode === 'register'
                  ? 'bg-white text-[#FF6B35] shadow-xs'
                  : 'text-[#2D1B12]/60 hover:text-[#2D1B12]'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Simulation Notice Disclaimer */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-[11px] text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong className="font-bold">Simulated Authentication:</strong> Frontend demo only. No real credentials or sensitive passwords are transmitted to any server.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D1B12]/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border text-sm text-[#2D1B12] outline-none transition-colors ${
                        errors.name ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D1B12]/40" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border text-sm text-[#2D1B12] outline-none transition-colors ${
                        errors.phone ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D1B12]/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border text-sm text-[#2D1B12] outline-none transition-colors ${
                    errors.email ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D1B12]/70 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2D1B12]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border text-sm text-[#2D1B12] outline-none transition-colors ${
                    errors.password ? 'border-rose-500' : 'border-[#2D1B12]/15 focus:border-[#FF6B35]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2D1B12]/40 hover:text-[#2D1B12]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-2xl bg-[#FF6B35] text-white text-sm font-bold shadow-lg hover:bg-[#E85A27] transition-all active:scale-95"
            >
              {authModalMode === 'login' ? 'Sign In to Account' : 'Create Free Account'}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#2D1B12]/10" />
              <span className="flex-shrink mx-3 text-[11px] font-bold text-[#2D1B12]/40 uppercase tracking-wider">
                Or Quick Test
              </span>
              <div className="flex-grow border-t border-[#2D1B12]/10" />
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 rounded-2xl bg-white border border-[#FF6B35]/40 text-[#2D1B12] text-xs font-bold hover:bg-[#FFF0E1] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              <span>Fill & Sign In with Demo Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
