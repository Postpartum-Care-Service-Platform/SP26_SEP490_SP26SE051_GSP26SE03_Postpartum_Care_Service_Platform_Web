'use client';

import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface PlaceholderSuggestion {
  key: string;
  label: string;
  table?: string;
}

export const createSuggestionExtension = (placeholders: PlaceholderSuggestion[], onSelect: (key: string, label: string) => void) => {
  return Extension.create({
    name: 'placeholderSuggestion',

    addOptions() {
      return {
        placeholders: [],
        onSelect: () => {},
      };
    },

    addProseMirrorPlugins() {
      const { placeholders, onSelect } = this.options;

      return [
        new Plugin({
          key: new PluginKey('placeholderSuggestion'),
          view: () => ({
            update: (view) => {
              const { state } = view;
              const { selection } = state;
              const { $from } = selection;
              const textBefore = $from.parent.textContent.slice(0, $from.parent.offset);

              // Check if user typed {{
              const match = textBefore.match(/\{\{([a-zA-Z0-9_]*)$/);
              
              if (match) {
                const searchText = match[1];
                // Dispatch event to show suggestion
                window.dispatchEvent(new CustomEvent('tiptap-suggestion', {
                  detail: { searchText, placeholders, onSelect, view }
                }));
              }
            },
          }),
        }),
      ];
    },
  });
};

// Simple placeholder autocomplete using keyboard events
export const PlaceholderAutoComplete = (placeholders: PlaceholderSuggestion[], onInsert: (key: string, label: string) => void) => {
  let currentIndex = -1;
  let isOpen = false;
  let searchText = '';

  const filterPlaceholders = (query: string) => {
    if (!query) return placeholders.slice(0, 10);
    const q = query.toLowerCase();
    return placeholders.filter(p => 
      p.key.toLowerCase().includes(q) || 
      p.label.toLowerCase().includes(q)
    ).slice(0, 10);
  };

  return Extension.create({
    name: 'placeholderAutoComplete',

    addOptions() {
      return {
        placeholders: [],
        onInsert: () => {},
      };
    },

    addKeyboardShortcuts() {
      return {
        Enter: () => {
          if (isOpen && currentIndex >= 0) {
            const filtered = filterPlaceholders(searchText);
            if (filtered[currentIndex]) {
              const item = filtered[currentIndex];
              this.options.onInsert(item.key, item.label);
              return true;
            }
          }
          return false;
        },
        ArrowDown: () => {
          if (isOpen) {
            const filtered = filterPlaceholders(searchText);
            currentIndex = Math.min(currentIndex + 1, filtered.length - 1);
            window.dispatchEvent(new CustomEvent('tiptap-suggestion-update', { 
              detail: { index: currentIndex, filtered: filterPlaceholders(searchText) } 
            }));
            return true;
          }
          return false;
        },
        ArrowUp: () => {
          if (isOpen) {
            currentIndex = Math.max(currentIndex - 1, 0);
            window.dispatchEvent(new CustomEvent('tiptap-suggestion-update', { 
              detail: { index: currentIndex, filtered: filterPlaceholders(searchText) } 
            }));
            return true;
          }
          return false;
        },
        Escape: () => {
          if (isOpen) {
            isOpen = false;
            currentIndex = -1;
            window.dispatchEvent(new CustomEvent('tiptap-suggestion-close'));
            return true;
          }
          return false;
        },
      };
    },
  });
};
