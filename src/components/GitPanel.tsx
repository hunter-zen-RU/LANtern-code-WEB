import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  GitPullRequest, 
  UploadCloud, 
  DownloadCloud, 
  Check, 
  Plus, 
  RotateCcw, 
  GitMerge, 
  FileText,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { FileItem, GitCommit } from '../types';

interface GitPanelProps {
  branch: string;
  files: FileItem[];
  commits: GitCommit[];
  onCommit: (message: string) => void;
  onPush: () => void;
  onPull: () => void;
  onOpenBranchModal: () => void;
  onOpenMergeModal: () => void;
  onOpenDiffModal: (file: FileItem) => void;
  isSyncing: boolean;
  syncStatus: string;
}

export const GitPanel: React.FC<GitPanelProps> = ({
  branch,
  files,
  commits,
  onCommit,
  onPush,
  onPull,
  onOpenBranchModal,
  onOpenMergeModal,
  onOpenDiffModal,
  isSyncing,
  syncStatus,
}) => {
  const [commitMessage, setCommitMessage] = useState('');
  const modifiedFiles = files.filter((f) => f.modified);

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    onCommit(commitMessage.trim());
    setCommitMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-300 text-xs select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-amber-400" />
          Git Source Control
        </span>
        <button
          onClick={onOpenBranchModal}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"
        >
          {branch}
        </button>
      </div>

      {/* Push / Pull / Merge Toolbar */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-slate-950/40 border-b border-slate-800/80">
        <button
          onClick={onPush}
          disabled={isSyncing}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded text-slate-200 border border-slate-700/60 transition disabled:opacity-50"
          title="Push commits to remote (GitHub / GitLab)"
        >
          <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-medium">Push</span>
        </button>
        <button
          onClick={onPull}
          disabled={isSyncing}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded text-slate-200 border border-slate-700/60 transition disabled:opacity-50"
          title="Pull latest remote changes"
        >
          <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-medium">Pull</span>
        </button>
        <button
          onClick={onOpenMergeModal}
          className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded text-slate-200 border border-slate-700/60 transition"
          title="Merge another branch or resolve conflicts"
        >
          <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-medium">Merge</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="px-3 py-1 bg-slate-800/80 text-[11px] text-emerald-400 border-b border-slate-800 flex items-center justify-between">
          <span className="truncate">{syncStatus}</span>
          {isSyncing && <span className="animate-spin text-amber-400">↻</span>}
        </div>
      )}

      {/* Commit Box */}
      <div className="p-3 border-b border-slate-800">
        <form onSubmit={handleCommitSubmit} className="space-y-2">
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Commit message (e.g. feat: add LAN WebSockets)..."
            rows={2}
            className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded border border-slate-700 focus:border-amber-400 focus:outline-none resize-none font-mono"
          />
          <button
            type="submit"
            disabled={!commitMessage.trim()}
            className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition flex items-center justify-center space-x-1"
          >
            <GitCommitIcon className="w-3.5 h-3.5" />
            <span>Commit to {branch}</span>
          </button>
        </form>
      </div>

      {/* Changed Files */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 font-semibold text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Working Tree ({modifiedFiles.length})</span>
          {modifiedFiles.length > 0 && (
            <span className="text-[10px] text-amber-400 font-mono">Uncommitted</span>
          )}
        </div>

        {modifiedFiles.length === 0 ? (
          <div className="px-3 py-4 text-center text-slate-500">
            <Check className="w-5 h-5 mx-auto mb-1 text-emerald-500/70" />
            Working directory clean
          </div>
        ) : (
          <div className="space-y-0.5 px-2">
            {modifiedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-800/80 group"
              >
                <div className="flex items-center space-x-1.5 truncate min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate text-slate-200">{file.name}</span>
                </div>
                <button
                  onClick={() => onOpenDiffModal(file)}
                  className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-amber-300 hover:bg-amber-400/20 px-1.5 py-0.5 rounded border border-amber-400/30"
                  title="View Git Diff"
                >
                  Diff
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Commit History Log */}
        <div className="mt-4 border-t border-slate-800/80 pt-2">
          <div className="px-3 py-1 font-semibold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Commit History
          </div>
          <div className="space-y-1 p-2">
            {commits.map((c) => (
              <div
                key={c.id}
                className="p-2 rounded bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-medium truncate font-sans">{c.message}</span>
                  <span className="font-mono text-amber-400/90 text-[10px] ml-1 shrink-0">{c.hash}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <div className="flex items-center space-x-1.5">
                    <img src={c.authorAvatar} alt={c.author} className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span>{c.author}</span>
                  </div>
                  <span>{c.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
