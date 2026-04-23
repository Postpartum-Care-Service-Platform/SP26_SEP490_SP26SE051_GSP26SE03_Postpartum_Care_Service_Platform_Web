import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import styles from './RichTextEditor.module.css'

export interface SuggestionListProps {
  items: any[]
  command: (item: any) => void
}

export const SuggestionList = forwardRef((props: SuggestionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex(((selectedIndex + props.items.length) - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className={styles.suggestionListWrapper}>
      <div className={styles.suggestionListHeader}>Chọn trường dữ liệu</div>
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`${styles.suggestionListItem} ${index === selectedIndex ? styles.isSelected : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <span className={styles.suggestionBadge}>{item.label}</span>
            <span className={styles.suggestionKey}>{item.key}</span>
          </button>
        ))
      ) : (
        <div className={styles.suggestionListEmpty}>Không tìm thấy kết quả</div>
      )}
    </div>
  )
})

SuggestionList.displayName = 'SuggestionList'
