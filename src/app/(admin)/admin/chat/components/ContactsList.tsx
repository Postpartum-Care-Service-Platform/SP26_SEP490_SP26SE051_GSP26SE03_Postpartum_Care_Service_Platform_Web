'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import userService from '@/services/user.service';
import type { Account } from '@/types/account';

import styles from './contacts-list.module.css';

export function ContactsList() {
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
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.contactsList}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.contactsList}>
      <div className={styles.searchBar}>
        <div className={styles.searchWrapper}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search Here.."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.list}>
        {filteredAccounts.map((account) => (
          <div key={account.id} className={styles.contactItem}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarPlaceholder}>
                <User size={24} />
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.name}>{account.username || account.email}</div>
              <div className={styles.email}>{account.email}</div>
            </div>
            <div className={styles.role}>{account.roleName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

