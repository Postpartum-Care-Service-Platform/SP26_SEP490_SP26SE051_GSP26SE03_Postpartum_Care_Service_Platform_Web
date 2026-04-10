'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import userService from '@/services/user.service';
import type { Account } from '@/types/account';
import type { ChatEntry } from './types';

import styles from './contacts-list.module.css';

interface Props {
  recentChats: ChatEntry[];
}

export function ContactsList({ recentChats }: Props) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getAllAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) {
      return accounts;
    }
    const query = searchQuery.toLowerCase();
    return accounts.filter(
      (account) =>
        account.username.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.roleName.toLowerCase().includes(query)
    );
  }, [accounts, searchQuery]);

  if (loading) {
    return (
      <div className={styles.contactsList}>
        <div className={styles.loading}>Đang tải danh bạ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contactsList}>
        <div className={styles.error}>Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.contactsList}>
      <div className={styles.contentContainer}>
        <div className={styles.searchBar}>
          <div className={styles.searchWrapper}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm danh bạ..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {recentChats && recentChats.length > 0 && !searchQuery && (
          <div className={styles.recentSection}>
            <div className={styles.sectionTitle}>Gần đây</div>
            <div className={styles.recentList}>
              {recentChats.map((chat) => (
                <div key={chat.id} className={styles.recentItem}>
                  <div className={styles.recentAvatarWrapper}>
                    <img src={chat.avatar ?? undefined} alt={chat.name} className={styles.recentAvatar} />
                    {chat.isOnline && <div className={styles.onlineStatus} />}
                  </div>
                  <div className={styles.recentName}>{chat.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.list}>
          {filteredAccounts.map((account) => (
            <div key={account.id} className={styles.contactItem}>
              <div className={styles.avatarWrapper}>
                {account.avatarUrl ? (
                  <img src={account.avatarUrl} alt={account.username} className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(account.username || '')}&background=random&color=fff`} 
                      alt={account.username} 
                      className={styles.avatarImg}
                    />
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <div className={styles.name}>
                  {account.username || account.email}
                </div>
                <div className={styles.email}>{account.email}</div>
              </div>
              <div className={styles.role}>{account.roleName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
