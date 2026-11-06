import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Bot, 
  Shield, 
  Share2, 
  CheckCircle, 
  Radio, 
  MessageSquare,
  Zap
} from 'lucide-react';
import { PeerCollaborator } from '../types';

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  peers: PeerCollaborator[];
  onAddAiToTeam: (role: string) => void;
  aiIncluded: boolean;
}

export const TeamInviteModal: React.FC<TeamInviteModalProps> = ({
  isOpen,
  onClose,
  projectName,
  peers,
  onAddAiToTeam,
  aiIncluded,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'editor' | 'reviewer'>('editor');
  const [includeAi, setIncludeAi] = useState(aiIncluded);
  const [aiRole, setAiRole] = useState('Pair Programmer & Auditor');

  const inviteLink = `https://lantern.code.app/join/team-${projectName.toLowerCase().replace(/\s+/g, '-')}-room?role=${selectedRole}&include_ai=${includeAi}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAi = () => {
    const next = !includeAi;
    setIncludeAi(next);
    if (next) {
      onAddAiToTeam(aiRole);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-4 ring-amber-500/10">
        {/* Header */}
        <div className="h-14 px-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-100">Invite Team to Workspace</span>
              <div className="text-[10px] text-slate-400 font-mono">Peer-to-Peer & AI Collaboration</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[80vh]">
          {/* AI Assistant in Team Section (Requirement 4: team can also include AI assistant) */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/40 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-indigo-200 flex items-center gap-1.5">
                    <span>Include AI Assistant in Team</span>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="text-[10px] text-indigo-300/80">
                    AI joins room as active peer for pair-coding, auditing & @mentions
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleAi}
                className={`w-11 h-6 rounded-full transition relative p-0.5 ${
                  includeAi ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    includeAi ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {includeAi && (
              <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between text-[11px]">
                <span className="text-indigo-300 font-medium">AI Teammate Role:</span>
                <select
                  value={aiRole}
                  onChange={(e) => {
                    setAiRole(e.target.value);
                    onAddAiToTeam(e.target.value);
                  }}
                  className="bg-slate-900 text-indigo-200 border border-indigo-500/40 rounded-lg px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="Pair Programmer & Auditor">Pair Programmer & Auditor</option>
                  <option value="Vibecoder Specialist">Vibecoder Specialist</option>
                  <option value="Security Sentinel">Security Sentinel</option>
                  <option value="Documentation Architect">Documentation Architect</option>
                </select>
              </div>
            )}
          </div>

          {/* Peer Access Role */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Invited Member Default Permission
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedRole('editor')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedRole === 'editor'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full-Write Editor</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Live code editing, Git commits, and SQLite queries
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('reviewer')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedRole === 'reviewer'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>Reviewer Spectator</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Read-only cursor tracking and team chat
                </div>
              </button>
            </div>
          </div>

          {/* Generated Shareable Team Link */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Shareable Team Invite Link
            </label>
            <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="font-mono text-xs text-amber-300 truncate select-all flex-1">
                {inviteLink}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition flex items-center gap-1 shrink-0"
              >
                {copied ? (
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
          </div>

          {/* Current Team Roster Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Team Members ({peers.length + (includeAi ? 1 : 0)})
            </span>
            <div className="space-y-1.5">
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <img src={peer.avatar} alt={peer.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-slate-200">{peer.name}</div>
                      <div className="text-[10px] text-slate-500">{peer.device}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {peer.role === 'write' ? 'Full-Write' : 'Read-Only'}
                  </span>
                </div>
              ))}

              {includeAi && (
                <div className="flex items-center justify-between p-2 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                      🤖
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-200 flex items-center gap-1">
                        <span>LANtern AI Assistant</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <div className="text-[10px] text-indigo-400/80">{aiRole}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                    AI Member
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
