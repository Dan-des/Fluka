import React, { memo } from 'react';
import {
  X,
  Heart,
  Sun,
  Moon,
  Download,
  Store,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { ThemeMode } from '../types/store';

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenInstallPwa: () => void;
  activeView: 'store' | 'vendor' | 'admin';
  onSwitchView: (view: 'store' | 'vendor' | 'admin') => void;
}

export const SideNavDrawer: React.FC<SideNavDrawerProps> = memo(({
  isOpen,
  onClose,
  wishlistCount,
  onOpenWishlist,
  theme,
  onToggleTheme,
  onOpenInstallPwa,
  activeView,
  onSwitchView,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleNavigateView = (view: 'store' | 'vendor' | 'admin') => {
    onSwitchView(view);
    onClose();
  };

  const handleWishlistClick = () => {
    onOpenWishlist();
    onClose();
  };

  const handleInstallClick = () => {
    onOpenInstallPwa();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden animate-in fade-in duration-300">
      {/* Rich Depth of Field Blur Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-Over Right Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-xs sm:max-w-sm border-l shadow-2xl flex flex-col justify-between transition-transform duration-300 animate-in slide-in-from-right duration-300 ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-5 border-b flex items-center justify-between gap-4 ${
              isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {/* Branding Logo */}
            <div className="flex items-center gap-3 select-none">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-0.5 shadow-md shadow-cyan-500/20">
                <div
                  className={`h-full w-full rounded-[14px] flex items-center justify-center ${
                    isDark ? 'bg-slate-950' : 'bg-white'
                  }`}
                >
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-500 to-violet-600 tracking-tighter">
                    F
                  </span>
                </div>
              </div>
              <div>
                <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  FLUKA<span className="text-cyan-500">.</span>
                </span>
                <p className={`text-[9px] font-mono tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Navigation Menu
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                  : 'bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Options List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Secondary Controls Section */}
            <div className="space-y-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick Actions
              </span>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  isDark
                    ? 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-slate-200 hover:text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                  </div>
                  <span className="text-xs font-bold">Saved Wishlist</span>
                </div>
                {wishlistCount > 0 ? (
                  <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full font-mono text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                ) : (
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    0 items
                  </span>
                )}
              </button>

              {/* Theme Switcher Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  isDark
                    ? 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-slate-200 hover:text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600'}`}>
                    {isDark ? (
                      <Sun className="w-4 h-4 fill-amber-400/20" />
                    ) : (
                      <Moon className="w-4 h-4 fill-indigo-600/20" />
                    )}
                  </div>
                  <span className="text-xs font-bold">
                    {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-indigo-700'}`}>
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* Install PWA App */}
              <button
                type="button"
                onClick={handleInstallClick}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  isDark
                    ? 'bg-cyan-950/40 hover:bg-cyan-950/70 border-cyan-800/60 text-cyan-300'
                    : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">Install Fluka Web App</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              </button>
            </div>

            {/* Portal Views Section */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block px-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Portals & Dashboards
              </span>

              {/* Customer Marketplace View */}
              <button
                type="button"
                onClick={() => handleNavigateView('store')}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between transition ${
                  activeView === 'store'
                    ? isDark ? 'bg-slate-900 border-cyan-500/50 text-cyan-400' : 'bg-slate-100 border-cyan-600 text-cyan-700 font-bold'
                    : isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-bold">Customer Marketplace</span>
                </div>
                {activeView === 'store' && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>

              {/* Admin Portal View */}
              <button
                type="button"
                onClick={() => handleNavigateView('admin')}
                className={`w-full p-3 rounded-2xl border flex items-center justify-between transition ${
                  activeView === 'admin'
                    ? isDark ? 'bg-slate-900 border-indigo-500/50 text-indigo-400' : 'bg-slate-100 border-indigo-600 text-indigo-700 font-bold'
                    : isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">Admin Dashboard</span>
                </div>
                {activeView === 'admin' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Prominent Become a Vendor Banner CTA */}
          <div className="p-5 border-t border-slate-800 space-y-3">
            <div className={`p-4 rounded-2xl border shadow-xl space-y-3 relative overflow-hidden ${
              isDark ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-indigo-950/80 border-cyan-800/60' : 'bg-gradient-to-br from-cyan-50 to-indigo-50 border-cyan-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-xs font-black tracking-wide text-cyan-400 uppercase font-mono">
                  VENDOR PORTAL
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Sell your tech products & manage storefront inventory directly on Fluka.
              </p>

              <button
                type="button"
                onClick={() => handleNavigateView('vendor')}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Access Vendor Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SideNavDrawer.displayName = 'SideNavDrawer';
