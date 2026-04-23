'use client';

import { useEffect } from 'react';
import { registerBones } from 'boneyard-js/react';

export function BoneyardProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Stats Cards Skeleton
    registerBones('dashboard-stats', [
      { x: '0%', y: 0, w: '23%', h: 120, r: 12 },
      { x: '25.5%', y: 0, w: '23%', h: 120, r: 12 },
      { x: '51%', y: 0, w: '23%', h: 120, r: 12 },
      { x: '76.5%', y: 0, w: '23%', h: 120, r: 12 },
    ]);

    // Main Revenue Chart
    registerBones('revenue-chart', [
      { x: '0%', y: 0, w: '100%', h: 350, r: 16 },
      // Chart line simulation
      { x: '10%', y: 280, w: '80%', h: 4, r: 2 },
      { x: '10%', y: 150, w: '5%', h: 130, r: 4 },
      { x: '20%', y: 100, w: '5%', h: 180, r: 4 },
      { x: '30%', y: 200, w: '5%', h: 80, r: 4 },
      { x: '40%', y: 50, w: '5%', h: 230, r: 4 },
      { x: '50%', y: 120, w: '5%', h: 160, r: 4 },
    ]);

    // Calendar & Carousel
    registerBones('admin-calendar', [
      { x: '0%', y: 0, w: '100%', h: 300, r: 12 },
    ]);

    registerBones('appointment-carousel', [
      { x: '0%', y: 0, w: '100%', h: 150, r: 12 },
    ]);

    // Sidebar Charts
    registerBones('top-doctors', [
      { x: '0%', y: 0, w: '100%', h: 250, r: 12 },
    ]);

    registerBones('average-visit', [
      { x: '0%', y: 0, w: '100%', h: 250, r: 12 },
    ]);

    registerBones('cashflow-chart', [
      { x: '0%', y: 0, w: '100%', h: 320, r: 12 },
    ]);
  }, []);

  return <>{children}</>;
}
