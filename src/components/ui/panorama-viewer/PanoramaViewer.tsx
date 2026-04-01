'use client';

import { Play, Pause, Move, Camera, ChevronLeft } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import styles from './PanoramaViewer.module.css';

interface PanoramaHotspot {
  id: string;
  label: string;
  ry: number; // Yaw angle in degrees (horizontal position)
  rx: number; // Pitch angle in degrees (vertical position)
  target: {
    folderPath: string;
    filePrefix: string;
    fileSuffix?: string;
    title?: string;
  };
}

interface PanoramaViewerProps {
  id: string;
  folderPath: string; 
  filePrefix: string; 
  fileSuffix?: string;
  onBack?: () => void;
  title?: string;
  hotspots?: PanoramaHotspot[];
}

export function PanoramaViewer({
  folderPath: initialFolderPath,
  filePrefix: initialFilePrefix,
  fileSuffix: initialFileSuffix = "001",
  onBack,
  title: initialTitle = "Chi tiết căn hộ",
  hotspots = []
}: PanoramaViewerProps) {
  const [scene, setScene] = useState({
    folderPath: initialFolderPath,
    filePrefix: initialFilePrefix,
    fileSuffix: initialFileSuffix,
    title: initialTitle
  });

  const [prevInitial, setPrevInitial] = useState({
    initialFolderPath,
    initialFilePrefix,
    initialFileSuffix,
    initialTitle
  });

  // Sync internal scene state with initial props if they change (Adjustment during rendering)
  if (initialFolderPath !== prevInitial.initialFolderPath || 
      initialFilePrefix !== prevInitial.initialFilePrefix ||
      initialFileSuffix !== prevInitial.initialFileSuffix ||
      initialTitle !== prevInitial.initialTitle) {
    setPrevInitial({
      initialFolderPath,
      initialFilePrefix,
      initialFileSuffix,
      initialTitle
    });
    setScene({
      folderPath: initialFolderPath,
      filePrefix: initialFilePrefix,
      fileSuffix: initialFileSuffix,
      title: initialTitle
    });
  }

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [fov, setFov] = useState(75);
  const [isFading, setIsFading] = useState(false);
  
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);


  const handleSceneSwitch = (newScene: PanoramaHotspot['target']) => {
    setIsFading(true);
    setTimeout(() => {
      setScene({
        folderPath: newScene.folderPath,
        filePrefix: newScene.filePrefix,
        fileSuffix: newScene.fileSuffix || "001",
        title: newScene.title || "Vị trí mới"
      });
      setIsFading(false);
    }, 500);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoRotate(false);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setRotation(prev => ({
      x: Math.max(-85, Math.min(85, prev.x - deltaY * 0.1)),
      y: prev.y + deltaX * 0.1
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    setFov(prev => Math.max(40, Math.min(100, prev + e.deltaY * 0.05)));
  };

  useEffect(() => {
    const animate = () => {
      if (isAutoRotate && !isDragging) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.05 }));
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isAutoRotate, isDragging]);

  const faces = [
    { name: 'Front',  rx: 0, ry: 0,   rz: 0,   tx: 0, ty: 0, tz: -512 },
    { name: 'Back',   rx: 0, ry: 180, rz: 0,   tx: 0, ty: 0, tz: -512 },
    { name: 'Left',   rx: 0, ry: 90,  rz: 0,   tx: 0, ty: 0, tz: -512 },
    { name: 'Right',  rx: 0, ry: -90, rz: 0,   tx: 0, ty: 0, tz: -512 },
    { name: 'Top',    rx: -90, ry: 0, rz: 0,   tx: 0, ty: 0, tz: -512 },
    { name: 'Bottom', rx: 90, ry: 0,  rz: 0,   tx: 0, ty: 0, tz: -512 },
  ];

  // Utility to get image src
  const getImageUrl = (face: string) => {
    return `${scene.folderPath}/${scene.filePrefix}_${face}_${scene.fileSuffix}_2026.jpg`;
  };

  const perspectiveValue = 512 / Math.tan((fov * Math.PI) / 360);

  return (
    <div 
      className={`${styles.pViewer} ${isFading ? styles.fading : ''}`} 
      onWheel={handleWheel}
      ref={containerRef}
    >
      {/* Background UI */}
      <div className={styles.uiOverlay}>
        <div className={styles.header}>
          {onBack && (
            <button onClick={onBack} className={styles.backButton}>
              <ChevronLeft size={20} />
              Quay lại 3D Tour
            </button>
          )}
          <h2 className={styles.title}>{scene.title}</h2>
        </div>

        <div className={styles.controls}>
          <button 
            onClick={() => setIsAutoRotate(!isAutoRotate)} 
            className={`${styles.controlBtn} ${isAutoRotate ? styles.active : ''}`}
          >
            {isAutoRotate ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={() => setRotation({ x: 0, y: 0 })} className={styles.controlBtn}>
             <Camera size={18} />
          </button>
        </div>
        
        {/* Thumbnails / Bottom Switcher - Simplified mock as per user request screenshot */}
        <div className={styles.sceneSwitcher}>
          {hotspots.map((hs) => (
             <div 
               key={hs.id} 
               className={styles.thumbnail}
               onClick={() => handleSceneSwitch(hs.target)}
               title={hs.label}
             >
               <div 
                 className={styles.thumbImg} 
                 style={{ backgroundImage: `url("${hs.target.folderPath}/${hs.target.filePrefix}_Front_${hs.target.fileSuffix || '001'}_256.jpg")` }}
               />
               <span className={styles.thumbLabel}>{hs.label}</span>
             </div>
          ))}
        </div>

        <div className={styles.hint}>
          <Move size={14} />
          Kéo để quan sát xung quanh • Click mũi tên để di chuyển
        </div>
      </div>

      {/* 3D Scene */}
      <div 
        className={styles.viewport}
        style={{ perspective: `${perspectiveValue}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div 
          className={styles.cube}
          style={{
            transform: `translateZ(${perspectiveValue}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {faces.map(face => (
            <div 
              key={face.name}
              className={styles.face}
              style={{
                backgroundImage: `url("${getImageUrl(face.name)}")`,
                transform: `rotateY(${face.ry}deg) rotateX(${face.rx}deg) rotateZ(${face.rz}deg) translateZ(${face.tz}px)`
              }}
            />
          ))}

          {/* Navigational Hotspots in 3D */}
          {hotspots.map(hs => (
            <div 
              key={hs.id}
              className={styles.panoHotspot}
              style={{
                // Positioned on a sphere around the camera, looking inward
                transform: `rotateY(${hs.ry}deg) rotateX(${hs.rx}deg) translateZ(-400px) rotateX(90deg)`
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSceneSwitch(hs.target);
              }}
            >
              <div className={styles.hotspotArrow}>
                <ChevronLeft className={styles.arrowIcon} style={{ transform: 'rotate(90deg)' }} />
              </div>
              <div className={styles.hotspotPopup}>{hs.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
