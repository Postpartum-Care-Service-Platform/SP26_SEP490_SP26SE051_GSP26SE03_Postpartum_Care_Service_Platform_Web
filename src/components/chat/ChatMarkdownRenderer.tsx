'use client';

import React from 'react';

type MarkdownTableData = {
    headers: string[];
    rows: string[][];
};

// Parse markdown table từ text
function parseMarkdownTable(text: string): MarkdownTableData | null {
    const lines = text.split('\n').filter((line) => line.trim().startsWith('|'));
    if (lines.length < 2) return null;

    const parseRow = (line: string): string[] => {
        return line
            .split('|')
            .map((cell) => cell.trim())
            .filter((cell) => cell && !cell.match(/^[-:]+$/));
    };

    const headers = parseRow(lines[0]);
    if (headers.length === 0) return null;

    // Skip separator line (|---|---|)
    const dataLines = lines.filter((line) => !line.match(/^\|[\s-:|]+\|$/));
    const rows = dataLines.slice(1).map(parseRow).filter((row) => row.length > 0);

    return { headers, rows };
}

// Render một bảng từ markdown
function MarkdownTable({ data }: { data: MarkdownTableData }) {
    return (
        <div className="chat-md-table-wrapper">
            <table className="chat-md-table">
                <thead>
                    <tr>
                        {data.headers.map((header, i) => (
                            <th key={i}>{cleanMarkdownText(header)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>{cleanMarkdownText(cell)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Clean markdown formatting (bold, italic, etc.)
function cleanMarkdownText(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic *text*
        .replace(/__([^_]+)__/g, '$1') // Remove bold __text__
        .replace(/_([^_]+)_/g, '$1') // Remove italic _text_
        .trim();
}

// Loại bỏ tool calls từ content (tool_start...tool_end)
function removeToolCalls(content: string): string {
    // Remove tool_start...tool_end blocks
    let cleaned = content.replace(/tool_start[\s\S]*?tool_end/g, '');
    // Remove standalone tool markers
    cleaned = cleaned.replace(/^tool_start\s*$/gm, '');
    cleaned = cleaned.replace(/^tool_end\s*$/gm, '');
    // Remove JSON-like tool call lines
    cleaned = cleaned.replace(/^\s*\{"name":\s*"[^"]+",\s*"arguments":[^}]+\}\s*$/gm, '');
    // Clean up multiple empty lines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    return cleaned.trim();
}

// Parse và render markdown content
export function ChatMarkdownRenderer({ content }: { content: string }) {
    // Loại bỏ tool calls trước khi render
    const cleanedContent = removeToolCalls(content);

    if (!cleanedContent) {
        return <span className="chat-md-text">Đang xử lý...</span>;
    }

    const parts: React.ReactNode[] = [];
    let currentText = '';
    let partIndex = 0;

    const lines = cleanedContent.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Check if this is start of a table
        if (line.trim().startsWith('|')) {
            // Flush current text
            if (currentText.trim()) {
                parts.push(
                    <span key={partIndex++} className="chat-md-text">
                        {renderTextWithFormatting(currentText)}
                    </span>
                );
                currentText = '';
            }

            // Collect all table lines
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }

            const tableData = parseMarkdownTable(tableLines.join('\n'));
            if (tableData) {
                parts.push(<MarkdownTable key={partIndex++} data={tableData} />);
            } else {
                // Fallback: render as text
                currentText += tableLines.join('\n') + '\n';
            }
        } else {
            currentText += line + '\n';
            i++;
        }
    }

    // Flush remaining text
    if (currentText.trim()) {
        parts.push(
            <span key={partIndex++} className="chat-md-text">
                {renderTextWithFormatting(currentText)}
            </span>
        );
    }

    return <div className="chat-md-content">{parts}</div>;
}

// Render text với basic formatting (headers, bold, lists)
function renderTextWithFormatting(text: string): React.ReactNode[] {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];

    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
            result.push(<br key={`br-${i}`} />);
            return;
        }

        // Headers
        if (trimmed.startsWith('### ')) {
            result.push(
                <strong key={i} className="chat-md-h3">
                    {cleanMarkdownText(trimmed.slice(4))}
                </strong>
            );
            result.push(<br key={`br-${i}`} />);
            return;
        }
        if (trimmed.startsWith('## ')) {
            result.push(
                <strong key={i} className="chat-md-h2">
                    {cleanMarkdownText(trimmed.slice(3))}
                </strong>
            );
            result.push(<br key={`br-${i}`} />);
            return;
        }

        // List items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            result.push(
                <span key={i} className="chat-md-list-item">
                    • {cleanMarkdownText(trimmed.slice(2))}
                </span>
            );
            result.push(<br key={`br-${i}`} />);
            return;
        }

        // Regular text with inline formatting
        result.push(
            <span key={i}>
                {renderInlineFormatting(trimmed)}
            </span>
        );
        if (i < lines.length - 1) {
            result.push(<br key={`br-${i}`} />);
        }
    });

    return result;
}

// Render inline formatting (bold, italic)
function renderInlineFormatting(text: string): React.ReactNode {
    // Simple approach: just clean the markdown
    return cleanMarkdownText(text);
}
