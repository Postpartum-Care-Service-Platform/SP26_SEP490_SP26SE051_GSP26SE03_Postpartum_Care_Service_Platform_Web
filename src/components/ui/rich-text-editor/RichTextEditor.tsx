'use client';

import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color, FontFamily } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent, Extension, Node, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Palette,
  Undo,
  Redo,
  Columns2,
  Rows3,
  Trash2,
  Minus,
  Plus,
  Check,
  Pipette,
  Eraser,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { PlaceholderChip } from "./PlaceholderChip";
import styles from "./RichTextEditor.module.css";
import { PlaceholderSuggestion } from "./SuggestionExtension";

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
            renderHTML: (attrs: Record<string, unknown>) =>
              typeof attrs.style === 'string' ? { style: attrs.style } : {},
          },
          class: {
            default: null,
            parseHTML: (el: Element) => el.getAttribute('class') || null,
            renderHTML: (attrs: Record<string, unknown>) =>
              typeof attrs.class === 'string' ? { class: attrs.class } : {},
          },
        },
      },
    ];
  },
});

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: el => el.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attrs => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain, state, dispatch }: any) => {
        const { selection, doc } = state;
        const { $from, $to } = selection;

        // If selection is empty AND the parent node is also empty
        if (selection.empty && $from.parent.content.size === 0) {
          // Apply to block level to resize caret AND set stored mark for typing
          return chain()
            .updateAttributes($from.parent.type.name, { style: `font-size: ${fontSize}` })
            .setMark('textStyle', { fontSize })
            .run();
        }

        // Otherwise (has text or selection), apply as mark
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    } as any;
  },
});

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  editorRef?: React.MutableRefObject<unknown>;
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
  // Sans Serif
  { value: 'Arial', label: 'Arial' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },

  // Serif
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Cambria', label: 'Cambria' },

  // Monospace
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Monaco', label: 'Monaco' },
  // Special
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Lexend Deca', label: 'Lexend Deca' },
];

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px', '96px'
];

const GOOGLE_DOCS_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
  '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130',
];

// Color conversion helpers
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// HSV to RGB conversion for hue slider
const hsvToRgb = (h: number, s: number, v: number) => {
  s /= 100;
  v /= 100;
  let c = v * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = v - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
};

interface CustomColorDialogProps {
  onSelect: (color: string) => void;
  onClose: () => void;
  initialColor?: string;
}

