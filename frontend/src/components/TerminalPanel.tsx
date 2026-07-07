'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Settings, ChevronRight } from 'lucide-react';

interface LogLine {
  text: string;
  type: 'system' | 'input' | 'output' | 'error' | 'loading';
}

const WELCOME_LINES = [
  "==================================================================",
  "💻 WELCOME TO SHAHRUKH FAISAL'S PORTFOLIO TERMINAL v1.0.0",
  "==================================================================",
  "Available local commands:",
  "  help  - Display this help documentation",
  "  clear - Clear the terminal session",
  "",
  "Type any questions about Shahrukh to chat with his AI Assistant.",
  "Example: 'Where does Shahrukh study?' or 'Tell me about his coding projects.'",
  "==================================================================",
];

interface TerminalPanelProps {
  height?: number;
}

export default function TerminalPanel({ height }: TerminalPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('terminal');
  const [logs, setLogs] = useState<LogLine[]>(
    WELCOME_LINES.map(line => ({ text: line, type: 'system' }))
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const executeCommand = async (commandText: string) => {
    const trimmed = commandText.trim();
    if (!trimmed) return;

    // Append command to logs
    setLogs((prev) => [...prev, { text: `visitor@guest:~$ ${trimmed}`, type: 'input' }]);

    const cmdLower = trimmed.toLowerCase();

    if (cmdLower === 'clear') {
      setLogs([]);
      setInputValue('');
      return;
    }

    if (cmdLower === 'help') {
      const helpOutputs: LogLine[] = [
        { text: 'Portfolio Terminal Help Docs:', type: 'system' },
        { text: '  help  - Shows this text overview.', type: 'system' },
        { text: '  clear - Wipes the terminal history clean.', type: 'system' },
        { text: '  [any query] - Initiates a query with Shahrukh\'s AI Assistant.', type: 'system' },
        { text: '                Example: "What is his tech stack?"', type: 'system' },
      ];
      setLogs((prev) => [...prev, ...helpOutputs]);
      setInputValue('');
      return;
    }

    // Call Backend Chatbot
    setIsLoading(true);
    setInputValue('');

    // Add loader entry
    setLogs((prev) => [...prev, { text: '[*] Consulting AI Core model... [spinning wheel]', type: 'loading' }]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status code: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove loading line and append response
      setLogs((prev) => {
        const filtered = prev.filter((l) => l.type !== 'loading');
        return [...filtered, { text: data.response, type: 'output' }];
      });
    } catch (err: any) {
      setLogs((prev) => {
        const filtered = prev.filter((l) => l.type !== 'loading');
        return [
          ...filtered,
          { text: `⚠️ Connection Error: Failed to fetch AI response (${err.message}). Make sure backend server is running on http://localhost:8000.`, type: 'error' },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
    }
  };

  return (
    <div
      style={{ height: height ? `${height}px` : '280px' }}
      className="bg-editor-bg border-t border-border-dark flex flex-col overflow-hidden font-mono text-xs select-none"
    >
      {/* Panel Headers */}
      <div className="flex justify-between items-center bg-activity-bg border-b border-border-dark h-[35px] shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors ${
              activeTab === 'problems'
                ? 'text-dracula-purple border-b-2 border-dracula-purple'
                : 'text-text-muted'
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors ${
              activeTab === 'output'
                ? 'text-dracula-purple border-b-2 border-dracula-purple'
                : 'text-text-muted'
            }`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors ${
              activeTab === 'debug'
                ? 'text-dracula-purple border-b-2 border-dracula-purple'
                : 'text-text-muted'
            }`}
          >
            Debug Console
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'text-text-normal border-b-2 border-dracula-purple bg-editor-bg/40 font-semibold'
                : 'text-text-muted'
            }`}
          >
            <Terminal size={12} />
            Terminal
          </button>
        </div>
      </div>

      {/* Terminal View Content */}
      <div
        onClick={handleTerminalClick}
        className="flex-1 overflow-y-auto p-4 cursor-text bg-editor-bg relative select-text"
      >
        {activeTab === 'terminal' ? (
          <div className="space-y-1">
            {logs.map((log, idx) => {
              if (log.type === 'loading') {
                return (
                  <div key={idx} className="text-dracula-cyan animate-pulse flex items-center">
                    <span className="inline-block animate-spin mr-2">⠋</span>
                    Consulting AI core...
                  </div>
                );
              }
              if (log.type === 'input') {
                return (
                  <div key={idx} className="text-text-normal">
                    {log.text}
                  </div>
                );
              }
              if (log.type === 'error') {
                return (
                  <div key={idx} className="text-dracula-red whitespace-pre-wrap">
                    {log.text}
                  </div>
                );
              }
              if (log.type === 'output') {
                return (
                  <div key={idx} className="text-dracula-green whitespace-pre-wrap leading-relaxed py-1 bg-dracula-selection/10 px-2 rounded border border-dracula-selection/20">
                    {log.text}
                  </div>
                );
              }
              return (
                <div key={idx} className="text-text-muted">
                  {log.text}
                </div>
              );
            })}

            {/* Input Row */}
            {!isLoading && (
              <div className="flex items-center text-text-normal pt-1.5">
                <span className="shrink-0 text-dracula-cyan mr-1.5 font-bold">visitor@guest:~$</span>
                <span className="whitespace-pre truncate select-text">{inputValue}</span>
                {/* Blinking Cursor Caret */}
                <span
                  className={`inline-block w-2 h-4 bg-dracula-purple ml-0.5 ${
                    isFocused ? 'animate-caret' : 'opacity-30'
                  }`}
                />
              </div>
            )}

            {/* Hidden Input field */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              disabled={isLoading}
            />

            <div ref={terminalEndRef} />
          </div>
        ) : (
          <div className="text-text-muted flex items-center justify-center h-full">
            No output data. Switch to Terminal tab to chat.
          </div>
        )}
      </div>
    </div>
  );
}
