import React from 'react';
import { AlertTriangle, Check, X, ArrowRight, GitMerge } from 'lucide-react';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  peerName: string;
  localCode: string;
  incomingCode: string;
  onResolve: (chosen: 'local' | 'incoming' | 'both') => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  fileName,
  peerName,
  localCode,
  incomingCode,
  onResolve,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold text-sm text-slate-100">
              Live Collaboration Conflict Detected
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-300">{peerName}</span> and you edited the same block in{' '}
            <span className="font-mono text-amber-400">{fileName}</span> simultaneously over the local network. Choose how to resolve:
          </p>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            {/* Current (Local) */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-sans font-bold">
                <span>Current Changes (You)</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">HEAD</span>
              </div>
              <pre className="text-emerald-400 bg-slate-900 p-2 rounded text-[11px] overflow-x-auto whitespace-pre-wrap">
                {localCode}
              </pre>
              <button
                onClick={() => onResolve('local')}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-semibold rounded-lg text-xs transition"
              >
                Keep My Changes
              </button>
            </div>

            {/* Incoming (Peer) */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-sky-400 font-sans font-bold">
                <span>Incoming ({peerName})</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300">PEER</span>
              </div>
              <pre className="text-sky-400 bg-slate-900 p-2 rounded text-[11px] overflow-x-auto whitespace-pre-wrap">
                {incomingCode}
              </pre>
              <button
                onClick={() => onResolve('incoming')}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-semibold rounded-lg text-xs transition"
              >
                Accept Peer Changes
              </button>
            </div>
          </div>

          {/* Merge Both Button */}
          <button
            onClick={() => onResolve('both')}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/10"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Combine / Smart Three-Way Merge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
