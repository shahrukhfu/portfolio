'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Settings, ChevronRight } from 'lucide-react';

interface LogLine {
  text: string;
  type: 'system' | 'input' | 'output' | 'error' | 'loading';
}

const WELCOME_LINES = [
  "==================================================================",
  "WELCOME TO SHAHRUKH FAISAL'S PORTFOLIO TERMINAL v1.0.0",
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

const parseInlineFormatting = (text: string) => {
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="text-text-normal font-bold">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="bg-dracula-selection/55 text-dracula-cyan px-1.5 py-0.5 rounded font-mono text-[11px] border border-border-light/20">
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
};

const renderLine = (line: string, idx: string) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    const content = trimmed.substring(2);
    return (
      <div key={idx} className="flex items-start gap-2 pl-4 py-0.5 whitespace-pre-wrap break-words">
        <span className="text-dracula-purple select-none">•</span>
        <span className="text-dracula-green">{parseInlineFormatting(content)}</span>
      </div>
    );
  }
  const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
  if (numMatch) {
    const num = numMatch[1];
    const content = numMatch[2];
    return (
      <div key={idx} className="flex items-start gap-2 pl-4 py-0.5 whitespace-pre-wrap break-words">
        <span className="text-dracula-purple font-semibold select-none">{num}.</span>
        <span className="text-dracula-green">{parseInlineFormatting(content)}</span>
      </div>
    );
  }
  if (trimmed === '') {
    return <div key={idx} className="h-2" />;
  }
  return (
    <div key={idx} className="text-dracula-green whitespace-pre-wrap break-words leading-relaxed py-0.5">
      {parseInlineFormatting(line)}
    </div>
  );
};

const renderMessageContent = (text: string) => {
  const trimmed = text.trim();
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(trimmed);
      const formatted = JSON.stringify(parsed, null, 2);
      return (
        <pre className="bg-editor-bg border border-border-dark/80 p-3 rounded-md my-2 overflow-x-auto font-mono text-[11px] text-dracula-cyan whitespace-pre-wrap break-words select-text">
          <code>{formatted}</code>
        </pre>
      );
    } catch (e) {
      // Treat as plain text
    }
  }

  const blocks = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-1">
      {blocks.map((block, index) => {
        if (block.startsWith('```') && block.endsWith('```')) {
          const lines = block.split('\n');
          const firstLine = lines[0].slice(3).trim();
          const codeLines = lines.slice(1, -1).join('\n');
          return (
            <pre key={index} className="bg-editor-bg border border-border-dark/80 p-3 rounded-md my-2 overflow-x-auto font-mono text-[11px] text-dracula-cyan whitespace-pre-wrap break-words select-text">
              {firstLine && <div className="text-[9px] text-text-muted uppercase font-bold tracking-wider mb-1 select-none">{firstLine}</div>}
              <code>{codeLines}</code>
            </pre>
          );
        }

        const lines = block.split('\n');
        return (
          <div key={index} className="space-y-0.5">
            {lines.map((line, idx) => renderLine(line, `${index}-${idx}`))}
          </div>
        );
      })}
    </div>
  );
};

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
  const panelRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!panelRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll to bottom on logs or layout resize
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [logs, dimensions]);

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
          { text: `Connection Error: Failed to fetch AI response (${err.message}). Make sure backend server is running on http://localhost:8000.`, type: 'error' },
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
      ref={panelRef}
      style={{ height: height ? `${height}px` : '280px' }}
      className="bg-editor-bg border-t border-border-dark flex flex-col overflow-hidden font-mono text-xs select-none"
    >
      {/* Panel Headers */}
      <div className="flex justify-between items-center bg-activity-bg border-b border-border-dark h-[35px] shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors ${activeTab === 'problems'
                ? 'text-dracula-purple border-b-2 border-dracula-purple'
                : 'text-text-muted'
              }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors ${activeTab === 'output'
                ? 'text-dracula-purple border-b-2 border-dracula-purple'
                : 'text-text-muted'
              }`}
          >
            Output
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors ${activeTab === 'debug'
                ? 'text-dracula-purple border-b-2 border-dracula-purple'
                : 'text-text-muted'
              }`}
          >
            Debug Console
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-2 hover:text-text-normal cursor-pointer transition-colors flex items-center gap-1.5 ${activeTab === 'terminal'
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
                  <div key={idx} className="text-dracula-green whitespace-pre-wrap break-words leading-relaxed py-2 bg-dracula-selection/10 px-3 rounded border border-dracula-selection/20 select-text">
                    {renderMessageContent(log.text)}
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
                  className={`inline-block w-2 h-4 bg-dracula-purple ml-0.5 ${isFocused ? 'animate-caret' : 'opacity-30'
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
