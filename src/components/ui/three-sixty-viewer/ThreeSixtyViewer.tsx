'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MoveHorizontal, Play, Pause } from 'lucide-react';
import styles from './ThreeSixtyViewer.module.css';

// Import polygon data for buildings
import frameDataJson from '@/data/frame-elements.json';

interface Hotspot {
  id: string;
  type: 'navigation' | 'info';
  label: string;
  frame: number; // Anchor frame (used as fallback or for visibility)
  x: number; // Percent 0-100 (used as fallback or relative offset if anchored)
  y: number; // Percent 0-100 (used as fallback or relative offset if anchored)
  anchorBuildingId?: string; // If provided, looks up real-time center from JSON
  targetNode?: string;
  description?: string;
  onClick?: () => void;
}

interface BuildingElement {
  A: {
    I: string; // ID of the building
    T: string; // Type
  };
  P: number[][][]; // Polygon coordinates [[[x,y], [x,y], ...]]
  C?: number[]; // Center point [x, y] from dataset
}

interface FrameElement {
  D: number;
  E: BuildingElement[];
}

interface ThreeSixtyViewerProps {
  imagePath: string; // e.g. "/thejoyfulnest/Mall/f_"
  frameCount?: number; // default 120
  extension?: string; // default ".jpg"
  className?: string;
  hotspots?: Hotspot[];
  onBuildingClick?: (buildingId: string) => void;
  selectedBuildingId?: string | null;
  showBuildingOverlay?: boolean;
  calibration?: {
    xScale: number;
    yScale: number;
    xOffset: number;
    yOffset: number;
    coordBase?: number; // Mẫu số chuẩn hóa (mặc định 1000 = 100k units)
    frameOffset?: number; // Dịch chuyển chỉ số khung hình (0-119)
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number; // ms per frame (legacy)
  autoRotateDuration?: number; // ms for total animation (preferred)
  initialTargetFrame?: number; // Stop at this frame (90)
}

export function ThreeSixtyViewer({
  imagePath,
  frameCount = 120,
  extension = ".jpg",
  className = "",
  hotspots = [],
  onBuildingClick,
  selectedBuildingId = null,
  showBuildingOverlay = true,
  calibration = { xScale: 1, yScale: 1, xOffset: 0, yOffset: 0, coordBase: 1000 },
  autoRotate = true,
  autoRotateSpeed = 40,
  autoRotateDuration = 10000,
  initialTargetFrame = 120
}: ThreeSixtyViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoRotate);
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [imageRect, setImageRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const LEFT_BUILDING_ID = '3';

  // Ref to store preloaded images
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const framePositionRef = useRef(0);
  const requestRef = useRef<number>(0);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    let isMounted = true;

    const preloadNext = (index: number) => {
      if (index >= frameCount) return;

      const img = new Image();
      img.src = `${imagePath}${index}${extension}`;
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setIsLoading(false);
        }
      };
      images[index] = img;
    };

    for (let i = 0; i < frameCount; i++) {
      preloadNext(i);
    }

    // Reset frame and auto-play when image path changes
    setCurrentFrame(0);
    setIsAutoPlaying(autoRotate);
    setIsLoading(true);

    imagesRef.current = images;
    return () => { isMounted = false; };
  }, [imagePath, frameCount, extension, autoRotate]);

  // Handle drawing to canvas and update imageRect for SVG alignment
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];

    if (canvas && ctx && img && img.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const canvasAspectRatio = canvas.width / canvas.height;
      const imgAspectRatio = img.width / img.height;

      let renderWidth, renderHeight, offsetX, offsetY;

      if (canvasAspectRatio > imgAspectRatio) {
        renderHeight = canvas.height;
        renderWidth = img.width * (canvas.height / img.height);
        offsetX = (canvas.width - renderWidth) / 2;
        offsetY = 0;
      } else {
        renderWidth = canvas.width;
        renderHeight = img.height * (canvas.width / img.width);
        offsetX = 0;
        offsetY = (canvas.height - renderHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

      // Update imageRect in percentage relative to container
      setImageRect({
        x: (offsetX / canvas.width) * 100,
        y: (offsetY / canvas.height) * 100,
        width: (renderWidth / canvas.width) * 100,
        height: (renderHeight / canvas.height) * 100
      });
    }
  }, []);

  // Easing function for smooth rotation
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Main Animation Loop for Smooth Physics and Auto-Rotation
  useEffect(() => {
    const animate = (time: number) => {
      if (isLoading) {
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      const friction = 0.92;
      const autoSpeed = isAutoPlaying ? (frameCount / (autoRotateDuration / 16.67)) : 0;
      
      // If we are dragging, we don't apply physics here (it's handled in handleMove)
      if (!isDragging) {
        // Combine auto-rotation and current inertial velocity
        if (isAutoPlaying) {
          // Accelerate to auto-speed smoothly
          velocityRef.current = velocityRef.current * 0.9 + autoSpeed * 0.1;
        } else {
          // Apply friction to manual spin
          velocityRef.current *= friction;
        }

        // Apply velocity to position
        framePositionRef.current += velocityRef.current;
        
        // Keep within bounds
        if (framePositionRef.current < 0) framePositionRef.current += frameCount;
        if (framePositionRef.current >= frameCount) framePositionRef.current -= frameCount;

        const nextFrame = Math.floor(framePositionRef.current);
        if (nextFrame !== currentFrame) {
          setCurrentFrame(nextFrame);
        }

        // Stop loop if moving very slowly and not auto-playing
        if (!isAutoPlaying && Math.abs(velocityRef.current) < 0.01) {
          velocityRef.current = 0;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isAutoPlaying, isLoading, isDragging, frameCount, autoRotateDuration, currentFrame]);

  // Sync ref with state for manual interaction base
  useEffect(() => {
    if (!isDragging) {
      framePositionRef.current = currentFrame;
    }
  }, [currentFrame, isDragging]);

  useEffect(() => {
    if (!isLoading) {
      drawFrame(currentFrame);
    }
  }, [currentFrame, isLoading, drawFrame]);

  // Interaction handlers
  const handleStart = (clientX: number) => {
    setIsAutoPlaying(false);
    setIsDragging(true);
    startXRef.current = clientX;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    startFrameRef.current = currentFrame;
    velocityRef.current = 0;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const dx = clientX - lastXRef.current;
    
    // Sensitivity: how many pixels equal 1 frame
    const sensitivity = 8;
    const frameDelta = dx / sensitivity;
    
    // Update frame position based on drag
    let newPos = framePositionRef.current - frameDelta;
    while (newPos < 0) newPos += frameCount;
    while (newPos >= frameCount) newPos -= frameCount;
    
    framePositionRef.current = newPos;
    setCurrentFrame(Math.floor(newPos));
    
    // Calculate velocity for inertia (frames per ms -> frames per normalized tick)
    if (dt > 0) {
      const instantVelocity = -frameDelta / (dt / 16.67);
      // Smooth the velocity calculation
      velocityRef.current = velocityRef.current * 0.7 + instantVelocity * 0.3;
    }
    
    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handlePlayTour = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (!isAutoPlaying) {
      // Small nudge to start moving
      if (Math.abs(velocityRef.current) < 0.1) {
        velocityRef.current = 0.5;
      }
    }
  };

  // Stable source data
  const frameElements = useMemo(
    () => ((frameDataJson as any).data.frameElements as FrameElement[]) || [],
    []
  );

  // Map runtime frame -> annotation frame via nearest D on circular domain [0, 1000)
  const frameMapping = useMemo(() => {
    const { frameOffset = 0 } = calibration;

    if (!frameElements.length) {
      return {
        rotatedFrameIndex: 0,
        targetD: null as number | null,
        mappedIndex: 0,
        mappedD: null as number | null,
        dDiff: null as number | null,
        buildings: [] as BuildingElement[],
      };
    }

    let rotatedFrameIndex = (currentFrame + frameOffset) % frameCount;
    if (rotatedFrameIndex < 0) rotatedFrameIndex += frameCount;

    // Dataset anchor: frame 0 ≈ D=246
    const targetD = (1000 + (246 - (rotatedFrameIndex * 1000) / frameCount)) % 1000;

    let bestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < frameElements.length; i++) {
      const d = frameElements[i].D;
      const diff = Math.min(
        Math.abs(d - targetD),
        Math.abs(d - (targetD + 1000)),
        Math.abs(d - (targetD - 1000))
      );

      if (diff < minDiff) {
        minDiff = diff;
        bestIndex = i;
      }
    }

    const bestFrame = frameElements[bestIndex];

    return {
      rotatedFrameIndex,
      targetD,
      mappedIndex: bestIndex,
      mappedD: bestFrame?.D ?? null,
      dDiff: Number.isFinite(minDiff) ? minDiff : null,
      buildings: bestFrame?.E ?? [],
    };
  }, [currentFrame, frameCount, calibration, frameElements]);

  const currentFrameBuildings = frameMapping.buildings;

  // Convert coordinate from dataset base (default 1000) to normalized SVG space 0..100
  const formatPolygonPoints = (points: number[][]) => {
    const { xScale, yScale, xOffset, yOffset, coordBase = 1000 } = calibration;

    return points.map((p) => {
      const nx = p[0] / coordBase;
      const ny = p[1] / coordBase;

      const x = (nx * xScale) + xOffset;
      const y = (ny * yScale) + yOffset;

      return `${x},${y}`;
    }).join(' ');
  };

  const getLeftBuildingZonePolygons = (points: number[][]) => {
    const { xScale, yScale, xOffset, yOffset, coordBase = 1000 } = calibration;

    const normalized = points.map((p) => ({
      x: (p[0] / coordBase) * xScale + xOffset,
      y: (p[1] / coordBase) * yScale + yOffset,
    }));

    if (!normalized.length) return [] as string[];

    const minX = Math.min(...normalized.map((p) => p.x));
    const maxX = Math.max(...normalized.map((p) => p.x));
    const minY = Math.min(...normalized.map((p) => p.y));
    const maxY = Math.max(...normalized.map((p) => p.y));

    const width = maxX - minX;
    const height = maxY - minY;

    // Slight inset so colored zones sit inside the left building polygon
    const x0 = minX + width * 0.06;
    const x1 = maxX - width * 0.06;
    const y0 = minY + height * 0.04;
    const y1 = maxY - height * 0.04;

    const h = y1 - y0;
    const cut1 = y0 + h * 0.33;
    const cut2 = y0 + h * 0.66;

    const top = `${x0},${y0} ${x1},${y0} ${x1},${cut1} ${x0},${cut1}`;
    const mid = `${x0},${cut1} ${x1},${cut1} ${x1},${cut2} ${x0},${cut2}`;
    const bot = `${x0},${cut2} ${x1},${cut2} ${x1},${y1} ${x0},${y1}`;

    return [top, mid, bot];
  };

  return (
    <div
      className={`${styles.viewerContainer} ${className}`}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <div className={styles.loadingText}>Đang tải không gian 3D...</div>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* SVG Polygons Overlay mapped to image position */}
      {!isLoading && showBuildingOverlay && (
        <svg
          className={styles.svgOverlay}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          style={{
            left: `${imageRect.x}%`,
            top: `${imageRect.y}%`,
            width: `${imageRect.width}%`,
            height: `${imageRect.height}%`,
          }}
        >
          {currentFrameBuildings.map((b, idx) => {
            const isLeftBuilding = b.A.I === LEFT_BUILDING_ID;
            const shouldShowZones = isLeftBuilding && selectedBuildingId === LEFT_BUILDING_ID;
            const zonePolygons = shouldShowZones ? getLeftBuildingZonePolygons(b.P[0]) : [];

            return (
              <g key={`${b.A.I}-${idx}`}>
                <polygon
                  points={formatPolygonPoints(b.P[0])}
                  className={`${styles.buildingPolygon} ${hoveredBuilding === b.A.I ? styles.buildingHovered : ''}`}
                  onMouseEnter={() => setHoveredBuilding(b.A.I)}
                  onMouseLeave={() => setHoveredBuilding(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onBuildingClick) onBuildingClick(b.A.I);
                    else console.log(`Building clicked: ${b.A.I}`);
                  }}
                />

                {shouldShowZones && zonePolygons.map((zonePoints, zoneIdx) => {
                  const zoneMeta = [
                    { fill: 'rgba(70,175,52,0.25)', stroke: '#46af34' },
                    { fill: 'rgba(250,175,29,0.25)', stroke: '#faaf1d' },
                    { fill: 'rgba(250,29,29,0.25)', stroke: '#fa1d1d' },
                  ][zoneIdx];

                  return (
                    <polygon
                      key={`${b.A.I}-zone-${zoneIdx}`}
                      points={zonePoints}
                      className={styles.leftBuildingZone}
                      style={{
                        fill: zoneMeta.fill,
                        stroke: zoneMeta.stroke,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onBuildingClick) onBuildingClick(b.A.I);
                      }}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}

      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className={styles.canvas}
      />

      {/* Hotspots Overlay */}
      {!isLoading && (
        <div className={styles.hotspotOverlay}>
          {hotspots.map((hs) => {
            let posX = hs.x;
            let posY = hs.y;
            let isVisible = false;

            // If anchored to a building, pull center and polygon from current frame data
            if (hs.anchorBuildingId) {
              const bData = currentFrameBuildings.find(b => b.A.I === hs.anchorBuildingId);
              if (bData && bData.P?.[0]) {
                const { xScale, yScale, xOffset, yOffset, coordBase = 1000 } = calibration;
                
                // Calculate projected polygon points to find current boundaries
                const projectedPoints = bData.P[0].map(p => ({
                  x: (p[0] / coordBase) * xScale + xOffset,
                  y: (p[1] / coordBase) * yScale + yOffset
                }));

                const minX = Math.min(...projectedPoints.map(p => p.x));
                const maxX = Math.max(...projectedPoints.map(p => p.x));
                const minY = Math.min(...projectedPoints.map(p => p.y));
                const maxY = Math.max(...projectedPoints.map(p => p.y));
                
                const bWidth = maxX - minX;
                const bHeight = maxY - minY;
                
                const centerX = bData.C 
                  ? (bData.C[0] / coordBase) * xScale + xOffset
                  : (minX + maxX) / 2;
                const centerY = bData.C 
                  ? (bData.C[1] / coordBase) * yScale + yOffset
                  : (minY + maxY) / 2;
                
                // High precision mapping: Treat hs.x/y as 0-100% of the building's bounding box
                const finalX = centerX + ((hs.x - 50) / 100) * bWidth;
                const finalY = centerY + ((hs.y - 50) / 100) * bHeight;

                posX = imageRect.x + (finalX * imageRect.width) / 100;
                posY = imageRect.y + (finalY * imageRect.height) / 100;
                isVisible = true;
              }
            } else {
              // Fallback to frame-distance calculation
              let diff = (currentFrame - hs.frame);
              if (diff > frameCount / 2) diff -= frameCount;
              if (diff < -frameCount / 2) diff += frameCount;

              // Scale relative to current image container fit
              isVisible = Math.abs(diff) < 60;
              const horizontalOffset = -(diff * 3.5); 
              const rawX = hs.x + horizontalOffset;
              const rawY = hs.y;

              posX = imageRect.x + (rawX * imageRect.width) / 100;
              posY = imageRect.y + (rawY * imageRect.height) / 100;
            }

            return (
              <div
                key={hs.id}
                className={styles.hotspot}
                style={{
                  left: `${posX}%`,
                  top: `${posY}%`,
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  isVisible && hs.onClick && hs.onClick();
                }}
              >
                <div className={styles.hotspotIcon}>
                  {hs.type === 'navigation' ? (
                    <div className={styles.pulseRing} />
                  ) : null}
                  <div className={styles.innerDot} />
                </div>
                <div className={styles.hotspotLabel}>{hs.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && (
        <div className={styles.overlayControls}>
          <button 
            className={`${styles.playTourButton} ${isAutoPlaying ? styles.playTourButtonActive : ''}`}
            onClick={handlePlayTour}
            title={isAutoPlaying ? "Dừng tour" : "Xem tour tự động"}
          >
            {isAutoPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            <span className={styles.buttonText}>{isAutoPlaying ? "Dừng Tour" : "Xem Tour"}</span>
          </button>
          
          <div className={styles.divider} />

          <div className={styles.interactionHint}>
            <MoveHorizontal
              size={18}
              className={`${styles.controlIcon} ${isDragging ? styles.controlIconActive : ''}`}
            />
            <span className={styles.loadingText}>Kéo để xoay 360° • Click tòa nhà để xem chi tiết</span>
          </div>
        </div>
      )}
    </div>
  );
}
