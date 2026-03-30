'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { roomMapService, Floor, MOCK_ROOM_DATA } from '@/services/room-map.service';
import { FloorMap } from './FloorMap';
import { initMallMap } from './mall-map.init';

const MallMap = () => {
  const [mapData, setMapData] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorInfo(null);
    try {
      const data = await roomMapService.getMapData();
      console.log('Map Data loaded:', data);
      if (data.length === 0) {
        console.warn('API returned 0 floors/rooms');
      }
      setMapData(data);
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu bản đồ:", error);
      setErrorInfo(error?.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMockData = () => {
    console.log('Manually loading MOCK_ROOM_DATA...');
    // Dùng logic conversion trong component nếu cần, hoặc giả lập API flow
    // Ở đây ta cast trực tiếp qua build logic của service (mock logic)
    // Để đơn giản, ta lặp lại logic build của service ở đây hoặc gọi service chuyên biệt
    // Vì buildFloorsFromRooms không export, ta sẽ fake 1 floor đơn giản
    const mockFloors: Floor[] = [
      { id: 1, name: 'Tầng 1 (MOCK)', level: 1, rooms: MOCK_ROOM_DATA.filter(r => r.floor === 1).map(d => ({
        id: d.name, name: `Phòng ${d.name}`, category: '1', content: d.roomTypeName, floorId: 1, apiId: d.id, status: d.status, isActive: true, rawName: d.name, roomTypeId: 1, roomTypeName: d.roomTypeName
      }))}
    ];
    setMapData(mockFloors);
  };

  useEffect(() => {
    if (!loading) {
      console.log('Initializing Mall Map with', mapData.length, 'floors');
      const timer = setTimeout(() => {
        const cleanup = initMallMap(setSelectedRoomKey);
        return () => {
          if (cleanup) cleanup();
        };
      }, 500); // Đợi DOM sync
      return () => clearTimeout(timer);
    }
  }, [loading, mapData.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="text-orange-500 font-medium">Đang tải bản đồ 3D...</p>
      </div>
    );
  }

  return (
    <div className="container relative">
      {/* Nút Diagnostic - Chỉ hiện khi thiếu data */}
      {mapData.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-6 rounded-lg shadow-2xl border border-orange-200 text-center max-w-sm">
          <h4 className="text-red-500 font-bold mb-2">Không tìm thấy dữ liệu phòng</h4>
          <p className="text-gray-600 text-sm mb-4">
            {errorInfo ? `Lỗi: ${errorInfo}` : 'API /Room đã phản hồi nhưng không có dữ liệu phòng nào được trả về.'}
          </p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => fetchData()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
            >
              Thử tải lại API
            </button>
            <button 
              onClick={loadMockData}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold transition"
            >
              🚀 Tải Dữ Liệu Mẫu (MOCK)
            </button>
          </div>
        </div>
      )}
      <div className="main">
        <div className="mall">
          <div className="surroundings">
            <Image
              className="surroundings__map"
              src="/Interactive3DMallMap/img/surroundings.svg"
              alt="Surroundings"
              width={800}
              height={600}
            />
          </div>
          
          <div className="levels">
            {mapData.map(floor => (
              <FloorMap 
                key={floor.id} 
                floorLevel={floor.level} 
                rooms={floor.rooms}
                selectedRoomKey={selectedRoomKey}
              />
            ))}
          </div>
        </div>

        <button className="boxbutton boxbutton--dark open-search" aria-label="Show search">
          <svg className="icon icon--search"><use xlinkHref="#icon-search"></use></svg>
        </button>

        <nav className="mallnav mallnav--hidden">
          <button className="boxbutton mallnav__button--up" aria-label="Go up"><svg className="icon icon--angle-up"><use xlinkHref="#icon-angle-up"></use></svg></button>
          <button className="boxbutton boxbutton--dark mallnav__button--all-levels" aria-label="Back to all levels"><svg className="icon icon--stack"><use xlinkHref="#icon-stack"></use></svg></button>
          <button className="boxbutton mallnav__button--down" aria-label="Go down"><svg className="icon icon--angle-down"><use xlinkHref="#icon-angle-down"></use></svg></button>
        </nav>

        <div className="content">
          <button className="boxbutton boxbutton--dark content__button content__button--hidden" aria-label="Close details">
            <svg className="icon icon--cross"><use xlinkHref="#icon-cross"></use></svg>
          </button>
          {mapData.flatMap(f => f.rooms).map(room => (
            <div key={room.rawName} className="content__item" data-space={room.rawName} data-category={room.category}>
              <h3 className="content__item-title" style={{ color: '#fa8314' }}>{room.name}</h3>
              <div className="content__item-details">
                <p className="content__meta">
                  <span className="content__meta-item" style={{ color: '#fa8314', fontWeight: 'bold' }}>The Joyful Nest</span>
                </p>
                <p className="content__desc">{room.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="spaces-list" id="spaces-list">
        <div className="search">
          <input className="search__input" style={{ backgroundColor: '#1e1e1e' }} placeholder="Tìm kiếm phòng..." />
          <button className="boxbutton boxbutton--darker close-search" aria-label="Close search">
            <svg className="icon icon--cross"><use xlinkHref="#icon-cross"></use></svg>
          </button>
        </div>
        <span className="label">
          <input id="sort-by-name" className="label__checkbox" type="checkbox" aria-label="Sắp xếp theo tên" />
          <label className="label__text" style={{ color: '#fa8314' }}>A - Z</label>
        </span>
        <ul className="list grouped-by-category">
          {mapData.map(floor => (
            floor.rooms.map(room => (
              <li key={room.rawName} className="list__item" data-level={floor.level} data-category={room.category} data-space={room.rawName}>
                <a href="#" className="list__link">{room.name}</a>
              </li>
            ))
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default MallMap;
