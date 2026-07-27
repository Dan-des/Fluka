import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Check,
  ShieldCheck,
  Truck,
  Store,
  PackageCheck,
} from 'lucide-react';
import type { Product, ThemeMode } from '../types/store';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  theme?: ThemeMode;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  theme = 'dark',
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [added, setAdded] = useState(false);
  const isDark = theme === 'dark';

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md flex items-start sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl border rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Sticky Mobile Header with Title & Close Button */}
        <div
          className={`sticky top-0 z-30 px-5 py-3.5 border-b flex items-center justify-between gap-4 backdrop-blur-xl ${
            isDark ? 'bg-slate-900/95 border-slate-800/80' : 'bg-white/95 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="text-xs font-extrabold font-mono text-cyan-400 uppercase tracking-wider block shrink-0">
              QUICK VIEW
            </span>
            <span className={`text-xs font-bold truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              — {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition border shadow-md shrink-0 cursor-pointer ${
              isDark
                ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300'
            }`}
            title="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column Image */}
            <div className="space-y-4">
              <div
                className={`aspect-square rounded-2xl overflow-hidden border relative ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-violet-600 text-white text-[10px] font-extrabold rounded-md shadow">
                    BEST SELLER
                  </span>
                )}
              </div>

              {/* Seller & Stock Info Pill */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-400" />
                  <span>
                    Sold by: <strong>{product.vendorName || 'Fluka Official'}</strong>
                  </span>
                </div>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5" /> In Stock ({product.stockQuantity || 25})
                </span>
              </div>

              {/* Quick Specs Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4 text-cyan-500" />
                  <span className="text-[11px]">Free Express Delivery</span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isDark
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px]">2-Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Right Column Product Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-cyan-500 font-semibold mb-1">
                  <span>{product.category}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-mono">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{product.rating > 0 ? product.rating : '0.0'}</span>
                    <span className={isDark ? 'text-slate-500 font-normal' : 'text-slate-400 font-normal'}>
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {product.name}
                </h2>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {product.description}
                </p>

                {/* Price with Naira ₦ */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className={`text-sm line-through font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Color Options */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Color: <span className={isDark ? 'text-white' : 'text-slate-900'}>{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          style={{ backgroundColor: c.hex }}
                          className={`w-7 h-7 rounded-full border-2 transition ${
                            selectedColor === c.name
                              ? 'border-cyan-500 scale-110 shadow-lg'
                              : isDark
                              ? 'border-slate-800 hover:scale-105'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Table */}
                <div
                  className={`space-y-1.5 p-3 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span
                    className={`font-bold text-[10px] uppercase tracking-wider block mb-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Technical Specifications
                  </span>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{key}:</span>
                      <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center border rounded-xl p-1 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                        isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold font-mono text-xs">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                        isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition shadow-lg ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart - ₦{(product.price * quantity).toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    className={`p-3 rounded-xl border transition ${
                      isWishlisted
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
