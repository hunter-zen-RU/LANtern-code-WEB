import React, { useState } from 'react';
import { Share2, Copy, Check, X, QrCode, Wifi, Globe, Smartphone, ShieldCheck } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  inviteCode: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  projectName,
  inviteCode,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const fullUrl = `https://lantern.code.app/join/${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400">
            <Share2 className="w-4 h-4" />
            <span className="font-bold text-sm text-slate-100">Invite Collaborators</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="text-center space-y-1">
            <div className="text-sm font-semibold text-slate-100">{projectName}</div>
            <p className="text-xs text-slate-400">
              Share this passkey or QR code with teammates on the same Wi-Fi router or over WAN.
            </p>
          </div>

          {/* QR Code Placeholder with lantern styling */}
          <div className="w-40 h-40 mx-auto bg-slate-950 border-2 border-amber-500/40 rounded-2xl flex flex-col items-center justify-center p-3 text-center shadow-inner relative">
            <QrCode className="w-24 h-24 text-amber-400" />
            <span className="text-[10px] font-mono text-slate-400 mt-1">mDNS Discovery Tag</span>
          </div>

          {/* Invite Code Box */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs text-amber-300 font-bold truncate mr-2 select-all">
              {fullUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 border-t border-slate-800 pt-3">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Wifi className="w-3.5 h-3.5 shrink-0" />
              <span>Zero external server required when on local Wi-Fi</span>
            </div>
            <div className="flex items-center space-x-1.5 text-sky-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>End-to-end encrypted peer-to-peer data channel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
