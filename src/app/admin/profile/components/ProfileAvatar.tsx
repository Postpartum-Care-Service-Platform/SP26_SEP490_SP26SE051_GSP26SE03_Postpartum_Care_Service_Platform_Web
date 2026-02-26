'use client';

import { Camera } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';

import styles from './profile-avatar.module.css';

type ProfileAvatarProps = {
  name?: string;
  imageUrl?: string;
};

export function ProfileAvatar({ name = '', imageUrl }: ProfileAvatarProps) {
  const [avatarImage, setAvatarImage] = useState<string | null>(imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const avatarInitial = name ? name.charAt(0).toUpperCase() : '';

  return (
    <div
      className={styles.avatarContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {avatarImage ? (
        <Image
          src={avatarImage}
          alt="Avatar"
          fill
          className={styles.avatarImage}
        />
      ) : (
        <div className={styles.avatarPlaceholder}>
          {avatarInitial}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
      {isHovered && (
        <div className={styles.overlay}>
          <Camera size={20} className={styles.cameraIcon} />
        </div>
      )}
    </div>
  );
}
