'use client';

import styles from './profile-name.module.css';

type ProfileNameProps = {
  name?: string;
};

export function ProfileName({ name }: ProfileNameProps) {
  if (!name) return null;

  return <div className={styles.name}>{name}</div>;
}
