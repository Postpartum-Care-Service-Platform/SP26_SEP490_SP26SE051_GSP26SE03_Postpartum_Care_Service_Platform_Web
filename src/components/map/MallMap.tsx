'use client';

import React, { useEffect, useState } from 'react';
import { roomMapService, Floor } from '@/services/room-map.service';
import { initMallMap } from './mall-map.init';

const MallMap = () => {
  const [mapData, setMapData] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);

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
      const cleanup = initMallMap();
      return () => {
        if (cleanup) cleanup();
      };
    }
  }, [loading, mapData]);

  if (loading) {
    return <div className="p-10 text-center">Đang tải bản đồ...</div>;
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
              <div key={floor.id} className={`level level--${floor.level}`} aria-label={floor.name}>
                <svg className={`map map--${floor.level}`} viewBox="0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  <title>{floor.name}</title>
                  <polygon points="1035.94 787.41 1035.94 423.16 855.37 423.16 855.37 350.52 1187.28 350.52 1187.28 12.59 548.09 12.59 548.09 68.87 437.36 68.87 437.36 12.59 49.37 12.59 49.37 366.5 12.72 366.5 12.72 787.41 356.2 787.41 414.93 584.41 554.4 584.41 627.81 787.41 1035.94 787.41" className="map__ground" />
                  <path d="M1187.28,12.59V350.52H855.37v72.64h180.58V787.41H627.81l-73.41-203H414.93l-58.73,203H12.72V366.5H49.37V12.59h388V68.87H548.08V12.59h639.19M1200,0H535.36V56.28H450.09V0H36.65V353.91H0V800H365.8l2.64-9.13L424.52,597H545.44l70.39,194.65,3,8.35h429.82V410.57H868.09V363.11H1200V0h0Z" className="map__outline" />
                  
                  {floor.rooms.map(room => (
                    <polygon 
                      key={room.id}
                      data-space={room.id}
                      points="12.72 685.56 153.78 685.56 153.78 747.64 215.44 747.64 215.44 712.85 263.89 712.85 263.89 787.41 12.72 787.41 12.72 685.56"
                      className="map__space"
                    />
                  ))}
                </svg>
                <div className="level__pins">
                  {floor.rooms.map(room => (
                    <a key={room.id} className={`pin pin--${floor.level}-${room.rawName.slice(-1)}`} 
                       data-category={room.category} data-space={room.id} href="#" aria-label={`Pin for ${room.name}`}>
                      <span className="pin__icon">
                        <svg className="icon icon--pin"><use xlinkHref="#icon-pin"></use></svg>
                        <svg className="icon icon--logo"><use xlinkHref={room.category === '1' ? "#icon-appleheart" : room.category === '2' ? "#icon-origami" : "#icon-dress"}></use></svg>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
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
            <div key={room.id} className="content__item" data-space={room.id} data-category={room.category}>
              <h3 className="content__item-title">{room.name}</h3>
              <div className="content__item-details">
                <p className="content__meta">
                  <span className="content__meta-item">Dịch vụ chăm sóc sau sinh</span>
                </p>
                <p className="content__desc">{room.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="spaces-list" id="spaces-list">
        <div className="search">
          <input className="search__input" placeholder="Tìm kiếm..." />
          <button className="boxbutton boxbutton--darker close-search" aria-label="Close search">
            <svg className="icon icon--cross"><use xlinkHref="#icon-cross"></use></svg>
          </button>
        </div>
        <span className="label">
          <input id="sort-by-name" className="label__checkbox" type="checkbox" aria-label="Sắp xếp theo tên" />
          <label className="label__text">A - Z</label>
        </span>
        <ul className="list grouped-by-category">
          {mapData.map(floor => (
            floor.rooms.map(room => (
              <li key={room.id} className="list__item" data-level={floor.level} data-category={room.category} data-space={room.id}>
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
