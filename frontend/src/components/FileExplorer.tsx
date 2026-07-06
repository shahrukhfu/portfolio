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
}

export const filesData: FileNode[] = [
  {
    name: 'projects',
    path: 'projects',
    type: 'folder',
    children: [
      {
        name: 'project_1.json',
        path: 'projects/project_1.json',
        type: 'file',
        language: 'json',
        content: `{
  "name": "Autonomous Agentic Coding Assistant",
  "description": "An LLM-driven coding agent that leverages specialized tools to interact with local filesystems, execute terminal commands, and verify builds.",
  "role": "Lead AI & Backend Developer",
  "technologies": ["FastAPI", "Python", "Google Gemini API", "Pydantic", "Docker"],
  "highlights": [
    "Designed event-driven agent architecture with reactive wakeups",
    "Created sandboxed environment execution logic using Docker API",
    "Optimized tool-use execution cycles reducing token overhead by 35%"
  ]
}`
      },
      {
        name: 'project_2.py',
        path: 'projects/project_2.py',
        type: 'file',
        language: 'python',
        content: `# Shahrukh Faisal - Computer Vision & Robotics Project
import cv2
import numpy as np

class DroneTargetDetector:
    def __init__(self, target_color_range):
        # Air University Computer Vision Lab
        self.target_color_range = target_color_range
        self.detector_active = True

    def process_frame(self, frame):
        """
        Detect target position using contour detection & color segmentation
        """
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, self.target_color_range[0], self.target_color_range[1])
        
        # Noise reduction
        kernel = np.ones((5,5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        
        # Finding contours
        contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)
            centroid = (int(x + w/2), int(y + h/2))
            return {
                "detected": True,
                "bbox": (x, y, w, h),
                "centroid": centroid
            }
        
        return {"detected": False}
`
      }
    ]
  },
  {
    name: 'certifications',
    path: 'certifications',
    type: 'folder',
    children: [
      {
        name: 'certifications_list.md',
        path: 'certifications/certifications_list.md',
        type: 'file',
        language: 'markdown',
        content: `# Professional Certifications & Education

## 🎓 Air University, Islamabad
- **B.S. Artificial Intelligence** (Ongoing)
- Focused Coursework: Computer Vision, Deep Learning, Autonomous Agents, Software Architecture.

## 🛠️ Specialized Training
- **DeepLearning.AI**: LangChain for LLM Application Development
- **Google Cloud Platform**: Serverless FastAPI Deployments with Cloud Run
- **TensorFlow Developer**: Advanced Deep Learning and Computer Vision Models
- **NVIDIA Deep Learning Institute**: Jetson Nano Robotics & Computer Vision Edge Deployments
`
      }
    ]
  },
  {
    name: 'tech_stack',
    path: 'tech_stack',
    type: 'folder',
    children: [
      {
        name: 'languages_and_frameworks.json',
        path: 'tech_stack/languages_and_frameworks.json',
        type: 'file',
        language: 'json',
        content: `{
  "languages": {
    "proficient": ["Python", "TypeScript", "JavaScript", "HTML/CSS", "SQL"],
    "familiar": ["Rust", "C++"]
  },
  "frameworks_and_libraries": {
    "backend": ["FastAPI", "Uvicorn", "Flask", "Django"],
    "frontend": ["Next.js", "React", "Tailwind CSS", "Redux Toolkit"],
    "ai_and_cv": ["PyTorch", "TensorFlow", "OpenCV", "Scikit-Learn", "LangChain"]
  },
  "developer_tools": ["Git", "Docker", "VS Code", "PostgreSQL", "Google Cloud Platform"]
}`
      }
    ]
  }
];

export default function FileExplorer({ onFileSelect, activeFilePath }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    projects: true,
    certifications: true,
    tech_stack: true,
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
        {filesData.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
