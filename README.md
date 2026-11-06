# LANtern Code 💡

![LANtern Code Logo](app-logo.png)

Illuminate your workflow. Code together, anywhere.

LANtern Code is a high-performance, feature-rich Android IDE and collaborative studio designed for modern developers who need desktop-grade project management on a mobile device or browser. Whether you are working solo on the move or syncing with a local team in a hackathon, LANtern Code bridges the gap between localized offline development and cloud-based version control.

---

## 🚀 Key Features

### 1. Connection to GitHub & Full Git Version Control
- **GitHub Integration**: Connect with your GitHub account or tokens.
- **Remote Operations**: Clone, commit, push, pull, branch, and merge directly with GitHub and remote repositories.
- **Git Commit History**: Interactive visual commit history with author badges, commit hashes, and file diffs.

### 2. Local SQLite Database for Project & Code Management
- **In-Memory & Local SQLite Engine**: Create, inspect, query, and manage local SQLite databases (`lantern_mobile_studio.sqlite`).
- **Interactive SQL Console**: Execute `SELECT`, `INSERT`, `UPDATE`, `CREATE TABLE`, `DELETE`, and `DROP TABLE` queries with live execution times.
- **Pre-Configured Schemas**: Schema tables for `projects`, `files`, `code_snippets`, `audit_logs`, and `team_sessions`.
- **Database Export**: Export full database snapshots to JSON / `.sqlite` format.

### 3. Browser Gateway via LAN or WAN Link
- **Live Browser Companion**: Generate instant web links to access the studio from any desktop browser (Chrome, Firefox, Safari) or mobile phone on the same Wi-Fi.
- **Subnet Scanner (mDNS / NSD)**: Scan local `192.168.1.0/24` subnet for active collaborative browser nodes.
- **QR Code Pairing**: Instant camera scanning to open the studio on mobile or tablet devices.

### 4. Team Collaboration & AI Assistant Inclusion
- **Shareable Team Invites**: Generate room invite links with configurable roles (Full-Write Editor or Read-Only Reviewer).
- **AI Assistant as First-Class Team Member**: Invite the **LANtern AI Assistant** into the team room for pair programming, real-time code auditing, and automated responses.
- **Live Room Chat**: Chat in real-time with peers and mention `@AI` for instant suggestions.

### 5. Comprehensive Project Analysis & Health Audit
- **Project Health Score**: Multi-dimensional grading (Health, Security, Android Battery & Performance, Maintainability).
- **Vulnerability & Static Diagnostic Scanner**: Scans for coroutine dispatch bottlenecks, Wi-Fi multicast battery wake-locks, and missing SQLite indexes.
- **One-Click Auto-Fix**: Automatically apply AI-generated recommendations directly into the codebase.

### 6. AI Agent Assist & Vibecoding (Online & Local)
- **Online Gemini 3.8 Flash**: Cloud-speed reasoning for full-stack code synthesis and refactoring.
- **Local AI Mesh**: Connect to local Ollama or LM Studio models (`deepseek-coder`, `llama3.2`, `qwen2.5-coder`) over `localhost` or LAN.
- **Vibecoding Studio**: Natural language to code generator—prompt your vibe, inspect the diff, and apply directly to the editor.

### 7. Additional Features
- **Android 15 Material 3 Design**: Realistic Android phone and tablet mockup frames with status bar, 5G/Wi-Fi indicators, and gesture bar.
- **Touch-Friendly Symbol Keyboard**: Quick-insert bar for mobile screens (`{}`, `()`, `[]`, `<>`, `=>`, `;`, `Tab`, `Undo`, `Redo`).
- **Integrated Android Logcat / Terminal**: Interactive command shell supporting `sqlite`, `git`, `vibe`, `audit`, `lan`, and `run`.
- **Live Applet Preview Runner**: Interactive execution sandbox for Android Compose and Web applications.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend**: Express on Node.js 22 with Vite development middlewares.
- **AI Engine**: `@google/genai` TypeScript SDK (server-side Gemini 3.8 Flash) + Local Ollama / LM Studio proxy.
- **Database**: Local SQLite 3.42 engine with SQL parser and JSON backup export.
- **Networking**: Simulated mDNS / NSD network discovery, WebSocket P2P data channels, and TLS 1.3 LAN links.
