'use client';

import React from 'react';
import { Files, Search, GitBranch, Settings } from 'lucide-react';

interface ActivityBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function ActivityBar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}: ActivityBarProps) {
  const items = [
    { id: 'explorer', icon: Files, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'source-control', icon: GitBranch, label: 'Source Control' },
  ];

  const handleTabClick = (id: string) => {
    if (activeTab === id) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setActiveTab(id);
      setSidebarOpen(true);
    }
  };

  return (
    <div className="w-[50px] bg-activity-bg flex flex-col justify-between items-center py-2 border-r border-border-dark select-none h-full">
      {/* Top Icons */}
      <div className="flex flex-col gap-1 w-full items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && sidebarOpen;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full py-3 flex items-center justify-center border-l-2 cursor-pointer relative group transition-all duration-150 ${
                isActive
                  ? 'border-dracula-purple text-text-normal bg-editor-bg/30'
                  : 'border-transparent text-text-muted hover:text-text-normal'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon size={24} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>

      {/* Bottom Gear */}
      <div className="w-full flex items-center justify-center py-2">
        <button
          className="text-text-muted hover:text-text-normal cursor-pointer transition-colors duration-150"
          title="Settings"
          aria-label="Settings"
        >
          <Settings size={24} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
