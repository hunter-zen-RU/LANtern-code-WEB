export interface FileItem {
  id: string;
  name: string;
  path: string;
  content: string;
  language: 'typescript' | 'javascript' | 'kotlin' | 'rust' | 'json' | 'markdown' | 'css' | 'html';
  isFolder?: boolean;
  children?: FileItem[];
  modified?: boolean;
  staged?: boolean;
}

export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  branch: string;
  filesChanged: number;
}

export interface PeerCollaborator {
  id: string;
  name: string;
  device: string; // e.g. "Pixel Tablet (Android)", "Galaxy Fold 6", "MacBook Air"
  avatar: string;
  color: string;
  role: 'owner' | 'write' | 'read';
  connectionType: 'LAN' | 'WAN';
  ip?: string;
  latencyMs: number;
  activeFileId: string;
  cursorLine: number;
  cursorCol: number;
  isTyping?: boolean;
}

export interface DiscoveredStudio {
  id: string;
  name: string;
  hostName: string;
  hostDevice: string;
  ip: string;
  port: number;
  protocol: 'mDNS / NSD' | 'WebSocket LAN' | 'WebRTC P2P';
  latencyMs: number;
  peersCount: number;
  locked: boolean;
  projectType: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderColor: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface LintProblem {
  id: string;
  fileId: string;
  fileName: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
}
