'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import Image from 'next/image';

import styles from './image-preview-modal.module.css';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  foodName?: string;
}

export function ImagePreviewModal({ isOpen, onClose, imageUrl, foodName }: ImagePreviewModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Image preview"
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close preview"
        >
          <X size={20} />
        </button>
        
        <div className={styles.imageWrapper}>
          <img 
            src={imageUrl} 
            alt={foodName || 'Food image'} 
            className={styles.previewImage}
          />
        </div>
        
        {foodName && <p className={styles.imageTitle}>{foodName}</p>}
      </div>
    </div>
  );
}
