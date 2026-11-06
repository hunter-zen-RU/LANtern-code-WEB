import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Activity, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  X, 
  Trash2, 
  Play, 
  ChevronRight 
} from 'lucide-react';
import { LintProblem } from '../types';

interface BottomPanelProps {
  logs: string[];
  onClearLogs: () => void;
  terminalHistory: string[];
  onExecuteCommand: (cmd: string) => void;
  problems: LintProblem[];
  onSelectProblemLine: (fileId: string, line: number) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  logs,
  onClearLogs,
  terminalHistory,
  onExecuteCommand,
  problems,
  onSelectProblemLine,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'problems'>('terminal');
  const [cmdInput, setCmdInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    onExecuteCommand(cmdInput.trim());
    setCmdInput('');
  };

  return (
    <div
      className={`border-t border-slate-800 bg-slate-950 flex flex-col transition-all duration-200 select-none ${
        isExpanded ? 'h-72' : 'h-44'
      }`}
    >
      {/* Tab bar */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 text-xs font-semibold rounded-t flex items-center space-x-1.5 transition ${
              activeTab === 'terminal'
                ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-1 text-xs font-semibold rounded-t flex items-center space-x-1.5 transition ${
              activeTab === 'output'
                ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Build & LAN Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-3 py-1 text-xs font-semibold rounded-t flex items-center space-x-1.5 transition ${
              activeTab === 'problems'
                ? 'bg-slate-950 text-amber-400 border-t-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Problems ({problems.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          {activeTab === 'output' && (
            <button
              onClick={onClearLogs}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
              title="Clear logs"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-auto p-2 font-mono text-xs text-slate-300">
        {activeTab === 'terminal' ? (
          <div className="flex flex-col h-full justify-between">
            <div className="overflow-y-auto space-y-1">
              <div className="text-amber-400/90 text-[11px] font-sans pb-1">
                LANtern Embedded Terminal v1.4.2 [LAN Wi-Fi Direct: 192.168.1.142]
                <br />
                Type <span className="text-amber-300 font-mono font-bold">help</span> to list available commands.
              </div>
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                  {item.startsWith('$') ? (
                    <span className="text-amber-300 font-bold">{item}</span>
                  ) : item.startsWith('✓') ? (
                    <span className="text-emerald-400">{item}</span>
                  ) : item.startsWith('!') ? (
                    <span className="text-rose-400">{item}</span>
                  ) : (
                    <span className="text-slate-300">{item}</span>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommandSubmit} className="flex items-center space-x-1 pt-1 border-t border-slate-800/80 mt-1">
              <span className="text-emerald-400 font-bold flex items-center">
                <span>lantern</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="git status, lantern scan, run..."
                className="flex-1 bg-transparent text-slate-100 text-xs focus:outline-none"
              />
            </form>
          </div>
        ) : activeTab === 'output' ? (
          <div className="space-y-1">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-slate-500 mr-2 text-[10px]">
                  {new Date().toLocaleTimeString()}
                </span>
                <span className={log.includes('ERROR') ? 'text-rose-400' : log.includes('SYNC') ? 'text-emerald-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {problems.length === 0 ? (
              <div className="text-slate-500 py-3 text-center font-sans">
                No linting issues or compiler warnings detected. Clean build!
              </div>
            ) : (
              problems.map((prob) => (
                <div
                  key={prob.id}
                  onClick={() => onSelectProblemLine(prob.fileId, prob.line)}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/50 cursor-pointer text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-amber-400">⚠</span>
                    <span className="text-slate-200">{prob.message}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {prob.fileName}:{prob.line}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
