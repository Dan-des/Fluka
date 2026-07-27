import React from 'react';
import {
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Zap,
} from 'lucide-react';
import type { ThemeMode } from '../types/store';

interface HeroBannerProps {
  onShopClick: () => void;
  theme?: ThemeMode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <section
      className={`relative overflow-hidden my-4 rounded-3xl mx-4 sm:mx-6 lg:mx-8 border transition-colors duration-300 animate-slide-fade transform-gpu ${
        isDark
          ? 'bg-slate-900/60 border-slate-800/80'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column Text Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-cyan-950/80 border-cyan-800/60 text-cyan-300'
                : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500" />
            <span>Introducing Fluka 2026 Collection</span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Next-Gen Tech Essentials, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600">
              Redefined for Precision.
            </span>
          </h1>

          <p
            className={`text-sm sm:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Experience premium acoustic fidelity, aerospace-grade wearables, and minimalist smart home gear crafted for maximum performance.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              type="button"
              onClick={onShopClick}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition active:scale-95 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column Featured Mockup Image */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative group w-full">
            {/* Glowing border ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-violet-600 opacity-30 group-hover:opacity-50 blur transition duration-500" />
            <div
              className={`relative rounded-2xl overflow-hidden border shadow-2xl p-4 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className={`w-full h-64 sm:h-72 rounded-xl overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="Fluka SoundPulse Pro"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition duration-500"
                />
              </div>
              <div
                className={`absolute bottom-6 left-6 right-6 backdrop-blur-md p-3.5 rounded-xl border flex items-center justify-between shadow-xl ${
                  isDark
                    ? 'bg-slate-950/90 border-slate-800 text-white'
                    : 'bg-white/90 border-slate-200 text-slate-900'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">SoundPulse Pro ANC</p>
                  <p className="text-[11px] text-cyan-500 font-mono">
                    ₦185,000{' '}
                    <span className={`line-through ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      ₦220,000
                    </span>
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 rounded-lg text-[10px] font-bold">
                  ★ 4.9 (428)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Features Bar */}
      <div
        className={`border-t px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs ${
          isDark
            ? 'border-slate-800/80 bg-slate-950/60 text-slate-400'
            : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <Truck className="w-4 h-4 text-cyan-500" />
          <span><strong>Free Express Delivery</strong> on orders over ₦150,000</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span><strong>2-Year Warranty</strong> & 30-Day Money Back</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Headphones className="w-4 h-4 text-violet-500" />
          <span><strong>24/7 Priority Support</strong> from Tech Experts</span>
        </div>
      </div>
    </section>
  );
};
