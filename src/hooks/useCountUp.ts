import { useEffect, useRef, useState } from 'react';

type UseCountUpOptions = {
  duration?: number;
  startOnMount?: boolean;
  decimals?: number;
};

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
): number {
  const { duration = 2000, startOnMount = true, decimals = 0 } = options;
  const [count, setCount] = useState(startOnMount ? 0 : end);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const endRef = useRef(end);

  useEffect(() => {
    endRef.current = end;

    if (!startOnMount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(end);
      return;
    }

    setCount(0);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = easeOutQuart * endRef.current;

      setCount(currentCount);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endRef.current);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, startOnMount]);

  return Number(count.toFixed(decimals));
}
