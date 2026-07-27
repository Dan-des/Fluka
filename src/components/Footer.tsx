import React from 'react';
import { Lock, CreditCard } from 'lucide-react';
import type { ThemeMode } from '../types/store';

interface FooterProps {
  theme?: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <footer
      className={`border-t text-xs mt-16 transition-colors duration-300 ${
        isDark
          ? 'border-slate-800 bg-slate-950 text-slate-400'
          : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
              <div
                className={`h-full w-full rounded-[10px] flex items-center justify-center font-black text-cyan-400 text-sm ${
                  isDark ? 'bg-slate-950' : 'bg-white'
                }`}
              >
                F
              </div>
            </div>
            <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              FLUKA.
            </span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Next-generation acoustic, wearable, and smart home tech designed for precision engineering and minimalist aesthetic.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className={`font-bold uppercase text-[11px] tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Shop Categories
          </h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-cyan-500 transition">Audio & ANC Headphones</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition">Smart Wearables & Watches</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition">Ergonomic Keyboards & Mice</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition">Smart Home Ambient Lighting</a></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className={`font-bold uppercase text-[11px] tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Customer Service
          </h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-cyan-500 transition">Track Your Order</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition">2-Year Warranty Claim</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-cyan-500 transition">24/7 Priority Support</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h4 className={`font-bold uppercase text-[11px] tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Stay Connected
          </h4>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Subscribe for secret drops & exclusive discounts.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className={`px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-cyan-500 flex-1 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            />
            <button
              type="button"
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition text-xs"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`border-t py-6 px-4 text-center text-[11px] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4 ${
          isDark
            ? 'border-slate-900 bg-slate-950/90 text-slate-500'
            : 'border-slate-100 bg-slate-50 text-slate-500'
        }`}
      >
        <p>© 2026 Fluka Inc. All rights reserved. Precision Tech Storefront.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-cyan-500" /> SSL Encrypted</span>
          <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Visa / Mastercard / Apple Pay</span>
        </div>
      </div>
    </footer>
  );
};
