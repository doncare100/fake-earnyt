import React from 'react';
import { LogOut, LogIn, User as UserIcon, Coins, ShieldCheck, ShieldAlert } from 'lucide-react';
import { User, IPInfo } from '../types';

interface HeaderProps {
  user: User | null;
  ipInfo: IPInfo | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSelectTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  ipInfo,
  onOpenAuth,
  onLogout,
  onSelectTab,
}) => {
  return (
    <header className="bg-[#0b0c10] border-b border-[#181a22] px-4 py-3 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div 
          onClick={() => onSelectTab('VIDEOS')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#141e33] border border-[#233558] flex items-center justify-center font-bold text-lg text-[#3b82f6] shadow-sm group-hover:border-[#3b82f6] transition-colors">
            e
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            earn<span className="text-[#3b82f6]">yt</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* IP Status pill */}
          {ipInfo && (
            <div 
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                ipInfo.status === 'ALLOWED'
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                  : ipInfo.status === 'VPN_NOT_SUPPORTED'
                  ? 'bg-amber-950/40 text-amber-400 border-amber-800/40'
                  : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
              }`}
              title={`IP: ${ipInfo.ip} | Country: ${ipInfo.country} | VPN: ${ipInfo.isVpn ? 'Yes' : 'No'}`}
            >
              {ipInfo.status === 'ALLOWED' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>US IP: {ipInfo.ip}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{ipInfo.status === 'VPN_NOT_SUPPORTED' ? 'VPN Detected' : 'Non-US IP'}</span>
                </>
              )}
            </div>
          )}

          {/* User Balance / Account */}
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onSelectTab('EARNINGS')}
                className="bg-[#14161f] border border-[#232736] rounded-xl px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:border-[#3b82f6]/50 transition-all"
              >
                <Coins className="w-4 h-4 text-[#3b82f6]" />
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-white leading-none">
                    {user.points.toLocaleString()} <span className="text-[#3b82f6]">pts</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium leading-none mt-0.5">
                    ${(user.points / 1000).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-9 h-9 rounded-xl bg-[#14161f] border border-[#232736] flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-[#1c1f2b] transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