function CustomColorDialog({ onSelect, onClose, initialColor = '#ff0000' }: CustomColorDialogProps) {
  const [hex, setHex] = useState(initialColor);
  const [rgb, setRgb] = useState(hexToRgb(initialColor));
  const [hsv, setHsv] = useState(rgbToHsv(rgb.r, rgb.g, rgb.b));

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value;
    setHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const newRgb = hexToRgb(value);
      setRgb(newRgb);
      setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: string) => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgb, [channel]: num };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    const newRgb = hsvToRgb(hue, hsv.s, hsv.v);
    setHsv({ ...hsv, h: hue });
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleMapSelection = (e: React.MouseEvent | MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect() || 
                 (document.querySelector(`.${styles.colorMainArea}`)?.getBoundingClientRect());
    if (!rect) return;
    
    const x = Math.max(0, Math.min(rect.width, ('clientX' in e ? e.clientX : 0) - rect.left));
    const y = Math.max(0, Math.min(rect.height, ('clientY' in e ? e.clientY : 0) - rect.top));
    
    const s = Math.round((x / rect.width) * 100);
    const v = Math.round(100 - (y / rect.height) * 100);
    
    const newRgb = hsvToRgb(hsv.h, s, v);
    setHsv({ ...hsv, s, v });
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const onMouseDownMap = (e: React.MouseEvent) => {
    handleMapSelection(e);
    const onMouseMove = (moveEvent: MouseEvent) => handleMapSelection(moveEvent);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const openEyeDropper = async () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        const color = result.sRGBHex;
        setHex(color);
        const newRgb = hexToRgb(color);
        setRgb(newRgb);
        setHsv(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
      } catch (e) {
        console.log('EyeDropper cancelled');
      }
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng lấy màu này.');
    }
  };

  const content = (
    <div className={styles.customColorOverlay} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <div className={styles.customColorDialog} onMouseDown={(e) => e.stopPropagation()}>
        <div 
          className={styles.colorMainArea} 
          style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
          onMouseDown={onMouseDownMap}
        >
          <div className={styles.colorWhiteOverlay} />
          <div className={styles.colorBlackOverlay} />
          <div className={styles.colorPickerMarker} style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%` }} />
        </div>
        
        <div className={styles.colorControlsRow}>
          <div className={styles.activeColorCircle} style={{ backgroundColor: hex }} />
          <button type="button" className={styles.eyedropperBtn} onClick={openEyeDropper}>
            <Pipette size={18} />
          </button>
          <div className={styles.hueSliderWrapper}>
            <input 
              type="range" 
              className={styles.hueSlider} 
              min="0" 
              max="360" 
              value={hsv.h} 
              onChange={handleHueChange} 
            />
          </div>
        </div>

        <div className={styles.colorInputsRow}>
          <div className={styles.inputGroup}>
            <label>Hệ lục phân</label>
            <div className={styles.hexInputWrapper}>
              <input type="text" value={hex} onChange={handleHexChange} />
            </div>
          </div>
          <div className={styles.rgbLabelsRow}>
            <div className={styles.inputGroup}>
              <label>R</label>
              <input type="number" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>G</label>
              <input type="number" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>B</label>
              <input type="number" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} />
            </div>
          </div>
        </div>

        <div className={styles.dialogActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Hủy</button>
          <button type="button" className={styles.confirmBtn} onClick={() => { onSelect(hex); onClose(); }}>Ok</button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

interface ColorPickerProps {
  onSelect: (color: string) => void;
  onClose: () => void;
  title?: string;
  initialColor?: string;
}

function ColorPicker({ onSelect, onClose, title = 'CHỌN MÀU', initialColor }: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  const handleNone = () => {
    onSelect(''); // Send empty string for 'reset/none'
    onClose();
  };

  const openEyeDropper = async () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onSelect(result.sRGBHex);
        onClose();
      } catch (e) {
        console.log('EyeDropper cancelled');
      }
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng lấy màu này.');
    }
  };

  return (
    <>
      <div className={styles.colorPickerPopover}>
        <button 
          type="button" 
          className={styles.noneColorBtn}
          onMouseDown={(e) => {
            e.preventDefault();
            handleNone();
          }}
        >
          <Eraser size={16} />
          <span>Không</span>
        </button>
        <div className={styles.colorPickerGrid}>
          {GOOGLE_DOCS_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={styles.colorSwatch}
              style={{ backgroundColor: color }}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(color);
                onClose();
              }}
            />
          ))}
        </div>
        <div className={styles.colorPickerFooter}>
          <div className={styles.customLabel}>{title}</div>
          <div className={styles.footerActions}>
            <button 
              type="button" 
              className={styles.footerActionBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                setShowCustom(true);
              }}
            >
              <Plus size={16} />
            </button>
            <button 
              type="button" 
              className={styles.footerActionBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                openEyeDropper();
              }}
            >
              <Pipette size={16} />
            </button>
          </div>
        </div>
      </div>
      {showCustom && (
        <CustomColorDialog 
          onSelect={onSelect} 
          onClose={() => {
            setShowCustom(false);
            onClose();
          }} 
          initialColor={initialColor}
        />
      )}
    </>
  );
}

const ToolbarTooltip = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className={styles.tooltipWrapper}>
    {children}
    <span className={styles.tooltip}>{title}</span>
  </div>
);

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function Btn({ onClick, active, title, disabled, children }: ToolbarButtonProps) {
  return (
    <ToolbarTooltip title={title || ''}>
      <button
        type="button"
        className={`${styles.toolbarBtn} ${active ? styles.active : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
        disabled={disabled}
      >
        {children}
      </button>
    </ToolbarTooltip>
  );
}

