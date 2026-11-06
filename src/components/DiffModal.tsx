import React from 'react';
import { FileCode, X, Plus, Minus } from 'lucide-react';
import { FileItem } from '../types';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
}

export const DiffModal: React.FC<DiffModalProps> = ({ isOpen, onClose, file }) => {
  if (!isOpen || !file) return null;

  // Generate simulated diff lines
  const lines = file.content.split('\n');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="h-12 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm text-slate-100">
              Git Diff: <span className="font-mono text-amber-300">{file.name}</span>
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-5 bg-slate-950 text-slate-300">
          <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-800 mb-2">
            --- a/{file.path}
            <br />
            +++ b/{file.path}
          </div>
          <div className="space-y-0.5">
            {lines.map((line, idx) => {
              const isAdded = idx % 5 === 2;
              const isRemoved = idx % 7 === 3;

              if (isAdded) {
                return (
                  <div key={idx} className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded flex items-center">
                    <span className="w-6 text-emerald-500 shrink-0 select-none">+</span>
                    <span className="truncate">{line}</span>
                  </div>
                );
              }

              if (isRemoved) {
                return (
                  <div key={idx} className="bg-rose-950/50 text-rose-300 px-2 py-0.5 rounded flex items-center">
                    <span className="w-6 text-rose-500 shrink-0 select-none">-</span>
                    <span className="truncate line-through opacity-80">{line}</span>
                  </div>
                );
              }

              return (
                <div key={idx} className="px-2 py-0.5 flex items-center text-slate-400">
                  <span className="w-6 text-slate-600 shrink-0 select-none"> </span>
                  <span className="truncate">{line}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
