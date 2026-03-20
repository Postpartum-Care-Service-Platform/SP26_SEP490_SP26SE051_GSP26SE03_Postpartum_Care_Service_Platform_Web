'use client';

import React, { useState, useEffect } from 'react';
import { ContractModalHeader } from './ContractModalHeader';

interface ContractPreviewModalProps {
  contract: {
    code: string;
    fileUrl: string | null;
  };
  onClose: () => void;
}

export function ContractPreviewModal({ contract, onClose }: ContractPreviewModalProps) {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setZoom(prev => Math.min(prev + 10, 300));
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          setZoom(prev => Math.max(prev - 10, 50));
        } else if (e.key === '0') {
          e.preventDefault();
          setZoom(100);
        }
      }
    };

    const handleGlobalWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        setZoom(prev => Math.max(50, Math.min(300, prev + delta)));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '1200px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden'
        }}
      >
        <ContractModalHeader 
          title={contract.code} 
          onClose={onClose} 
          onDownload={() => contract.fileUrl && window.open(contract.fileUrl, '_blank')}
        />
        <div 
          style={{ 
            flex: 1, 
            backgroundColor: '#f3f4f6', 
            position: 'relative',
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            padding: '40px 20px'
          }}
        >
          {contract.fileUrl ? (
            <div style={{ 
              maxWidth: '900px', 
              width: `${zoom}%`, 
              backgroundColor: '#fff', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
              padding: '0',
              transition: 'width 0.2s ease-in-out'
            }}>
              <img 
                src={contract.fileUrl}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                title={`Hợp đồng ${contract.code}`}
                alt={`Hợp đồng ${contract.code}`}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', flexDirection: 'column', gap: '10px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
                <line x1="9" y1="9" x2="10" y2="9" />
              </svg>
              <span>Không tìm thấy hình ảnh hợp đồng</span>
            </div>
          )}
        </div>
        
        {/* Modal Footer with Page Info and Zoom */}
        <div style={{ 
          height: '40px', 
          backgroundColor: '#fff', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 15px',
          color: '#6b7280',
          fontSize: '13px'
        }}>
          <div>Trang 1/1</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 500 }}>{zoom}%</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={handleZoomOut}
                style={{ border: 'none', background: 'none', padding: '5px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                title="Thu nhỏ (-)"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
              <button 
                onClick={handleZoomIn}
                style={{ border: 'none', background: 'none', padding: '5px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                title="Phóng to (+)"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159ZM4.25 6.5C4.25 6.22386 4.47386 6 4.75 6H6V4.75C6 4.47386 6.22386 4.25 6.5 4.25C6.77614 4.25 7 4.47386 7 4.75V6H8.25C8.52614 6 8.75 6.22386 8.75 6.5C8.75 6.77614 8.52614 7 8.25 7H7V8.25C7 8.52614 6.77614 8.75 6.5 8.75C6.22386 8.75 6 8.52614 6 8.25V7H4.75C4.47386 7 4.25 6.77614 4.25 6.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
