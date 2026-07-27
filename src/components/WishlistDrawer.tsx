import React, { memo } from 'react';
import { Heart, X, ShoppingBag, Trash2, ArrowRight, Store } from 'lucide-react';
import type { Product, ThemeMode } from '../types/store';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  theme?: ThemeMode;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = memo(({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onMoveToCart,
  theme = 'dark',
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md border-l shadow-2xl flex flex-col justify-between transition-transform duration-300 ${
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                  <span>Saved Wishlist</span>
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full font-mono text-[11px] font-bold">
                    {items.length}
                  </span>
                </h2>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your favorited products saved for later.
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

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <Heart className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Your wishlist is empty</h3>
                  <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click the heart icon on any product in the marketplace catalog to save it to your wishlist.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition ${
                    isDark ? 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-16 h-16 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <h4 className="text-xs font-bold truncate text-white">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Store className="w-3 h-3 text-indigo-400" />
                      <span className="truncate">{product.vendorName || 'Fluka Official'}</span>
                    </div>

                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-xs font-black font-mono text-white">
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] line-through font-mono text-slate-500">
                          ₦{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onMoveToCart(product)}
                      className="p-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow"
                      title="Move to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">Add</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(product)}
                      className={`p-2 rounded-xl transition ${
                        isDark ? 'bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400' : 'bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600'
                      }`}
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div
              className={`p-5 border-t space-y-3 ${
                isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  items.forEach((item) => onMoveToCart(item));
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All Items to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

WishlistDrawer.displayName = 'WishlistDrawer';
