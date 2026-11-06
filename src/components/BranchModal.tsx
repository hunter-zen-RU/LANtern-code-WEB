import React, { useState } from 'react';
import { GitBranch, Plus, Check, X, Trash2 } from 'lucide-react';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranch: string;
  onSelectBranch: (branch: string) => void;
  onCreateBranch: (branch: string) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  currentBranch,
  onSelectBranch,
  onCreateBranch,
}) => {
  if (!isOpen) return null;

  const [branches, setBranches] = useState<string[]>([
    'main',
    'feature/lan-sync',
    'feature/webrtc-p2p',
    'fix/cursor-drift',
  ]);
  const [newBranchName, setNewBranchName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newBranchName.trim().replace(/\s+/g, '-');
    if (clean && !branches.includes(clean)) {
      setBranches([...branches, clean]);
      onCreateBranch(clean);
      setNewBranchName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400">
            <GitBranch className="w-4 h-4" />
            <span className="font-bold text-sm text-slate-100">Switch or Create Branch</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <form onSubmit={handleCreate} className="flex space-x-1.5">
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="e.g. feature/crdt-sync..."
              className="flex-1 bg-slate-950 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={!newBranchName.trim()}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </form>

          <div className="space-y-1 max-h-56 overflow-y-auto">
            {branches.map((b) => (
              <div
                key={b}
                onClick={() => {
                  onSelectBranch(b);
                  onClose();
                }}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs font-mono transition ${
                  b === currentBranch
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                  <span>{b}</span>
                </div>
                {b === currentBranch && <Check className="w-4 h-4 text-amber-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
