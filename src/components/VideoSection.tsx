import React, { useState } from 'react';
import { Play, BookOpen, RefreshCw, CheckCircle2, Clock, Coins, Eye, Sparkles, Tv, AlertCircle } from 'lucide-react';
import { Video, User } from '../types';

interface VideoSectionProps {
  videos: Video[];
  completedVideos: Video[];
  user: User | null;
  onCompleteVideo: (video: Video) => void;
  onOpenAuth: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos,
  completedVideos,
  user,
  onCompleteVideo,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Start watching video timer
  const handleStartWatch = (video: Video) => {
    setSelectedVideo(video);
    setTimerSeconds(video.durationSeconds);
    setIsWatching(true);
    setIsCompleted(false);

    // Countdown interval
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCompleted(true);
          setIsWatching(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimReward = () => {
    if (selectedVideo) {
      onCompleteVideo(selectedVideo);
      setSelectedVideo(null);
      setIsCompleted(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Featured Header Card (Exact screenshot replicate) */}
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Large Play Icon Box */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#131e36] border border-[#21355e] flex items-center justify-center shadow-inner mb-6 transition-transform hover:scale-105">
          <Play className="w-10 h-10 md:w-12 md:h-12 text-[#3b82f6] fill-[#3b82f6] ml-1" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
          Select a Video to Get Started
        </h1>

        {/* Subtext */}
        <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
          Pick an available video from the list, watch it fully, and earn points toward your balance!
        </p>
      </div>

      {/* Available Videos Card (Exact screenshot replicate) */}
      <div className="bg-[#14151c] border border-[#222533] rounded-3xl p-6 md:p-8 shadow-xl">
        {/* Card Header Row */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f2231]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#3b82f6]" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Available Videos
            </h2>
          </div>

          <button 
            onClick={() => {}} 
            className="p-1.5 rounded-xl bg-[#1a1c26] text-zinc-400 hover:text-white hover:bg-[#232738] transition-colors"
            title="Refresh videos list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'available'
                ? 'bg-[#141e33] border border-[#233558] text-[#3b82f6] shadow-sm'
                : 'bg-[#101117] border border-[#1d202c] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Available ({videos.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-[#141e33] border border-[#233558] text-[#3b82f6] shadow-sm'
                : 'bg-[#101117] border border-[#1d202c] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Completed ({completedVideos.length})
          </button>
        </div>

        {/* Video List */}
        <div className="space-y-3.5">
          {activeTab === 'available' ? (
            videos.length > 0 ? (
              videos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-[#0c0d12] border border-[#1d202e] rounded-2xl p-4 hover:border-[#2d334a] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-16 h-12 rounded-xl bg-[#161a26] border border-[#252b3e] overflow-hidden shrink-0 relative group-hover:border-[#3b82f6]/50 transition-colors">
                      <img 
                        src={vid.thumbnailUrl} 
                        alt={vid.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-[#3b82f6] transition-colors">
                        {vid.title}
                      </h3>
                      <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 mt-1 flex-wrap">
                        <span className="bg-[#181b26] px-2 py-0.5 rounded text-zinc-300 font-medium">
                          {vid.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          0:{vid.durationSeconds < 10 ? `0${vid.durationSeconds}` : vid.durationSeconds}
                        </span>
                        <span className="flex items-center gap-1 text-[#3b82f6] font-bold">
                          <Coins className="w-3 h-3 text-[#3b82f6]" />
                          +{vid.rewardPoints} Points
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!user) {
                        onOpenAuth();
                      } else {
                        handleStartWatch(vid);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Now</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500 text-xs bg-[#0b0c10] rounded-2xl border border-[#1a1d29] p-6">
                <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="font-semibold text-zinc-400">All available videos completed!</p>
                <p className="text-zinc-500 mt-1">Check back soon for new video tasks.</p>
              </div>
            )
          ) : (
            completedVideos.length > 0 ? (
              completedVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-[#0c0d12] border border-[#1d202e] rounded-2xl p-4 flex items-center justify-between gap-4 opacity-75"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-10 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-200 line-through">
                        {vid.title}
                      </h3>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        +{vid.rewardPoints} Points Earned
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-xl">
                    Completed
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500 text-xs bg-[#0b0c10] rounded-2xl border border-[#1a1d29] p-6">
                <p className="font-medium">No completed videos yet.</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Video Watch Overlay Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-[#12141c] border border-[#232738] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative">
            <div className="p-4 border-b border-[#1e2232] flex items-center justify-between bg-[#0b0c10]">
              <div className="flex items-center gap-2 min-w-0">
                <Tv className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <h3 className="text-sm font-bold text-white truncate">
                  {selectedVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 bg-[#17223b] text-[#3b82f6] border border-[#243861] px-2.5 py-1 rounded-full text-xs font-bold">
                <Coins className="w-3.5 h-3.5" />
                <span>+{selectedVideo.rewardPoints} Pts</span>
              </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black relative flex items-center justify-center">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Progress & Control */}
            <div className="p-5 space-y-4">
              <div className="bg-[#0b0c10] p-4 rounded-2xl border border-[#1f2231] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">
                    {isCompleted ? 'Video Finished!' : 'Watch Progress'}
                  </span>
                  <span className="text-white font-mono font-bold">
                    {isCompleted ? '00:00' : `00:${timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-[#181a24] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3b82f6] to-sky-400 transition-all duration-1000 ease-linear"
                    style={{
                      width: `${
                        ((selectedVideo.durationSeconds - timerSeconds) /
                          selectedVideo.durationSeconds) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>

              {isCompleted ? (
                <button
                  onClick={handleClaimReward}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 animate-bounce"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>Claim +{selectedVideo.rewardPoints} Points Now!</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Keep this video playing to unlock your point reward!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
