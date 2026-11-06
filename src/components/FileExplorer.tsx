import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  FileText, 
  FilePlus, 
  FolderPlus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  File
} from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  onRenameFile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleStartCreate = () => {
    setIsCreating(true);
    setNewFileName('');
  };

  const handleFinishCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setIsCreating(false);
      setNewFileName('');
    }
  };

  const handleStartRename = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const handleFinishRename = (fileId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (renameValue.trim()) {
      onRenameFile(fileId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.kt')) {
      return <span className="text-purple-400 font-mono text-[11px] font-bold">K</span>;
    }
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      return <span className="text-blue-400 font-mono text-[11px] font-bold">TS</span>;
    }
    if (fileName.endsWith('.html') || fileName.endsWith('.xml')) {
      return <span className="text-orange-400 font-mono text-[11px] font-bold">&lt;&gt;</span>;
    }
    if (fileName.endsWith('.md')) {
      return <span className="text-emerald-400 font-mono text-[11px] font-bold">M↓</span>;
    }
    if (fileName.endsWith('.json')) {
      return <span className="text-yellow-400 font-mono text-[11px] font-bold">{}</span>;
    }
    return <FileCode className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-300 text-xs select-none">
      {/* Explorer Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
          Project Files
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleStartCreate}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New File Inline Input */}
      {isCreating && (
        <form onSubmit={handleFinishCreate} className="px-2 py-1.5 bg-slate-800/80 border-b border-slate-700">
          <input
            autoFocus
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={() => {
              if (!newFileName.trim()) setIsCreating(false);
            }}
            placeholder="e.g. ServiceWorker.ts, Screen.kt"
            className="w-full bg-slate-950 text-slate-100 text-xs px-2 py-1 rounded border border-amber-500/50 focus:outline-none"
          />
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto py-1">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isRenaming = renamingId === file.id;

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition ${
                isActive
                  ? 'bg-amber-500/15 text-amber-200 border-l-2 border-amber-400 font-medium'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2 truncate min-w-0 flex-1">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {getFileIcon(file.name)}
                </div>

                {isRenaming ? (
                  <form onSubmit={(e) => handleFinishRename(file.id, e)} className="flex-1 mr-2">
                    <input
                      autoFocus
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => setRenamingId(null)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-1.5 py-0.5 rounded border border-amber-500"
                    />
                  </form>
                ) : (
                  <span className="truncate">{file.name}</span>
                )}

                {file.modified && (
                  <span className="text-[10px] font-bold text-amber-400 shrink-0" title="Modified file">
                    •
                  </span>
                )}
              </div>

              {/* Action buttons on hover */}
              {!isRenaming && (
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 ml-1">
                  <button
                    onClick={(e) => handleStartRename(file, e)}
                    className="p-0.5 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
                    title="Rename"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  {files.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete ${file.name}?`)) {
                          onDeleteFile(file.id);
                        }
                      }}
                      className="p-0.5 hover:bg-rose-900/50 rounded text-slate-400 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Directory Quick Info */}
      <div className="p-2 border-t border-slate-800/80 text-[10px] text-slate-500 bg-slate-950/40 flex justify-between items-center">
        <span>{files.length} files in studio</span>
        <span className="font-mono text-emerald-400/80">In-Memory Git FS</span>
      </div>
    </div>
  );
};
