'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Menu } from '@/types/menu';
import styles from './menu-view-visualizer.module.css';

interface MenuViewVisualizerProps {
  menus: Menu[];
}

// Define fixed positions for the nodes
const POSITIONS = [
  { x: 0, y: 0, scale: 1, zIndex: 10, opacity: 1, type: 'main' },      // Position 0: Center (Main)
  { x: Math.cos(120 * Math.PI / 180) * 280, y: Math.sin(120 * Math.PI / 180) * 280, scale: 0.2, zIndex: 6, opacity: 1, type: 'bottom' }, // Position 1: Bottom (120 deg)
  { x: Math.cos(180 * Math.PI / 180) * 280, y: Math.sin(180 * Math.PI / 180) * 280, scale: 0.2, zIndex: 6, opacity: 1, type: 'middle' }, // Position 2: Middle (180 deg)
  { x: Math.cos(240 * Math.PI / 180) * 280, y: Math.sin(240 * Math.PI / 180) * 280, scale: 0.2, zIndex: 6, opacity: 1, type: 'top' },    // Position 3: Top (240 deg)
];

export function MenuViewVisualizer({ menus }: MenuViewVisualizerProps) {
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [displayFoods, setDisplayFoods] = useState<any[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const currentMenu = menus[currentMenuIndex];

  // Initialize or reset display foods when current menu changes
  useEffect(() => {
    if (currentMenu && currentMenu.foods && currentMenu.foods.length > 0) {
      const initial = currentMenu.foods.slice(0, 4);
      while (initial.length < 4 && initial.length > 0) {
        initial.push(initial[initial.length % initial.length]);
      }
      setDisplayFoods(initial);
    }
  }, [currentMenuIndex, currentMenu]);

  useEffect(() => {
    if (!isAutoRotating || displayFoods.length < 4) return;
    
    const interval = setInterval(() => {
      handleRotate();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isAutoRotating, displayFoods]);

  const handleRotate = () => {
    setDisplayFoods((prev) => {
      const next = [...prev];
      const first = next.shift();
      next.push(first);
      return next;
    });
  };

  if (!currentMenu) return <div className={styles.empty}>Không có dữ liệu thực đơn.</div>;

  const handlePrevMenu = () => {
    setCurrentMenuIndex((prev) => (prev > 0 ? prev - 1 : menus.length - 1));
  };

  const handleNextMenu = () => {
    setCurrentMenuIndex((prev) => (prev < menus.length - 1 ? prev + 1 : 0));
  };

  const slowGlideTransition = {
    duration: 1.5,
    ease: "easeInOut"
  };

  return (
    <div className={styles.container} onMouseEnter={() => setIsAutoRotating(false)} onMouseLeave={() => setIsAutoRotating(true)}>
      <div className={styles.contentWrapper}>
        {/* Left Side: Info */}
        <div className={styles.infoSide}>
          <div className={styles.price}>150.000₫</div>
          <div className={styles.typeBadge}>{currentMenu.menuTypeName}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMenu.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={styles.title}>{currentMenu.menuName}</h1>
              <p className={styles.description}>{currentMenu.description || 'Thực đơn dinh dưỡng chất lượng cao dành cho mẹ bé.'}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className={styles.nutritionInfo}>
            <div className={styles.nutriItem}>
              <span className={styles.nutriLabel}>Món ăn:</span>
              <span className={styles.nutriValue}>{currentMenu.foods?.length || 0} món</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className={styles.visualSide}>
          <div className={styles.bgDecoration} />
          
          {/* Dashed Arc */}
          <div className={styles.dashedArcWrapper}>
            <svg width="600" height="600" viewBox="0 0 600 600" className={styles.dashedArcSvg}>
              <path 
                d="M 160 542 A 280 280 0 0 1 160 58" 
                fill="none" 
                stroke="#d1d1d1" 
                strokeWidth="2" 
                strokeDasharray="8,8"
                className={styles.arcPath}
              />
            </svg>
          </div>

          {/* Dishes */}
          {displayFoods.map((food, index) => {
            const pos = POSITIONS[index];
            const isMain = index === 0;

            return (
              <motion.div
                key={food.id}
                layout
                initial={false}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  scale: isMain ? 1 : 0.2,
                  zIndex: pos.zIndex,
                }}
                transition={slowGlideTransition}
                className={isMain ? styles.mainDishWrapper : styles.smallDishWrapper}
                onClick={() => {
                   if (!isMain) {
                     const idx = displayFoods.indexOf(food);
                     setDisplayFoods(prev => {
                       const next = [...prev];
                       for(let i=0; i<idx; i++) {
                         next.push(next.shift());
                       }
                       return next;
                     });
                     setIsAutoRotating(false);
                   }
                }}
              >
                {food.imageUrl ? (
                  <Image 
                    src={food.imageUrl} 
                    alt={food.name} 
                    width={450}
                    height={450} 
                    className={isMain ? styles.mainDishImg : styles.smallDishImg}
                    priority={isMain}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>{food.name[0]}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Page Navigation Arrows */}
      <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrevMenu} title="Thực đơn trước">
        <ChevronLeft size={32} />
      </button>
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNextMenu} title="Thực đơn sau">
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
