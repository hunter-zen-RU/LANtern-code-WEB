// In-browser SQLite local database engine for project and code management

export interface ColumnDef {
  name: string;
  type: 'INTEGER' | 'TEXT' | 'REAL' | 'BLOB';
  isPrimary?: boolean;
}

export interface TableDef {
  name: string;
  columns: ColumnDef[];
  rows: Record<string, any>[];
}

export class LocalSQLiteDatabase {
  private dbName: string;
  private tables: Map<string, TableDef> = new Map();
  private queryHistory: { sql: string; timestamp: string; durationMs: number; success: boolean }[] = [];

  constructor(dbName: string = 'lantern_local.sqlite') {
    this.dbName = dbName;
    this.seedDefaultSchema();
  }

  public getDatabaseName(): string {
    return this.dbName;
  }

  public getTables(): TableDef[] {
    return Array.from(this.tables.values());
  }

  public getTable(name: string): TableDef | undefined {
    return this.tables.get(name);
  }

  public getQueryHistory() {
    return this.queryHistory;
  }

  // Initialize standard SQLite schema for LANtern Android IDE
  public seedDefaultSchema() {
    // 1. projects table
    this.createTable('projects', [
      { name: 'id', type: 'TEXT', isPrimary: true },
      { name: 'name', type: 'TEXT' },
      { name: 'package_name', type: 'TEXT' },
      { name: 'git_remote', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT' },
    ]);
    this.insert('projects', {
      id: 'proj-android-lantern',
      name: 'LANtern Android Core',
      package_name: 'com.lantern.code',
      git_remote: 'https://github.com/hunter-zen-RU/LANtern-Code.git',
      created_at: '2026-11-01 09:00:00',
      updated_at: '2026-11-06 09:40:00',
    });
    this.insert('projects', {
      id: 'proj-p2p-sync',
      name: 'SQLite Mesh Engine',
      package_name: 'com.lantern.mesh',
      git_remote: 'https://github.com/hunter-zen-RU/SQLite-Mesh.git',
      created_at: '2026-11-03 14:20:00',
      updated_at: '2026-11-06 08:15:00',
    });

    // 2. files table
    this.createTable('files', [
      { name: 'id', type: 'TEXT', isPrimary: true },
      { name: 'project_id', type: 'TEXT' },
      { name: 'path', type: 'TEXT' },
      { name: 'language', type: 'TEXT' },
      { name: 'size_bytes', type: 'INTEGER' },
      { name: 'is_modified', type: 'INTEGER' },
    ]);
    this.insert('files', {
      id: 'f-main',
      project_id: 'proj-android-lantern',
      path: 'app/src/main/java/MainActivity.kt',
      language: 'kotlin',
      size_bytes: 2840,
      is_modified: 0,
    });
    this.insert('files', {
      id: 'f-sqlite',
      project_id: 'proj-android-lantern',
      path: 'app/src/main/java/db/SQLiteManager.kt',
      language: 'kotlin',
      size_bytes: 1950,
      is_modified: 1,
    });
    this.insert('files', {
      id: 'f-manifest',
      project_id: 'proj-android-lantern',
      path: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      size_bytes: 840,
      is_modified: 0,
    });

    // 3. code_snippets table (for vibecoding & reusable blocks)
    this.createTable('code_snippets', [
      { name: 'id', type: 'INTEGER', isPrimary: true },
      { name: 'title', type: 'TEXT' },
      { name: 'language', type: 'TEXT' },
      { name: 'code', type: 'TEXT' },
      { name: 'vibe_tags', type: 'TEXT' },
    ]);
    this.insert('code_snippets', {
      id: 1,
      title: 'Compose SQLite Flow Hook',
      language: 'kotlin',
      code: 'val items by db.projectDao().observeAll().collectAsState(initial = emptyList())',
      vibe_tags: 'compose,sqlite,reactive',
    });
    this.insert('code_snippets', {
      id: 2,
      title: 'mDNS NSD Broadcast Service',
      language: 'kotlin',
      code: 'nsdManager.registerService(serviceInfo, NsdManager.PROTOCOL_DNS_SD, listener)',
      vibe_tags: 'p2p,lan,network',
    });

    // 4. audit_logs table
    this.createTable('audit_logs', [
      { name: 'id', type: 'INTEGER', isPrimary: true },
      { name: 'health_score', type: 'INTEGER' },
      { name: 'security_score', type: 'INTEGER' },
      { name: 'findings_count', type: 'INTEGER' },
      { name: 'audited_at', type: 'TEXT' },
    ]);
    this.insert('audit_logs', {
      id: 1,
      health_score: 95,
      security_score: 98,
      findings_count: 2,
      audited_at: '2026-11-06 09:30:00',
    });

    // 5. team_sessions table
    this.createTable('team_sessions', [
      { name: 'peer_id', type: 'TEXT', isPrimary: true },
      { name: 'peer_name', type: 'TEXT' },
      { name: 'device_type', type: 'TEXT' },
      { name: 'role', type: 'TEXT' },
      { name: 'is_ai', type: 'INTEGER' },
      { name: 'latency_ms', type: 'INTEGER' },
    ]);
    this.insert('team_sessions', {
      peer_id: 'peer-elena',
      peer_name: 'Elena Rostova',
      device_type: 'Pixel Tablet (Android 15)',
      role: 'Full-Write',
      is_ai: 0,
      latency_ms: 3,
    });
    this.insert('team_sessions', {
      peer_id: 'peer-marcus',
      peer_name: 'Marcus Vance',
      device_type: 'Galaxy Z Fold 6',
      role: 'Full-Write',
      is_ai: 0,
      latency_ms: 5,
    });
    this.insert('team_sessions', {
      peer_id: 'peer-lantern-ai',
      peer_name: 'LANtern AI Assistant',
      device_type: 'Gemini 3.8 / Local Neural Core',
      role: 'Pair-Programmer & Auditor',
      is_ai: 1,
      latency_ms: 12,
    });
  }

  public createTable(name: string, columns: ColumnDef[]) {
    this.tables.set(name, {
      name,
      columns,
      rows: [],
    });
  }

  public insert(tableName: string, row: Record<string, any>) {
    const table = this.tables.get(tableName);
    if (!table) throw new Error(`Table "${tableName}" does not exist`);
    table.rows.push({ ...row });
  }

  // Execute standard SQL statements: SELECT, INSERT, CREATE TABLE, UPDATE, DELETE, DROP TABLE
  public execute(sql: string): { columns: string[]; rows: any[][]; affectedRows?: number; message: string } {
    const start = performance.now();
    const cleanSql = sql.trim().replace(/;$/, '');
    const upper = cleanSql.toUpperCase();

    try {
      // 1. SELECT query
      if (upper.startsWith('SELECT')) {
        const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
        if (!fromMatch) throw new Error('Invalid SELECT statement: missing FROM clause');
        const tableName = fromMatch[1];
        const table = this.tables.get(tableName);
        if (!table) throw new Error(`no such table: ${tableName}`);

        // Simple column selector
        const selectPart = cleanSql.match(/SELECT\s+(.*?)\s+FROM/i)?.[1]?.trim() || '*';
        let columns = table.columns.map(c => c.name);
        if (selectPart !== '*') {
          const requested = selectPart.split(',').map(s => s.trim());
          columns = requested.filter(c => table.columns.some(col => col.name === c));
        }

        let resultRows = [...table.rows];

        // Optional WHERE filter (basic = comparison)
        const whereMatch = cleanSql.match(/WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/i);
        if (whereMatch) {
          const field = whereMatch[1];
          const val = whereMatch[2];
          resultRows = resultRows.filter(r => String(r[field]) === String(val));
        }

        const formattedRows = resultRows.map(row => columns.map(col => row[col]));

        this.recordHistory(sql, performance.now() - start, true);
        return {
          columns,
          rows: formattedRows,
          message: `${formattedRows.length} rows retrieved (${(performance.now() - start).toFixed(1)}ms)`,
        };
      }

      // 2. INSERT INTO query
      if (upper.startsWith('INSERT INTO')) {
        const match = cleanSql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*(?:\((.*?)\))?\s*VALUES\s*\((.*?)\)/i);
        if (!match) throw new Error('Invalid INSERT INTO syntax. Example: INSERT INTO table (col1, col2) VALUES ("val1", "val2")');
        const tableName = match[1];
        const table = this.tables.get(tableName);
        if (!table) throw new Error(`no such table: ${tableName}`);

        const colNames = match[2]
          ? match[2].split(',').map(s => s.trim())
          : table.columns.map(c => c.name);

        const rawValues = match[3].split(',').map(s => {
          const trimmed = s.trim();
          if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
          }
          if (!isNaN(Number(trimmed))) return Number(trimmed);
          return trimmed;
        });

        const newRow: Record<string, any> = {};
        colNames.forEach((col, idx) => {
          newRow[col] = rawValues[idx] ?? null;
        });

        table.rows.push(newRow);
        this.recordHistory(sql, performance.now() - start, true);
        return {
          columns: ['status'],
          rows: [['1 row inserted']],
          affectedRows: 1,
          message: 'Query executed successfully. 1 row affected.',
        };
      }

      // 3. CREATE TABLE
      if (upper.startsWith('CREATE TABLE')) {
        const match = cleanSql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\((.*?)\)/is);
        if (!match) throw new Error('Invalid CREATE TABLE syntax.');
        const tableName = match[1];
        if (this.tables.has(tableName)) {
          return { columns: ['status'], rows: [['Table already exists']], message: 'Table already exists.' };
        }
        const colDefinitions = match[2].split(',').map(c => {
          const parts = c.trim().split(/\s+/);
          return {
            name: parts[0],
            type: (parts[1]?.toUpperCase() as any) || 'TEXT',
            isPrimary: c.toUpperCase().includes('PRIMARY KEY'),
          };
        });
        this.createTable(tableName, colDefinitions);
        this.recordHistory(sql, performance.now() - start, true);
        return {
          columns: ['status'],
          rows: [[`Table ${tableName} created with ${colDefinitions.length} columns`]],
          message: `Table ${tableName} created successfully.`,
        };
      }

