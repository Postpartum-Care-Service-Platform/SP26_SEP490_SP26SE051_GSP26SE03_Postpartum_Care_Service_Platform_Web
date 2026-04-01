'use client';

import React, { useState } from 'react';
import { ThreeSixtyViewer } from "@/components/ui/three-sixty-viewer/ThreeSixtyViewer";
import { PanoramaViewer } from "@/components/ui/panorama-viewer/PanoramaViewer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Test360Page() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [activeTour, setActiveTour] = useState<'mall' | 'left_building' | 'center_building'>('mall');
  const [viewMode, setViewMode] = useState<'tour' | 'panorama'>('tour');
  const [activePanorama, setActivePanorama] = useState<{ 
    folder: string, 
    prefix: string, 
    suffix?: string, 
    title?: string,
    tourHotspots: any[] 
  } | null>(null);
  
  // Calibration state
  const [calibration, setCalibration] = useState({
    xScale: 1.0,
    yScale: 1.0,
    xOffset: 0,
    yOffset: 0,
    coordBase: 1000,
    frameOffset: 0
  });

  // Consolidated Interior Virtual Tour Data
  const APARTMENT_TOUR_HOTSPOTS = [
    {
      id: 'hp-001', label: '1. Phòng Khách', ry: 0, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/first_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '001', title: 'Căn hộ - Phòng Khách' }
    },
    {
      id: 'hp-002', label: '2. Ban Công', ry: 45, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/fourth_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '002', title: 'Căn hộ - Ban Công' }
    },
    {
      id: 'hp-003', label: '3. Lối Vào / Hành Lang', ry: -45, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/sixth_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '003', title: 'Căn hộ - Hành Lang' }
    },
    {
      id: 'hp-004', label: '4. Phòng Ngủ Phụ', ry: -90, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/seventh_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '004', title: 'Căn hộ - Phòng Ngủ Phụ' }
    },
    {
      id: 'hp-005', label: '5. Phòng Tắm / WC', ry: -135, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/eigth_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '005', title: 'Căn hộ - Phòng Tắm' }
    },
    {
      id: 'hp-006', label: '6. Phòng Ngủ Master', ry: 180, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/sec_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '006', title: 'Căn hộ - Phòng Ngủ Master' }
    },
    {
      id: 'hp-007', label: '7. Sảnh Chuyển Tiếp', ry: 135, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/fifth_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '007', title: 'Căn hộ - Sảnh Chuyển Tiếp' }
    },
    {
      id: 'hp-008', label: '8. Khu Vực Bếp', ry: 90, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/first_floor/thr_hotspot', filePrefix: 'f5919657-b65c-4a54-8c4e-73e838ecc55f', fileSuffix: '008', title: 'Căn hộ - Phòng Bếp' }
    }
  ];

  const GROUND_FLOOR_TOUR_HOTSPOTS = [
    {
      id: 'gf-001', label: '1. Sảnh Chính', ry: 0, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/Ground_floor/first_hotspot', filePrefix: '10935128-83ae-4be8-a095-fbaf8297180c', fileSuffix: '001', title: 'Sảnh - Lối Vào Chính' }
    },
    {
      id: 'gf-002', label: '2. Khu Tiện Ích', ry: 90, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/Ground_floor/fourth_hotspot', filePrefix: '10935128-83ae-4be8-a095-fbaf8297180c', fileSuffix: '002', title: 'Sảnh - Khu Tiện Ích' }
    },
    {
      id: 'gf-003', label: '3. Khu Chờ', ry: 180, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/Ground_floor/third_hotspot', filePrefix: '10935128-83ae-4be8-a095-fbaf8297180c', fileSuffix: '003', title: 'Sảnh - Khu Vực Chờ' }
    },
    {
      id: 'gf-004', label: '4. Lối Thang Máy', ry: -90, rx: -10,
      target: { folderPath: '/thejoyfulnest/Mall/left_building/first_block/Ground_floor/sec_hotspot', filePrefix: '10935128-83ae-4be8-a095-fbaf8297180c', fileSuffix: '004', title: 'Sảnh - Lối Thang Máy' }
    }
  ];

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

  const handleTourChange = (tour: 'mall' | 'left_building' | 'center_building') => {
    setActiveTour(tour);
    if (tour === 'mall') {
      setSelectedBuilding(null);
    } else if (tour === 'left_building') {
      setSelectedBuilding('3');
    } else if (tour === 'center_building') {
      setSelectedBuilding('4');
    }
    setViewMode('tour');
    setActivePanorama(null);
    setCalibration((prev) => ({ ...prev, frameOffset: 0 }));
  };

  const handleOpenPanorama = (folder: string, prefix: string, suffix: string = '001', title: string = "Chi tiết", tourHotspots: any[] = []) => {
    setActivePanorama({ folder, prefix, suffix, title, tourHotspots });
    setViewMode('panorama');
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
          {/* Premium Tour Selector Tabs */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            padding: '6px',
            borderRadius: '40px',
            zIndex: 1000,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}>
            <button 
              onClick={() => handleTourChange('mall')}
              style={{
                background: activeTour === 'mall' ? '#004a8c' : 'transparent',
                color: activeTour === 'mall' ? '#fff' : '#004a8c',
                padding: '10px 24px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              Mall 360
            </button>
            <button 
              onClick={() => handleTourChange('left_building')}
              style={{
                background: activeTour === 'left_building' ? '#004a8c' : 'transparent',
                color: activeTour === 'left_building' ? '#fff' : '#004a8c',
                padding: '10px 24px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              Left Building 360
            </button>
            <button 
              onClick={() => handleTourChange('center_building')}
              style={{
                background: activeTour === 'center_building' ? '#004a8c' : 'transparent',
                color: activeTour === 'center_building' ? '#fff' : '#004a8c',
                padding: '10px 24px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap'
              }}
            >
              Center Building 360
            </button>
          </div>

          <div style={{ width: '100%', height: '100%', position: 'relative', display: viewMode === 'tour' ? 'block' : 'none' }}>
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
                          onClick: () => handleTourChange('left_building')
                        },
                        // Floor hotspots on Mall view - Strategic Vertical Column
                        { 
                          id: 'lb-gf', 
                          type: 'navigation', 
                          label: 'Tầng Trệt: Sảnh & Tiện ích', 
                          anchorBuildingId: '3', 
                          frame: 0, 
                          x: 63, 
                          y: 92,
                          onClick: () => handleOpenPanorama(
                            '/thejoyfulnest/Mall/left_building/first_block/Ground_floor/first_hotspot',
                            '10935128-83ae-4be8-a095-fbaf8297180c',
                            '001',
                            'Sảnh & Tiện ích Tầng Trệt',
                            GROUND_FLOOR_TOUR_HOTSPOTS
                          )
                        },
                        { 
                          id: 'lb-f1', 
                          type: 'info', 
                          label: 'Căn hộ Tầng 1', 
                          anchorBuildingId: '3', 
                          frame: 0, 
                          x: 63, 
                          y: 77,
                          onClick: () => handleOpenPanorama(
                            '/thejoyfulnest/Mall/left_building/first_block/first_floor/first_hotspot',
                            'f5919657-b65c-4a54-8c4e-73e838ecc55f',
                            '001',
                            'Căn hộ Tầng 1 - Phòng Khách',
                            APARTMENT_TOUR_HOTSPOTS
                          )
                        },
                        { 
                          id: 'lb-f2', 
                          type: 'info', 
                          label: 'Căn hộ Tầng 2', 
                          anchorBuildingId: '3', 
                          frame: 0, 
                          x: 63, 
                          y: 62,
                          onClick: () => handleOpenPanorama(
                            '/thejoyfulnest/Mall/left_building/first_block/first_floor/sec_hotspot',
                            'f5919657-b65c-4a54-8c4e-73e838ecc55f',
                            '006',
                            'Căn hộ Tầng 2 - Phòng Ngủ',
                            APARTMENT_TOUR_HOTSPOTS
                          )
                        },
                        { id: 'lb-f3', type: 'info', label: 'Căn hộ Tầng 3', anchorBuildingId: '3', frame: 0, x: 63, y: 47 },
                        { id: 'lb-f4', type: 'info', label: 'Căn hộ Tầng 4', anchorBuildingId: '3', frame: 0, x: 63, y: 32 }
                      ]
                  : activeTour === 'left_building'
                    ? [
                        {
                          id: 'lb-base',
                          type: 'navigation',
                          label: 'Khu vực Sảnh & Tiện ích',
                          frame: 0,
                          x: 55,
                          y: 82,
                          description: 'Khu vực đón khách và các tiện ích tầng trệt',
                          onClick: () => handleOpenPanorama(
                            '/thejoyfulnest/Mall/left_building/first_block/Ground_floor/first_hotspot',
                            '10935128-83ae-4be8-a095-fbaf8297180c',
                            '001',
                            'Sảnh & Tiện ích Tầng Trệt',
                            GROUND_FLOOR_TOUR_HOTSPOTS
                          )
                        },
                        // Detailed hotspots when INSIDE the tour
                        { 
                          id: 'lb-f1-l-det', 
                          type: 'info', 
                          label: 'Căn hộ 101 (View Hồ)', 
                          frame: 0, 
                          x: 38, 
                          y: 64,
                          onClick: () => handleOpenPanorama(
                            '/thejoyfulnest/Mall/left_building/first_block/first_floor/first_hotspot',
                            'f5919657-b65c-4a54-8c4e-73e838ecc55f',
                            '001',
                            'Căn hộ 101 - Phòng Khách',
                            APARTMENT_TOUR_HOTSPOTS
                          )
                        },
                        { 
                          id: 'lb-f1-r-det', 
                          type: 'info', 
                          label: 'Căn hộ 102 (View Vườn)', 
                          frame: 0, 
                          x: 64, 
                          y: 64,
                          onClick: () => handleOpenPanorama(
                            '/thejoyfulnest/Mall/left_building/first_block/first_floor/sec_hotspot',
                            'f5919657-b65c-4a54-8c4e-73e838ecc55f',
                            '006',
                            'Căn hộ 102 - Phòng Ngủ',
                            APARTMENT_TOUR_HOTSPOTS
                          )
                        },
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
          </div>

          {viewMode === 'panorama' && activePanorama && (
            <PanoramaViewer 
              id="active-pano"
              folderPath={activePanorama.folder}
              filePrefix={activePanorama.prefix}
              fileSuffix={activePanorama.suffix}
              title={activePanorama.title}
              onBack={() => setViewMode('tour')}
              hotspots={activePanorama.tourHotspots}
            />
          )}
          
          {selectedBuilding && activeTour === 'mall' && (
            <div style={{
              position: 'absolute',
              top: '80px',
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
            bottom: '26px',
            right: '26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 100
          }}>
            <button
               onClick={() => setViewMode('tour')}
               style={{
                background: '#004a8c',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                display: viewMode === 'panorama' ? 'block' : 'none'
               }}
            >
              Quay lại 3D Tour
            </button>
          </div>
        </div>


      </div>
    </div>
  );
}
