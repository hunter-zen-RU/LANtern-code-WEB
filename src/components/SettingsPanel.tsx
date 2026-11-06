import React from 'react';
import { Settings, Info, Cpu, Shield, Globe, Wifi } from 'lucide-react';

interface SettingsPanelProps {
  authorName: string;
  onChangeAuthorName: (name: string) => void;
  lanPort: number;
  onChangeLanPort: (port: number) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  authorName,
  onChangeAuthorName,
  lanPort,
  onChangeLanPort,
  fontSize,
  onChangeFontSize,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-300 text-xs select-none">
      <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          IDE Preferences
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* About Card */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
          <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
            <span>💡 LANtern Code v1.4.2</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            High-performance Android & Web IDE. Bridges offline localized peer-to-peer Wi-Fi coding and cloud-based version control.
          </p>
        </div>

        {/* Git Configuration */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Git Committer Name
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => onChangeAuthorName(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* LAN Port */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            mDNS NSD Broadcast Port
          </label>
          <input
            type="number"
            value={lanPort}
            onChange={(e) => onChangeLanPort(parseInt(e.target.value) || 8080)}
            className="w-full bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none font-mono"
          />
        </div>

        {/* Editor Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Editor Font Size</span>
            <span className="text-amber-400 font-mono">{fontSize}px</span>
          </div>
          <input
            type="range"
            min={10}
            max={18}
            value={fontSize}
            onChange={(e) => onChangeFontSize(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Diagnostics & Network Details */}
        <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-[10px] space-y-1 font-mono text-slate-400">
          <div className="text-slate-300 font-sans font-semibold mb-1">Runtime Status:</div>
          <div>WebRTC Data Channel: Ready</div>
          <div>mDNS Multicast: Active</div>
          <div>CRDT / OT Engine: Synchronized</div>
          <div>Storage: In-Memory IndexedDB Git FS</div>
        </div>
      </div>
    </div>
  );
};
