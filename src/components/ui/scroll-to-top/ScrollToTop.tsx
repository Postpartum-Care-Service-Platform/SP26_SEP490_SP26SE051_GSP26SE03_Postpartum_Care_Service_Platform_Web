'use client';

import { ArrowUp } from 'lucide-react';
import React from 'react';

import styles from './scroll-to-top.module.css';

const CIRCLE_CIRCUMFERENCE = 307.919;

const getScrollThreshold = () => {
  if (typeof window === 'undefined') return 100;
  const width = window.innerWidth;
  if (width < 768) return 100;
  if (width < 1024) return 150;
  return 200;
};

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const rafIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const findScrollContainer = (): HTMLElement | Window => {
      const allElements = document.querySelectorAll('*');
      for (let i = 0; i < allElements.length; i++) {
        const htmlEl = allElements[i] as HTMLElement;
        const style = window.getComputedStyle(htmlEl);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          if (htmlEl.scrollHeight > htmlEl.clientHeight) {
            return htmlEl;
          }
        }
      }
      return window;
    };

    let scrollContainer: HTMLElement | Window = window;

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (scrollContainer === window) {
          scrollContainer = findScrollContainer();
        }

        const isWindow = scrollContainer === window;
        const scrollY = isWindow ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;
        const scrollHeight = isWindow
          ? document.documentElement.scrollHeight
          : (scrollContainer as HTMLElement).scrollHeight;
        const clientHeight = isWindow
          ? window.innerHeight
          : (scrollContainer as HTMLElement).clientHeight;
        const scrollableHeight = scrollHeight - clientHeight;

        const scrollProgress = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
        setProgress(scrollProgress);

        const threshold = getScrollThreshold();
        setIsVisible(scrollY > threshold);
      });
    };

    scrollContainer = findScrollContainer();

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    const contentElement = document.querySelector('[class*="content"]') as HTMLElement | null;
    if (contentElement && contentElement.scrollHeight > contentElement.clientHeight) {
      contentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      className={`${styles.button} ${isVisible ? styles.visible : styles.hidden}`}
      onClick={handleClick}
      aria-label="Scroll to top"
      aria-hidden={!isVisible}
    >
      <svg
        className={styles.progressCircle}
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
        aria-hidden="true"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          className={styles.progressPath}
          style={{
            strokeDasharray: `${CIRCLE_CIRCUMFERENCE}, ${CIRCLE_CIRCUMFERENCE}`,
            strokeDashoffset,
          }}
        />
      </svg>
      <ArrowUp className={styles.icon} />
    </button>
  );
}

