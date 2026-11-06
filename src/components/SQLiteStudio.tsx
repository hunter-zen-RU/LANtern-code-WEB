import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Play, 
  Download, 
  Plus, 
  Trash2, 
  FileCode, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  Check, 
  AlertCircle,
  FilePlus,
  Clock
} from 'lucide-react';
import { sqliteDB, TableDef } from '../lib/sqliteEngine';

export const SQLiteStudio: React.FC = () => {
  const [tables, setTables] = useState<TableDef[]>(sqliteDB.getTables());
  const [activeTableName, setActiveTableName] = useState<string>('projects');
  const [sqlInput, setSqlInput] = useState('SELECT * FROM projects;');
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: any[][];
    message: string;
  } | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCols, setNewTableCols] = useState('id TEXT PRIMARY KEY, title TEXT, content TEXT');

  const activeTable = tables.find(t => t.name === activeTableName) || tables[0];

  const refreshTables = () => {
    setTables(sqliteDB.getTables());
  };

  const handleRunQuery = () => {
    if (!sqlInput.trim()) return;
    setIsExecuting(true);
    setQueryError(null);

    setTimeout(() => {
      try {
        const result = sqliteDB.execute(sqlInput.trim());
        setQueryResult(result);
        refreshTables();
      } catch (err: any) {
        setQueryError(err?.message || 'SQL execution failed');
        setQueryResult(null);
      } finally {
        setIsExecuting(false);
      }
    }, 50);
  };

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;
    try {
      const sql = `CREATE TABLE ${newTableName.trim()} (${newTableCols.trim()});`;
      sqliteDB.execute(sql);
      refreshTables();
      setActiveTableName(newTableName.trim());
      setShowNewTableModal(false);
      setNewTableName('');
      setSqlInput(`SELECT * FROM ${newTableName.trim()};`);
    } catch (err: any) {
      alert(`Error creating table: ${err.message}`);
    }
  };

  const handleExportDB = () => {
    const json = sqliteDB.exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sqliteDB.getDatabaseName()}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 text-xs select-none overflow-hidden">
      {/* SQLite Studio Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>SQLite Local Project Store</span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                v3.42.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {sqliteDB.getDatabaseName()} • {tables.length} tables active
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowNewTableModal(true)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-semibold transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Table</span>
          </button>
          <button
            onClick={handleExportDB}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            title="Export SQLite database"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New Table Dialog */}
      {showNewTableModal && (
        <form onSubmit={handleCreateTable} className="p-3 bg-slate-950 border-b border-slate-800 space-y-2">
          <div className="font-semibold text-slate-200 text-xs flex justify-between items-center">
            <span>Create New SQLite Table</span>
            <button
              type="button"
              onClick={() => setShowNewTableModal(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="table_name (e.g. app_settings)"
              className="bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono focus:outline-none focus:border-indigo-400"
            />
            <input
              type="text"
              value={newTableCols}
              onChange={(e) => setNewTableCols(e.target.value)}
              placeholder="id TEXT PRIMARY KEY, key TEXT, val TEXT"
              className="bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono focus:outline-none focus:border-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition"
          >
            Execute CREATE TABLE
          </button>
        </form>
      )}

      {/* Main Workspace (Table Selector + SQL Console + Data Grid) */}
      <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
        {/* Table Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 shrink-0 no-scrollbar">
          {tables.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setActiveTableName(t.name);
                setSqlInput(`SELECT * FROM ${t.name};`);
                // Auto execute select
                try {
                  const res = sqliteDB.execute(`SELECT * FROM ${t.name};`);
                  setQueryResult(res);
                  setQueryError(null);
                } catch {}
              }}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center space-x-1.5 transition shrink-0 ${
                activeTableName === t.name
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Table className="w-3.5 h-3.5 opacity-80" />
              <span>{t.name}</span>
              <span className="text-[10px] opacity-70 bg-black/30 px-1.5 py-0.2 rounded-full">
                {t.rows.length}
              </span>
            </button>
          ))}
        </div>

        {/* SQL Query Console Box */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-indigo-400" />
              SQL Console
            </span>
            {/* Quick SQL queries */}
            <div className="flex items-center space-x-1">
              {[
                `SELECT * FROM ${activeTableName};`,
                `SELECT * FROM files WHERE is_modified = 1;`,
                `SELECT * FROM code_snippets;`,
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setSqlInput(q)}
                  className="text-[10px] font-mono text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 truncate max-w-[140px]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <textarea
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              rows={2}
              className="flex-1 bg-slate-900 text-slate-100 text-xs p-2 rounded-lg border border-slate-700 font-mono focus:border-indigo-400 focus:outline-none resize-none"
              placeholder="Type SQLite query (SELECT, INSERT, UPDATE, CREATE TABLE)..."
            />
            <button
              onClick={handleRunQuery}
              disabled={isExecuting || !sqlInput.trim()}
              className="px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex flex-col items-center justify-center transition shadow-md shadow-indigo-600/20"
            >
              <Play className="w-4 h-4 fill-white" />
              <span className="text-[10px] mt-0.5">Run</span>
            </button>
          </div>

          {queryError && (
            <div className="p-2 bg-rose-950/80 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{queryError}</span>
            </div>
          )}

          {queryResult && (
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{queryResult.message}</span>
            </div>
          )}
        </div>

        {/* Results Data Grid */}
        <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-inner">
          {queryResult && queryResult.columns.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 sticky top-0">
                  {queryResult.columns.map((col, idx) => (
                    <th key={idx} className="p-2.5 font-bold text-[11px] uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queryResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="p-2.5 text-slate-300 truncate max-w-xs">
                        {val === null || val === undefined ? (
                          <span className="text-slate-600 italic">null</span>
                        ) : typeof val === 'object' ? (
                          JSON.stringify(val)
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : activeTable ? (
            /* Active Table Direct Preview */
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 sticky top-0">
                  {activeTable.columns.map((col, idx) => (
                    <th key={idx} className="p-2.5 font-bold text-[11px] uppercase tracking-wider">
                      {col.name} {col.isPrimary && <span className="text-amber-400 text-[9px]">(PK)</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeTable.rows.length === 0 ? (
                  <tr>
                    <td colSpan={activeTable.columns.length} className="p-4 text-center text-slate-500 font-sans">
                      Table is currently empty.
                    </td>
                  </tr>
                ) : (
                  activeTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                      {activeTable.columns.map((col, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-slate-300 truncate max-w-xs">
                          {String(row[col.name] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">No tables selected</div>
          )}
        </div>
      </div>
    </div>
  );
};
