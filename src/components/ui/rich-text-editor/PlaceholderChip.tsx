'use client';

import { Node, mergeAttributes, type Editor } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

// Custom extension for placeholder chips
export const PlaceholderChip = Node.create({
    name: 'placeholderChip',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            key: {
                default: null,
                parseHTML: (el) => el.getAttribute('data-placeholder-key'),
                renderHTML: (attrs) => ({ 'data-placeholder-key': attrs.key }),
            },
            label: {
                default: null,
                parseHTML: (el) => el.getAttribute('data-placeholder-label') || el.getAttribute('data-placeholder-key'),
                renderHTML: (attrs) => ({ 'data-placeholder-label': attrs.label }),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'span[data-placeholder-key]' }];
    },

    // atom node: renderHTML chi can 1 the don, khong co children
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, {
            class: 'template-chip',
            contenteditable: 'false',
        })];
    },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, deleteNode }) => {
      const attrs = node.attrs as { key: string; label?: string };
      return (
            <NodeViewWrapper style={{ display: 'inline', lineHeight: 'normal' }}>
                <span
                    contentEditable={false}
                    data-placeholder-key={attrs.key}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        background: 'linear-gradient(135deg, #fa8314 0%, #e06b00 100%)',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        verticalAlign: 'middle',
                        userSelect: 'none',
                        cursor: 'default',
                    }}
                >
                    <span>{attrs.label || attrs.key}</span>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); deleteNode(); }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '14px',
                            height: '14px',
                            padding: 0,
                            marginLeft: '2px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.35)',
                            color: '#fff',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '11px',
                            lineHeight: 1,
                            flexShrink: 0,
                        }}
                    >
                        ×
                    </button>
                </span>
            </NodeViewWrapper>
      );
    });
    },
});

export function insertPlaceholder(editor: Editor | null | undefined, key: string, label: string) {
    if (!editor) return;
    editor.chain().focus().insertContent({
        type: 'placeholderChip',
        attrs: { key, label },
    }).run();
}

export function convertPlaceholdersToChips(
    html: string,
    placeholders: Array<{ key: string; label: string }>
): string {
    return html.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
        const found = placeholders.find(p => p.key === key);
        const label = found?.label || key;
        return `<span data-placeholder-key="${key}" data-placeholder-label="${label}"></span>`;
    });
}

export function convertChipsToPlaceholders(html: string): string {
    return html.replace(
        /<span[^>]*data-placeholder-key="([^"]+)"[^>]*>[\s\S]*?<\/span>/gi,
        (_, key) => `{{${key}}}`
    );
}
