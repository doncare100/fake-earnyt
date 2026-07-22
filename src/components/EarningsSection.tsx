import React, { useState } from 'react';
import { Wallet, Coins, ArrowUpRight, Calendar, DollarSign, CreditCard, CheckCircle2, Clock } from 'lucide-react';
import { User, WithdrawalRequest } from '../types';

interface EarningsSectionProps {
  user: User | null;
  onOpenAuth: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const EarningsSection: React.FC<EarningsSectionProps> = ({
  user,
  onOpenAuth,
  onUpdateUser
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('PayPal');
  const [selectedAmountUsd, setSelectedAmountUsd] = useState<number>(5);
  const [accountDetail, setAccountDetail] = useState<string>('');
  const [withdrawalMessage, setWithdrawalMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    {
      id: 'wd-seed-1',
      userId: user?.id || 'usr-101',
      userName: user?.name || 'Alex Morgan',
      method: 'PayPal',
      accountDetail: 'alex.morgan@us-earner.com',
      amountUsd: 10.00,
      pointsSpent: 10000,
      status: 'Completed',
      requestedAt: '2026-07-10'
    }
  ]);

  if (!user) {
    return (
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-8 text-center max-w-xl mx-auto my-8">
        <Wallet className="w-12 h-12 text-[#3b82f6] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Your Earnings Dashboard</h2>
        <p className="text-zinc-400 text-xs mb-6 max-w-sm mx-auto">
          Sign in or create a USA verified account to track point rewards, complete daily check-ins, and withdraw cash payouts.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold rounded-xl transition-colors shadow-lg"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleDailyCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (user.lastCheckIn === today) {
      setError('You have already claimed today\'s check-in bonus!');
      return;
    }

    const updatedUser = {
      ...user,
      points: user.points + 50,
      earnedTotalUsd: user.earnedTotalUsd + 0.05,
      dailyStreak: user.dailyStreak + 1,
      lastCheckIn: today
    };

    onUpdateUser(updatedUser);
    setWithdrawalMessage('🎉 Daily Check-in Bonus +50 Points Claimed!');
  };

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setWithdrawalMessage('');

    const pointsNeeded = selectedAmountUsd * 1000;
    if (user.points < pointsNeeded) {
      setError(`Insufficient balance. You need ${pointsNeeded.toLocaleString()} points ($${selectedAmountUsd}.00 USD).`);
      return;
    }

    if (!accountDetail.trim()) {
      setError(`Please enter your ${selectedMethod} address or phone number.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          method: selectedMethod,
          accountDetail,
          amountUsd: selectedAmountUsd,
          pointsSpent: pointsNeeded
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Withdrawal failed.');
      } else {
        onUpdateUser(data.user);
        setWithdrawals([data.withdrawal, ...withdrawals]);
        setWithdrawalMessage(`✅ Withdrawal request for $${selectedAmountUsd}.00 USD submitted successfully!`);
        setAccountDetail('');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Top Balance Summary Card */}
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f2231]">
          <div className="flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-[#3b82f6]" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Earnings & Rewards
            </h2>
          </div>

          <button
            onClick={handleDailyCheckIn}
            className="px-3 py-1.5 rounded-xl bg-[#1a2338] border border-[#263c63] text-[#3b82f6] text-xs font-bold flex items-center gap-1.5 hover:bg-[#203050] transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Streak: {user.dailyStreak} Days (+50 Pts)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0b0c10] border border-[#1e2130] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#141e33] border border-[#233558] flex items-center justify-center text-[#3b82f6] shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                Points Balance
              </span>
              <span className="text-2xl font-black text-white">
                {user.points.toLocaleString()} <span className="text-xs font-semibold text-[#3b82f6]">pts</span>
              </span>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-[#1e2130] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                USD Cash Value
              </span>
              <span className="text-2xl font-black text-emerald-400">
                ${(user.points / 1000).toFixed(2)} <span className="text-xs font-medium text-zinc-400">USD</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-400 bg-[#0d0e13] p-3 rounded-xl border border-[#1a1c28]">
          💡 <strong>Conversion Rate:</strong> 1,000 earnyt points = $1.00 USD. Minimum cashout threshold is $5.00 USD (5,000 points).
        </p>
      </div>

      {/* Cashout Request Form */}
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-6 md:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#3b82f6]" />
          <span>Request Payout</span>
        </h3>

        {withdrawalMessage && (
          <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-xs text-emerald-300">
            {withdrawalMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/50 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleRequestWithdrawal} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-2">
              Select Payout Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {['PayPal', 'Cash App', 'Venmo', 'Bitcoin', 'Amazon Gift Card'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                    selectedMethod === method
                      ? 'bg-[#141e33] border-[#3b82f6] text-[#3b82f6]'
                      : 'bg-[#0b0c10] border-[#1f2231] text-zinc-400 hover:text-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-2">
              Select Cashout Amount
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[5, 10, 25, 50].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setSelectedAmountUsd(amt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    selectedAmountUsd === amt
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                      : 'bg-[#0b0c10] border-[#1f2231] text-zinc-400 hover:text-white'
                  }`}
                >
                  ${amt}.00 USD
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1.5">
              {selectedMethod} Account Email / Username
            </label>
            <input
              type="text"
              required
              value={accountDetail}
              onChange={(e) => setAccountDetail(e.target.value)}
              placeholder={
                selectedMethod === 'PayPal'
                  ? 'paypal-email@example.com'
                  : selectedMethod === 'Cash App'
                  ? '$cashtag'
                  : selectedMethod === 'Bitcoin'
                  ? 'BTC Wallet Address'
                  : 'email@example.com'
              }
              className="w-full bg-[#0b0c10] border border-[#202433] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw ${selectedAmountUsd}.00 USD ({selectedAmountUsd * 1000} Pts)</span>
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-6 md:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Payout History</h3>
        <div className="space-y-3">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="bg-[#0c0d12] border border-[#1d202e] rounded-2xl p-4 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#141e33] border border-[#233558] flex items-center justify-center text-[#3b82f6]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">{w.method} (${w.amountUsd}.00 USD)</span>
                  <span className="text-zinc-500 text-[11px]">{w.accountDetail} • {w.requestedAt}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                w.status === 'Completed'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
              }`}>
                {w.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
