import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  CornerDownLeft, 
  Code, 
  Wand2, 
  Undo, 
  Redo, 
  Search,
  Sparkles
} from 'lucide-react';
import { FileItem, PeerCollaborator } from '../types';

interface CodeEditorProps {
  file: FileItem;
  onChangeContent: (content: string) => void;
  peers: PeerCollaborator[];
  onInsertSymbol: (symbol: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onChangeContent,
  peers,
  onInsertSymbol,
  readOnly = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [copied, setCopied] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteItems, setAutocompleteItems] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([file.content]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // Split lines for line numbers
  const lines = file.content.split('\n');

  // Track cursor position on textarea changes/clicks
  const updateCursorPosition = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = file.content.substring(0, pos);
    const lineNum = textBefore.split('\n').length;
    const lastNewline = textBefore.lastIndexOf('\n');
    const colNum = lastNewline === -1 ? pos + 1 : pos - lastNewline;
    setCursorPos({ line: lineNum, col: colNum });

    // Check last word for autocomplete
    const match = textBefore.match(/([a-zA-Z0-9_]{2,})$/);
    if (match) {
      const query = match[1].toLowerCase();
      const suggestions = [
        'Modifier', 'Column', 'Row', 'Text', 'Color', 'Box', 'Button',
        'setContent', 'remember', 'mutableStateOf', 'Spacer', 'Card',
        'LANDiscoveryManager', 'PeerPresence', 'WebSocket', 'useEffect'
      ].filter(s => s.toLowerCase().startsWith(query) && s.toLowerCase() !== query);

      if (suggestions.length > 0) {
        setAutocompleteItems(suggestions);
        setShowAutocomplete(true);
        return;
      }
    }
    setShowAutocomplete(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChangeContent(val);
    updateCursorPosition();

    // Push history debounce
    if (val !== history[historyIdx]) {
      const nextHistory = history.slice(0, historyIdx + 1);
      nextHistory.push(val);
      setHistory(nextHistory);
      setHistoryIdx(nextHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      onChangeContent(prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      onChangeContent(next);
    }
  };

  const insertQuickText = (text: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const original = file.content;
    const replacement = original.substring(0, start) + text + original.substring(end);
    onChangeContent(replacement);

    // Update history
    const nextHistory = history.slice(0, historyIdx + 1);
    nextHistory.push(replacement);
    setHistory(nextHistory);
    setHistoryIdx(nextHistory.length - 1);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
      updateCursorPosition();
    }, 10);
  };

  const applyAutocomplete = (item: string) => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = file.content.substring(0, pos);
    const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
    if (match) {
      const wordLen = match[1].length;
      const start = pos - wordLen;
      const original = file.content;
      const replacement = original.substring(0, start) + item + original.substring(pos);
      onChangeContent(replacement);
      setShowAutocomplete(false);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.setSelectionRange(start + item.length, start + item.length);
      }, 10);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find peers looking at this file
  const activePeersInFile = peers.filter(p => p.activeFileId === file.id);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative select-none">
      {/* Editor Tab & Header */}
      <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">{file.name}</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
            {file.language}
          </span>
          {file.modified && <span className="w-2 h-2 rounded-full bg-amber-400" title="Modified" />}
        </div>

