'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BlurredIconTransitionProps {
  /** Path to the first icon SVG */
  iconA: string;
  /** Path to the second icon SVG */
  iconB: string;
  /** Custom class name for the wrapper */
  className?: string;
  /** Custom class name for the icons */
  iconClassName?: string;
  /** Duration of the transition in seconds */
  duration?: number;
  /** Whether to animate on loop or on hover */
  mode?: 'loop' | 'hover' | 'both';
  /** Size of the icons (should be square) */
  size?: number | string;
  /** Additional CSS filter to apply to both icons (e.g., 'brightness(0) invert(1)') */
  baseFilter?: string;
}

/**
 * A component that smoothly transitions between two icons using Gaussian blur and opacity.
 * Focused on premium, organic feel with ease-in-out timing.
 */
export const BlurredIconTransition: React.FC<BlurredIconTransitionProps> = ({
  iconA,
  iconB,
  className = '',
  iconClassName = '',
  duration = 0.8,
  mode = 'loop',
  size = '100%',
  baseFilter = '',
}) => {
  const isLoop = mode === 'loop' || mode === 'both';
  const isHover = mode === 'hover' || mode === 'both';

  // Animation constants
  const blurAmount = '20px';
  const scaleReduction = 0.95;

  const transitionConfig = {
    duration: duration,
    ease: 'easeInOut' as const,
  };

  const loopTransitionConfig = {
    duration: duration * 6, // Overall cycle length
    repeat: Infinity,
    ease: 'easeInOut' as const,
    times: [0, 0.1, 0.6, 0.7, 1], // Massive 50% transition window for ultra-slow blend
  };

  const getFilter = (blur: string) => {
    return `${baseFilter} blur(${blur})`.trim();
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Icon A */}
      <motion.img
        src={iconA}
        alt="Icon A"
        className={`absolute inset-0 w-full h-full object-contain ${iconClassName}`}
        initial={{ opacity: 1, filter: getFilter('0px'), scale: 1 }}
        animate={isLoop ? {
          opacity: [1, 1, 0, 0, 1],
          filter: [getFilter('0px'), getFilter('0px'), getFilter(blurAmount), getFilter(blurAmount), getFilter('0px')],
          scale: [1, 1, scaleReduction, scaleReduction, 1],
        } : undefined}
        whileHover={isHover ? {
          opacity: 0,
          filter: getFilter(blurAmount),
          scale: scaleReduction,
        } : undefined}
        transition={isLoop ? loopTransitionConfig : transitionConfig}
      />

      {/* Icon B */}
      <motion.img
        src={iconB}
        alt="Icon B"
        className={`absolute inset-0 w-full h-full object-contain ${iconClassName}`}
        initial={{ opacity: 0, filter: getFilter(blurAmount), scale: scaleReduction }}
        animate={isLoop ? {
          opacity: [0, 0, 1, 1, 0],
          filter: [getFilter(blurAmount), getFilter(blurAmount), getFilter('0px'), getFilter('0px'), getFilter(blurAmount)],
          scale: [scaleReduction, scaleReduction, 1, 1, scaleReduction],
        } : undefined}
        whileHover={isHover ? {
          opacity: 1,
          filter: getFilter('0px'),
          scale: 1,
        } : undefined}
        transition={isLoop ? loopTransitionConfig : transitionConfig}
      />
    </div>
  );
};
