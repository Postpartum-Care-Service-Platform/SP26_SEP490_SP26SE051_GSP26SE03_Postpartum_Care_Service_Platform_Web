'use client';

import { useEditor, EditorContent, Extension, Node, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { TextStyle, Color, FontFamily } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Table as TableIcon, Link as LinkIcon, Image as ImageIcon,
  Highlighter, Palette, Undo, Redo, Columns2, Rows3, Trash2, Minus,
} from 'lucide-react';
import styles from './RichTextEditor.module.css';
import { PlaceholderChip } from './PlaceholderChip';
import { PlaceholderSuggestion } from './SuggestionExtension';

// Node extension cho <div> - preserve style/class
const Div = Node.create({
  name: 'div',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      style: { default: null, parseHTML: (el) => el.getAttribute('style'), renderHTML: (a) => a.style ? { style: a.style } : {} },
      class: { default: null, parseHTML: (el) => el.getAttribute('class'), renderHTML: (a) => a.class ? { class: a.class } : {} },
    };
  },
  parseHTML() { return [{ tag: 'div' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes), 0]; },
});

// Extension preserve style/class tren cac node co san
const PreserveStyles = Extension.create({
  name: 'preserveStyles',
  addGlobalAttributes() {
    return [
      {
        types: [
          'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem',
          'blockquote', 'codeBlock', 'table', 'tableRow', 'tableCell', 'tableHeader',
          'image',
        ],
        attributes: {
          style: {
            default: null,
            parseHTML: (el: Element) => el.getAttribute('style') || null,
            renderHTML: (attrs: Record<string, any>) => attrs.style ? { style: attrs.style } : {},
          },
          class: {
            default: null,
            parseHTML: (el: Element) => el.getAttribute('class') || null,
            renderHTML: (attrs: Record<string, any>) => attrs.class ? { class: attrs.class } : {},
          },
        },
      },
    ];
  },
});

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  editorRef?: React.MutableRefObject<any>;
  placeholders?: PlaceholderSuggestion[];
  onPlaceholderSelect?: (key: string, label: string) => void;
}

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF4500', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF',
  '#0000FF', '#9900FF', '#FF00FF', '#FF69B4',
  '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#CFE2F3', '#D9D2E9',
];

const HIGHLIGHT_COLORS = [
  '#FFFF00', '#FF9900', '#FF6B6B', '#90EE90', '#87CEEB', '#DDA0DD',
  '#FFB6C1', '#98FB98', '#F0E68C', '#E6E6FA', '#FFDAB9', '#B0E0E6',
];

const FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Lexend Deca', label: 'Lexend Deca' },
];

// Extract body content tu full HTML document
function extractBodyContent(html: string): string {
  if (!html) return '';
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  return html;
}

