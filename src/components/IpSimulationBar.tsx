import React from 'react';
import { RefreshCw, Cpu, ShieldCheck, ShieldAlert, Globe } from 'lucide-react';
import { IPInfo } from '../types';

interface IpSimulationBarProps {
  ipInfo: IPInfo | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const IpSimulationBar: React.FC<IpSimulationBarProps> = ({
  ipInfo,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="bg-[#12141c] border-b border-[#202432] px-4 py-2 text-xs text-zinc-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Real-time IP details */}
        <div className="flex items-center gap-2 flex-wrap text-zinc-400">
          <div className="flex items-center gap-1.5 font-semibold text-white bg-[#1a1e2b] px-2.5 py-1 rounded-lg border border-[#2b3145]">
            <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>Real-Time IP Tracker</span>
          </div>

          {ipInfo ? (
            <div className="flex items-center gap-2 text-[11px] flex-wrap">
              <span className="text-zinc-200 font-mono bg-black/40 px-2 py-0.5 rounded border border-zinc-800">
                {ipInfo.ip}
              </span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">{ipInfo.city}, {ipInfo.country} ({ipInfo.countryCode})</span>
              <span>•</span>
              <span className="text-zinc-400">{ipInfo.isp}</span>
              <span>•</span>
              <span className={ipInfo.isVpn ? "text-amber-400 font-semibold flex items-center gap-1" : "text-emerald-400 font-semibold flex items-center gap-1"}>
                {ipInfo.isVpn ? <ShieldAlert className="w-3 h-3 inline" /> : <ShieldCheck className="w-3 h-3 inline" />}
                VPN: {ipInfo.isVpn ? "DETECTED" : "CLEAR"}
              </span>
            </div>
          ) : (
            <span className="text-zinc-500 animate-pulse">Detecting client IP...</span>
          )}
        </div>

        {/* Right: Refresh button and status summary */}
        <div className="flex items-center gap-2.5">
          {ipInfo && (
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              ipInfo.status === 'ALLOWED' 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                : ipInfo.status === 'VPN_NOT_SUPPORTED' 
                ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' 
                : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
            }`}>
              {ipInfo.status === 'ALLOWED' 
                ? '✓ USA Access Allowed' 
                : ipInfo.status === 'VPN_NOT_SUPPORTED' 
                ? '⚠️ VPN Restricted' 
                : '⛔ Region Restricted'}
            </span>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1e2b] text-zinc-300 hover:text-white hover:bg-[#252a3c] transition-colors border border-[#2b3145]"
            title="Refresh Real-World IP Check"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#3b82f6]' : ''}`} />
            <span className="text-[11px] font-medium">Re-check IP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
