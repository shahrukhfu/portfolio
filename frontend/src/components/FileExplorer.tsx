'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileJson, FileCode, FileText } from 'lucide-react';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  activeFilePath: string | null;
  explorerData: FileNode[];
}

export default function FileExplorer({ onFileSelect, activeFilePath, explorerData }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    projects: false,
    certifications: false,
    tech_stack: false,
  });

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={16} className="text-dracula-yellow mr-2 shrink-0" />;
    if (fileName.endsWith('.py')) return <FileCode size={16} className="text-dracula-cyan mr-2 shrink-0" />;
    if (fileName.endsWith('.md')) return <FileText size={16} className="text-dracula-pink mr-2 shrink-0" />;
    return <FileText size={16} className="text-text-muted mr-2 shrink-0" />;
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.name] || false;
    const paddingLeft = `${depth * 12 + 10}px`;

    if (isFolder) {
      return (
        <div key={node.path} className="w-full">
          <button
            onClick={() => toggleFolder(node.name)}
            style={{ paddingLeft }}
            className="w-full flex items-center py-1 hover:bg-dracula-selection/30 text-text-normal text-sm font-medium cursor-pointer text-left transition-colors duration-100"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-text-muted mr-1" />
            ) : (
              <ChevronRight size={14} className="text-text-muted mr-1" />
            )}
            {isExpanded ? (
              <FolderOpen size={16} className="text-dracula-purple mr-2 shrink-0" />
            ) : (
              <Folder size={16} className="text-dracula-purple mr-2 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div className="w-full">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const isActive = activeFilePath === node.path;

    return (
      <button
        key={node.path}
        onClick={() => onFileSelect(node)}
        style={{ paddingLeft }}
        className={`w-full flex items-center py-1 text-sm cursor-pointer text-left transition-colors duration-100 ${
          isActive
            ? 'bg-dracula-selection/65 text-text-normal font-semibold border-l-2 border-dracula-purple'
            : 'hover:bg-dracula-selection/20 text-text-normal/85 hover:text-text-normal border-l-2 border-transparent'
        }`}
      >
        <span className="ml-4 shrink-0 flex items-center">
          {getFileIcon(node.name)}
        </span>
        <span className="truncate">{node.name}</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-sidebar-bg flex flex-col h-full select-none select-none text-text-normal border-r border-border-dark">
      {/* Sidebar Header */}
      <div className="px-5 py-2.5 text-xs font-bold tracking-wider text-text-muted uppercase border-b border-border-dark flex justify-between items-center">
        <span>Explorer</span>
      </div>
      
      {/* Workspace Label */}
      <div className="px-3 py-2 flex items-center text-xs font-bold uppercase tracking-wide text-text-normal/80">
        <ChevronDown size={14} className="mr-1" />
        <span className="truncate">Portfolio [Workspace]</span>
      </div>

      {/* Directory File Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {explorerData.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
