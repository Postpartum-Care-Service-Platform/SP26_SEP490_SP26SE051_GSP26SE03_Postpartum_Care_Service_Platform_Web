'use client';

import React, { useEffect, useState } from 'react';
import { roomMapService, Floor } from '@/services/room-map.service';
import { initMallMap } from './mall-map.init';
import { FloorMap } from './FloorMap';

const MallMap = () => {
  const [mapData, setMapData] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await roomMapService.getMapData();
        setMapData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bản đồ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && mapData.length > 0) {
      const cleanup = initMallMap(setSelectedRoomKey);
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [loading, mapData]);

  if (loading) {
    return <div className="p-10 text-center text-orange-500">Đang tải bản đồ...</div>;
  }

  return (
    <div className="container">
      <div className="main">
        <div className="mall">
          <div className="surroundings">
            <img className="surroundings__map" src="/Interactive3DMallMap/img/surroundings.svg" alt="Surroundings" />
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
