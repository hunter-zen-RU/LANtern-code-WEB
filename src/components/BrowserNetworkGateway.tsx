import React, { useState } from 'react';
import { 
  Wifi, 
  Globe, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Radio, 
  RefreshCw, 
  Laptop, 
  Smartphone, 
  Tablet, 
  ShieldCheck, 
  Sparkles,
  Link2,
  Server
} from 'lucide-react';
import { DiscoveredStudio } from '../types';

interface BrowserNetworkGatewayProps {
  onOpenBrowserPreview: () => void;
}

export const BrowserNetworkGateway: React.FC<BrowserNetworkGatewayProps> = ({
  onOpenBrowserPreview,
}) => {
  const [networkType, setNetworkType] = useState<'LAN' | 'WAN'>('LAN');
  const [copiedLan, setCopiedLan] = useState(false);
  const [copiedWan, setCopiedWan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activePort, setActivePort] = useState(3000);
  const [lanIp, setLanIp] = useState('192.168.1.142');

  const lanUrl = `http://${lanIp}:${activePort}/browser-studio?token=lantern_wifi_${activePort}`;
  const wanUrl = `https://relay.lantern.code.app/join/wan-session-alpha-${activePort}`;

  const handleCopyLan = () => {
    navigator.clipboard?.writeText(lanUrl);
    setCopiedLan(true);
    setTimeout(() => setCopiedLan(false), 2000);
  };

  const handleCopyWan = () => {
    navigator.clipboard?.writeText(wanUrl);
    setCopiedWan(true);
    setTimeout(() => setCopiedWan(false), 2000);
  };

  const [discoveredBrowsers, setDiscoveredBrowsers] = useState<
    { id: string; name: string; ip: string; client: string; pingMs: number; status: string }[]
  >([
    {
      id: 'b1',
      name: 'Elena Chrome on MacBook Pro M3',
      ip: '192.168.1.108:3000',
      client: 'Chrome 131 (macOS)',
      pingMs: 2.8,
      status: 'Connected & Syncing',
    },
    {
      id: 'b2',
      name: 'Marcus Safari on iPad Pro 13"',
      ip: '192.168.1.115:3000',
      client: 'Safari 18 (iPadOS)',
      pingMs: 4.1,
      status: 'Active Spectator',
    },
    {
      id: 'b3',
      name: 'Lab Display Samsung SmartTV',
      ip: '192.168.1.173:3000',
      client: 'Chromium TV Browser',
      pingMs: 6.2,
      status: 'Dashboard Mode',
    },
  ]);

  const handleScanSubnet = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDiscoveredBrowsers(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          name: 'Linux Dev Terminal (Firefox 133)',
          ip: '192.168.1.199:3000',
          client: 'Firefox Developer Edition',
          pingMs: 1.9,
          status: 'Ready to Pair',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 text-xs select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>Browser LAN & WAN Gateway</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Live Server
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Port: {activePort} • Zero Configuration mDNS NSD
            </div>
          </div>
        </div>

        <button
          onClick={onOpenBrowserPreview}
          className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Test Browser Link</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Connection Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setNetworkType('LAN')}
            className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
              networkType === 'LAN'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Local Wi-Fi (LAN)</span>
          </button>
          <button
            onClick={() => setNetworkType('WAN')}
            className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition ${
              networkType === 'WAN'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Cloud Relay (WAN)</span>
          </button>
        </div>

        {/* Generated Browser Link Card with QR Code */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-amber-400" />
              <span>Shareable {networkType} Browser Link</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Broadcasting on port {activePort}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Open this URL on any desktop laptop, iPad, or mobile phone connected to the same router to edit code, view SQLite databases, and collaborate without installing software.
          </p>

          {/* URL Bar */}
          <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
            <span className="font-mono text-xs text-amber-300 truncate select-all flex-1">
              {networkType === 'LAN' ? lanUrl : wanUrl}
            </span>
            <button
              onClick={networkType === 'LAN' ? handleCopyLan : handleCopyWan}
              className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition flex items-center gap-1 shrink-0"
            >
              {(networkType === 'LAN' ? copiedLan : copiedWan) ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* QR Code and Quick Details */}
          <div className="flex items-center space-x-4 pt-2">
            <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center p-2 text-center shrink-0">
              <QrCode className="w-16 h-16 text-amber-400" />
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="text-slate-200 font-sans font-semibold">
                Camera Scan Ready:
              </div>
              <div>Subnet: 192.168.1.0/24</div>
              <div>Protocol: HTTP/1.1 + WebSocket P2P</div>
              <div>Encryption: TLS 1.3 Local Direct</div>
            </div>
          </div>
        </div>

        {/* Discovered Browser Clients over LAN */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Browser Clients On Subnet ({discoveredBrowsers.length})</span>
            </span>
            <button
              onClick={handleScanSubnet}
              disabled={isScanning}
              className="flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Subnet...' : 'Scan Wi-Fi'}</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {discoveredBrowsers.map((b) => (
              <div
                key={b.id}
                className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <span>{b.name}</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      {b.pingMs}ms
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {b.ip} • {b.client}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
