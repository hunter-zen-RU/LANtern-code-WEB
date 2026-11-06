import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit as GitCommitIcon, 
  UploadCloud, 
  DownloadCloud, 
  Check, 
  Plus, 
  Key, 
  Globe, 
  ExternalLink, 
  FolderGit2, 
  RefreshCw, 
  Lock, 
  Unlock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { GitCommit, FileItem } from '../types';

interface GitHubStudioProps {
  branch: string;
  commits: GitCommit[];
  files: FileItem[];
  onCommit: (message: string) => void;
  onPush: () => void;
  onPull: () => void;
  onSelectBranch: (branch: string) => void;
  onCreateBranch: (branch: string) => void;
  onCloneRepo: (url: string) => void;
  isSyncing: boolean;
  syncStatus: string;
}

export const GitHubStudio: React.FC<GitHubStudioProps> = ({
  branch,
  commits,
  files,
  onCommit,
  onPush,
  onPull,
  onSelectBranch,
  onCreateBranch,
  onCloneRepo,
  isSyncing,
  syncStatus,
}) => {
  const [gitToken, setGitToken] = useState('ghp_lantern_live_token_verified');
  const [isConnected, setIsConnected] = useState(true);
  const [repoUrl, setRepoUrl] = useState('https://github.com/hunter-zen-RU/LANtern-Code.git');
  const [commitMessage, setCommitMessage] = useState('');
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [newBranchInput, setNewBranchInput] = useState('');

  const modifiedFiles = files.filter(f => f.modified);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (gitToken.trim()) {
      setIsConnected(true);
    }
  };

  const handleCloneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onCloneRepo(repoUrl.trim());
      setShowCloneDialog(false);
    }
  };

  const handleCommitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    onCommit(commitMessage.trim());
    setCommitMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 text-xs select-none overflow-hidden">
      {/* GitHub Top Banner */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>GitHub Remote Sync</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {repoUrl.replace('https://github.com/', '')}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCloneDialog(!showCloneDialog)}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
        >
          <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Clone Repo</span>
        </button>
      </div>

      {/* Clone Dialog dropdown */}
      {showCloneDialog && (
        <form onSubmit={handleCloneSubmit} className="p-3 bg-slate-950 border-b border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-300">Clone Repository into SQLite Store</div>
          <div className="flex space-x-1.5">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo.git"
              className="flex-1 bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Clone
            </button>
          </div>
        </form>
      )}

      {/* Main Git Operations Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Remote Sync & Branch Controls */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">Active Branch:</span>
              <span className="font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                {branch}
              </span>
            </div>

            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SSH Verified
            </span>
          </div>

          {/* Push / Pull Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onPush}
              disabled={isSyncing}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded-xl border border-slate-700 font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Push to GitHub</span>
            </button>
            <button
              onClick={onPull}
              disabled={isSyncing}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 rounded-xl border border-slate-700 font-semibold text-slate-200 flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-400" />
              <span>Pull from GitHub</span>
            </button>
          </div>

          {/* Sync Status Banner */}
          <div className="p-2 bg-slate-900 rounded-lg text-[11px] text-slate-300 flex items-center justify-between font-mono">
            <span>Status: {syncStatus}</span>
            {isSyncing && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
          </div>
        </div>

        {/* Commit Message Box */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span>Stage & Commit Local Changes</span>
            <span className="text-amber-400 font-mono">
              {modifiedFiles.length} file{modifiedFiles.length === 1 ? '' : 's'} modified
            </span>
          </div>

          <form onSubmit={handleCommitSubmit} className="space-y-2">
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message (e.g. feat: add local SQLite database schema & Android UI)..."
              rows={2}
              className="w-full bg-slate-900 text-slate-100 text-xs p-2 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none resize-none font-mono"
            />
            <button
              type="submit"
              disabled={!commitMessage.trim()}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/10"
            >
              <GitCommitIcon className="w-4 h-4" />
              <span>Commit to {branch}</span>
            </button>
          </form>
        </div>

        {/* Commit History */}
        <div className="space-y-2">
          <div className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Commit History</span>
            <span className="text-[10px] text-slate-500">{commits.length} commits</span>
          </div>

          <div className="space-y-1.5">
            {commits.map((c) => (
              <div
                key={c.id}
                className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80 hover:border-slate-700 transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 text-xs truncate mr-2">
                    {c.message}
                  </span>
                  <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded shrink-0">
                    {c.hash}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <img src={c.authorAvatar} alt={c.author} className="w-4 h-4 rounded-full object-cover" />
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
