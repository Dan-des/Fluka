import React, { memo } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  X,
  Sparkles,
  Sun,
  Moon,
  Download,
  Tag,
} from 'lucide-react';
import type { DiscountCampaign, ProductCategory, ThemeMode } from '../types/store';
import { CATEGORIES } from '../data/products';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  cartSubtotal: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenInstallPwa: () => void;
  activeView: 'store' | 'vendor' | 'admin';
  onSwitchView: (view: 'store' | 'vendor' | 'admin') => void;
  activeCampaigns?: DiscountCampaign[];
}

export const Header: React.FC<HeaderProps> = memo(({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  cartSubtotal,
  theme,
  onToggleTheme,
  onOpenInstallPwa,
  activeView,
  onSwitchView,
  activeCampaigns = [],
}) => {
  const isDark = theme === 'dark';

  const handleNavigateHome = () => {
    onSwitchView('store');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  const defaultCampaign: DiscountCampaign = {
    id: 'default',
    code: 'FLUKA10',
    discountPercent: 10,
    announcementText: '🔥 Summer Tech Flash Sale: Instant 10% OFF on all flagship headsets & smartwatch gear!',
    isActive: true,
  };

  const displayCampaigns = activeCampaigns.length > 0 ? activeCampaigns : [defaultCampaign];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950/90 border-slate-800/80 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Dynamic Marquee Scrolling Announcement Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 text-white text-[11px] font-semibold py-2 overflow-hidden whitespace-nowrap relative select-none border-b border-cyan-400/20">
        <div className="animate-marquee-track flex items-center gap-12">
          {/* Loop Set 1 */}
          <div className="flex items-center gap-10">
            {displayCampaigns.map((camp) => (
              <div key={`loop1-${camp.id}`} className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{camp.announcementText}</span>
                </span>
                <span className="px-2 py-0.5 bg-slate-950/40 text-cyan-200 border border-cyan-400/30 rounded font-mono font-bold text-[10px] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-300" /> {camp.code} ({camp.discountPercent}% OFF)
                </span>
              </div>
            ))}
          </div>

          {/* Loop Set 2 (Duplicate for continuous seamless scrolling) */}
          <div className="flex items-center gap-10">
            {displayCampaigns.map((camp) => (
              <div key={`loop2-${camp.id}`} className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{camp.announcementText}</span>
                </span>
                <span className="px-2 py-0.5 bg-slate-950/40 text-cyan-200 border border-cyan-400/30 rounded font-mono font-bold text-[10px] flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-300" /> {camp.code} ({camp.discountPercent}% OFF)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo Branding */}
          <div
            onClick={handleNavigateHome}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div
                className={`h-full w-full rounded-[14px] flex items-center justify-center ${
                  isDark ? 'bg-slate-950' : 'bg-white'
                }`}
              >
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-500 to-violet-600 tracking-tighter">
                  F
                </span>
              </div>
            </div>
            <div>
              <span
                className={`text-2xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                FLUKA<span className="text-cyan-500">.</span>
              </span>
              <p
                className={`text-[10px] font-mono tracking-widest uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Marketplace
              </p>
            </div>
          </div>

          {/* Search Bar Input */}
          {activeView === 'store' && (
            <div className="flex-1 max-w-md hidden md:block relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search headphones, smartwatches, mechanical keyboards..."
                  className={`w-full pl-10 pr-9 py-2 border rounded-xl text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition ${
                    isDark
                      ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                      : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Install PWA App Download Button */}
            <button
              type="button"
              onClick={onOpenInstallPwa}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-cyan-950/60 hover:bg-cyan-900/80 border-cyan-800/80 text-cyan-300'
                  : 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-800'
              }`}
              title="Install / Download Fluka Web App"
            >
              <Download className="w-4 h-4 text-cyan-500" />
              <span className="hidden lg:inline">Install App</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
              )}
            </button>

            {/* Wishlist Button */}
            {activeView === 'store' && (
              <button
                type="button"
                onClick={onOpenWishlist}
                className={`relative p-2.5 rounded-xl border transition flex items-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
                title="Saved Wishlist"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                <span className="text-xs font-semibold hidden sm:inline">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="h-5 min-w-[20px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Drawer Trigger with Naira (₦) */}
            {activeView === 'store' && (
              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl font-medium text-xs shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 min-w-[16px] px-1 bg-slate-950 text-cyan-400 border border-cyan-400 rounded-full text-[9px] font-extrabold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="font-semibold">Cart</span>
                {cartSubtotal > 0 && (
                  <span className="hidden sm:inline font-mono opacity-90 border-l border-white/20 pl-2">
                    ₦{cartSubtotal.toLocaleString()}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {activeView === 'store' && (
          <div className="block md:hidden relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tech products..."
                className={`w-full pl-10 pr-9 py-2 border rounded-xl text-xs focus:outline-none focus:border-cyan-500 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Pills Filter */}
        {activeView === 'store' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5 text-xs">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-1.5 rounded-xl font-medium transition whitespace-nowrap text-xs cursor-pointer ${
                  selectedCategory === category
                    ? isDark
                      ? 'bg-slate-100 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 text-white font-bold shadow-md'
                    : isDark
                    ? 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
