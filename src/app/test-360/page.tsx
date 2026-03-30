'use client';

import React, { useState } from 'react';
import { ThreeSixtyViewer } from "@/components/ui/three-sixty-viewer/ThreeSixtyViewer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Test360Page() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [activeTour, setActiveTour] = useState<'mall' | 'left_building' | 'center_building'>('mall');
  
  // Calibration state
  const [calibration, setCalibration] = useState({
    xScale: 1.0,
    yScale: 1.0,
    xOffset: 0,
    yOffset: 0,
    coordBase: 1000,
    frameOffset: 0
  });

  const handleBuildingClick = (id: string) => {
    setSelectedBuilding(id);

    // Building 3 (left building) opens its own dedicated 360 set
    if (id === '3') {
      setActiveTour('left_building');
      return;
    }

    // Building 2 (center building) opens center building 360 set
    if (id === '2') {
      setActiveTour('center_building');
      return;
    }

    setTimeout(() => setSelectedBuilding(null), 3000);
  };

  const handleBackToMall = () => {
    setActiveTour('mall');
    setSelectedBuilding(null);
    setCalibration((prev) => ({ ...prev, frameOffset: 0 }));
  };

  const switchTour = (tour: 'mall' | 'left_building' | 'center_building') => {
    setActiveTour(tour);
    setSelectedBuilding(null);
    setCalibration((prev) => ({ ...prev, frameOffset: 0 }));
  };

  return (
    <div style={{ padding: '0 40px 80px', width: '100%', margin: '0 auto', fontFamily: 'system-ui', backgroundColor: '#fff' }}>
      <header style={{ padding: '24px 0', borderBottom: '1px solid #eee', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Link href="/" style={{ color: '#fa8314', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <ChevronLeft size={20} />
              Quay lại trang chủ
            </Link>
            <h1 style={{ marginTop: '12px', fontSize: '24px', letterSpacing: '-0.5px', fontWeight: '800', color: '#004a8c' }}>3D ESTATE - VIRTUAL TOUR</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '30px', fontSize: '13px', fontWeight: '500' }}>BẢN DEMO</div>
            <div style={{ padding: '8px 24px', backgroundColor: '#004a8c', color: '#fff', borderRadius: '30px', fontSize: '13px', fontWeight: '600' }}>LIÊN HỆ TƯ VẤN</div>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Viewer - Immersive Layout */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '4/3',
          backgroundColor: '#000', 
          borderRadius: '32px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
          border: '1px solid #eee'
        }}>
          <ThreeSixtyViewer 
            imagePath={
              activeTour === 'mall'
                ? '/thejoyfulnest/Mall/f_'
                : activeTour === 'left_building'
                  ? '/thejoyfulnest/Mall/left_building/f_'
                  : '/thejoyfulnest/Mall/center_building/f_'
            }
            frameCount={120}
            extension=".jpg"
            onBuildingClick={handleBuildingClick}
            selectedBuildingId={selectedBuilding}
            showBuildingOverlay={false}
            calibration={calibration}
            hotspots={
              activeTour === 'mall' 
                ? [
                    {
                      id: 'left-building-h',
                      type: 'navigation',
                      label: 'Khám phá Tòa Bên Trái',
                      anchorBuildingId: '3', 
                      frame: 0,
                      x: 27,
                      y: 55,
                      onClick: () => switchTour('left_building')
                    },
                    // Floor hotspots on Mall view - Single consolidated column
                    { id: 'lb-f1', type: 'info', label: 'Căn hộ Tầng 1', anchorBuildingId: '3', frame: 0, x: 63, y: 82 },
                    { id: 'lb-f2', type: 'info', label: 'Căn hộ Tầng 2', anchorBuildingId: '3', frame: 0, x: 63, y: 62 },
                    { id: 'lb-f3', type: 'info', label: 'Căn hộ Tầng 3', anchorBuildingId: '3', frame: 0, x: 63, y: 42 },
                    { id: 'lb-f4', type: 'info', label: 'Căn hộ Tầng 4', anchorBuildingId: '3', frame: 0, x: 63, y: 22 }
                  ]
                : activeTour === 'left_building'
                  ? [
                      {
                        id: 'lb-base',
                        type: 'info',
                        label: 'Khu vực Sảnh & Tiện ích',
                        frame: 0,
                        x: 55,
                        y: 82,
                        description: 'Khu vực đón khách và các tiện ích tầng trệt'
                      },
                      // Detailed hotspots when INSIDE the tour
                      { id: 'lb-f1-l-det', type: 'info', label: 'Căn hộ 101 (View Hồ)', frame: 0, x: 38, y: 64 },
                      { id: 'lb-f1-r-det', type: 'info', label: 'Căn hộ 102 (View Vườn)', frame: 0, x: 64, y: 64 },
                      { id: 'lb-f2-l-det', type: 'info', label: 'Căn hộ 201', frame: 0, x: 38, y: 48 },
                      { id: 'lb-f2-r-det', type: 'info', label: 'Căn hộ 202', frame: 0, x: 64, y: 48 },
                      { id: 'lb-f3-l-det', type: 'info', label: 'Căn hộ 301', frame: 0, x: 38, y: 32 },
                      { id: 'lb-f3-r-det', type: 'info', label: 'Căn hộ 302', frame: 0, x: 64, y: 32 },
                      { id: 'lb-f4-l-det', type: 'info', label: 'Căn hộ 401', frame: 0, x: 38, y: 16 },
                      { id: 'lb-f4-r-det', type: 'info', label: 'Căn hộ 402', frame: 0, x: 64, y: 16 },
                    ]
                  : []
            }
          />
          
          {selectedBuilding && activeTour === 'mall' && (
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#004a8c',
              padding: '16px 32px',
              borderRadius: '40px',
              fontWeight: 'bold',
              zIndex: 100,
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid #fff'
            }}>
              ĐANG KHÁM PHÁ: TÒA NHÀ {selectedBuilding}
            </div>
          )}

          <div style={{
            position: 'absolute',
            top: '26px',
            left: '26px',
            display: 'flex',
            gap: '10px',
            zIndex: 120,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => switchTour('mall')}
              style={{
                border: 'none',
                background: activeTour === 'mall' ? '#004a8c' : 'rgba(255,255,255,0.92)',
                color: activeTour === 'mall' ? '#fff' : '#004a8c',
                borderRadius: '999px',
                padding: '10px 16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
              }}
            >
              Mall 360
            </button>

            <button
              onClick={() => switchTour('left_building')}
              style={{
                border: 'none',
                background: activeTour === 'left_building' ? '#004a8c' : 'rgba(255,255,255,0.92)',
                color: activeTour === 'left_building' ? '#fff' : '#004a8c',
                borderRadius: '999px',
                padding: '10px 16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
              }}
            >
              Left Building 360
            </button>

            <button
              onClick={() => switchTour('center_building')}
              style={{
                border: 'none',
                background: activeTour === 'center_building' ? '#004a8c' : 'rgba(255,255,255,0.92)',
                color: activeTour === 'center_building' ? '#fff' : '#004a8c',
                borderRadius: '999px',
                padding: '10px 16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
              }}
            >
              Center Building 360
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}
