'use client';

import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import styles from './chat-search-bar.module.css';

type Props = {
  onSearch?: (query: string) => void;
  onNewChat?: () => void;
};

export function ChatSearchBar({ onSearch, onNewChat }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrapper}>
        <MagnifyingGlassIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search Here.."
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <button
        type="button"
        className={styles.newChatButton}
        onClick={onNewChat}
        aria-label="New chat"
      >
        <PlusIcon className={styles.plusIcon} />
      </button>
    </div>
  );
}