// Extract body content tu full HTML document
function extractBodyContent(html: string): string {
  if (!html) return '';
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();
  return html;
}

// ── Font Picker ────────────────────────────────────────────────────────────────
interface FontPickerProps {
  currentFont: string;
  onSelect: (font: string) => void;
}

function FontPicker({ currentFont, onSelect }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentFonts, setRecentFonts] = useState<string[]>(['Arial', 'Times New Roman']);

  const handleSelect = (font: string) => {
    onSelect(font);
    setRecentFonts(prev => [font, ...prev.filter(f => f !== font)].slice(0, 5));
    setIsOpen(false);
  };

  return (
    <div className={styles.fontPickerWrapper}>
      <ToolbarTooltip title="Phông chữ">
        <button
          type="button"
          className={styles.fontPickerToggle}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span style={{ fontFamily: currentFont }}>{currentFont}</span>
          <ChevronDownIcon size={14} />
        </button>
      </ToolbarTooltip>

      {isOpen && (
        <>
          <div className={styles.fontDropdownOverlay} onClick={() => setIsOpen(false)} />
          <div className={styles.fontDropdown}>
            <div className={styles.fontDropdownScroll}>
              {recentFonts.length > 0 && (
                <div className={styles.fontSection}>
                  <div className={styles.fontSectionTitle}>GẦN ĐÂY</div>
                  {recentFonts.map(font => (
                    <button
                      key={`recent-${font}`}
                      type="button"
                      className={styles.fontOption}
                      onClick={() => handleSelect(font)}
                    >
                      <div className={styles.fontOptionCheck}>
                        {currentFont === font && <Check size={14} />}
                      </div>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </button>
                  ))}
                  <div className={styles.fontDivider} />
                </div>
              )}
              <div className={styles.fontSection}>
                {FONTS.map(f => (
                  <button
                    key={f.value}
                    type="button"
                    className={styles.fontOption}
                    onClick={() => handleSelect(f.value)}
                  >
                    <div className={styles.fontOptionCheck}>
                      {currentFont === f.value && <Check size={14} />}
                    </div>
                    <span style={{ fontFamily: f.value }}>{f.label}</span>
                    {['Lora', 'Roboto', 'Montserrat', 'Playfair Display'].includes(f.value) && (
                      <ChevronRightIcon size={12} className={styles.fontOptionArrow} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const HEADING_OPTIONS = [
  { label: 'Văn bản thường', value: 'p', style: { fontSize: '14px' } },
  { label: 'Tiêu đề', value: 'h1', style: { fontSize: '24px', fontWeight: '700' } },
  { label: 'Tiêu đề 1', value: 'h2', style: { fontSize: '22px', fontWeight: '700' } },
  { label: 'Tiêu đề 2', value: 'h3', style: { fontSize: '18px', fontWeight: '700' } },
  { label: 'Tiêu đề 3', value: 'h4', style: { fontSize: '16px', fontWeight: '700' } },
];

function HeadingPicker({ currentValue, onSelect }: { currentValue: string, onSelect: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLabel = HEADING_OPTIONS.find(o => o.value === currentValue)?.label || 'Văn bản thường';

  return (
    <div className={styles.fontPickerWrapper}>
      <ToolbarTooltip title="Kiểu văn bản">
        <button
          type="button"
          className={styles.fontPickerToggle}
          onMouseDown={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        >
          <span className={styles.currentFontLabel} style={{ width: '100px' }}>{currentLabel}</span>
          <ChevronDownIcon size={14} />
        </button>
      </ToolbarTooltip>

      {isOpen && (
        <>
          <div className={styles.fontDropdownOverlay} onMouseDown={() => setIsOpen(false)} />
          <div className={styles.fontDropdown} style={{ width: '220px' }}>
            {HEADING_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={styles.fontOption}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(opt.value);
                  setIsOpen(false);
                }}
              >
                <div className={styles.fontOptionCheck}>
                  {currentValue === opt.value && <Check size={14} />}
                </div>
                <span style={opt.style}>{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Nhap noi dung...',
  editable = true,
  editorRef,
  placeholders = [],
  onPlaceholderSelect,
}: RichTextEditorProps) {
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceholderSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ top: 0, left: 0 });
  
  // Ruler margin states
  const [leftMargin, setLeftMargin] = useState(45);
  const [rightMargin, setRightMargin] = useState(45);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      window.rulerElement = node;
    }
  }, []);

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingLeft && !isDraggingRight) return;
      const ruler = window.rulerElement;
      if (!ruler) return;

      const rect = ruler.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      if (isDraggingLeft) {
        // Limit range within ruler width
        const newVal = Math.max(0, Math.min(x, 850 - rightMargin - 50));
        setLeftMargin(newVal);
      } else if (isDraggingRight) {
        const newVal = Math.max(0, Math.min(850 - x, 850 - leftMargin - 50));
        setRightMargin(newVal);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, leftMargin, rightMargin]);

  const editorContent = extractBodyContent(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
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
      FontSize,
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
        editor.commands.setContent(incoming);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [content, editor]);

  // Detect {{ and show suggestions
  useEffect(() => {
    if (!editor || !placeholders.length) return;

    const handleUpdate = () => {
      const { $from } = editor.state.selection;
      const parentText = $from.parent.textContent ?? '';
      const textBefore = parentText.slice(0, $from.parentOffset);
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

  const [, setUpdateTrigger] = useState(0);

  // Force re-render on each transaction to update UI controls (font size, active marks, etc.)
  useEffect(() => {
    if (!editor) return;
    const handleTransaction = () => {
      setUpdateTrigger(prev => prev + 1);
    };
    editor.on('transaction', handleTransaction);
    return () => {
      editor.off('transaction', handleTransaction);
    };
  }, [editor]);

  // Handle suggestion selection
  const selectSuggestion = (key: string, label: string) => {
    if (!editor) return;

    const { $from } = editor.state.selection;
    const parentText = $from.parent.textContent ?? '';
    const textBefore = parentText.slice(0, $from.parentOffset);
    const match = textBefore.match(/\{\{([a-zA-Z0-9_]*)$/);

    if (match) {
      const deleteCount = match[0].length;
      editor.chain().focus().deleteRange({
        from: editor.state.selection.from - deleteCount,
        to: editor.state.selection.from,
      }).run();
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'placeholderChip',
        attrs: { key, label },
      })
      .run();

    setShowSuggestions(false);
    onPlaceholderSelect?.(key, label);
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

  if (!editor) return null;

  const currentHeading = editor.isActive('heading', { level: 1 }) ? 'h1'
    : editor.isActive('heading', { level: 2 }) ? 'h2'
      : editor.isActive('heading', { level: 3 }) ? 'h3'
        : editor.isActive('heading', { level: 4 }) ? 'h4' : 'p';

  const currentFontSize = editor.getAttributes('textStyle').fontSize || '14px';
  const fontSizeValue = parseInt(currentFontSize);


  const updateFontSize = (newSize: number) => {
    if (newSize < 8) newSize = 8;
    if (newSize > 96) newSize = 96;

    // Crucial fix: focus without scrolling into view
    editor.commands.focus(null, { scrollIntoView: false });
    editor.chain().setFontSize(`${newSize}px`).run();
    setShowFontSizeDropdown(false);
  };

  const incrementFontSize = (e: React.MouseEvent) => {
    e.preventDefault();
    updateFontSize(fontSizeValue + 1);
  };
  const decrementFontSize = (e: React.MouseEvent) => {
    e.preventDefault();
    updateFontSize(fontSizeValue - 1);
  };

  const currentFont = editor.getAttributes('textStyle').fontFamily || 'Arial';

  // Helper to apply marks with caret fix for empty paragraphs
  const applyMarkWithCaretFix = (attribute: string, value: string) => {
    if (!editor) return;
    const { selection } = editor.state;
    const { $from } = selection;

    if (selection.empty && $from.parent.content.size === 0) {
      const currentStyle = $from.parent.attrs.style || '';
      const cssProp = attribute === 'fontFamily' ? 'font-family' : 
                     attribute === 'color' ? 'color' : 
                     attribute === 'fontSize' ? 'font-size' : '';
      
      let newStyle = currentStyle;
      if (cssProp) {
        newStyle = currentStyle.replace(new RegExp(`${cssProp}:[^;]+;?`, 'g'), '').trim();
        newStyle += (newStyle && !newStyle.endsWith(';') ? ';' : '') + ` ${cssProp}: ${value};`;
      }

      editor.chain()
        .focus()
        .updateAttributes($from.parent.type.name, { style: newStyle })
        .setMark('textStyle', { [attribute]: value })
        .run();
    } else {
      if (attribute === 'fontFamily') editor.chain().focus().setFontFamily(value).run();
      else if (attribute === 'color') {
        if (value === '') editor.chain().focus().unsetColor().run();
        else editor.chain().focus().setColor(value).run();
      }
      else if (attribute === 'fontSize') editor.chain().focus().setFontSize(value).run();
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <FontPicker
            currentFont={currentFont}
            onSelect={(font: string) => applyMarkWithCaretFix('fontFamily', font)}
          />
          {/* Font Size Selector - Google Docs style - [size] + */}
          <div className={styles.fontSizeControls}>
            <ToolbarTooltip title="Giảm kích thước chữ">
              <button
                className={styles.fontSizeBtn}
                onMouseDown={decrementFontSize}
              >
                <Minus size={14} />
              </button>
            </ToolbarTooltip>
            <div className={styles.fontSizeValueWrapper}>
              <ToolbarTooltip title="Chọn kích thước chữ">
                <button
                  type="button"
                  className={styles.fontSizeValue}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowFontSizeDropdown(!showFontSizeDropdown);
                  }}
                >
                  {fontSizeValue}
                </button>
              </ToolbarTooltip>

              {showFontSizeDropdown && (
                <>
                  <div className={styles.fontDropdownOverlay} onClick={() => setShowFontSizeDropdown(false)} />
                  <div className={styles.fontSizeDropdown}>
                    <div className={styles.fontSizeDropdownScroll}>
                      {FONT_SIZES.map((size) => {
                        const val = parseInt(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            className={`${styles.fontSizeOption} ${fontSizeValue === val ? styles.fontSizeOptionActive : ''}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              updateFontSize(val);
                            }}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
            <ToolbarTooltip title="Tăng kích thước chữ">
              <button
                className={styles.fontSizeBtn}
                onMouseDown={incrementFontSize}
              >
                <Plus size={14} />
              </button>
            </ToolbarTooltip>
          </div>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <HeadingPicker
            currentValue={currentHeading}
            onSelect={(v) => {
              if (v === 'p') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().setHeading({ level: parseInt(v[1]) as 1 | 2 | 3 | 4 }).run();
            }}
          />
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="In đậm"><Bold size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="In nghiêng"><Italic size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gạch chân"><UnderlineIcon size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Gạch ngang"><Strikethrough size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          {/* Text Color */}
          <div className={styles.pickerContainer}>
            <Btn
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              active={showColorPicker}
              title="Màu chữ"
            >
              <div className={styles.colorBtnContent}>
                <Palette size={18} />
                <div 
                  className={styles.colorIndicator} 
                  style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }} 
                />
              </div>
            </Btn>
            {showColorPicker && (
              <>
                <div className={styles.pickerOverlay} onClick={() => setShowColorPicker(false)} />
                <ColorPicker
                  onSelect={(color) => applyMarkWithCaretFix('color', color)}
                  onClose={() => setShowColorPicker(false)}
                  initialColor={editor.getAttributes('textStyle').color || '#000000'}
                />
              </>
            )}
          </div>

          {/* Highlight Color */}
          <div className={styles.pickerContainer}>
            <Btn
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              active={showHighlightPicker}
              title="Màu nền"
            >
              <div className={styles.colorBtnContent}>
                <Highlighter size={18} />
                <div 
                  className={styles.colorIndicator} 
                  style={{ backgroundColor: editor.getAttributes('highlight').color || '#ffff00' }} 
                />
              </div>
            </Btn>
            {showHighlightPicker && (
              <>
                <div className={styles.pickerOverlay} onClick={() => setShowHighlightPicker(false)} />
                <ColorPicker
                  onSelect={(color) => {
                    if (color === '') editor.chain().focus().unsetHighlight().run();
                    else editor.chain().focus().setHighlight({ color }).run();
                  }}
                  onClose={() => setShowHighlightPicker(false)}
                  title="MÀU NỀN"
                  initialColor={editor.getAttributes('highlight').color || '#ffff00'}
                />
              </>
            )}
          </div>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Căn trái"><AlignLeft size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Căn giữa"><AlignCenter size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Căn phải"><AlignRight size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Căn đều"><AlignJustify size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Danh sách dấu chấm"><List size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Danh sách số"><ListOrdered size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang"><Minus size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Chèn bảng"><TableIcon size={15} /></Btn>
          {editor.isActive('table') && <>
            <Btn onClick={() => editor.chain().focus().addRowAfter().run()} title="Thêm dòng"><Rows3 size={15} /></Btn>
            <Btn onClick={() => editor.chain().focus().deleteTable().run()} title="Xóa bảng"><Trash2 size={15} /></Btn>
          </>}
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <div className={styles.colorDropdown}>
            <Btn onClick={() => setShowLinkInput(v => !v)} active={editor.isActive('link')} title="Chèn liên kết"><LinkIcon size={15} /></Btn>
            {showLinkInput && (
              <div className={styles.linkInput}>
                <input type="url" placeholder="Nhập URL..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSetLink()} autoFocus />
                <button type="button" onClick={handleSetLink}>Thêm</button>
              </div>
            )}
          </div>
          <Btn onClick={() => { const url = window.prompt('URL hình ảnh:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }} title="Chèn hình ảnh"><ImageIcon size={15} /></Btn>
        </div>
        <div className={styles.toolbarDivider} />
        <div className={styles.toolbarGroup}>
          <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác"><Undo size={15} /></Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại"><Redo size={15} /></Btn>
        </div>
      </div>
      <div className={styles.rulerContainer}>
        <div className={styles.rulerContent} ref={rulerRef}>
          <div 
            className={styles.leftMarginMarker} 
            data-dragging={isDraggingLeft}
            style={{ left: `${leftMargin}px` }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingLeft(true);
            }}
          />
          <div className={styles.rulerScale}>
            {/* Generate ticks and numbers */}
            {Array.from({ length: 19 }).map((_, i) => (
              <div key={i} className={styles.rulerUnit}>
                <span className={styles.rulerNumber}>{i + 1}</span>
                <div className={styles.rulerSubTicks}>
                  <div className={styles.tick} />
                  <div className={styles.tick} />
                  <div className={styles.tick} />
                  <div className={styles.tick} />
                </div>
              </div>
            ))}
          </div>
          <div 
            className={styles.rightMarginMarker} 
            data-dragging={isDraggingRight}
            style={{ right: `${rightMargin}px` }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDraggingRight(true);
            }}
          />
        </div>
      </div>
      <div className={styles.workspace}>
        <div className={styles.page}>
          <EditorContent editor={editor} className={styles.richEditor} />

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
    </div>
  );
}
