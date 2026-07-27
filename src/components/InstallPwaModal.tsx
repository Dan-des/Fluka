import React, { useState, useEffect } from 'react';
import {
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  Smartphone,
  Monitor,
  Download,
} from 'lucide-react';
import type { ThemeMode } from '../types/store';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstall: () => void;
  theme?: ThemeMode;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstall,
  theme = 'dark',
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md border rounded-3xl shadow-2xl overflow-hidden p-6 text-center space-y-5 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition ${
            isDark
              ? 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 border-slate-800'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20">
          <div
            className={`h-full w-full rounded-[14px] flex items-center justify-center font-black text-cyan-400 text-2xl ${
              isDark ? 'bg-slate-950' : 'bg-white'
            }`}
          >
            F
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">Install Fluka App</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Install Fluka on your device home screen or desktop for fast, offline-ready access.
          </p>
        </div>

        {/* Device Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium ${
              isDark
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-500" />
            <span>Android & iOS</span>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium ${
              isDark
                ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Monitor className="w-4 h-4 text-indigo-500" />
            <span>macOS & Windows</span>
          </div>
        </div>

        {/* Install Action or iOS Instructions */}
        {deferredPrompt ? (
          <button
            type="button"
            onClick={onInstall}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>1-Click Install Fluka</span>
          </button>
        ) : isIOS ? (
          <div
            className={`p-3.5 rounded-2xl border text-left text-xs space-y-2 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p className="font-bold text-cyan-500 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> How to install on iOS Safari:
            </p>
            <ol className="space-y-1.5 text-slate-300 list-decimal list-inside pl-1 text-[11px]">
              <li>
                Tap the <strong className="text-white">Share</strong> button <Share className="w-3 h-3 inline text-cyan-400" /> in Safari navigation.
              </li>
              <li>
                Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> <PlusSquare className="w-3 h-3 inline text-cyan-400" />.
              </li>
              <li>
                Tap <strong className="text-white">"Add"</strong> in the top right corner.
              </li>
            </ol>
          </div>
        ) : (
          <div
            className={`p-3.5 rounded-2xl border text-left text-xs space-y-2 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p className="font-bold text-emerald-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Install from your browser menu:
            </p>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Look for the <strong>"Install App"</strong> or <strong>"Install Fluka"</strong> icon in your browser address bar (Chrome, Edge, Brave, Safari) or tap <strong>Menu → Install App</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
