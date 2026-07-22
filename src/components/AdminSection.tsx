import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, ShieldAlert, Users, Activity, Globe, RefreshCw, Cpu, Database } from 'lucide-react';
import { IPLog, User, IPInfo } from '../types';

interface AdminSectionProps {
  ipInfo: IPInfo | null;
  onRefreshIp: () => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({ ipInfo, onRefreshIp }) => {
  const [ipLogs, setIpLogs] = useState<IPLog[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'users' | 'rules'>('logs');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [logsRes, usersRes] = await Promise.all([
        fetch('/api/admin/ip-logs'),
        fetch('/api/admin/users')
      ]);

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setIpLogs(logsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsersList(usersData);
      }
    } catch (err) {
      console.warn("Failed to load admin logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1f2231]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#3b82f6]" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Admin Control & IP Tracker
              </h2>
              <span className="text-xs text-zinc-400">
                Real-time security analytics & USA regional enforcement
              </span>
            </div>
          </div>

          <button
            onClick={() => { onRefreshIp(); fetchAdminData(); }}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-[#1a2133] hover:bg-[#232f4a] border border-[#2b3e66] text-[#3b82f6] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Analytics</span>
          </button>
        </div>

        {/* Subtab Toggle */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-[#0c0d12] p-1.5 rounded-2xl border border-[#1f2231]">
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'logs'
                ? 'bg-[#141e33] text-[#3b82f6] border border-[#233558]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>IP Tracker Logs</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'users'
                ? 'bg-[#141e33] text-[#3b82f6] border border-[#233558]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Accounts</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rules')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeSubTab === 'rules'
                ? 'bg-[#141e33] text-[#3b82f6] border border-[#233558]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Geo & VPN Rules</span>
          </button>
        </div>

        {/* Subtab Content 1: IP Tracking Log */}
        {activeSubTab === 'logs' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1 mb-2">
              <span className="font-semibold text-white">Live Request Stream ({ipLogs.length} events)</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Monitoring Active
              </span>
            </div>

            <div className="overflow-x-auto border border-[#1f2231] rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b0c10] text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#1f2231]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">IP Address</th>
                    <th className="p-3">Location / ISP</th>
                    <th className="p-3">VPN Status</th>
                    <th className="p-3 text-right">Action Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d29] bg-[#0d0e14]">
                  {ipLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#121520] transition-colors">
                      <td className="p-3 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                        {log.ip}
                      </td>
                      <td className="p-3 text-zinc-300">
                        <div className="font-medium">{log.city}, {log.country} ({log.countryCode})</div>
                        <div className="text-[10px] text-zinc-500 truncate max-w-[120px]">{log.isp}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {log.isVpn ? (
                          <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded text-[10px]">
                            VPN Detected
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded text-[10px]">
                            Clean IP
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          log.status === 'ALLOWED'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : log.status === 'BLOCKED_VPN'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}>
                          {log.status === 'ALLOWED'
                            ? 'ALLOWED'
                            : log.status === 'BLOCKED_VPN'
                            ? 'BLOCKED (VPN)'
                            : 'BLOCKED (NON-US)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subtab Content 2: Registered Users */}
        {activeSubTab === 'users' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Registered Accounts ({usersList.length})
            </h3>
            <div className="space-y-2.5">
              {usersList.map((usr) => (
                <div
                  key={usr.id}
                  className="bg-[#0b0c10] border border-[#1f2231] rounded-2xl p-4 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{usr.name}</span>
                    <span className="text-zinc-400">{usr.email} • ZIP: {usr.zipCode} ({usr.country})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#3b82f6] block">{usr.points.toLocaleString()} Points</span>
                    <span className="text-zinc-500 text-[10px]">Joined: {usr.joinedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtab Content 3: Security & Geo Rules */}
        {activeSubTab === 'rules' && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#0b0c10] border border-[#1f2231] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1a1d29]">
                <div>
                  <h4 className="font-bold text-white text-sm">United States Geofence Enforcement</h4>
                  <p className="text-zinc-400 text-xs">Only allow requests originating from US region IP addresses.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold text-[11px]">
                  ENABLED (STRICT)
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#1a1d29]">
                <div>
                  <h4 className="font-bold text-white text-sm">VPN / Proxy Shield</h4>
                  <p className="text-zinc-400 text-xs">Block access if IP is flagged as hosting, proxy, datacenter, or VPN.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold text-[11px]">
                  ENABLED (ACTIVE)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Real-time IP Tracker Pipeline</h4>
                  <p className="text-zinc-400 text-xs">Query `ip-api` on every dashboard access and store session logs.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#17223b] text-[#3b82f6] border border-[#243861] font-bold text-[11px]">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
