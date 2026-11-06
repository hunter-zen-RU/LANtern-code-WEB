import { FileItem, GitCommit, PeerCollaborator, DiscoveredStudio } from '../types';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  branch: string;
  files: FileItem[];
  commits: GitCommit[];
  defaultFileId: string;
}

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: 'lantern-compose',
    name: 'LANtern Android Studio',
    description: 'Jetpack Compose Android IDE with NSD (Network Service Discovery) & P2P WebSockets',
    branch: 'main',
    defaultFileId: 'main-activity',
    files: [
      {
        id: 'main-activity',
        name: 'MainActivity.kt',
        path: 'app/src/main/java/com/lantern/code/MainActivity.kt',
        language: 'kotlin',
        content: `package com.lantern.code

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.lantern.code.network.LANDiscoveryManager

class MainActivity : ComponentActivity() {
    private val discoveryManager = LANDiscoveryManager()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        discoveryManager.startNsdService()

        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFFF59E0B),
                    surface = Color(0xFF0F172A),
                    background = Color(0xFF020617)
                )
            ) {
                LanternStudioScreen(discoveryManager)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        discoveryManager.stopNsdService()
    }
}

@Composable
fun LanternStudioScreen(discovery: LANDiscoveryManager) {
    var peerCount by remember { mutableStateOf(3) }
    var isBroadcasting by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0B1120))
            .padding(16.dp)
    ) {
        // Lantern Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "LANtern Code 💡",
                fontSize = 22.sp,
                color = Color(0xFFF59E0B),
                style = MaterialTheme.typography.titleLarge
            )
            Badge(containerColor = Color(0xFF10B981)) {
                Text("LAN ACTIVE: 192.168.1.142", color = Color.White)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Collaborative Workspace Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Connected Peers in Room",
                    fontSize = 16.sp,
                    color = Color.LightGray
                )
                Text(
                    text = "$peerCount Collaborators live syncing",
                    fontSize = 14.sp,
                    color = Color(0xFF38BDF8)
                )
            }
        }
    }
}
`,
      },
      {
        id: 'lan-discovery',
        name: 'LANDiscoveryManager.kt',
        path: 'app/src/main/java/com/lantern/code/network/LANDiscoveryManager.kt',
        language: 'kotlin',
        content: `package com.lantern.code.network

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.util.Log

class LANDiscoveryManager(private val port: Int = 8080) {
    private val SERVICE_TYPE = "_lantern_ide._tcp."
    private var isRegistered = false

    fun startNsdService() {
        val serviceInfo = NsdServiceInfo().apply {
            serviceName = "LANtern-Studio-Alpha"
            serviceType = SERVICE_TYPE
            setPort(port)
        }
        Log.i("LANtern", "Broadcasting workspace on port $port via NSD...")
        isRegistered = true
    }

    fun stopNsdService() {
        if (isRegistered) {
            Log.i("LANtern", "Stopped local network broadcast.")
            isRegistered = false
        }
    }

    fun resolvePeer(address: String): Boolean {
        // Fast ping over local subnet
        return address.startsWith("192.168.")
    }
}
`,
      },
      {
        id: 'readme-compose',
        name: 'README.md',
        path: 'README.md',
        language: 'markdown',
        content: `# LANtern Code 💡
Illuminate your workflow. Code together, anywhere.

High-performance Android & Web IDE tailored for peer-to-peer live collaboration.
Features:
- Instant mDNS / NSD local discovery
- Multi-cursor real-time diffing
- Git commit, branch and merge
- Seamless offline Wi-Fi router sync
`,
      },
      {
        id: 'manifest',
        name: 'AndroidManifest.xml',
        path: 'app/src/main/AndroidManifest.xml',
        language: 'html',
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />

    <application
        android:label="LANtern Code"
        android:theme="@style/Theme.Material3.Dark">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
      },
    ],
    commits: [
      {
        id: 'c1',
        hash: '7a9b1c2',
        message: 'feat: add NSD Network Service Discovery daemon',
        author: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        timestamp: '12m ago',
        branch: 'main',
        filesChanged: 2,
      },
      {
        id: 'c2',
        hash: '3f8d4e5',
        message: 'fix: optimize Jetpack Compose re-composition on peer typing',
        author: 'Hunter Zen (You)',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        timestamp: '1h ago',
        branch: 'main',
        filesChanged: 1,
      },
      {
        id: 'c3',
        hash: '9e2b10a',
        message: 'chore: initial mobile IDE scaffold and Git tree',
        author: 'Hunter Zen (You)',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        timestamp: '1d ago',
        branch: 'main',
        filesChanged: 4,
      },
    ],
  },
  {
    id: 'lantern-p2p-web',
    name: 'P2P Real-time Collaboration Engine',
    description: 'TypeScript WebRTC & WebSocket collaborative canvas & code sync engine',
    branch: 'feature/cursor-mesh',
    defaultFileId: 'p2p-engine',
    files: [
      {
        id: 'p2p-engine',
        name: 'PeerMesh.ts',
        path: 'src/network/PeerMesh.ts',
        language: 'typescript',
        content: `export interface PeerPresence {
  id: string;
  name: string;
  cursor: { line: number; col: number };
  selectionRange?: [number, number];
  color: string;
}

export class LANMeshClient {
  private peers: Map<string, PeerPresence> = new Map();
  private ws: WebSocket | null = null;

  constructor(public roomId: string, public user: { name: string; color: string }) {}

  connect(url: string = 'ws://localhost:8080/lan-sync') {
    console.log(\`Connecting to LANtern peer swarm at \${url}...\`);
    // Simulated peer heartbeat
    this.peers.set('peer-marcus', {
      id: 'peer-marcus',
      name: 'Marcus Vance (Tablet)',
      cursor: { line: 14, col: 22 },
      color: '#38bdf8'
    });
  }

  broadcastCursor(line: number, col: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'CURSOR_MOVE', line, col }));
    }
  }

  resolveConflict(localText: string, incomingText: string): string {
    // Operational Transformation (OT) / CRDT three-way merge
    console.log('[LANtern OT Engine] Resolving concurrent character delta');
    return incomingText;
  }
}
`,
      },
      {
        id: 'app-preview',
        name: 'index.html',
        path: 'public/index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0b1120; color: #f8fafc; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 95vh; margin: 0; }
    .badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 13px; }
    .card { background: #1e293b; padding: 24px; border-radius: 12px; width: 340px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .btn { background: #f59e0b; color: #000; font-weight: bold; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; width: 100%; margin-top: 16px; }
    .btn:hover { background: #fbbf24; }
  </style>
</head>
<body>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
      <h2 style="margin:0; color:#f59e0b;">LANtern Live 💡</h2>
      <span class="badge">LAN ONLINE</span>
    </div>
    <p style="color:#94a3b8; font-size:14px; margin: 0 0 16px 0;">Real-time peer collaborative sandbox ready.</p>
    <div style="background:#0f172a; padding:12px; border-radius:6px; font-family:monospace; font-size:12px; color:#38bdf8;">
      Active Peers: 3<br>
      Latency: 4ms (Wi-Fi 6 Direct)<br>
      Sync Status: Zero Conflicts
    </div>
    <button class="btn" onclick="alert('⚡ Synchronized with 3 peers over LAN!')">Ping Room Peers</button>
  </div>
</body>
</html>
`,
      },
    ],
    commits: [
      {
        id: 'c10',
        hash: '4d19aa2',
        message: 'feat: add CRDT Operational Transformation parser',
        author: 'Hunter Zen',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
        timestamp: '30m ago',
        branch: 'feature/cursor-mesh',
        filesChanged: 2,
      },
    ],
  },
];

export const INITIAL_PEERS: PeerCollaborator[] = [
  {
    id: 'peer-1',
    name: 'Elena Rostova',
    device: 'Pixel Tablet (Android 15)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    color: '#ec4899', // Pink
    role: 'write',
    connectionType: 'LAN',
    ip: '192.168.1.108',
    latencyMs: 3,
    activeFileId: 'main-activity',
    cursorLine: 28,
    cursorCol: 34,
    isTyping: true,
  },
  {
    id: 'peer-2',
    name: 'Marcus Vance',
    device: 'Galaxy Z Fold 6 (Android)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    color: '#38bdf8', // Sky
    role: 'write',
    connectionType: 'LAN',
    ip: '192.168.1.115',
    latencyMs: 5,
    activeFileId: 'main-activity',
    cursorLine: 54,
    cursorCol: 18,
    isTyping: false,
  },
  {
    id: 'peer-3',
    name: 'Sarah Chen',
    device: 'MacBook Air M3 (Wi-Fi 6)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    color: '#a855f7', // Purple
    role: 'read',
    connectionType: 'LAN',
    ip: '192.168.1.140',
    latencyMs: 2,
    activeFileId: 'lan-discovery',
    cursorLine: 12,
    cursorCol: 8,
    isTyping: false,
  },
];

export const DISCOVERED_STUDIOS: DiscoveredStudio[] = [
  {
    id: 'studio-hackathon-alpha',
    name: 'Hackathon-Team-Alpha',
    hostName: 'David K. (Host)',
    hostDevice: 'Xiaomi Pad 6S Pro',
    ip: '192.168.1.102',
    port: 8080,
    protocol: 'mDNS / NSD',
    latencyMs: 4,
    peersCount: 4,
    locked: false,
    projectType: 'Kotlin Compose + KMP',
  },
  {
    id: 'studio-cs-pair',
    name: 'CS102-Algorithms-Lab',
    hostName: 'Prof. Miller',
    hostDevice: 'Linux Workstation',
    ip: '192.168.1.88',
    port: 3000,
    protocol: 'WebSocket LAN',
    latencyMs: 2,
    peersCount: 12,
    locked: true,
    projectType: 'Rust + WebAssembly',
  },
  {
    id: 'studio-gamedev',
    name: 'Lantern-Indie-Gamejam',
    hostName: 'Maya Thorne',
    hostDevice: 'OnePlus Open',
    ip: '192.168.1.173',
    port: 8092,
    protocol: 'WebRTC P2P',
    latencyMs: 8,
    peersCount: 2,
    locked: false,
    projectType: 'TypeScript Canvas P2P',
  },
];
