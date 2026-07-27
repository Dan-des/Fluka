import React, { useState, memo } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Check,
  Store,
  AlertTriangle,
  Plus,
  Minus,
} from 'lucide-react';
import type { Product, ThemeMode } from '../types/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  cartQuantity?: number;
  onUpdateQuantity?: (productId: string, newQuantity: number) => void;
  theme?: ThemeMode;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
  cartQuantity = 0,
  onUpdateQuantity,
  theme = 'dark',
}) => {
  const [added, setAdded] = useState(false);
  const isDark = theme === 'dark';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, cartQuantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, cartQuantity - 1);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onQuickView(product)}
      className={`group border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer relative transform-gpu ${
        product.isFlagged
          ? 'border-rose-500/80 ring-1 ring-rose-500/40'
          : isDark
          ? 'bg-slate-900/80 border-slate-800/90 text-slate-100 hover:border-slate-700 hover:shadow-2xl hover:shadow-cyan-500/10'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-xl hover:border-slate-300'
      }`}
    >
      {/* Product Image Container with Reserved Aspect Square & Neutral Skeleton Background */}
      <div className={`relative aspect-square w-full overflow-hidden shrink-0 ${isDark ? 'bg-slate-950 border-b border-slate-800/60' : 'bg-slate-200 border-b border-slate-100'}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFlagged && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-md shadow uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> FLAGGED BY ADMIN
            </span>
          )}
          {product.isNew && !product.isFlagged && (
            <span className="px-2.5 py-1 bg-cyan-500 text-slate-950 text-[10px] font-extrabold rounded-md shadow uppercase tracking-wider">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isFlagged && (
            <span className="px-2.5 py-1 bg-violet-600 text-white text-[10px] font-extrabold rounded-md shadow uppercase tracking-wider">
              BESTSELLER
            </span>
          )}
          {discountPercent > 0 && !product.isFlagged && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-md shadow">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Action Buttons (Wishlist & QuickView) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition shadow ${
              isWishlisted
                ? 'bg-rose-600 text-white'
                : isDark
                ? 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition shadow ${
              isDark
                ? 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-semibold text-cyan-500 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-mono text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating > 0 ? product.rating : '0.0'}</span>
              <span className={isDark ? 'text-slate-500 font-normal' : 'text-slate-400 font-normal'}>
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <h3 className={`text-sm font-bold transition line-clamp-1 ${isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-600'}`}>
            {product.name}
          </h3>

          {/* Vendor Seller Tag */}
          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-slate-400">
            <Store className="w-3 h-3 text-indigo-400" />
            <span>Sold by: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{product.vendorName || 'Fluka Official'}</strong></span>
          </div>

          <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {product.tagline}
          </p>
        </div>

        {/* Price & Add to Cart / Inline Quantity Selector Footer */}
        <div className={`pt-2 border-t flex items-center justify-between gap-2 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={`text-xs line-through font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  ₦{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* INLINE QUANTITY CONTROLLER IF IN CART, OR DEFAULT ADD BUTTON */}
          {cartQuantity > 0 ? (
            <div
              className={`flex items-center rounded-xl p-0.5 border shadow-md ${
                isDark ? 'bg-cyan-950/80 border-cyan-800/80 text-white' : 'bg-cyan-50 border-cyan-300 text-cyan-900'
              }`}
            >
              <button
                type="button"
                onClick={handleDecrement}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-cyan-200 text-cyan-800'
                }`}
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 font-mono font-black text-xs min-w-[20px] text-center text-cyan-400">
                {cartQuantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-cyan-200 text-cyan-800'
                }`}
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white'
                  : isDark
                  ? 'bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white border border-slate-700/80 hover:border-cyan-500'
                  : 'bg-slate-100 hover:bg-cyan-600 text-slate-800 hover:text-white border border-slate-200 hover:border-cyan-500'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
