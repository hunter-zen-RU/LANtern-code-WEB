import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  Radio, 
  Zap, 
  Terminal 
} from 'lucide-react';
import { FileItem, PeerCollaborator } from '../types';

interface RunPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileItem[];
  projectName: string;
  peers: PeerCollaborator[];
}

export const RunPreviewModal: React.FC<RunPreviewModalProps> = ({
  isOpen,
  onClose,
  files,
  projectName,
  peers,
}) => {
  if (!isOpen) return null;

  const [counter, setCounter] = useState(0);
  const [broadcastActive, setBroadcastActive] = useState(true);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  // Check if we have an HTML file
  const htmlFile = files.find(f => f.name.endsWith('.html'));
  const isAndroidCompose = projectName.includes('Android');

  const handlePingPeers = () => {
    setPingSuccess(`Pinged ${peers.length} peers on local subnet. Avg RTT: 3.4ms`);
    setTimeout(() => setPingSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm text-slate-100">
              LANtern Execution Engine: {projectName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-slate-950">
          {htmlFile ? (
            /* Web Project Runner */
            <div className="w-full h-96 border border-slate-800 rounded-xl overflow-hidden bg-white shadow-xl flex flex-col">
              <iframe
                title="Preview"
                srcDoc={htmlFile.content}
                className="w-full flex-1 border-0"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            /* Android Jetpack Compose Simulated Screen */
            <div className="w-80 h-[480px] bg-slate-950 rounded-[36px] border-4 border-slate-700 shadow-2xl p-4 flex flex-col relative overflow-hidden ring-4 ring-amber-500/10">
              {/* Android Notch / Camera Cutout */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3 shrink-0" />

              {/* Compose UI App Bar */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <span className="text-amber-400 font-extrabold text-sm flex items-center gap-1">
                  💡 LANtern Studio
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  192.168.1.142
                </span>
              </div>

              {/* Compose Screen Body */}
              <div className="flex-1 flex flex-col space-y-3">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">
                    Local Peer Swarm
                  </div>
                  <div className="text-lg font-bold text-amber-300 mt-1">
                    {peers.length} Peers Connected
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Broadcasting via mDNS NSD</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
                  <div className="text-xs text-slate-300 font-medium">Interactive Demo Counter:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold text-slate-100">{counter}</span>
                    <button
                      onClick={() => setCounter(c => c + 1)}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                    >
                      + Increment
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePingPeers}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl text-xs border border-slate-700 flex items-center justify-center space-x-1.5 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ping Local LAN Peers</span>
                </button>

                {pingSuccess && (
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono text-center">
                    {pingSuccess}
                  </div>
                )}
              </div>

              {/* Android Home Bar */}
              <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2 shrink-0" />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target Architecture: linux-x64 / Android Compose Runtime</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
