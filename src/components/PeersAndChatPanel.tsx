import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Radio, 
  Sparkles, 
  Shield, 
  AlertTriangle, 
  Laptop, 
  Tablet, 
  Smartphone,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { PeerCollaborator, ChatMessage } from '../types';

interface PeersAndChatPanelProps {
  peers: PeerCollaborator[];
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSimulatingPeerTyping: boolean;
  onToggleSimulatingPeerTyping: () => void;
  onTriggerConflict: () => void;
  onChangePeerRole: (peerId: string, newRole: 'write' | 'read') => void;
}

export const PeersAndChatPanel: React.FC<PeersAndChatPanelProps> = ({
  peers,
  chatMessages,
  onSendMessage,
  isSimulatingPeerTyping,
  onToggleSimulatingPeerTyping,
  onTriggerConflict,
  onChangePeerRole,
}) => {
  const [activeTab, setActiveTab] = useState<'peers' | 'chat'>('peers');
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 text-slate-300 text-xs select-none">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('peers')}
          className={`flex-1 py-2 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
            activeTab === 'peers'
              ? 'border-b-2 border-amber-400 text-amber-300 bg-slate-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Peers ({peers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
            activeTab === 'chat'
              ? 'border-b-2 border-amber-400 text-amber-300 bg-slate-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Room Chat</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'peers' ? (
          <div className="p-3 space-y-4">
            {/* Live Peer Simulation Controller */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Live Collaborative Demo
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">P2P Ready</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate teammates actively editing, moving cursors, and resolving code changes on your screen.
              </p>
              <div className="flex space-x-2 pt-1">
                <button
                  onClick={onToggleSimulatingPeerTyping}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition ${
                    isSimulatingPeerTyping
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isSimulatingPeerTyping ? (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pause Typing</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simulate Peer Typing</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onTriggerConflict}
                  className="py-1.5 px-2.5 rounded-lg font-semibold text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition flex items-center gap-1"
                  title="Simulate concurrent line edits to trigger merge conflict resolver"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Conflict</span>
                </button>
              </div>
            </div>

            {/* Peer List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Collaborators
              </span>
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-7 h-7 rounded-full overflow-hidden border-2"
                        style={{ borderColor: peer.color }}
                      >
                        <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                          <span>{peer.name}</span>
                          {peer.isTyping && (
                            <span className="text-[9px] text-amber-400 font-mono animate-pulse">
                              typing...
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{peer.device}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {peer.latencyMs}ms
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                    <span className="font-mono text-slate-400">
                      Cursor: Ln {peer.cursorLine}, Col {peer.cursorCol}
                    </span>
                    <select
                      value={peer.role}
                      onChange={(e) => onChangePeerRole(peer.id, e.target.value as 'write' | 'read')}
                      className="bg-slate-900 text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-amber-400"
                    >
                      <option value="write">Full-Write</option>
                      <option value="read">Read-Only</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Team Chat */
          <div className="flex flex-col h-full">
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  {msg.isSystem ? (
                    <div className="text-center text-[10px] text-amber-400/80 font-mono py-1">
                      — {msg.text} —
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-xl p-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <span
                            className="font-bold text-[11px]"
                            style={{ color: msg.senderColor }}
                          >
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-2 border-t border-slate-800 bg-slate-950/40 flex space-x-1.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message active peers..."
                className="flex-1 bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-amber-500 text-slate-950 rounded-lg disabled:opacity-40 hover:bg-amber-400 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
