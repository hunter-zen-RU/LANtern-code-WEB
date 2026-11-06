import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PROJECTS, 
  INITIAL_PEERS, 
  DISCOVERED_STUDIOS, 
  ProjectData 
} from './data/defaultProjects';
import { 
  FileItem, 
  GitCommit, 
  PeerCollaborator, 
  DiscoveredStudio, 
  ChatMessage, 
  LintProblem 
} from './types';
import { AndroidFrame } from './components/AndroidFrame';
import { Header, MainViewTab } from './components/Header';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { FileExplorer } from './components/FileExplorer';
import { GitPanel } from './components/GitPanel';
import { NetworkDiscoveryPanel } from './components/NetworkDiscoveryPanel';
import { PeersAndChatPanel } from './components/PeersAndChatPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { CodeEditor } from './components/CodeEditor';
import { BottomPanel } from './components/BottomPanel';
import { RunPreviewModal } from './components/RunPreviewModal';
import { ConflictModal } from './components/ConflictModal';
import { BranchModal } from './components/BranchModal';
import { DiffModal } from './components/DiffModal';
import { GitHubStudio } from './components/GitHubStudio';
import { SQLiteStudio } from './components/SQLiteStudio';
import { BrowserNetworkGateway } from './components/BrowserNetworkGateway';
import { TeamInviteModal } from './components/TeamInviteModal';
import { ProjectAnalysisAudit } from './components/ProjectAnalysisAudit';
import { VibecodingStudio } from './components/VibecodingStudio';
import { BrowserPreviewModal } from './components/BrowserPreviewModal';
import { sqliteDB } from './lib/sqliteEngine';

