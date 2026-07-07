'use client';

import React, { useState } from 'react';
import { X, FileJson, FileCode, FileText, Code2, Check } from 'lucide-react';
import { FileNode } from './FileExplorer';

interface EditorPanelProps {
  openFiles: FileNode[];
  activeFile: FileNode | null;
  onSelectFile: (file: FileNode) => void;
  onCloseFile: (filePath: string) => void;
}

interface ParsedProject {
  title: string;
  github: string;
  overview: string;
  techStack: string[];
  architecture: string[];
}

export default function EditorPanel({
  openFiles,
  activeFile,
  onSelectFile,
  onCloseFile,
}: EditorPanelProps) {
  // Track Source vs Preview mode per file path
  const [viewModes, setViewModes] = useState<Record<string, 'source' | 'preview'>>({});
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const getMode = (path: string) => viewModes[path] || 'source';

  const toggleMode = (path: string, mode: 'source' | 'preview') => {
    setViewModes((prev) => ({ ...prev, [path]: mode }));
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.json')) return <FileJson size={14} className="text-dracula-yellow mr-1.5 shrink-0" />;
    if (fileName.endsWith('.py')) return <FileCode size={14} className="text-dracula-cyan mr-1.5 shrink-0" />;
    if (fileName.endsWith('.md')) return <FileText size={14} className="text-dracula-pink mr-1.5 shrink-0" />;
    return <FileText size={14} className="text-text-muted mr-1.5 shrink-0" />;
  };

  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  // Helper parser for Project Markdown logs
  const parseProjectMarkdown = (content: string): ParsedProject => {
    // Sanitize backslash escapes commonly found in raw parsed contents
    const cleanContent = content
      .replace(/\\#/g, '#')
      .replace(/\\-/g, '-')
      .replace(/\\\*/g, '*')
      .replace(/\\&/g, '&');

    const lines = cleanContent.split('\n');
    let title = '';
    let github = '';
    let overview = '';
    const techStack: string[] = [];
    const architecture: string[] = [];
    
    let currentSection = '';
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      // Title
      if (line.startsWith('#') && !line.startsWith('##')) {
        title = line.replace(/^[#\s]+/, '').trim();
        continue;
      }
      
      // GitHub Repository Link
      if (line.includes('https://github.com/')) {
        const match = line.match(/https?:\/\/\S+/);
        if (match) {
          github = match[0].trim();
        }
        continue;
      }
      
      // Section triggers
      if (line.startsWith('### Overview')) {
        currentSection = 'overview';
        continue;
      } else if (line.startsWith('### Core Tech Stack')) {
        currentSection = 'tech';
        continue;
      } else if (line.startsWith('### System Architecture')) {
        currentSection = 'architecture';
        continue;
      }
      
      // Section aggregators
      if (currentSection === 'overview') {
        overview += (overview ? ' ' : '') + line.replace(/^[\*\s-]+/, '').trim();
      } else if (currentSection === 'tech') {
        if (line.startsWith('-') || line.startsWith('*')) {
          techStack.push(line.replace(/^[\*\s-]+/, '').trim());
        }
      } else if (currentSection === 'architecture') {
        if (line.startsWith('-') || line.startsWith('*')) {
          architecture.push(line.replace(/^[\*\s-]+/, '').trim());
        }
      }
    }
    
    return { title, github, overview, techStack, architecture };
  };

  const renderLineContent = (line: string, isJson: boolean) => {
    if (!line.trim()) return <span>&nbsp;</span>;

    if (isJson) {
      // 1. Highlight JSON Keys, Strings, Numbers, and Brackets
      const keyMatch = line.match(/^(\s*)("[^"]+")(\s*:\s*)(.*)$/);
      if (keyMatch) {
        const indent = keyMatch[1];
        const key = keyMatch[2];
        const colon = keyMatch[3];
        const rest = keyMatch[4];
        
        let restElement = <span className="text-text-normal">{rest}</span>;
        const trimmedRest = rest.trim();
        
        if (trimmedRest.startsWith('"')) {
          const strMatch = rest.match(/^(\s*)("[^"]+")(.*)$/);
          if (strMatch) {
            restElement = (
              <span>
                <span className="text-text-normal">{strMatch[1]}</span>
                <span className="text-dracula-green">{strMatch[2]}</span>
                <span className="text-text-normal">{strMatch[3]}</span>
              </span>
            );
          }
        } else if (/^\d+/.test(trimmedRest)) {
          const numMatch = rest.match(/^(\s*)(\d+)(.*)$/);
          if (numMatch) {
            restElement = (
              <span>
                <span className="text-text-normal">{numMatch[1]}</span>
                <span className="text-dracula-orange">{numMatch[2]}</span>
                <span className="text-text-normal">{numMatch[3]}</span>
              </span>
            );
          }
        } else if (/^(true|false|null)/.test(trimmedRest)) {
          const valMatch = rest.match(/^(\s*)(true|false|null)(.*)$/);
          if (valMatch) {
            restElement = (
              <span>
                <span className="text-text-normal">{valMatch[1]}</span>
                <span className="text-dracula-purple font-bold">{valMatch[2]}</span>
                <span className="text-text-normal">{valMatch[3]}</span>
              </span>
            );
          }
        }
        
        return (
          <span>
            <span className="text-text-normal">{indent}</span>
            <span className="text-dracula-pink">{key}</span>
            <span className="text-dracula-purple">{colon}</span>
            {restElement}
          </span>
        );
      }
      
      if (/^[{}[\],:\s]+$/.test(line.trim())) {
        return <span className="text-dracula-cyan">{line}</span>;
      }
      
      return <span className="text-text-normal">{line}</span>;
    } else {
      // 2. Highlight Markdown headings & parse GitHub Repositories into clickable links
      if (line.includes('https://github.com/')) {
        const repoMatch = line.match(/(.*)(https?:\/\/github\.com\/\S+)(.*)/);
        if (repoMatch) {
          const prefix = repoMatch[1];
          const url = repoMatch[2];
          const suffix = repoMatch[3];
          return (
            <span>
              <span className="text-text-normal">{prefix}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dracula-cyan underline font-bold bg-dracula-selection/40 hover:bg-dracula-purple hover:text-editor-bg px-2 py-0.5 rounded transition-all duration-150 inline-flex items-center gap-1 cursor-pointer"
              >
                {url} ↗
              </a>
              <span className="text-text-normal">{suffix}</span>
            </span>
          );
        }
      }

      if (line.startsWith('#') || line.startsWith('\\#')) {
        return <span className="text-dracula-pink font-bold">{line}</span>;
      }
      if (line.startsWith('##') || line.startsWith('###') || line.startsWith('\\##') || line.startsWith('\\###')) {
        return <span className="text-dracula-purple font-semibold">{line}</span>;
      }
      
      if (line.trim().startsWith('#')) {
        return <span className="text-text-muted italic">{line}</span>;
      }

      return <span className="text-text-normal/90">{line}</span>;
    }
  };

  const isFileJson = activeFile?.name.endsWith('.json') || false;

  return (
    <div className="flex-1 bg-editor-bg flex flex-col h-full overflow-hidden">
      {/* Tabs Header Toggle System */}
      {openFiles.length > 0 ? (
        <div className="flex bg-activity-bg border-b border-border-dark select-none h-[35px] items-center justify-between shrink-0">
          {/* Active Tabs list */}
          <div className="flex overflow-x-auto scrollbar-none h-full flex-1">
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
          
          {/* Split Mode Toggle Button group */}
          {activeFile && (
            <div className="flex items-center gap-1.5 px-3 shrink-0">
              <button
                onClick={() => toggleMode(activeFile.path, 'source')}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                  getMode(activeFile.path) === 'source'
                    ? 'bg-dracula-purple text-editor-bg shadow'
                    : 'bg-dracula-selection/45 text-text-muted hover:text-text-normal'
                }`}
              >
                &lt;/&gt; Source
              </button>
              <button
                onClick={() => toggleMode(activeFile.path, 'preview')}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer ${
                  getMode(activeFile.path) === 'preview'
                    ? 'bg-dracula-purple text-editor-bg shadow'
                    : 'bg-dracula-selection/45 text-text-muted hover:text-text-normal'
                }`}
              >
                👁 Preview
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Editor Main Content Area */}
      <div className="flex-1 overflow-auto relative">
        {activeFile ? (
          getMode(activeFile.path) === 'source' ? (
            /* 1. SOURCE CODE VIEW MODE */
            <div className="flex font-mono text-sm leading-relaxed p-4 h-full animate-fade-in-up">
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
                    <div key={index} className="h-5 hover:bg-dracula-selection/10 rounded px-1 flex items-center">
                      {renderLineContent(line, isFileJson)}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          ) : (
            /* 2. RICH COMPONENT PREVIEW VIEW MODE */
            <div className="p-4 md:p-6 overflow-y-auto h-full scroll-smooth select-text">
              {activeFile.path.startsWith('projects/') ? (
                /* A. Projects Markdown Dashboard Showcase */
                (() => {
                  const project = parseProjectMarkdown(activeFile.content || '');
                  return (
                    <div className="animate-scale-in max-w-4xl mx-auto py-2">
                      {/* Header block with interactive github sliding button */}
                      <div className="border-b border-border-light pb-4 mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h1 className="text-xl md:text-2xl font-bold text-dracula-purple flex items-center gap-2">
                            <FileCode size={26} className="text-dracula-purple shrink-0" />
                            {project.title}
                          </h1>
                          <p className="text-xs text-text-muted mt-1 select-none font-mono">projects/{activeFile.name}</p>
                        </div>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-dracula-selection text-text-normal hover:text-editor-bg text-xs font-bold rounded-lg shadow-md border border-border-light relative overflow-hidden group cursor-pointer shrink-0 transition-all duration-300"
                          >
                            <span className="relative z-10 flex items-center gap-1.5">
                              {/* Inline GitHub SVG */}
                              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                              Open Repository ↗
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-dracula-pink to-dracula-purple translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                          </a>
                        )}
                      </div>

                      {/* Overview Panel */}
                      <div className="mb-6 animate-fade-in-up delay-75">
                        <h3 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-2 select-none">Project Overview</h3>
                        <div className="bg-activity-bg/50 border-l-4 border-dracula-green p-4 rounded-r-lg">
                          <p className="text-sm text-text-normal/90 leading-relaxed font-sans">{project.overview}</p>
                        </div>
                      </div>

                      {/* Core Tech Stack Badges */}
                      <div className="mb-6 animate-fade-in-up delay-150">
                        <h3 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-2 select-none">Technologies Used</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-dracula-selection/40 text-dracula-cyan border border-dracula-cyan/15 hover:border-dracula-cyan rounded-full text-xs font-semibold select-none transition-all duration-200 hover:scale-105 cursor-default"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* System Architecture cards list */}
                      <div className="animate-fade-in-up delay-200">
                        <h3 className="text-xs font-bold uppercase text-text-muted tracking-wider mb-3 select-none">Architecture & Design Logic</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.architecture.map((arch, i) => {
                            const colonIndex = arch.indexOf(':');
                            const label = colonIndex !== -1 ? arch.substring(0, colonIndex + 1) : '';
                            const body = colonIndex !== -1 ? arch.substring(colonIndex + 1) : arch;
                            return (
                              <div
                                key={i}
                                className="p-4 bg-activity-bg/25 border border-border-light rounded-lg hover:border-dracula-purple hover:bg-activity-bg/40 transition-all duration-300 hover:-translate-y-1 shadow-sm font-sans"
                              >
                                <div className="text-xs text-text-normal leading-relaxed">
                                  {label && <strong className="text-dracula-pink font-semibold mr-1">{label}</strong>}
                                  {body.trim()}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : activeFile.path.startsWith('certifications/') ? (
                /* B. Certifications Credentials Badges Showcase */
                (() => {
                  const cert = JSON.parse(activeFile.content || '{}');
                  return (
                    <div className="max-w-2xl mx-auto py-8 px-4 animate-scale-in">
                      <div className="bg-activity-bg border border-border-light rounded-xl overflow-hidden shadow-2xl relative font-sans">
                        <div className="h-4 bg-gradient-to-r from-dracula-purple via-dracula-pink to-dracula-cyan" />
                        
                        <div className="p-6 md:p-8">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-dracula-pink bg-dracula-pink/10 px-2 py-0.5 rounded select-none">
                            Verified Credentials
                          </span>
                          
                          <h2 className="text-xl md:text-2xl font-bold text-text-normal mt-4 mb-2">
                            {cert.title}
                          </h2>
                          
                          <div className="flex items-center gap-2 mt-2 mb-6 flex-wrap">
                            <span className="text-xs text-text-muted select-none">Issued by</span>
                            <span className="text-xs font-semibold text-dracula-purple bg-dracula-purple/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 select-none">
                              <span className="text-dracula-green mr-0.5">✓</span> {cert.issuer}
                            </span>
                            <span className="text-xs text-text-muted ml-auto select-none">{cert.issue_date}</span>
                          </div>
                          
                          {/* Core Skills focus */}
                          <div className="border-t border-border-dark pt-6 mb-6">
                            <h4 className="text-xs uppercase font-bold text-text-muted tracking-wider mb-3 select-none">Core Skills Matrix</h4>
                            <ul className="space-y-2.5">
                              {cert.skills_and_focus?.map((skill: string, i: number) => (
                                <li key={i} className="text-xs text-text-normal flex items-start gap-2.5">
                                  <span className="text-dracula-cyan mt-0.5 shrink-0 select-none">◇</span>
                                  <span>{skill}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Interactive Credential ID with Copy transient notify */}
                          {cert.credential_id && (
                            <div className="border-t border-border-dark pt-5 flex items-center justify-between flex-wrap gap-4 select-none">
                              <div>
                                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Credential ID</p>
                                <p className="font-mono text-sm text-dracula-green font-semibold mt-1 select-text">{cert.credential_id}</p>
                              </div>
                              <div className="flex gap-2 relative">
                                <button
                                  onClick={() => handleCopy(cert.credential_id, activeFile.path)}
                                  className="px-4 py-2 bg-dracula-selection text-text-normal hover:bg-dracula-purple hover:text-editor-bg text-xs font-bold rounded-lg transition-colors border border-border-light cursor-pointer shadow flex items-center gap-1.5"
                                >
                                  Copy ID
                                </button>
                                {copiedPath === activeFile.path && (
                                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-dracula-green text-editor-bg text-[10px] font-bold rounded shadow-lg animate-scale-in">
                                    Copied!
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : activeFile.path.startsWith('tech_stack/') ? (
                /* C. Tech Stack Masonry dynamic skill matrix */
                (() => {
                  const tech = JSON.parse(activeFile.content || '{}');
                  return (
                    <div className="p-4 md:p-6 animate-fade-in-up max-w-5xl mx-auto">
                      <div className="mb-6 border-b border-border-dark pb-4">
                        <h1 className="text-xl md:text-2xl font-bold text-dracula-cyan flex items-center gap-2 font-sans">
                          <Code2 size={26} className="text-dracula-cyan shrink-0" />
                          Technical Skills Matrix
                        </h1>
                        <p className="text-xs text-text-muted mt-1 select-none font-mono">tech_stack/{activeFile.name}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(tech).map(([category, skills], i) => {
                          if (!Array.isArray(skills)) return null;
                          
                          // Dynamic style colors for category tags
                          const colors = [
                            { text: 'text-dracula-cyan border-dracula-cyan/15 hover:border-dracula-cyan hover:text-dracula-cyan', badge: 'bg-dracula-cyan/10 text-dracula-cyan' },
                            { text: 'text-dracula-pink border-dracula-pink/15 hover:border-dracula-pink hover:text-dracula-pink', badge: 'bg-dracula-pink/10 text-dracula-pink' },
                            { text: 'text-dracula-green border-dracula-green/15 hover:border-dracula-green hover:text-dracula-green', badge: 'bg-dracula-green/10 text-dracula-green' },
                            { text: 'text-dracula-yellow border-dracula-yellow/15 hover:border-dracula-yellow hover:text-dracula-yellow', badge: 'bg-dracula-yellow/10 text-dracula-yellow' },
                            { text: 'text-dracula-orange border-dracula-orange/15 hover:border-dracula-orange hover:text-dracula-orange', badge: 'bg-dracula-orange/10 text-dracula-orange' },
                            { text: 'text-dracula-purple border-dracula-purple/15 hover:border-dracula-purple hover:text-dracula-purple', badge: 'bg-dracula-purple/10 text-dracula-purple' },
                          ];
                          const color = colors[i % colors.length];

                          return (
                            <div
                              key={category}
                              className="p-5 bg-activity-bg/25 border border-border-light rounded-xl shadow-lg hover:border-border-dark/60 transition-all duration-300 font-sans"
                            >
                              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 border-b border-border-dark pb-2 select-none capitalize flex justify-between items-center">
                                <span className={color.text.split(' ')[0]}>{category.replace(/_/g, ' ')}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${color.badge}`}>
                                  {skills.length} skills
                                </span>
                              </h3>
                              
                              <div className="flex flex-wrap gap-2">
                                {skills.map((skill: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className={`px-3 py-1.5 bg-dracula-selection/30 text-text-normal border border-border-light rounded-lg text-xs font-semibold cursor-default transition-all duration-200 hover:scale-105 hover:border-current hover:text-current ${color.text.split(' ').slice(1).join(' ')}`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Fallback text rendering if file is py or unknown */
                <div className="font-mono text-sm leading-relaxed p-4 h-full bg-editor-bg">
                  <pre className="text-text-normal whitespace-pre-wrap">{activeFile.content}</pre>
                </div>
              )}
            </div>
          )
        ) : (
          /* Landing/Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full text-center p-6 select-none bg-editor-bg">
            <Code2 size={72} className="text-dracula-purple/50 mb-6 animate-pulse animate-pulse" />
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
