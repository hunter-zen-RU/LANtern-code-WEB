import React, { useState } from 'react';
import { 
  Wifi, 
  Radio, 
  Globe, 
  RefreshCw, 
  Lock, 
  Unlock, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Signal, 
  Laptop, 
  Tablet, 
  Smartphone,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { DiscoveredStudio } from '../types';

interface NetworkDiscoveryPanelProps {
  isBroadcasting: boolean;
  onToggleBroadcast: () => void;
  connectionMode: 'LAN' | 'WAN';
  onToggleConnectionMode: () => void;
  discoveredStudios: DiscoveredStudio[];
  onScanSubnet: () => void;
  isScanning: boolean;
  onJoinStudio: (studio: DiscoveredStudio) => void;
  workspaceInviteUrl: string;
}

export const NetworkDiscoveryPanel: React.FC<NetworkDiscoveryPanelProps> = ({
  isBroadcasting,
  onToggleBroadcast,
  connectionMode,
  onToggleConnectionMode,
  discoveredStudios,
  onScanSubnet,
  isScanning,
  onJoinStudio,
  workspaceInviteUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [accessRole, setAccessRole] = useState<'write' | 'read'>('write');

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(workspaceInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-300 text-xs select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          LAN & WAN Discovery
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          mDNS / NSD
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Local Broadcast Station Card */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isBroadcasting ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="font-semibold text-slate-200">Local Studio Broadcast</span>
            </div>
            <button
              onClick={onToggleBroadcast}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                isBroadcasting
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              {isBroadcasting ? 'Stop Broadcast' : 'Broadcast Studio'}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Service Type:</span>
              <span className="text-amber-300">_lantern_ide._tcp</span>
            </div>
            <div className="flex justify-between">
              <span>Host IP / Port:</span>
              <span className="text-slate-300">192.168.1.142:8080</span>
            </div>
            <div className="flex justify-between">
              <span>Subnet Mask:</span>
              <span className="text-slate-300">255.255.255.0</span>
            </div>
          </div>
        </div>

        {/* Access Permissions for Incoming Peers */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Default Peer Access Permission
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setAccessRole('write')}
              className={`p-2 rounded-lg border text-left transition ${
                accessRole === 'write'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-[11px] flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Full-Write
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Live editing & Git commits</div>
            </button>
            <button
              onClick={() => setAccessRole('read')}
              className={`p-2 rounded-lg border text-left transition ${
                accessRole === 'read'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-sky-400" />
                Read-Only
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Spectator & code reviewer</div>
            </button>
          </div>
        </div>

        {/* WAN Cloud Relay Link */}
        <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-indigo-200">WAN Remote Invite Link</span>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 text-[10px] text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 px-2 py-0.5 rounded border border-indigo-500/30 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
          <div className="font-mono text-[10px] bg-slate-950 p-1.5 rounded text-indigo-300 truncate select-all">
            {workspaceInviteUrl}
          </div>
        </div>

        {/* Local Network Scanner */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-emerald-400" />
              Discovered LAN Studios
            </span>
            <button
              onClick={onScanSubnet}
              disabled={isScanning}
              className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Scan Subnet'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {discoveredStudios.map((studio) => (
              <div
                key={studio.id}
                className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">{studio.name}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {studio.latencyMs}ms ping
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{studio.hostDevice} • {studio.hostName}</span>
                  <span className="text-[10px] text-slate-500">{studio.peersCount} peers</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-500 truncate">{studio.projectType}</span>
                  <button
                    onClick={() => onJoinStudio(studio)}
                    className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
