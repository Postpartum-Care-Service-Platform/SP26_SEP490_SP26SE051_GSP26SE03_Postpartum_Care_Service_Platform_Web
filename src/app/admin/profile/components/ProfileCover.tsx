'use client';

import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import profileBg from '@/assets/images/profile-bg.png';
import styles from './profile-cover.module.css';

export function ProfileCover() {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={styles.coverContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt="Cover"
          fill
          className={styles.coverImage}
          priority
        />
      ) : (
        <Image
          src={profileBg}
          alt="Cover"
          fill
          className={styles.coverImage}
          priority
        />
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
          <div className={styles.overlayContent}>
            <Camera size={24} className={styles.cameraIcon} />
            <span className={styles.overlayText}>Thêm ảnh bìa</span>
          </div>
        </div>
      )}
    </div>
  );
}
