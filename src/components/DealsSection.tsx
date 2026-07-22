import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Gamepad2, FileCheck, CreditCard, ExternalLink, CheckCircle2, Coins } from 'lucide-react';
import { INITIAL_DEALS } from '../mockData';
import { User, Deal } from '../types';

interface DealsSectionProps {
  user: User | null;
  onOpenAuth: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  user,
  onOpenAuth,
  onUpdateUser
}) => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaimDeal = (deal: Deal) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setClaimingId(deal.id);
    setTimeout(() => {
      const updatedUser = {
        ...user,
        points: user.points + deal.rewardPoints,
        earnedTotalUsd: user.earnedTotalUsd + (deal.rewardPoints / 1000),
        completedDealIds: [...user.completedDealIds, deal.id]
      };
      onUpdateUser(updatedUser);
      setClaimingId(null);
    }, 1200);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5 text-[#3b82f6]" />;
      case 'FileCheck': return <FileCheck className="w-5 h-5 text-emerald-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-purple-400" />;
      default: return <CreditCard className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f2231]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#3b82f6]" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              High-Paying USA Deals & Offers
            </h2>
          </div>

          <span className="text-xs text-zinc-400 bg-[#0b0c10] px-3 py-1 rounded-xl border border-[#1d202e]">
            Updated Daily
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-6">
          Complete high-reward sponsor tasks, try new apps, or complete surveys to stack points quickly!
        </p>

        <div className="space-y-4">
          {deals.map((deal) => {
            const isCompleted = user?.completedDealIds.includes(deal.id);
            const isClaiming = claimingId === deal.id;

            return (
              <div
                key={deal.id}
                className="bg-[#0c0d12] border border-[#1d202e] rounded-2xl p-5 hover:border-[#2d334a] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#141e33] border border-[#233558] flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(deal.iconName)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-[#171a26] px-2 py-0.5 rounded">
                        {deal.category}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Est: {deal.estimatedMinutes} mins
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                      {deal.description}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1a1c28]">
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-black text-[#3b82f6] flex items-center gap-1">
                      <Coins className="w-4 h-4 text-[#3b82f6]" />
                      +{deal.rewardPoints.toLocaleString()} Pts
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      (${(deal.rewardPoints / 1000).toFixed(2)} USD)
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimDeal(deal)}
                      disabled={isClaiming}
                      className="px-4 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/10"
                    >
                      {isClaiming ? (
                        <span>Verifying...</span>
                      ) : (
                        <>
                          <span>Start Deal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
