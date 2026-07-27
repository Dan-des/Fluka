import React from 'react';
import {
  CheckCircle2,
  Package,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import type { OrderState, ThemeMode } from '../types/store';

interface OrderSuccessModalProps {
  order: OrderState | null;
  onClose: () => void;
  theme?: ThemeMode;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  theme = 'dark',
}) => {
  if (!order) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center transition-colors duration-300 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Animated Success Badge */}
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold font-mono inline-block mb-2">
            ORDER CONFIRMED #{order.orderId}
          </span>
          <h2 className="text-2xl font-black tracking-tight">Thank You for Your Order!</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We have dispatched your order details to <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{order.shipping.email}</strong>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className={`p-4 rounded-2xl border space-y-3 text-left text-xs ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Order Date:</span>
            </div>
            <span className="font-mono font-bold">{order.date}</span>
          </div>

          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Package className="w-4 h-4 text-indigo-500" />
              <span>Estimated Delivery:</span>
            </div>
            <span className="font-mono font-bold text-cyan-500">1-2 Business Days</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Total Paid:</span>
            <span className="font-mono font-black text-emerald-500 text-base">₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-2 text-left">
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Purchased Items ({order.items.length})
          </span>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div
                key={item.product.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className={`w-8 h-8 object-cover rounded-lg border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="font-bold truncate text-xs">{item.product.name}</p>
                    <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-cyan-500 text-xs">
                  ₦{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping on Fluka</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className={`flex items-center justify-center gap-1.5 text-[10px] ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Order reference email sent. Thank you for shopping with Fluka!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
