'use client';

import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/**
 * Component LazySection - Lazy load content khi scroll tới viewport
 * Sử dụng Intersection Observer API để detect khi element vào viewport
 */
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  rootMargin = '100px', // Load trước 100px khi scroll tới
  threshold = 0.1, // Trigger khi 10% element visible
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Khi element vào viewport
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Đánh dấu đã load để không unload lại
            setHasLoaded(true);
            // Disconnect observer sau khi đã load
            if (target) {
              observer.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    // Bắt đầu observe element
    if (target) {
      observer.observe(target);
    }

    // Cleanup observer khi component unmount
    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={sectionRef} className={className}>
      {hasLoaded || isVisible ? (
        children
      ) : (
        fallback || (
          <div
            style={{
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div
              style={{
                opacity: 0.5,
                fontSize: '14px',
                color: '#666',
                fontFamily: 'var(--font-body)',
              }}
            >
              Đang tải...
            </div>
          </div>
        )
      )}
    </div>
  );
};
