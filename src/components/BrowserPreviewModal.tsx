import React, { useState } from 'react';
import { X, ExternalLink, Globe, Wifi, RotateCw, Check, Database, Users, Laptop } from 'lucide-react';
import { sqliteDB } from '../lib/sqliteEngine';

interface BrowserPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export const BrowserPreviewModal: React.FC<BrowserPreviewModalProps> = ({
  isOpen,
  onClose,
  projectName,
}) => {
  if (!isOpen) return null;

  const [counter, setCounter] = useState(1);
  const [activeTab, setActiveTab] = useState<'preview' | 'db-mirror'>('preview');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[88vh]">
        {/* Browser Top Chrome / URL bar */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 flex-1 mr-4">
            {/* Mac/Chrome window dots */}
            <div className="flex space-x-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Simulated Browser URL bar */}
            <div className="flex-1 max-w-lg mx-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <span className="text-slate-500">🔒</span>
              <span className="truncate">http://192.168.1.142:3000/browser-studio?token=lantern_wifi_3000</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img src="/app-logo.png" alt="LANtern" className="w-8 h-8 rounded-xl object-contain bg-amber-500/10" onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }} />
                <div>
                  <div className="font-bold text-slate-100 text-sm">{projectName}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">LAN Peer Connected via WebSocket</div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                2.4ms RTT
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This simulated browser client confirms your LANtern studio is broadcasting seamlessly over Wi-Fi direct. Connected peers can view SQLite tables, edit code, and chat simultaneously.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">SQLite Tables Live</div>
                <div className="text-xl font-bold font-mono text-indigo-400">
                  {sqliteDB.getTables().length} Active
                </div>
                <div className="text-[10px] text-slate-500 font-mono">projects, files, team_sessions</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Connected Peers</div>
                <div className="text-xl font-bold font-mono text-amber-400">
                  4 Collaborators
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Pixel Tablet, Galaxy Fold, AI</div>
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={() => setCounter(c => c + 1)}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                Send Peer Action ({counter})
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
