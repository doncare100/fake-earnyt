import React from 'react';
import { Globe, ShieldAlert, RefreshCw } from 'lucide-react';
import { IPInfo } from '../types';

interface IpRestrictionModalProps {
  ipInfo: IPInfo;
  onRefresh: () => void;
}

export const IpRestrictionModal: React.FC<IpRestrictionModalProps> = ({
  ipInfo,
  onRefresh
}) => {
  const isNonUsa = ipInfo.status === 'REGION_NOT_SUPPORTED';
  const isVpn = ipInfo.status === 'VPN_NOT_SUPPORTED';

  return (
    <div className="max-w-xl mx-auto my-8 px-4">
      <div className="bg-[#12141c] border border-[#232738] rounded-3xl p-6 md:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow backdrop effect */}
        <div 
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isNonUsa ? 'bg-rose-500' : 'bg-amber-500'
          }`}
        />

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border shadow-inner transition-transform hover:scale-105">
          {isNonUsa ? (
            <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <Globe className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-3">
          {isNonUsa ? 'Region Not Supported' : 'VPN or Proxy Not Supported'}
        </h2>

        {/* Body Message */}
        <p className="text-zinc-300 text-sm leading-relaxed mb-6">
          {isNonUsa ? (
            <>
              earnyt is currently <span className="text-white font-semibold">only available to users located in the United States</span>.
            </>
          ) : (
            <>
              Your IP address originates from the USA, but a <span className="text-amber-400 font-semibold">VPN, Proxy, or Anonymizer</span> was detected. 
              To ensure platform security and advertiser compliance, earnyt does not allow VPN connections.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center">
          <button
            onClick={onRefresh}
            className="px-6 py-2.5 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-Check Real IP Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};
