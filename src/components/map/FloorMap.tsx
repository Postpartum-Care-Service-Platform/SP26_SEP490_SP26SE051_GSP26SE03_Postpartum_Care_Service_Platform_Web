import React from 'react';

import { Room } from '@/services/room-map.service';

import { FLOOR_SHAPES } from './floor-shapes';
import { RoomShape } from './RoomShape';

interface FloorMapProps {
  floorLevel: number;
  rooms: Room[];
  selectedRoomKey?: string | null;
}

export const FloorMap: React.FC<FloorMapProps> = ({ floorLevel, rooms, selectedRoomKey }) => {
  const shapes = FLOOR_SHAPES[floorLevel] ?? {};

  return (
    <div className={`level level--${floorLevel}`} aria-label={`Level ${floorLevel}`}>
      <svg className={`map map--${floorLevel}`} viewBox="0 0 1200 800" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <title>{`Map Level ${floorLevel}`}</title>

        <polygon
          points="1035.94 787.41 1035.94 423.16 855.37 423.16 855.37 350.52 1187.28 350.52 1187.28 12.59 548.09 12.59 548.09 68.87 437.36 68.87 437.36 12.59 49.37 12.59 49.37 366.5 12.72 366.5 12.72 787.41 356.2 787.41 414.93 584.41 554.4 584.41 627.81 787.41 1035.94 787.41"
          className="map__ground"
        />
        <path
          d="M1187.28,12.59V350.52H855.37v72.64h180.58V787.41H627.81l-73.41-203H414.93l-58.73,203H12.72V366.5H49.37V12.59h388V68.87H548.08V12.59h639.19M1200,0H535.36V56.28H450.09V0H36.65V353.91H0V800H365.8l2.64-9.13L424.52,597H545.44l70.39,194.65,3,8.35h429.82V410.57H868.09V363.11H1200V0h0Z"
          className="map__outline"
        />

        {rooms.map((room) => {
          const shape = shapes[room.rawName];
          if (!shape) return null;

          return (
            <RoomShape
              key={room.rawName}
              room={{ ...room, id: room.rawName }}
              shapeData={shape}
              isSelected={selectedRoomKey === room.rawName}
            />
          );
        })}
      </svg>
    </div>
  );
};
