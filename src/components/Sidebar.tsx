import React from 'react';
import { 
  FolderTree, 
  GitBranch, 
  Radio, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export type SidebarTab = 'files' | 'git' | 'network' | 'peers' | 'settings';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  modifiedCount: number;
  peersCount: number;
  isBroadcasting: boolean;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onToggleOpen,
  modifiedCount,
  peersCount,
  isBroadcasting,
  children,
}) => {
  return (
    <div className="flex h-full border-r border-slate-800 bg-slate-900 shrink-0 select-none">
      {/* Activity Bar (Icon Column) */}
      <div className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-3 justify-between shrink-0">
        <div className="flex flex-col items-center space-y-3">
          {/* File Explorer Icon */}
          <button
            onClick={() => {
              if (activeTab === 'files' && isOpen) {
                onToggleOpen();
              } else {
                onSelectTab('files');
                if (!isOpen) onToggleOpen();
              }
            }}
            className={`p-2 rounded-xl transition relative ${
              isOpen && activeTab === 'files'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Project Explorer"
          >
            <FolderTree className="w-5 h-5" />
          </button>

          {/* Git Source Control Icon */}
          <button
            onClick={() => {
              if (activeTab === 'git' && isOpen) {
                onToggleOpen();
              } else {
                onSelectTab('git');
                if (!isOpen) onToggleOpen();
              }
            }}
            className={`p-2 rounded-xl transition relative ${
              isOpen && activeTab === 'git'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Git Version Control"
          >
            <GitBranch className="w-5 h-5" />
            {modifiedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {modifiedCount}
              </span>
            )}
          </button>

          {/* Network Discovery Icon */}
          <button
            onClick={() => {
              if (activeTab === 'network' && isOpen) {
                onToggleOpen();
              } else {
                onSelectTab('network');
                if (!isOpen) onToggleOpen();
              }
            }}
            className={`p-2 rounded-xl transition relative ${
              isOpen && activeTab === 'network'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="LAN / WAN Studio Discovery"
          >
            <Radio className="w-5 h-5" />
            {isBroadcasting && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Peers & Chat Icon */}
          <button
            onClick={() => {
              if (activeTab === 'peers' && isOpen) {
                onToggleOpen();
              } else {
                onSelectTab('peers');
                if (!isOpen) onToggleOpen();
              }
            }}
            className={`p-2 rounded-xl transition relative ${
              isOpen && activeTab === 'peers'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Peers & Room Chat"
          >
            <Users className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-800 text-amber-400 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center justify-center">
              {peersCount}
            </span>
          </button>
        </div>

        {/* Bottom icon: Info/Toggle */}
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => {
              if (activeTab === 'settings' && isOpen) {
                onToggleOpen();
              } else {
                onSelectTab('settings');
                if (!isOpen) onToggleOpen();
              }
            }}
            className={`p-2 rounded-xl transition ${
              isOpen && activeTab === 'settings'
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="LANtern Settings & Info"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expandable Sidebar Drawer */}
      {isOpen && (
        <div className="w-64 md:w-72 flex flex-col h-full overflow-hidden border-r border-slate-800/80 bg-slate-900/95">
          {children}
        </div>
      )}
    </div>
  );
};
