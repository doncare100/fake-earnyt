import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { IpRestrictionModal } from './components/IpRestrictionModal';
import { AuthModal } from './components/AuthModal';
import { VideoSection } from './components/VideoSection';
import { EarningsSection } from './components/EarningsSection';
import { DealsSection } from './components/DealsSection';
import { AdminSection } from './components/AdminSection';
import { checkClientIP } from './services/ipService';
import { INITIAL_VIDEOS, INITIAL_COMPLETED_VIDEOS, DEMO_USER } from './mockData';
import { IPInfo, User, Video, TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('VIDEOS');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [ipLoading, setIpLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [availableVideos, setAvailableVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [completedVideos, setCompletedVideos] = useState<Video[]>(INITIAL_COMPLETED_VIDEOS);

  const refreshIPCheck = async () => {
    setIpLoading(true);
    const info = await checkClientIP();
    setIpInfo(info);
    setIpLoading(false);
  };

  useEffect(() => {
    refreshIPCheck();
  }, []);

  const handleCompleteVideo = async (video: Video) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    // Move from available to completed
    setAvailableVideos((prev) => prev.filter((v) => v.id !== video.id));
    setCompletedVideos((prev) => [video, ...prev]);

    // Send API update
    try {
      const res = await fetch('/api/videos/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          videoId: video.id,
          points: video.rewardPoints
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Fallback local state update
        setUser((prev) =>
          prev
            ? {
                ...prev,
                points: prev.points + video.rewardPoints,
                earnedTotalUsd: prev.earnedTotalUsd + video.rewardPoints / 1000,
                completedVideoIds: [...prev.completedVideoIds, video.id]
              }
            : null
        );
      }
    } catch (err) {
      console.warn('Backend complete video sync failed, updated locally', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white">
      {/* Main Top Header */}
      <Header
        user={user}
        ipInfo={ipInfo}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSelectTab={setActiveTab}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Body Content */}
      <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto">
        {ipLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#1f2333] border-t-[#3b82f6] rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 font-medium">Tracking real-time IP address & location...</p>
          </div>
        ) : ipInfo && ipInfo.status !== 'ALLOWED' ? (
          /* Show Region or VPN Restriction Screen */
          <IpRestrictionModal
            ipInfo={ipInfo}
            onRefresh={() => refreshIPCheck()}
          />
        ) : (
          /* IP Allowed - Display Active Dashboard Tab */
          <>
            {activeTab === 'VIDEOS' && (
              <VideoSection
                videos={availableVideos}
                completedVideos={completedVideos}
                user={user}
                onCompleteVideo={handleCompleteVideo}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}

            {activeTab === 'EARNINGS' && (
              <EarningsSection
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onUpdateUser={(updated) => setUser(updated)}
              />
            )}

            {activeTab === 'DEALS' && (
              <DealsSection
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onUpdateUser={(updated) => setUser(updated)}
              />
            )}

            {activeTab === 'ADMIN' && (
              <AdminSection
                ipInfo={ipInfo}
                onRefreshIp={() => refreshIPCheck()}
              />
            )}
          </>
        )}
      </main>

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

      {/* Footer */}
      <footer className="border-t border-[#151722] py-6 text-center text-xs text-zinc-500 bg-[#090a0e]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#141e33] border border-[#233558] flex items-center justify-center font-bold text-xs text-[#3b82f6]">
              e
            </div>
            <span className="font-extrabold text-white">
              earn<span className="text-[#3b82f6]">yt</span> © 2026
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            USA Regional Platform • Real-time IP Tracking & VPN Shield Active
          </p>
        </div>
      </footer>
    </div>
  );
}
