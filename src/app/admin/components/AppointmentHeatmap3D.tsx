'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, OrbitControls, ContactShadows, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface HeatmapPoint {
  date: string;
  dayOfWeek: number;
  hour: number;
  count: number;
}

interface AppointmentHeatmap3DProps {
  data: HeatmapPoint[];
  maxCount: number;
}

const COLORS = [
  '#f8f9fa', '#fff4e6', '#ffe8cc', '#ffd8a8', '#ffc078', 
  '#ffa94d', '#ff922b', '#fd7e14', '#f76707', '#e8590c'
];

export function AppointmentHeatmap3D({ data, maxCount }: AppointmentHeatmap3DProps) {
  const [hoveredData, setHoveredData] = useState<{
    date: string;
    hour: number;
    count: number;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Nhóm dữ liệu theo ngày
  const groups = useMemo(() => {
    const grouped: Record<string, { date: string, points: HeatmapPoint[] }> = {};
    data.forEach(p => {
      if (!grouped[p.date]) grouped[p.date] = { date: p.date, points: [] };
      grouped[p.date].points.push(p);
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '600px', background: '#fcfcfc', borderRadius: '0px', overflow: 'hidden', position: 'relative', border: '1px solid #f1f3f5' }}
    >
      <Canvas shadows>
        <OrthographicCamera 
          makeDefault 
          position={[15, 15, 15]} 
          zoom={35} 
          near={0.1} 
          far={1000} 
        />
        <OrbitControls 
          enablePan={true} 
          enableRotate={true} 
          enableZoom={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
        />

        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffd8a8" />

        <group position={[-HOURS.length / 2, 0, -groups.length / 2]}>
          {groups.map((group, zIndex) => (
            <group key={group.date}>
              <Text
                position={[-1.5, 0.1, zIndex + 0.5]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.4}
                color="#666"
                anchorX="right"
              >
                {group.date.split('-').reverse().slice(0, 2).join('/')}
              </Text>

              {HOURS.map((hour, xIndex) => {
                const point = group.points.find(p => p.hour === hour);
                const count = point?.count || 0;
                const h = Math.max((count / (maxCount || 1)) * 4, 0.1);
                const isHovered = hoveredData?.date === group.date && hoveredData?.hour === hour;

                return (
                  <mesh 
                    key={`${group.date}-${hour}`}
                    position={[xIndex + 0.5, h / 2, zIndex + 0.5]}
                    castShadow
                    receiveShadow
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      setHoveredData({ date: group.date, hour, count });
                      // Cập nhật Cursor thành pointer
                      document.body.style.cursor = 'pointer';
                    }}
                    onPointerOut={() => {
                      setHoveredData(null);
                      document.body.style.cursor = 'auto';
                    }}
                    scale={isHovered ? [1.05, 1, 1.05] : [1, 1, 1]}
                  >
                    <boxGeometry args={[0.9, h, 0.9]} />
                    <meshStandardMaterial 
                      color={isHovered ? '#ee6c4d' : (count === 0 ? '#f8f9fa' : COLORS[Math.min(Math.floor((count / (maxCount || 1)) * 9), 9)])} 
                      roughness={count > 0 ? 0.3 : 0.8}
                      metalness={0.1}
                      emissive={isHovered ? '#ee6c4d' : (count > 0 ? '#ff922b' : '#000')}
                      emissiveIntensity={isHovered ? 0.5 : (count > 0 ? 0.1 : 0)}
                    />
                  </mesh>
                );
              })}
            </group>
          ))}

          {HOURS.map((hour, xIndex) => (
            <Text
              key={hour}
              position={[xIndex + 0.5, 0.1, -0.8]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.4}
              color="#ee6c4d"
              fontWeight="bold"
            >
              {hour}h
            </Text>
          ))}
        </group>

        <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={40} blur={2} far={4.5} />
      </Canvas>

      {/* STABLE TOOLTIP (OUTSIDE CANVAS) */}
      {hoveredData && (
        <div style={{
          position: 'fixed',
          left: mousePos.x + 15,
          top: mousePos.y - 40,
          background: '#2b2d42',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          pointerEvents: 'none',
          transition: 'transform 0.1s ease-out'
        }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}>
            <b style={{ color: '#ee6c4d' }}>{hoveredData.date}</b>
          </div>
          <span>Thời gian: <strong>{hoveredData.hour}h</strong></span>
          <span>Lịch hẹn: <strong style={{ color: '#ffd8a8', fontSize: '15px' }}>{hoveredData.count}</strong></span>
        </div>
      )}
    </div>
  );
}
