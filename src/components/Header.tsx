import React, { useState } from 'react';
import { 
  Wifi, 
  Globe, 
  GitBranch, 
  Play, 
  Share2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ChevronDown, 
  Sparkles,
  Users,
  Check,
  Radio,
  Database,
  ShieldCheck,
  FolderTree,
  Bot
} from 'lucide-react';
import { PeerCollaborator } from '../types';
import { ProjectData } from '../data/defaultProjects';

export type MainViewTab = 'code' | 'github' | 'sqlite' | 'network' | 'audit' | 'vibe';

interface HeaderProps {
  projects: ProjectData[];
  currentProject: ProjectData;
  onSelectProject: (proj: ProjectData) => void;
  peers: PeerCollaborator[];
  connectionMode: 'LAN' | 'WAN';
  onToggleConnectionMode: () => void;
  deviceMode: 'mobile' | 'tablet' | 'fullscreen';
  onChangeDeviceMode: (v: 'mobile' | 'tablet' | 'fullscreen') => void;
  activeMainTab: MainViewTab;
  onChangeMainTab: (tab: MainViewTab) => void;
  onRunCode: () => void;
  onOpenInviteModal: () => void;
  onOpenBranchModal: () => void;
  hasUnsavedChanges: boolean;
  onQuickSave: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  currentProject,
  onSelectProject,
  peers,
  connectionMode,
  onToggleConnectionMode,
  deviceMode,
  onChangeDeviceMode,
  activeMainTab,
  onChangeMainTab,
  onRunCode,
  onOpenInviteModal,
  onOpenBranchModal,
  hasUnsavedChanges,
  onQuickSave,
}) => {
  const [showProjDropdown, setShowProjDropdown] = useState(false);

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-3 md:px-4 z-20 shrink-0 select-none">
      {/* Left: Brand with Logo & Project Switcher */}
      <div className="flex items-center space-x-2.5">
        {/* App Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center shadow-lg shadow-amber-500/10">
            <img
              src="/app-logo.png"
              alt="LANtern Code"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to stylized lantern icon if image cannot load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-base select-none">💡</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-slate-100 tracking-tight text-sm flex items-center gap-1.5">
              LANtern <span className="text-amber-400 font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">Code</span>
            </span>
          </div>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProjDropdown(!showProjDropdown)}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-200 px-2.5 py-1.5 rounded-xl border border-slate-700/80 transition"
          >
            <span className="truncate max-w-[110px] md:max-w-[160px]">
              {currentProject.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showProjDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Active Projects (SQLite Store)
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setShowProjDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex flex-col transition ${
                    p.id === currentProject.id
                      ? 'bg-amber-500/15 text-amber-300 font-medium'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-[10px] text-slate-400 truncate mt-0.5">{p.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Main App Features Navigation Bar */}
      <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 space-x-1">
        <button
          onClick={() => onChangeMainTab('code')}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
            activeMainTab === 'code'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Code Editor & Project Files"
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => onChangeMainTab('github')}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
            activeMainTab === 'github'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="GitHub Connection & Git Sync"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </button>

        <button
          onClick={() => onChangeMainTab('sqlite')}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
            activeMainTab === 'sqlite'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="SQLite Local Project & Code Database"
        >
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>SQLite</span>
        </button>

        <button
          onClick={() => onChangeMainTab('network')}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
            activeMainTab === 'network'
              ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Browser LAN/WAN Gateway Link"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Browser Link</span>
        </button>

        <button
          onClick={() => onChangeMainTab('audit')}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
            activeMainTab === 'audit'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Project Health & Security Audit"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audit</span>
        </button>

        <button
          onClick={() => onChangeMainTab('vibe')}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
            activeMainTab === 'vibe'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="AI Assistant (Online & Local) & Vibecoding"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Vibecoding</span>
        </button>
      </div>

      {/* Right: Team Invite, Android Frame Mode, Run */}
      <div className="flex items-center space-x-1.5 md:space-x-2">
        {/* Team Invite Button */}
        <button
          onClick={onOpenInviteModal}
          className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700/80 transition"
          title="Invite Team & AI Assistant"
        >
          <Users className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Team ({peers.length})</span>
        </button>

        {/* Android Device Mockup Selector */}
        <div className="hidden lg:flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800">
          <button
            onClick={() => onChangeDeviceMode('fullscreen')}
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'fullscreen' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Android Studio Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'tablet' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Android Tablet / Foldable Frame"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChangeDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition ${
              deviceMode === 'mobile' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Android Phone Mockup Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Run Button */}
        <button
          onClick={onRunCode}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3.5 py-1.5 rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Run</span>
        </button>
      </div>
    </header>
  );
};
