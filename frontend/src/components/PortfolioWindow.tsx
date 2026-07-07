'use client';

import React, { useState } from 'react';
import ActivityBar from './ActivityBar';
import FileExplorer, { FileNode } from './FileExplorer';
import EditorPanel from './EditorPanel';
import TerminalPanel from './TerminalPanel';
import { GitBranch, Search, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface PortfolioWindowProps {
  initialExplorerData: FileNode[];
}

export default function PortfolioWindow({ initialExplorerData }: PortfolioWindowProps) {
  const [activeTab, setActiveTab] = useState<string>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // File explorer selection
  const handleFileSelect = (file: FileNode) => {
    // Add to open files if not already present
    if (!openFiles.some((f) => f.path === file.path)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFile(file);
  };

  // Close tab
  const handleCloseFile = (filePath: string) => {
    const nextFiles = openFiles.filter((f) => f.path !== filePath);
    setOpenFiles(nextFiles);

    // If we closed the active file, switch to another open file
    if (activeFile?.path === filePath) {
      if (nextFiles.length > 0) {
        setActiveFile(nextFiles[nextFiles.length - 1]);
      } else {
        setActiveFile(null);
      }
    }
  };

  // Find all file contents matching query
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const results: { file: FileNode; line: number; text: string }[] = [];
    
    const searchNode = (node: FileNode) => {
      if (node.type === 'file' && node.content) {
        const lines = node.content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({
              file: node,
              line: index + 1,
              text: line.trim()
            });
          }
        });
      } else if (node.children) {
        node.children.forEach(searchNode);
      }
    };

    initialExplorerData.forEach(searchNode);
    return results;
  };

  const searchResults = getSearchResults();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-editor-bg select-none text-text-normal">
      {/* VS Code Window Title Bar */}
      <div className="h-[30px] bg-activity-bg flex items-center justify-between px-3 border-b border-border-dark select-none shrink-0 text-text-muted text-xs">
        {/* Window controls decoration */}
        <div className="flex items-center gap-1.5 w-1/4">
          <span className="w-3 h-3 rounded-full bg-dracula-red/80 hover:bg-dracula-red transition-colors inline-block" />
          <span className="w-3 h-3 rounded-full bg-dracula-yellow/80 hover:bg-dracula-yellow transition-colors inline-block" />
          <span className="w-3 h-3 rounded-full bg-dracula-green/80 hover:bg-dracula-green transition-colors inline-block" />
        </div>
        
        {/* Document Title */}
        <div className="w-2/4 text-center truncate select-text">
          {activeFile ? `${activeFile.name} - ` : ''}Shahrukh Faisal Portfolio - Visual Studio Code
        </div>
        
        {/* Empty layout spacer */}
        <div className="w-1/4 flex justify-end items-center text-[10px] uppercase font-bold tracking-wider opacity-85">
          <span className="bg-dracula-selection px-2 py-0.5 rounded text-dracula-purple">Dracula Theme</span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden w-full relative">
        {/* Left Side: Activity Bar */}
        <ActivityBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Collapsible Sidebar Panel */}
        {sidebarOpen && (
          <div className="w-[260px] md:w-[300px] bg-sidebar-bg shrink-0 flex flex-col h-full overflow-hidden border-r border-border-dark">
            {/* Render Sidebar tabs depending on Active Bar Selection */}
            {activeTab === 'explorer' && (
              <FileExplorer
                onFileSelect={handleFileSelect}
                activeFilePath={activeFile?.path || null}
                explorerData={initialExplorerData}
              />
            )}

            {activeTab === 'search' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="px-5 py-2.5 text-xs font-bold tracking-wider text-text-muted uppercase border-b border-border-dark">
                  <span>Search</span>
                </div>
                <div className="p-3">
                  <div className="relative flex items-center bg-editor-bg border border-border-light rounded px-2 py-1">
                    <Search size={14} className="text-text-muted mr-1.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search text in workspace"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none text-xs outline-none text-text-normal w-full"
                    />
                  </div>
                </div>
                {/* Search Results */}
                <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
                  {searchResults.length > 0 ? (
                    searchResults.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => handleFileSelect(res.file)}
                        className="w-full text-left p-1.5 rounded hover:bg-dracula-selection/20 border border-transparent hover:border-border-light transition-all text-xs"
                      >
                        <div className="font-semibold text-dracula-purple flex items-center justify-between">
                          <span>{res.file.name}</span>
                          <span className="text-[10px] text-text-muted">Line {res.line}</span>
                        </div>
                        <div className="text-text-muted truncate mt-0.5 font-mono select-none">
                          {res.text}
                        </div>
                      </button>
                    ))
                  ) : searchQuery.trim() ? (
                    <div className="text-text-muted text-xs text-center py-4">No results found</div>
                  ) : (
                    <div className="text-text-muted text-xs text-center py-4">Type a query to search file contents</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'source-control' && (
              <div className="flex-1 flex flex-col h-full">
                <div className="px-5 py-2.5 text-xs font-bold tracking-wider text-text-muted uppercase border-b border-border-dark">
                  <span>Source Control</span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                    <span className="flex items-center gap-1"><GitBranch size={14} /> main*</span>
                  </div>
                  
                  {/* Changed Files List */}
                  <div className="flex-1 overflow-y-auto space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Changes</div>
                    <div className="flex items-center justify-between p-1 hover:bg-dracula-selection/20 rounded">
                      <span className="text-dracula-green font-medium">.env</span>
                      <span className="text-[10px] text-dracula-yellow bg-dracula-yellow/10 px-1 py-0.5 rounded font-bold">M</span>
                    </div>
                    <div className="text-[10px] text-text-muted/70 italic px-1 pt-1.5">
                      (Modifications indicate API key placeholder setup)
                    </div>
                  </div>

                  {/* Message commit box */}
                  <div className="mt-auto space-y-2">
                    <input
                      type="text"
                      placeholder="Message (Ctrl+Enter to commit to 'main')"
                      className="w-full bg-editor-bg border border-border-light text-xs outline-none text-text-normal px-2.5 py-1.5 rounded"
                      disabled
                    />
                    <button
                      className="w-full bg-dracula-purple hover:bg-dracula-purple/85 text-editor-bg py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
                      disabled
                    >
                      Commit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Center Panel (Editor + Terminal) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Editor Tabs and Contents */}
          <EditorPanel
            openFiles={openFiles}
            activeFile={activeFile}
            onSelectFile={handleFileSelect}
            onCloseFile={handleCloseFile}
          />

          {/* Terminal Console Panel */}
          <TerminalPanel />
        </div>
      </div>

      {/* VS Code Bottom Status Bar */}
      <div className="h-[22px] bg-dracula-purple text-editor-bg flex items-center justify-between px-3 text-[11px] select-none shrink-0 font-medium z-10">
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/shahrukhfaisal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:bg-black/10 px-1.5 py-0.5 transition-colors cursor-pointer"
          >
            <GitBranch size={12} />
            <span>main</span>
          </a>
          <div className="flex items-center gap-1 hover:bg-black/10 px-1.5 py-0.5 transition-colors cursor-pointer">
            <RefreshCw size={10} className="animate-spin-slow" />
            <span>Syncing</span>
          </div>
          <div className="flex items-center gap-1 hover:bg-black/10 px-1.5 py-0.5 transition-colors">
            <AlertCircle size={12} />
            <span>0</span>
            <Info size={12} />
            <span>0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="hidden sm:inline">
            {activeFile?.language ? activeFile.language.toUpperCase() : 'PLAIN TEXT'}
          </span>
        </div>
      </div>
    </div>
  );
}