      // 4. DELETE FROM
      if (upper.startsWith('DELETE FROM')) {
        const match = cleanSql.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.*))?/i);
        if (!match) throw new Error('Invalid DELETE statement');
        const tableName = match[1];
        const table = this.tables.get(tableName);
        if (!table) throw new Error(`no such table: ${tableName}`);

        const initialLen = table.rows.length;
        if (!match[2]) {
          table.rows = [];
        } else {
          const whereMatch = match[2].match(/([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?/i);
          if (whereMatch) {
            const field = whereMatch[1];
            const val = whereMatch[2];
            table.rows = table.rows.filter(r => String(r[field]) !== String(val));
          }
        }
        const deleted = initialLen - table.rows.length;
        this.recordHistory(sql, performance.now() - start, true);
        return {
          columns: ['status'],
          rows: [[`${deleted} rows deleted`]],
          affectedRows: deleted,
          message: `Deleted ${deleted} rows.`,
        };
      }

      // 5. DROP TABLE
      if (upper.startsWith('DROP TABLE')) {
        const match = cleanSql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
        if (!match) throw new Error('Invalid DROP TABLE syntax');
        const tableName = match[1];
        this.tables.delete(tableName);
        this.recordHistory(sql, performance.now() - start, true);
        return {
          columns: ['status'],
          rows: [[`Table ${tableName} dropped`]],
          message: `Table ${tableName} dropped.`,
        };
      }

      throw new Error(`Unsupported or unrecognized SQL statement: "${cleanSql.substring(0, 30)}..."`);
    } catch (err: any) {
      this.recordHistory(sql, performance.now() - start, false);
      throw err;
    }
  }

  private recordHistory(sql: string, durationMs: number, success: boolean) {
    this.queryHistory.unshift({
      sql,
      timestamp: new Date().toLocaleTimeString(),
      durationMs: Math.round(durationMs),
      success,
    });
    if (this.queryHistory.length > 50) this.queryHistory.pop();
  }

  public exportDatabaseJson(): string {
    const data: Record<string, any> = {
      database: this.dbName,
      exportedAt: new Date().toISOString(),
      version: '3.42.0',
      tables: {},
    };
    this.tables.forEach((table, name) => {
      data.tables[name] = {
        columns: table.columns,
        rows: table.rows,
      };
    });
    return JSON.stringify(data, null, 2);
  }
}

// Global Singleton instance for application
export const sqliteDB = new LocalSQLiteDatabase('lantern_mobile_studio.sqlite');