export default function RichTextEditor({ content = '', onChange, placeholder = 'Nhap noi dung...', editable = true, editorRef, placeholders = [], onPlaceholderSelect }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceholderSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });

  const editorContent = extractBodyContent(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph', 'div'] }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Div,
      PreserveStyles,
      PlaceholderChip,
    ],
    content: editorContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class: styles.proseMirror,
        'data-placeholder': placeholder,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = extractBodyContent(content);
    // setTimeout tranh flushSync conflict voi React render cycle
    const t = setTimeout(() => {
      if (!editor.isDestroyed && incoming !== editor.getHTML()) {
        editor.commands.setContent(incoming, false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [content]);

  // Detect {{ and show suggestions
  useEffect(() => {
    if (!editor || !placeholders.length) return;

    const handleUpdate = () => {
      const textBefore = editor.state.selection.$from.parent.textContent.slice(0, editor.state.selection.$from.parent.offset);
      const match = textBefore.match(/\{\{([a-zA-Z0-9_]*)$/);

      if (match) {
        const searchText = match[1];
        const filtered = placeholders.filter(p =>
          p.key.toLowerCase().includes(searchText.toLowerCase()) ||
          p.label.toLowerCase().includes(searchText.toLowerCase())
        ).slice(0, 8);

        // Calculate cursor position for dropdown
        const { from } = editor.state.selection;
        const coords = editor.view.coordsAtPos(from);
        const editorDom = editor.view.dom as HTMLElement;
        const editorRect = editorDom.getBoundingClientRect();

        // Get scroll position
        const scrollTop = editorDom.scrollTop || 0;
        const scrollLeft = editorDom.scrollLeft || 0;

        setCursorPos({
          top: coords.top - editorRect.top + scrollTop + 20,
          left: coords.left - editorRect.left + scrollLeft,
        });

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
      }
    };

    editor.on('update', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor, placeholders]);

  // Handle suggestion selection
  const selectSuggestion = (key: string, label: string) => {
    if (!editor) return;

    const textBefore = editor.state.selection.$from.parent.textContent.slice(0, editor.state.selection.$from.parent.offset);
    const match = textBefore.match(/\{\{([a-zA-Z0-9_]*)$/);

    if (match) {
      const deleteCount = match[0].length;
      editor.chain().focus().deleteRange({
        from: editor.state.selection.from - deleteCount,
        to: editor.state.selection.from,
      }).run();
    }

    editor.chain().focus().insertContent({
      type: 'placeholderChip',
      attrs: { key, label },
    }).run();

    setShowSuggestions(false);
  };

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  const handleSetLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const Btn = ({ onClick, active, title, disabled, children }: any) => (
    <button
      type="button"
      className={`${styles.toolbarBtn} ${active ? styles.active : ''}`}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );

  const ColorPicker = ({ colors, onSelect, onClose }: { colors: string[]; onSelect: (c: string) => void; onClose: () => void }) => (
    <div className={styles.colorPicker}>
      <div className={styles.colorPickerHeader}>
        <span>Chon mau</span>
        <button type="button" onClick={onClose}>x</button>
      </div>
      <div className={styles.colorGrid}>
        {colors.map((color, i) => (
          <button key={i} type="button" className={styles.colorSwatch}
            style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #ddd' : 'none' }}
            onClick={() => { onSelect(color); onClose(); }}
          />
        ))}
      </div>
    </div>
  );

  if (!editor) return null;

  const currentHeading = editor.isActive('heading', { level: 1 }) ? 'h1'
    : editor.isActive('heading', { level: 2 }) ? 'h2'
      : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p';

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <select className={styles.fontSelect} onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} defaultValue="Arial">
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <select className={styles.headingSelect} value={currentHeading}
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'p') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().setHeading({ level: parseInt(v[1]) as 1 | 2 | 3 }).run();
            }}>
            <option value="p">Doan van</option>
            <option value="h1">Tieu de 1</option>
            <option value="h2">Tieu de 2</option>
            <option value="h3">Tieu de 3</option>
          </select>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="In dam"><Bold size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="In nghieng"><Italic size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gach chan"><UnderlineIcon size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Gach ngang"><Strikethrough size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <div className={styles.colorDropdown}>
            <Btn onClick={() => { setShowColorPicker(v => !v); setShowHighlightPicker(false); }} title="Mau chu"><Palette size={15} /></Btn>
            {showColorPicker && <ColorPicker colors={TEXT_COLORS} onSelect={(c) => editor.chain().focus().setColor(c).run()} onClose={() => setShowColorPicker(false)} />}
          </div>
          <div className={styles.colorDropdown}>
            <Btn onClick={() => { setShowHighlightPicker(v => !v); setShowColorPicker(false); }} title="To mau nen"><Highlighter size={15} /></Btn>
            {showHighlightPicker && <ColorPicker colors={HIGHLIGHT_COLORS} onSelect={(c) => editor.chain().focus().toggleHighlight({ color: c }).run()} onClose={() => setShowHighlightPicker(false)} />}
          </div>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Can trai"><AlignLeft size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Can giua"><AlignCenter size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Can phai"><AlignRight size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Can deu"><AlignJustify size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Danh sach"><List size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Danh sach so"><ListOrdered size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Duong ke ngang"><Minus size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Chen bang"><TableIcon size={15} /></Btn>
          {editor.isActive('table') && <>
            <Btn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Them cot"><Columns2 size={15} /></Btn>
            <Btn onClick={() => editor.chain().focus().addRowAfter().run()} title="Them dong"><Rows3 size={15} /></Btn>
            <Btn onClick={() => editor.chain().focus().deleteTable().run()} title="Xoa bang"><Trash2 size={15} /></Btn>
          </>}
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <div className={styles.colorDropdown}>
            <Btn onClick={() => setShowLinkInput(v => !v)} active={editor.isActive('link')} title="Chen lien ket"><LinkIcon size={15} /></Btn>
            {showLinkInput && (
              <div className={styles.linkInput}>
                <input type="url" placeholder="Nhap URL..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSetLink()} autoFocus />
                <button type="button" onClick={handleSetLink}>Them</button>
              </div>
            )}
          </div>
          <Btn onClick={() => { const url = window.prompt('URL hinh anh:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }} title="Chen hinh anh"><ImageIcon size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoan tac"><Undo size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Lam lai"><Redo size={15} /></Btn>
        </div>
      </div>
      <div className={styles.editorContent}>
        <EditorContent editor={editor} />

        {/* Placeholder Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: cursorPos.top,
            left: cursorPos.left,
            zIndex: 1000,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '7px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxHeight: '180px',
            overflow: 'auto',
            minWidth: '180px',
          }}>
            <div style={{ padding: '6px 10px', fontSize: '11px', color: '#888', borderBottom: '1px solid #eee' }}>
              Chọn trường dữ liệu
            </div>
            {suggestions.map((item, idx) => (
              <button
                key={item.key}
                type="button"
                onClick={() => selectSuggestion(item.key, item.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '6px 10px',
                  border: 'none',
                  background: idx === suggestionIndex ? 'rgba(250, 131, 20, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  background: 'linear-gradient(135deg, #fa8314 0%, #e06b00 100%)',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  marginRight: '8px',
                }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '10px', color: '#666' }}>{item.key}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