export const App: React.FC = () => {
  // Navigation & View State
  const [activeMainTab, setActiveMainTab] = useState<MainViewTab>('code');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'fullscreen'>('tablet');

  // Project & Files State
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState<ProjectData>(INITIAL_PROJECTS[0]);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_PROJECTS[0].files);
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_PROJECTS[0].defaultFileId);
  const [commits, setCommits] = useState<GitCommit[]>(INITIAL_PROJECTS[0].commits);

  // Collaboration, Peers & AI in Team (Req 4)
  const [peers, setPeers] = useState<PeerCollaborator[]>(INITIAL_PEERS);
  const [aiIncludedInTeam, setAiIncludedInTeam] = useState(true);
  const [connectionMode, setConnectionMode] = useState<'LAN' | 'WAN'>('LAN');
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [discoveredStudios, setDiscoveredStudios] = useState<DiscoveredStudio[]>(DISCOVERED_STUDIOS);
  const [isScanning, setIsScanning] = useState(false);
  const [isSimulatingPeerTyping, setIsSimulatingPeerTyping] = useState(false);
  const [authorName, setAuthorName] = useState('Hunter Zen (You)');
  const [lanPort, setLanPort] = useState(8080);
  const [fontSize, setFontSize] = useState(13);

  // Modals
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [diffTargetFile, setDiffTargetFile] = useState<FileItem | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBrowserPreviewOpen, setIsBrowserPreviewOpen] = useState(false);
  const [isSyncingGit, setIsSyncingGit] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('Synced with origin/main');

  // Sidebar in Code View
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('files');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Terminal & Logs
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '✓ Android 15 Material 3 Studio ready.',
    '✓ SQLite local database connected: lantern_mobile_studio.sqlite (5 tables).',
    '✓ GitHub remote configured: https://github.com/hunter-zen-RU/LANtern-Code.git',
    '✓ Local Wi-Fi browser link live: http://192.168.1.142:3000/browser-studio',
  ]);

  const [buildLogs, setBuildLogs] = useState<string[]>([
    '[Android OS] Initialized Dalvik/ART virtual machine container',
    '[SQLite Manager] Mounted SQLite 3.42.0 database engine',
    '[mDNS NSD] Broadcasting _lantern_ide._tcp on port 3000',
    '[AI Core] Neural agent initialized for vibecoding and code auditing',
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'peer-1',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      senderColor: '#ec4899',
      text: 'Connected via Wi-Fi 6 Direct. Verified SQLite tables and ready to pair-code!',
      timestamp: '09:40',
    },
    {
      id: 'm-ai',
      senderId: 'peer-ai',
      senderName: 'LANtern AI Assistant',
      senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces',
      senderColor: '#818cf8',
      text: 'AI Assistant active in team room. Mention @AI to audit code, vibecode components, or run SQL queries.',
      timestamp: '09:41',
    },
  ]);

  const [problems, setProblems] = useState<LintProblem[]>([
    {
      id: 'p1',
      fileId: 'main-activity',
      fileName: 'MainActivity.kt',
      line: 39,
      severity: 'info',
      message: 'Notice: Compose Material 3 dynamic color scheme active',
    },
  ]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const modifiedCount = files.filter((f) => f.modified).length;

  // Handle Project Selection
  const handleSelectProject = (project: ProjectData) => {
    setCurrentProject(project);
    setFiles(project.files);
    setActiveFileId(project.defaultFileId);
    setCommits(project.commits);
    setBuildLogs((prev) => [
      ...prev,
      `[Workspace] Switched to project: ${project.name}`,
    ]);
  };

  const handleUpdateFileContent = (newContent: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId ? { ...f, content: newContent, modified: true } : f
      )
    );
  };

  const handleCreateFile = (name: string) => {
    const ext = name.split('.').pop() || '';
    let language: FileItem['language'] = 'typescript';
    if (ext === 'kt') language = 'kotlin';
    else if (ext === 'html' || ext === 'xml') language = 'html';
    else if (ext === 'md') language = 'markdown';
    else if (ext === 'json') language = 'json';

    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name,
      path: `app/src/main/java/${name}`,
      language,
      content: `// ${name}\n// Managed in LANtern SQLite store\n\n`,
      modified: true,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);

    // Record in SQLite files table
    try {
      sqliteDB.insert('files', {
        id: newFile.id,
        project_id: currentProject.id,
        path: newFile.path,
        language: newFile.language,
        size_bytes: 250,
        is_modified: 1,
      });
    } catch {}
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== fileId);
      if (activeFileId === fileId && filtered.length > 0) {
        setActiveFileId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameFile = (fileId: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, name: newName, modified: true } : f))
    );
  };

  // Git operations
  const handleCommit = (message: string) => {
    const newCommit: GitCommit = {
      id: `c-${Date.now()}`,
      hash: Math.random().toString(16).substring(2, 9),
      message,
      author: authorName,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      timestamp: 'just now',
      branch: currentProject.branch,
      filesChanged: modifiedCount,
    };

    setCommits((prev) => [newCommit, ...prev]);
    setFiles((prev) => prev.map((f) => ({ ...f, modified: false, staged: false })));
    setSyncStatus('1 commit ahead of origin/main');
    setTerminalHistory((prev) => [
      ...prev,
      `$ git commit -m "${message}"`,
      `[${currentProject.branch} ${newCommit.hash}] ${message}`,
      ` ${modifiedCount} files updated in SQLite and Git FS`,
    ]);
  };

  const handlePush = () => {
    setIsSyncingGit(true);
    setSyncStatus('Pushing commits to GitHub remote...');
    setTimeout(() => {
      setIsSyncingGit(false);
      setSyncStatus('Up to date with origin/' + currentProject.branch);
      setTerminalHistory((prev) => [
        ...prev,
        `$ git push origin ${currentProject.branch}`,
        `✓ Pushed commits to https://github.com/hunter-zen-RU/LANtern-Code.git`,
      ]);
    }, 1200);
  };

  const handlePull = () => {
    setIsSyncingGit(true);
    setSyncStatus('Pulling latest commits from GitHub...');
    setTimeout(() => {
      setIsSyncingGit(false);
      setSyncStatus('Already up to date with origin/' + currentProject.branch);
      setTerminalHistory((prev) => [
        ...prev,
        `$ git pull origin ${currentProject.branch}`,
        `✓ Remote branch is cleanly synced.`,
      ]);
    }, 1000);
  };

  const handleCloneRepo = (url: string) => {
    setSyncStatus(`Cloned ${url}`);
    setTerminalHistory((prev) => [
      ...prev,
      `$ git clone ${url}`,
      `✓ Cloned repository into local SQLite database.`,
    ]);
    alert(`Successfully cloned ${url} into local SQLite project store!`);
  };

  const handleApplyAuditFix = (fileName: string, line: number, fixCode: string) => {
    const target = files.find(f => f.name === fileName);
    if (target) {
      handleUpdateFileContent(`${target.content}\n\n// [AI Audit Auto-Fix Line ${line}]:\n${fixCode}`);
      alert(`Applied automated audit fix to ${fileName}!`);
    }
  };

  const handleAddAiToTeam = (role: string) => {
    setAiIncludedInTeam(true);
    setTerminalHistory(prev => [
      ...prev,
      `✓ Added LANtern AI Assistant (${role}) to active team roster.`,
    ]);
  };

  // Terminal commands
  const handleExecuteCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();

    let output = '';
    if (mainCmd === 'help') {
      output = `LANtern Android Studio CLI:
• help                - Show command directory
• git <status|push|pull|branch> - Git version control
• sqlite <sql query>  - Execute query on local SQLite database
• audit               - Run AI health & security audit
• vibe <prompt>       - Synthesize code via vibecoding engine
• lan <scan|host>     - Network discovery & browser link
• run                 - Launch Android app preview runner
• clear               - Clear terminal output`;
    } else if (mainCmd === 'clear') {
      setTerminalHistory([]);
      return;
    } else if (mainCmd === 'sqlite') {
      const query = parts.slice(1).join(' ');
      if (!query) {
        output = 'Usage: sqlite SELECT * FROM projects;';
      } else {
        try {
          const res = sqliteDB.execute(query);
          output = `✓ ${res.message}\n` + JSON.stringify(res.rows.slice(0, 3));
        } catch (err: any) {
          output = `! SQLite error: ${err.message}`;
        }
      }
    } else if (mainCmd === 'audit') {
      setActiveMainTab('audit');
      output = '✓ Switched to Project Analysis & Audit Studio.';
    } else if (mainCmd === 'vibe') {
      setActiveMainTab('vibe');
      output = '✓ Switched to AI Vibecoding Studio.';
    } else if (mainCmd === 'run') {
      setIsRunModalOpen(true);
      output = '✓ Launching Android Compose execution preview...';
    } else {
      output = `! Unknown command: ${trimmed}. Type "help" for instructions.`;
    }

    setTerminalHistory((prev) => [...prev, `$ ${trimmed}`, output]);
  };

  return (
    <AndroidFrame
      deviceMode={deviceMode}
      onChangeDeviceMode={setDeviceMode}
      activeProjectName={currentProject.name}
    >
      {/* Top Header Bar with Logo and Tab Switcher */}
      <Header
        projects={projects}
        currentProject={currentProject}
        onSelectProject={handleSelectProject}
        peers={peers}
        connectionMode={connectionMode}
        onToggleConnectionMode={() =>
          setConnectionMode((m) => (m === 'LAN' ? 'WAN' : 'LAN'))
        }
        deviceMode={deviceMode}
        onChangeDeviceMode={setDeviceMode}
        activeMainTab={activeMainTab}
        onChangeMainTab={setActiveMainTab}
        onRunCode={() => setIsRunModalOpen(true)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onOpenBranchModal={() => setIsBranchModalOpen(true)}
        hasUnsavedChanges={modifiedCount > 0}
        onQuickSave={() => {
          setFiles((prev) => prev.map((f) => ({ ...f, modified: false })));
          setBuildLogs((prev) => [...prev, '[SQLite FS] Saved changes to local database']);
        }}
      />

      {/* Main Content Area based on activeMainTab */}
      <div className="flex-1 flex overflow-hidden bg-slate-950">
        {activeMainTab === 'code' && (
          /* Editor & Project Explorer View */
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              activeTab={sidebarTab}
              onSelectTab={setSidebarTab}
              isOpen={sidebarOpen}
              onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
              modifiedCount={modifiedCount}
              peersCount={peers.length}
              isBroadcasting={isBroadcasting}
            >
              {sidebarTab === 'files' && (
                <FileExplorer
                  files={files}
                  activeFileId={activeFileId}
                  onSelectFile={setActiveFileId}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  onRenameFile={handleRenameFile}
                />
              )}
              {sidebarTab === 'git' && (
                <GitPanel
                  branch={currentProject.branch}
                  files={files}
                  commits={commits}
                  onCommit={handleCommit}
                  onPush={handlePush}
                  onPull={handlePull}
                  onOpenBranchModal={() => setIsBranchModalOpen(true)}
                  onOpenMergeModal={() => setIsConflictModalOpen(true)}
                  onOpenDiffModal={(file) => {
                    setDiffTargetFile(file);
                    setIsDiffModalOpen(true);
                  }}
                  isSyncing={isSyncingGit}
                  syncStatus={syncStatus}
                />
              )}
              {sidebarTab === 'network' && (
                <NetworkDiscoveryPanel
                  isBroadcasting={isBroadcasting}
                  onToggleBroadcast={() => setIsBroadcasting(!isBroadcasting)}
                  connectionMode={connectionMode}
                  onToggleConnectionMode={() =>
                    setConnectionMode((m) => (m === 'LAN' ? 'WAN' : 'LAN'))
                  }
                  discoveredStudios={discoveredStudios}
                  onScanSubnet={() => {
                    setIsScanning(true);
                    setTimeout(() => setIsScanning(false), 1000);
                  }}
                  isScanning={isScanning}
                  onJoinStudio={(s) => alert(`Joined ${s.name}!`)}
                  workspaceInviteUrl={`https://lantern.code.app/join/${currentProject.id}`}
                />
              )}
              {sidebarTab === 'peers' && (
                <PeersAndChatPanel
                  peers={peers}
                  chatMessages={chatMessages}
                  onSendMessage={(t) => {
                    setChatMessages((prev) => [
                      ...prev,
                      {
                        id: `msg-${Date.now()}`,
                        senderId: 'me',
                        senderName: authorName,
                        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
                        senderColor: '#f59e0b',
                        text: t,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  }}
                  isSimulatingPeerTyping={isSimulatingPeerTyping}
                  onToggleSimulatingPeerTyping={() =>
                    setIsSimulatingPeerTyping(!isSimulatingPeerTyping)
                  }
                  onTriggerConflict={() => setIsConflictModalOpen(true)}
                  onChangePeerRole={(peerId, newRole) => {
                    setPeers((prev) =>
                      prev.map((p) => (p.id === peerId ? { ...p, role: newRole } : p))
                    );
                  }}
                />
              )}
              {sidebarTab === 'settings' && (
                <SettingsPanel
                  authorName={authorName}
                  onChangeAuthorName={setAuthorName}
                  lanPort={lanPort}
                  onChangeLanPort={setLanPort}
                  fontSize={fontSize}
                  onChangeFontSize={setFontSize}
                />
              )}
            </Sidebar>

            <div className="flex-1 flex flex-col overflow-hidden">
              {activeFile && (
                <CodeEditor
                  file={activeFile}
                  onChangeContent={handleUpdateFileContent}
                  peers={peers}
                  onInsertSymbol={(sym) => {}}
                />
              )}
              <BottomPanel
                logs={buildLogs}
                onClearLogs={() => setBuildLogs([])}
                terminalHistory={terminalHistory}
                onExecuteCommand={handleExecuteCommand}
                problems={problems}
                onSelectProblemLine={(fileId) => setActiveFileId(fileId)}
              />
            </div>
          </div>
        )}

        {activeMainTab === 'github' && (
          /* Requirement 1: Connection to GitHub */
          <GitHubStudio
            branch={currentProject.branch}
            commits={commits}
            files={files}
            onCommit={handleCommit}
            onPush={handlePush}
            onPull={handlePull}
            onSelectBranch={(b) => setCurrentProject(p => ({ ...p, branch: b }))}
            onCreateBranch={(b) => setCurrentProject(p => ({ ...p, branch: b }))}
            onCloneRepo={handleCloneRepo}
            isSyncing={isSyncingGit}
            syncStatus={syncStatus}
          />
        )}

        {activeMainTab === 'sqlite' && (
          /* Requirement 2: Local SQLite Database Studio */
          <SQLiteStudio />
        )}

        {activeMainTab === 'network' && (
          /* Requirement 3: Link to Browser LAN/WAN Gateway */
          <BrowserNetworkGateway
            onOpenBrowserPreview={() => setIsBrowserPreviewOpen(true)}
          />
        )}

        {activeMainTab === 'audit' && (
          /* Requirement 5: Project Analysis & Audit */
          <ProjectAnalysisAudit
            projectName={currentProject.name}
            files={files}
            onApplyFix={handleApplyAuditFix}
          />
        )}

        {activeMainTab === 'vibe' && (
          /* Requirement 6: Online & Local AI Vibecoding */
          <VibecodingStudio
            currentCode={activeFile?.content || ''}
            activeFileName={activeFile?.name || 'MainActivity.kt'}
            onApplyCode={(newCode) => {
              if (activeFile) {
                handleUpdateFileContent(newCode);
              }
            }}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (shows on small screens or when in mobile mode) */}
      <div className="md:hidden h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 text-[10px] font-bold text-slate-400 shrink-0">
        <button
          onClick={() => setActiveMainTab('code')}
          className={`flex flex-col items-center py-1 ${activeMainTab === 'code' ? 'text-amber-400 font-extrabold' : ''}`}
        >
          <span>📁</span>
          <span>Code</span>
        </button>
        <button
          onClick={() => setActiveMainTab('github')}
          className={`flex flex-col items-center py-1 ${activeMainTab === 'github' ? 'text-amber-400 font-extrabold' : ''}`}
        >
          <span>🐙</span>
          <span>GitHub</span>
        </button>
        <button
          onClick={() => setActiveMainTab('sqlite')}
          className={`flex flex-col items-center py-1 ${activeMainTab === 'sqlite' ? 'text-indigo-400 font-extrabold' : ''}`}
        >
          <span>🗄️</span>
          <span>SQLite</span>
        </button>
        <button
          onClick={() => setActiveMainTab('network')}
          className={`flex flex-col items-center py-1 ${activeMainTab === 'network' ? 'text-emerald-400 font-extrabold' : ''}`}
        >
          <span>🌐</span>
          <span>LAN/WAN</span>
        </button>
        <button
          onClick={() => setActiveMainTab('audit')}
          className={`flex flex-col items-center py-1 ${activeMainTab === 'audit' ? 'text-amber-400 font-extrabold' : ''}`}
        >
          <span>🛡️</span>
          <span>Audit</span>
        </button>
        <button
          onClick={() => setActiveMainTab('vibe')}
          className={`flex flex-col items-center py-1 ${activeMainTab === 'vibe' ? 'text-amber-400 font-extrabold' : ''}`}
        >
          <span>✨</span>
          <span>Vibe</span>
        </button>
      </div>

      {/* Modals */}
      <RunPreviewModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        files={files}
        projectName={currentProject.name}
        peers={peers}
      />

      <TeamInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectName={currentProject.name}
        peers={peers}
        onAddAiToTeam={handleAddAiToTeam}
        aiIncluded={aiIncludedInTeam}
      />

      <BrowserPreviewModal
        isOpen={isBrowserPreviewOpen}
        onClose={() => setIsBrowserPreviewOpen(false)}
        projectName={currentProject.name}
      />

      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        fileName={activeFile?.name || 'MainActivity.kt'}
        peerName="Elena Rostova (Pixel Tablet)"
        localCode={`// Your version\nval peerCount = 4\nisBroadcasting = true\nstartNsdService()`}
        incomingCode={`// Elena's incoming edit\nval peerCount = 5\nisBroadcasting = false\nstopNsdService()`}
        onResolve={(chosen) => {
          setIsConflictModalOpen(false);
          setBuildLogs((prev) => [...prev, `[Conflict] Resolved with ${chosen}`]);
        }}
      />

      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        currentBranch={currentProject.branch}
        onSelectBranch={(b) => setCurrentProject(p => ({ ...p, branch: b }))}
        onCreateBranch={(b) => setCurrentProject(p => ({ ...p, branch: b }))}
      />

      <DiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        file={diffTargetFile}
      />
    </AndroidFrame>
  );
};
