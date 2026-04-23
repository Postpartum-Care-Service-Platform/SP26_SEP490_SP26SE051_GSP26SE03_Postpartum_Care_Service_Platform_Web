import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { SuggestionList } from './SuggestionList'

// Module-level ref to store the latest placeholder data.
// This is the KEY: it allows items() to always read fresh data
// without needing to re-create the editor or plugin.
const placeholderDataRef: { current: any[] } = { current: [] }

export function updatePlaceholderData(data: any[]) {
  placeholderDataRef.current = data
}

export const PlaceholderSuggestionExtension = Extension.create({
  name: 'placeholderSuggestion',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '{{',

        items: ({ query }: { query: string }) => {
          // Always read from the module-level ref - always fresh data
          const placeholders = placeholderDataRef.current || []
          return placeholders
            .filter((item: any) =>
              item.key.toLowerCase().includes(query.toLowerCase()) ||
              item.label.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 50)
        },

        command: ({ editor, range, props }: any) => {
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'placeholderChip',
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run()
          window.getSelection()?.collapseToEnd()
        },

        allow: ({ state, range }: any) => {
          const $from = state.doc.resolve(range.from)
          const type = $from.parent.type
          return type.name !== 'codeBlock'
        },

        render: () => {
          let component: any
          let popup: any

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SuggestionList, {
                props,
                editor: props.editor,
              })

              if (!props.clientRect) return

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: '', // Remove default theme
                arrow: false, // Remove default arrow
              })
            },

            onUpdate(props: any) {
              component.updateProps(props)
              if (!props.clientRect) return
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              })
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide()
                return true
              }
              return component.ref?.onKeyDown(props)
            },

            onExit() {
              popup[0].destroy()
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})
