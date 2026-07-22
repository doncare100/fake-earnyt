import React from 'react';
import { PlayCircle, User as UserIcon, ShoppingBag, Settings } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'VIDEOS',
      label: 'VIDEOS',
      icon: <PlayCircle className="w-5 h-5" />
    },
    {
      id: 'EARNINGS',
      label: 'EARNINGS',
      icon: <UserIcon className="w-5 h-5" />
    },
    {
      id: 'DEALS',
      label: 'DEALS',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      id: 'ADMIN',
      label: 'ADMIN',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="bg-[#0b0c10] border-b border-[#181a22] px-4 py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#3b82f6] font-bold'
                  : 'text-zinc-500 hover:text-zinc-300 font-medium'
              }`}
            >
              <div className={`mb-1 transition-transform ${isActive ? 'scale-110 text-[#3b82f6]' : 'text-zinc-500'}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] tracking-wider uppercase font-semibold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
