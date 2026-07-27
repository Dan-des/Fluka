import React, { useState, useEffect, memo } from 'react';
import { Flame, X, Tag, Check, ArrowRight, Sparkles } from 'lucide-react';
import type { DiscountCampaign, ThemeMode } from '../types/store';

interface BestOfferNotificationProps {
  campaign: DiscountCampaign | null;
  onApplyCoupon: (code: string) => void;
  theme?: ThemeMode;
}

export const BestOfferNotification: React.FC<BestOfferNotificationProps> = memo(({
  campaign,
  onApplyCoupon,
  theme = 'dark',
}) => {
  if (!campaign) return null;

  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const isDark = theme === 'dark';

  // 20-second progress timer auto-collapses to minimized floating badge
  useEffect(() => {
    if (isDismissed || isMinimized) return;

    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [isDismissed, isMinimized, timerKey]);

  if (isDismissed) return null;

  const handleClaimOffer = () => {
    onApplyCoupon(campaign.code);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  const handleReExpand = () => {
    setIsMinimized(false);
    setTimerKey((prev) => prev + 1);
  };

  // Minimized Floating Badge View
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-in zoom-in duration-300">
        <button
          type="button"
          onClick={handleReExpand}
          className={`p-3 rounded-full border shadow-2xl backdrop-blur-xl flex items-center gap-2 transition hover:scale-108 active:scale-95 group cursor-pointer ${
            isDark
              ? 'bg-slate-900/95 border-amber-500/50 text-white shadow-amber-500/20'
              : 'bg-white/95 border-amber-400 text-slate-900 shadow-xl'
          }`}
          title="Click to view Best Offer deal"
        >
          <div className="p-1.5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-md">
            <Flame className="w-4 h-4 fill-white animate-bounce" />
          </div>
          <span className="text-xs font-black font-mono tracking-wider uppercase pr-1 text-amber-400">
            BEST OFFER
          </span>
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-bold">
            -{campaign.discountPercent}%
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-500">
      <style>{`
        @keyframes timer-shrink {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        .animate-progress-line {
          animation: timer-shrink 20s linear forwards;
        }
      `}</style>

      <div
        className={`relative p-5 rounded-3xl border shadow-2xl space-y-3 overflow-hidden backdrop-blur-xl transition-all duration-300 transform-gpu ${
          isDark
            ? 'bg-slate-900/95 border-amber-500/40 text-white shadow-amber-500/10'
            : 'bg-white/95 border-amber-400 text-slate-900 shadow-xl'
        }`}
      >
        {/* Ambient Top Glow Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-800/40 overflow-hidden">
          <div
            key={timerKey}
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 animate-progress-line"
          />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className={`absolute top-4 right-3.5 p-1 rounded-full border transition ${
            isDark
              ? 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900'
          }`}
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 pt-1">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-md shadow-amber-500/20">
            <Flame className="w-4 h-4 fill-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-extrabold tracking-wider font-mono">
                FEATURED BEST OFFER
              </span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 block mt-0.5">
              -{campaign.discountPercent}% INSTANT DISCOUNT
            </span>
          </div>
        </div>

        {/* Campaign Description */}
        <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {campaign.announcementText}
        </p>

        {/* Promo Code Badge & Claim Button */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-xs font-black ${
            isDark ? 'bg-slate-950 border-slate-800 text-cyan-400' : 'bg-slate-100 border-slate-300 text-cyan-700'
          }`}>
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>{campaign.code}</span>
          </div>

          <button
            type="button"
            onClick={handleClaimOffer}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isApplied
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Code Applied!</span>
              </>
            ) : (
              <>
                <span>Claim Offer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

BestOfferNotification.displayName = 'BestOfferNotification';
