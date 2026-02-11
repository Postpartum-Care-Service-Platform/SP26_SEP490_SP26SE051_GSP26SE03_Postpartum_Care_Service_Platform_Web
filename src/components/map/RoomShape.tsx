import React from 'react';
import { Room } from '@/services/room-map.service';

interface RoomShapeProps {
  room: Room;
  shapeData: {
    type: 'polygon' | 'rect' | 'path' | 'circle';
    points?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    d?: string;
    cx?: number;
    cy?: number;
    r?: number;
  };
  isSelected: boolean;
}

export const RoomShape: React.FC<RoomShapeProps> = ({ room, shapeData, isSelected }) => {
  const commonProps = {
    'data-space': room.id,
    className: `map__space ${isSelected ? 'map__space--selected' : ''}`,
  };

  const renderShape = () => {
    switch (shapeData.type) {
      case 'polygon':
        return <polygon {...commonProps} points={shapeData.points} />;
      case 'rect':
        return <rect {...commonProps} x={shapeData.x} y={shapeData.y} width={shapeData.width} height={shapeData.height} rx="4" />;
      case 'path':
        return <path {...commonProps} d={shapeData.d} />;
      case 'circle':
        return <circle {...commonProps} cx={shapeData.cx} cy={shapeData.cy} r={shapeData.r} />;
      default:
        return null;
    }
  };

  // Tính toán tâm để đặt label và điểm nhô lên
  const getCenter = () => {
    if (shapeData.type === 'rect' && shapeData.x !== undefined && shapeData.y !== undefined) {
      return { x: shapeData.x + (shapeData.width || 0) / 2, y: shapeData.y + (shapeData.height || 0) / 2 };
    }
    if (shapeData.type === 'circle') {
      return { x: shapeData.cx || 0, y: shapeData.cy || 0 };
    }
    if (shapeData.type === 'polygon' && shapeData.points) {
      const pts = shapeData.points.split(/[ ,]+/).filter(s => s !== '').map(Number);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < pts.length; i += 2) {
        if (!isNaN(pts[i])) {
          minX = Math.min(minX, pts[i]);
          maxX = Math.max(maxX, pts[i]);
          minY = Math.min(minY, pts[i + 1]);
          maxY = Math.max(maxY, pts[i + 1]);
        }
      }
      return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    }
    if (shapeData.type === 'path' && shapeData.d) {
      // Logic đơn giản cho path (ví dụ path hình chữ nhật bo góc của template)
      const m = shapeData.d.match(/[ML]\s*([\d.]+)[,\s]+([\d.]+)/i);
      if (m) {
        const startX = parseFloat(m[1]);
        const startY = parseFloat(m[2]);
        // Giả định tâm dịch chuyển một chút từ điểm bắt đầu cho path của template
        return { x: startX + 40, y: startY + 50 };
      }
    }
    return { x: 0, y: 0 };
  };

  const center = getCenter();

  return (
    <g className={`room-group ${isSelected ? 'room-group--selected' : ''}`}>
      {/* Hình khối căn phòng */}
      {renderShape()}
      
      {/* Điểm nhô lên (Pin Indicator) để nhận biết vị trí click */}
      <circle 
        cx={center.x} 
        cy={center.y} 
        r="8" 
        className={`map__pin-point ${isSelected ? 'map__pin-point--selected' : ''}`}
        data-space={room.id}
      />

      {/* Nhãn số phòng */}
      <text 
        x={center.x} 
        y={center.y - 25} 
        className="map__label"
      >
        {room.rawName}
      </text>
    </g>
  );
};