        {/* Peer Presence In Active File */}
        <div className="flex items-center space-x-2">
          {activePeersInFile.length > 0 && (
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
              <span className="text-[10px] text-slate-400">Co-editing:</span>
              <div className="flex -space-x-1.5 overflow-hidden">
                {activePeersInFile.map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar}
                    alt={p.name}
                    className="w-4 h-4 rounded-full ring-1 ring-slate-900"
                    title={`${p.name} (${p.device}) at Line ${p.cursorLine}`}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCopyCode}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition"
            title="Copy file content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Code Area */}
      <div className="flex-1 flex overflow-hidden relative font-mono text-xs leading-5">
        {/* Line Numbers Gutter */}
        <div className="w-12 bg-slate-900/60 border-r border-slate-800/80 py-3 text-right pr-2.5 text-slate-600 select-none shrink-0 font-mono text-[11px]">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isCurrentLine = cursorPos.line === lineNum;
            const peerOnLine = activePeersInFile.find(p => p.cursorLine === lineNum);

            return (
              <div
                key={i}
                className={`h-5 flex items-center justify-end space-x-1 ${
                  isCurrentLine ? 'text-amber-400 font-bold' : ''
                }`}
              >
                {peerOnLine && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: peerOnLine.color }}
                    title={`${peerOnLine.name} on Ln ${lineNum}`}
                  />
                )}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        {/* Text Area Container */}
        <div className="flex-1 relative overflow-auto">
          {/* Peer Cursor Badges Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {activePeersInFile.map((p) => {
              // Calculate rough Y position for line
              const top = (p.cursorLine - 1) * 20 + 12;
              return (
                <div
                  key={p.id}
                  style={{ top: `${top}px`, left: '16px' }}
                  className="absolute flex items-center space-x-1 transition-all duration-300 opacity-90"
                >
                  <div
                    className="w-0.5 h-4 animate-pulse shadow-sm"
                    style={{ backgroundColor: p.color }}
                  />
                  <div
                    className="text-[9px] text-white px-1 py-0.2 rounded font-sans font-medium flex items-center shadow-lg"
                    style={{ backgroundColor: p.color }}
                  >
                    <span>{p.name.split(' ')[0]}</span>
                    {p.isTyping && <span className="ml-1 animate-bounce">✎</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Autocomplete Popup */}
          {showAutocomplete && autocompleteItems.length > 0 && (
            <div
              className="absolute z-20 bg-slate-900 border border-amber-500/50 rounded-lg shadow-2xl p-1 w-48 text-xs font-mono"
              style={{
                top: `${Math.min((cursorPos.line) * 20 + 10, 240)}px`,
                left: `${Math.min((cursorPos.col) * 7 + 20, 300)}px`,
              }}
            >
              <div className="text-[9px] uppercase tracking-wider text-amber-400/80 px-2 py-0.5 font-sans font-bold flex items-center justify-between">
                <span>LANtern Suggest</span>
                <span>Tab / Click</span>
              </div>
              {autocompleteItems.slice(0, 5).map((item, idx) => (
                <button
                  key={item}
                  onClick={() => applyAutocomplete(item)}
                  className="w-full text-left px-2 py-1 rounded hover:bg-amber-500/20 hover:text-amber-200 text-slate-300 transition flex items-center justify-between"
                >
                  <span>{item}</span>
                  <span className="text-[9px] text-slate-500 font-sans">keyword</span>
                </button>
              ))}
            </div>
          )}

          {/* Editable Textarea */}
          <textarea
            ref={textareaRef}
            value={file.content}
            onChange={handleTextChange}
            onKeyUp={updateCursorPosition}
            onClick={updateCursorPosition}
            onSelect={updateCursorPosition}
            readOnly={readOnly}
            spellCheck={false}
            className="w-full h-full p-3 bg-transparent text-slate-100 font-mono text-xs leading-5 resize-none focus:outline-none whitespace-pre overflow-x-auto tab-size-4"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>

      {/* Mobile & Touch-Friendly Quick Symbol Toolbar */}
      <div className="h-9 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between px-2 overflow-x-auto shrink-0 select-none">
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleUndo}
            disabled={historyIdx === 0}
            className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-400 hover:text-slate-200"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-400 hover:text-slate-200"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-700 mx-1" />
        </div>

        {/* Quick insertion chips */}
        <div className="flex items-center space-x-1 overflow-x-auto py-0.5 no-scrollbar">
          {['{ }', '( )', '[ ]', '< >', '=>', ';', '"', '\'', ':', '=', '.', 'Tab'].map((sym) => (
            <button
              key={sym}
              onClick={() => {
                if (sym === 'Tab') insertQuickText('    ');
                else if (sym === '{ }') insertQuickText('{  }');
                else if (sym === '( )') insertQuickText('( )');
                else if (sym === '[ ]') insertQuickText('[ ]');
                else if (sym === '< >') insertQuickText('< >');
                else insertQuickText(sym);
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-slate-300 font-mono text-xs rounded border border-slate-700/60 transition shrink-0"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div className="hidden sm:flex items-center space-x-2 text-[10px] text-slate-500 font-mono shrink-0 pl-2">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
