'use client';

import { Maximize, Minimize } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styles from './admin-layout.module.css';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export function FullscreenToggle({ className }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button
      type="button"
      className={cn(styles.iconGhostBtn, className)}
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
      aria-label="Toggle fullscreen"
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  );
}
