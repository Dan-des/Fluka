import React from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { CartItem, ThemeMode } from '../types/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  discountAmount: number;
  theme?: ThemeMode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  couponCode,
  onApplyCoupon,
  discountAmount,
  theme = 'dark',
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = Math.max(0, subtotal + tax - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md border-l shadow-2xl flex flex-col transition-colors duration-300 ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Shopping Cart</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-slate-800/80 text-slate-500' : 'bg-slate-100 text-slate-400'
                }`}>
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold">Your cart is empty</h3>
                <p className={`text-xs max-w-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Add high-performance audio monitors, smart wearables, or ergonomic mechanical gear to get started.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg mt-2"
                >
                  Explore Fluka Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className={`p-3.5 rounded-2xl border flex gap-3 transition ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={`w-16 h-16 object-cover rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs truncate pr-2">{item.product.name}</h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className={`text-slate-400 transition ${isDark ? 'hover:text-rose-400' : 'hover:text-rose-600'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-cyan-500 font-bold">
                      ₦{item.product.price.toLocaleString()}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className={`flex items-center gap-2 border rounded-lg p-0.5 ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
                      }`}>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className={`p-1 rounded hover:bg-slate-700 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className={`p-1 rounded hover:bg-slate-700 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className={`p-6 border-t space-y-4 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => onApplyCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon Code"
                    className={`w-full pl-8 pr-3 py-1.5 border rounded-xl font-mono text-xs outline-none uppercase ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Subtotal</span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>VAT (7.5%)</span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>₦{tax.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount (FLUKA10)</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className={`flex justify-between text-sm font-bold pt-2 border-t font-sans ${
                  isDark ? 'border-slate-800 text-white' : 'border-slate-300 text-slate-900'
                }`}>
                  <span>Total Due</span>
                  <span className="text-cyan-500 font-mono">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>Proceed to Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className={`flex items-center justify-center gap-1.5 text-[10px] ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
