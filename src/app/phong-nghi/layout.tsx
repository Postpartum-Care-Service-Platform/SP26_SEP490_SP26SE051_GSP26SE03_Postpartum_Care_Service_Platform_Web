'use client';

import React, { useEffect } from 'react';

export default function PhongNghiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = '/Interactive3DMallMap/css/normalize.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = '/Interactive3DMallMap/css/style.css';
    document.head.appendChild(link2);

    return () => {
      link1.remove();
      link2.remove();
    };
  }, []);

  return <>{children}</>;
}
