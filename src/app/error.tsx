'use client';

import { useEffect } from 'react';
import Error500Page from './500/page';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return <Error500Page />;
}
