'use client';

import React, { useState, useEffect } from 'react';
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
  const [terminalOpen, setTerminalOpen] = useState<boolean>(true);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Resizing states
  const [sidebarWidth, setSidebarWidth] = useState<number>(300);
  const [isResizingSidebar, setIsResizingSidebar] = useState<boolean>(false);
  const [terminalHeight, setTerminalHeight] = useState<number>(280);
  const [isResizingTerminal, setIsResizingTerminal] = useState<boolean>(false);

  // Mobile state
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    
    // Auto-collapse panels on first mobile mount
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
      setTerminalOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isResizingSidebar && !isResizingTerminal) return;

    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(() => {
        if (isResizingSidebar) {
          const newWidth = e.clientX - 50;
          if (newWidth >= 200 && newWidth <= 450) {
            setSidebarWidth(newWidth);
          }
        } else if (isResizingTerminal) {
          const newHeight = window.innerHeight - 22 - e.clientY;
          if (newHeight >= 150 && newHeight <= 600) {
            setTerminalHeight(newHeight);
          }
        }
      });
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingTerminal(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar, isResizingTerminal]);

  // File explorer selection
  const handleFileSelect = (file: FileNode) => {
    // Add to open files if not already present
    if (!openFiles.some((f) => f.path === file.path)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFile(file);
    
    // Auto-close sidebar on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
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
    <div className="h-dvh w-dvw flex flex-col overflow-hidden bg-editor-bg select-none text-text-normal">
      {/* VS Code Window Title Bar */}
      <div className="h-[30px] bg-activity-bg flex items-center justify-between px-3 border-b border-border-dark select-none shrink-0 text-text-muted text-xs">
        {/* Window controls decoration (Desktop Only) */}
        <div className="hidden md:flex items-center gap-1.5 w-1/4">
          <span className="w-3 h-3 rounded-full bg-dracula-red/80 hover:bg-dracula-red transition-colors inline-block" />
          <span className="w-3 h-3 rounded-full bg-dracula-yellow/80 hover:bg-dracula-yellow transition-colors inline-block" />
          <span className="w-3 h-3 rounded-full bg-dracula-green/80 hover:bg-dracula-green transition-colors inline-block" />
        </div>
        
        {/* Document Title */}
        <div className="flex-1 md:w-2/4 text-left md:text-center truncate select-text font-medium md:font-normal">
          {activeFile ? `${activeFile.name} - ` : ''}Shahrukh Faisal
        </div>
        
        {/* Layout Control Spacer */}
        <div className="flex-1 md:w-1/4 flex justify-end items-center text-[10px] uppercase font-bold tracking-wider opacity-85">
          {/* Layout Toggles */}
          <div className="flex items-center gap-1 border-r border-border-dark pr-2 mr-2">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              title="Toggle Primary Side Bar"
              className={`p-1.5 rounded hover:bg-dracula-selection/60 transition-colors cursor-pointer text-text-normal ${
                sidebarOpen ? 'opacity-90 text-dracula-purple' : 'opacity-45 text-text-muted hover:opacity-100 hover:text-text-normal'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h3.5V2.5h-3.5zm4.5 0v11h8a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-8zM0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75z"/>
              </svg>
            </button>
            <button
              onClick={() => setTerminalOpen(prev => !prev)}
              title="Toggle Panel"
              className={`p-1.5 rounded hover:bg-dracula-selection/60 transition-colors cursor-pointer text-text-normal ${
                terminalOpen ? 'opacity-90 text-dracula-purple' : 'opacity-45 text-text-muted hover:opacity-100 hover:text-text-normal'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M14.25 14a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v10a.25.25 0 0 0 .25.25h12.5zM1.75 2h12.5C15.216 2 16 2.784 16 3.75v10A1.75 1.75 0 0 1 14.25 15.5H1.75A1.75 1.75 0 0 1 0 13.75v-10C0 2.784.784 2 1.75 2zm12.5 9.5H1.75v2.25c0 .138.112.25.25.25h12c.138 0 .25-.112.25-.25V11.5z"/>
              </svg>
            </button>
          </div>
          <span className="hidden sm:inline bg-dracula-selection px-2 py-0.5 rounded text-dracula-purple">Dracula Theme</span>
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
          <div
            style={{ width: isMobile ? 'calc(100vw - 50px)' : `${sidebarWidth}px` }}
            className={`${
              isMobile ? 'absolute left-[50px] top-0 bottom-0 z-30 shadow-2xl' : 'relative'
            } bg-sidebar-bg shrink-0 flex flex-col h-full overflow-hidden border-r border-border-dark`}
          >
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

        {/* Sidebar Resize Handle */}
        {sidebarOpen && !isMobile && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingSidebar(true);
            }}
            className="w-1 bg-border-dark/60 hover:bg-dracula-purple/50 active:bg-dracula-purple cursor-col-resize shrink-0 z-20 transition-colors"
          />
        )}

        {/* Center Panel (Editor + Terminal) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Editor Tabs and Contents */}
          <div className="flex-1 overflow-hidden relative">
            <EditorPanel
              openFiles={openFiles}
              activeFile={activeFile}
              onSelectFile={handleFileSelect}
              onCloseFile={handleCloseFile}
            />
            {/* Mobile Sidebar Overlay Dimmer Overlay */}
            {isMobile && sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 bg-black/45 z-20 transition-opacity duration-200"
              />
            )}
          </div>

          {/* Terminal Resize Handle & Console Panel */}
          {terminalOpen && (
            <>
              {!isMobile && (
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsResizingTerminal(true);
                  }}
                  className="h-1 bg-border-dark/60 hover:bg-dracula-purple/50 active:bg-dracula-purple cursor-row-resize shrink-0 z-20 transition-colors"
                />
              )}
              <TerminalPanel height={isMobile ? 250 : terminalHeight} />
            </>
          )}
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
          <span className="hidden md:inline">Ln 1, Col 1</span>
          <span className="hidden md:inline">Spaces: 2</span>
          <span className="hidden md:inline">UTF-8</span>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-85">
            {activeFile?.language ? activeFile.language.toUpperCase() : 'PLAIN TEXT'}
          </span>
        </div>
      </div>
    </div>
  );
}
