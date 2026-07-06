'use client';

import React from 'react';
import { X, FileJson, FileCode, FileText, Code2 } from 'lucide-react';
import { FileNode } from './FileExplorer';

interface EditorPanelProps {
  openFiles: FileNode[];
  activeFile: FileNode | null;
  onSelectFile: (file: FileNode) => void;
  onCloseFile: (filePath: string) => void;
}

export default function EditorPanel({
  openFiles,
  activeFile,
  onSelectFile,
  onCloseFile,
}: EditorPanelProps) {
  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={14} className="text-dracula-yellow mr-1.5 shrink-0" />;
    if (fileName.endsWith('.py')) return <FileCode size={14} className="text-dracula-cyan mr-1.5 shrink-0" />;
    if (fileName.endsWith('.md')) return <FileText size={14} className="text-dracula-pink mr-1.5 shrink-0" />;
    return <FileText size={14} className="text-text-muted mr-1.5 shrink-0" />;
  };

  return (
    <div className="flex-1 bg-editor-bg flex flex-col h-full overflow-hidden">
      {/* Tabs Header */}
      {openFiles.length > 0 ? (
        <div className="flex bg-activity-bg border-b border-border-dark overflow-x-auto select-none scrollbar-none h-[35px]">
          {openFiles.map((file) => {
            const isActive = activeFile?.path === file.path;
            return (
              <div
                key={file.path}
                onClick={() => onSelectFile(file)}
                className={`flex items-center px-4 py-1.5 border-r border-border-dark text-xs cursor-pointer transition-colors duration-100 group shrink-0 ${
                  isActive
                    ? 'bg-editor-bg text-text-normal border-t-2 border-dracula-purple'
                    : 'bg-activity-bg text-text-muted hover:bg-editor-bg/50 hover:text-text-normal'
                }`}
              >
                {getFileIcon(file.name)}
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseFile(file.path);
                  }}
                  className="ml-2.5 p-0.5 rounded-sm hover:bg-dracula-selection text-text-muted hover:text-dracula-red cursor-pointer transition-colors duration-100"
                  aria-label={`Close ${file.name}`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto relative">
        {activeFile ? (
          <div className="flex font-mono text-sm leading-relaxed p-4 h-full">
            {/* Line Numbers */}
            <div className="text-right text-text-muted select-none pr-4 border-r border-border-dark w-[40px] text-xs font-light">
              {activeFile.content?.split('\n').map((_, index) => (
                <div key={index} className="h-5">
                  {index + 1}
                </div>
              ))}
            </div>
            {/* Code Body */}
            <div className="pl-4 flex-1 select-text">
              <pre className="text-xs md:text-sm text-text-normal font-mono h-full overflow-x-auto whitespace-pre font-light">
                {activeFile.content?.split('\n').map((line, index) => (
                  <div key={index} className="h-5 hover:bg-dracula-selection/10 rounded px-1">
                    {line}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        ) : (
          /* Landing/Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none bg-editor-bg">
            <Code2 size={72} className="text-dracula-purple/50 mb-6 animate-pulse" />
            <h1 className="text-2xl font-bold text-text-normal mb-2">Shahrukh Faisal</h1>
            <p className="text-text-muted text-sm max-w-md mb-6">
              AI Student @ Air University | Full-Stack Developer & Autonomous Agents Specialist
            </p>
            <div className="space-y-3.5 text-xs text-left max-w-sm border border-border-light bg-activity-bg/50 p-5 rounded-lg shadow-xl">
              <div className="flex justify-between items-center border-b border-border-dark pb-2 text-text-muted uppercase text-[10px] tracking-wider font-bold">
                <span>Integrated Shortcuts</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-normal/85 font-medium">Explore Files</span>
                <span className="text-dracula-cyan bg-dracula-selection/45 px-1.5 py-0.5 rounded font-mono">Click Explorer Sidebar</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-normal/85 font-medium">Interactive Chat</span>
                <span className="text-dracula-purple bg-dracula-selection/45 px-1.5 py-0.5 rounded font-mono">Use Terminal Panel</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-normal/85 font-medium">Help Terminal</span>
                <span className="text-dracula-green bg-dracula-selection/45 px-1.5 py-0.5 rounded font-mono">Type &apos;help&apos; in Terminal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
