import React, { useState } from 'react';
import { ShoppingBag, Store, ShieldAlert, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import type { ThemeMode } from '../types/store';

interface DevViewSwitcherProps {
  activeView: 'store' | 'vendor' | 'admin';
  onSwitchView: (view: 'store' | 'vendor' | 'admin') => void;
  theme?: ThemeMode;
}

export const DevViewSwitcher: React.FC<DevViewSwitcherProps> = ({
  activeView,
  onSwitchView,
  theme = 'dark',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDark = theme === 'dark';
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleSelectView = (view: 'store' | 'vendor' | 'admin') => {
    onSwitchView(view);
    const newPath = view === 'store' ? '/' : `/${view}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-left-5 duration-300 select-none">
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className={`p-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-2 transition hover:scale-105 ${
            isDark
              ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-400 shadow-cyan-500/10'
              : 'bg-white/90 border-cyan-400 text-cyan-800 shadow-lg'
          }`}
          title="Expand Dev Portal Router Switcher"
        >
          <Monitor className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider">ROUTER</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div
          className={`p-3 rounded-3xl border shadow-2xl backdrop-blur-xl space-y-2 transition-all duration-300 ${
            isDark
              ? 'bg-slate-950/95 border-slate-800/80 text-white shadow-cyan-500/5'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 px-1 border-b pb-2 border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black font-mono tracking-widest text-slate-400 uppercase">
                DEV ROUTER | {currentHostname}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="text-slate-500 hover:text-slate-300 p-0.5"
              title="Minimize Switcher"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Switcher Pills Row */}
          <div className="flex items-center gap-1.5 text-xs">
            {/* Storefront */}
            <button
              type="button"
              onClick={() => handleSelectView('store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                activeView === 'store'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            {/* Vendor Portal */}
            <button
              type="button"
              onClick={() => handleSelectView('vendor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                activeView === 'vendor'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor</span>
            </button>

            {/* Admin Dashboard */}
            <button
              type="button"
              onClick={() => handleSelectView('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition ${
                activeView === 'admin'
                  ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
