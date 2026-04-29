'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useToast } from '@/components/ui/toast/use-toast';
import { 
  Table, FormInput, Save, X, 
  Layout, CreditCard, List,
  AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  MousePointer2, ChevronDown, Briefcase, Database, PanelRightClose, PanelRightOpen,
  Box, Move, Type, Eye, Droplets, Maximize, CornerUpRight, Square, Code, MoreHorizontal, Layers, RotateCcw, Check, Minus, Circle, Image as ImageIcon, MessageSquare, Settings
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import styles from '../page-builder.module.css';

interface CanvasComponent {
  id: string;
  type: string;
  label: string;
  config: {
    x: number;
    y: number;
    w: number;
    h: number;
    rotation: number;
    opacity: number;
    radius: number;
  };
}

export default function CreatePageBuilder() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['templates', 'components', 'layout', 'typography']);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const [pageInfo, setPageInfo] = useState({ title: '', apiEndpoint: '' });
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);

  // Interaction states
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const resizerRef = useRef<{ id: string, startX: number, startY: number, startW: number, startH: number, startXPos: number, startYPos: number, direction: string } | null>(null);
  const dragRef = useRef<{ id: string, startX: number, startY: number, startXPos: number, startYPos: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizerRef.current) {
        const { id, startX, startY, startW, startH, startXPos, startYPos, direction } = resizerRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        setCanvasComponents(prev => prev.map(comp => {
          if (comp.id === id) {
            let newW = comp.config.w;
            let newH = comp.config.h;
            let newX = comp.config.x;
            let newY = comp.config.y;

            if (direction.includes('r')) newW = Math.max(50, startW + deltaX);
            if (direction.includes('b')) newH = Math.max(50, startH + deltaY);
            if (direction.includes('l')) {
              newW = Math.max(50, startW - deltaX);
              if (newW > 50) newX = startXPos + deltaX;
            }
            if (direction.includes('t')) {
              newH = Math.max(50, startH - deltaY);
              if (newH > 50) newY = startYPos + deltaY;
            }

            return {
              ...comp,
              config: { ...comp.config, w: newW, h: newH, x: newX, y: newY }
            };
          }
          return comp;
        }));
      } else if (isDragging && dragRef.current) {
        const { id, startX, startY, startXPos, startYPos } = dragRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        setCanvasComponents(prev => prev.map(comp => {
          if (comp.id === id) {
            return {
              ...comp,
              config: {
                ...comp.config,
                x: startXPos + deltaX,
                y: startYPos + deltaY
              }
            };
          }
          return comp;
        }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
      resizerRef.current = null;
      dragRef.current = null;
    };

    if (isResizing || isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging]);

  const startResizing = (e: React.MouseEvent, id: string, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    const comp = canvasComponents.find(c => c.id === id);
    if (!comp) return;

    setIsResizing(true);
    resizerRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      startW: comp.config.w,
      startH: comp.config.h,
      startXPos: comp.config.x,
      startYPos: comp.config.y,
      direction
    };
  };

  const startDragging = (e: React.MouseEvent, id: string) => {
    // Only drag if clicking the component itself, not a handle
    const target = e.target as HTMLElement;
    if (target.className && target.className.toString().includes('resizeHandle')) return;
    
    e.stopPropagation();
    e.preventDefault();
    const comp = canvasComponents.find(c => c.id === id);
    if (!comp) return;

    setIsDragging(true);
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      startXPos: comp.config.x,
      startYPos: comp.config.y
    };
    setSelectedId(id);
    setIsInspectorCollapsed(false);
  };

  const addComponent = (type: string, label: string) => {
    const isTemplate = type === 'template-management-table';
    
    const newComponent: CanvasComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label,
      config: { 
        x: 50, 
        y: 50 + (canvasComponents.length * 40), 
        w: isTemplate ? 1000 : (type.includes('text') || type.includes('heading') ? 300 : 800), 
        h: isTemplate ? 600 : (type.includes('heading') ? 40 : 120), 
        rotation: 0, 
        opacity: 100, 
        radius: 0 
      }
    };
    setCanvasComponents([...canvasComponents, newComponent]);
    setSelectedId(newComponent.id);
    setIsInspectorCollapsed(false);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleDragStart = (e: React.DragEvent, type: string, label: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.setData('componentLabel', label);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const type = e.dataTransfer.getData('componentType');
    const label = e.dataTransfer.getData('componentLabel');
    if (type && label) {
      addComponent(type, label);
    }
  };

  const SidebarGroup = ({ id, title, icon: Icon, children }: { id: string, title: string, icon: any, children: React.ReactNode }) => {
    const isActive = expandedGroups.includes(id);
    return (
      <div className={styles.sidebarGroup}>
        <div className={styles.groupHeader} onClick={() => toggleGroup(id)}>
          <div className={styles.groupTitle}>
            <Icon size={14} color={isActive ? '#f97316' : '#64748b'} />
            <span className={isCollapsed ? styles.collapsedHide : ''}>{title}</span>
          </div>
          <div className={isCollapsed ? styles.collapsedHide : ''}>
             <ChevronDown size={14} color="#94a3b8" style={{ transform: isActive ? 'none' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
          </div>
        </div>
        <div className={`${styles.groupContent} ${isActive ? styles.groupContentActive : ''}`}>
          {children}
        </div>
      </div>
    );
  };

  const ComponentTile = ({ icon: Icon, label, type }: { icon: any, label: string, type: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            draggable 
            onDragStart={(e) => handleDragStart(e, type, label)} 
            onClick={() => addComponent(type, label)} 
            className={styles.componentItem}
          >
            <Icon size={18} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" style={{ fontSize: '11px', backgroundColor: '#1e293b', color: 'white' }}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const selectedComponent = canvasComponents.find(c => c.id === selectedId);

  return (
    <AdminPageLayout 
      header={<Breadcrumbs items={[{ label: 'Page Builder', href: '/admin/page-builder' }, { label: 'Thiết kế chuyên nghiệp' }]} />} 
      noCard 
      noScroll
    >
      <div className={styles.builderLayout}>
        <div className={`${styles.builderSidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
          <div className={styles.sidebarTitle}>
             <span className={isCollapsed ? styles.collapsedHide : ''}>Thư viện</span>
             <button className={styles.toggleBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
               {isCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
             </button>
          </div>
          
          <SidebarGroup id="templates" title="Mẫu" icon={Briefcase}>
            <ComponentTile icon={Table} label="Bảng quản lý" type="template-management-table" />
            <ComponentTile icon={Layout} label="Landing Page" type="template-landing" />
            <ComponentTile icon={CreditCard} label="Pricing" type="template-pricing" />
            <ComponentTile icon={List} label="Dashboard" type="template-dashboard" />
            <ComponentTile icon={Settings} label="Settings" type="template-settings" />
          </SidebarGroup>

          <SidebarGroup id="overview" title="Tổng quan" icon={Box}>
            <ComponentTile icon={Layout} label="Bắt đầu" type="getting-started" />
            <ComponentTile icon={Droplets} label="Định dạng" type="styling" />
            <ComponentTile icon={Maximize} label="Bố cục" type="layout-overview" />
            <ComponentTile icon={RotateCcw} label="Phiên bản" type="releases" />
            <ComponentTile icon={Layers} label="Tài nguyên" type="resources" />
          </SidebarGroup>

          <SidebarGroup id="theme" title="Chủ đề" icon={Droplets}>
            <ComponentTile icon={Eye} label="Tổng quan" type="theme-overview" />
            <ComponentTile icon={Droplets} label="Màu sắc" type="color" />
            <ComponentTile icon={ImageIcon} label="Chế độ tối" type="dark-mode" />
            <ComponentTile icon={Type} label="Kiểu chữ" type="typography-theme" />
            <ComponentTile icon={AlignStartVertical} label="Khoảng cách" type="spacing" />
            <ComponentTile icon={Maximize} label="Điểm ngắt" type="breakpoints" />
            <ComponentTile icon={Square} label="Bo góc" type="radius" />
            <ComponentTile icon={Layers} label="Đổ bóng" type="shadows" />
            <ComponentTile icon={MousePointer2} label="Con trỏ" type="cursors" />
          </SidebarGroup>
          
          <SidebarGroup id="layout" title="Bố cục" icon={Layout}>
            <ComponentTile icon={Square} label="Hộp (Box)" type="box" />
            <ComponentTile icon={AlignCenterVertical} label="Flex" type="flex" />
            <ComponentTile icon={Table} label="Lưới (Grid)" type="grid" />
            <ComponentTile icon={Maximize} label="Khung chứa" type="container" />
            <ComponentTile icon={Layout} label="Phần (Section)" type="section" />
          </SidebarGroup>

          <SidebarGroup id="typography" title="Kiểu chữ" icon={Type}>
            <ComponentTile icon={AlignLeft} label="Văn bản" type="text" />
            <ComponentTile icon={Type} label="Tiêu đề" type="heading" />
            <ComponentTile icon={AlignLeft} label="Trích dẫn" type="blockquote" />
            <ComponentTile icon={Code} label="Mã code" type="code" />
            <ComponentTile icon={Type} label="Nhấn mạnh (Em)" type="em" />
            <ComponentTile icon={Code} label="Phím (Kbd)" type="kbd" />
            <ComponentTile icon={CornerUpRight} label="Liên kết" type="link" />
            <ComponentTile icon={AlignLeft} label="Trích dẫn ngắn" type="quote" />
            <ComponentTile icon={Type} label="Chữ đậm" type="strong" />
          </SidebarGroup>

          <SidebarGroup id="components" title="Thành phần" icon={Layers}>
            <ComponentTile icon={MessageSquare} label="Thông báo xác nhận" type="alert-dialog" />
            <ComponentTile icon={ImageIcon} label="Tỷ lệ khung hình" type="aspect-ratio" />
            <ComponentTile icon={Box} label="Ảnh đại diện" type="avatar" />
            <ComponentTile icon={Check} label="Huy hiệu" type="badge" />
            <ComponentTile icon={Square} label="Nút bấm" type="button" />
            <ComponentTile icon={MessageSquare} label="Lời gọi" type="callout" />
            <ComponentTile icon={Square} label="Thẻ (Card)" type="card" />
            <ComponentTile icon={Check} label="Hộp kiểm" type="checkbox" />
            <ComponentTile icon={List} label="Nhóm hộp kiểm" type="checkbox-group" />
            <ComponentTile icon={Table} label="Thẻ hộp kiểm" type="checkbox-cards" />
            <ComponentTile icon={MoreHorizontal} label="Menu ngữ cảnh" type="context-menu" />
            <ComponentTile icon={List} label="Danh sách dữ liệu" type="data-list" />
            <ComponentTile icon={MessageSquare} label="Hộp thoại" type="dialog" />
            <ComponentTile icon={ChevronDown} label="Menu thả xuống" type="dropdown-menu" />
            <ComponentTile icon={Eye} label="Thẻ di chuột" type="hover-card" />
            <ComponentTile icon={Square} label="Nút icon" type="icon-button" />
            <ComponentTile icon={Maximize} label="Chèn (Inset)" type="inset" />
            <ComponentTile icon={Layers} label="Cửa sổ nổi (Popover)" type="popover" />
            <ComponentTile icon={AlignLeft} label="Tiến trình" type="progress" />
            <ComponentTile icon={Circle} label="Nút chọn (Radio)" type="radio" />
            <ComponentTile icon={List} label="Nhóm nút chọn" type="radio-group" />
            <ComponentTile icon={Table} label="Thẻ nút chọn" type="radio-cards" />
            <ComponentTile icon={Maximize} label="Vùng cuộn" type="scroll-area" />
            <ComponentTile icon={List} label="Điều khiển phân đoạn" type="segmented-control" />
            <ComponentTile icon={ChevronDown} label="Chọn (Select)" type="select" />
            <ComponentTile icon={Minus} label="Đường phân cách" type="separator" />
            <ComponentTile icon={RotateCcw} label="Khung chờ (Skeleton)" type="skeleton" />
            <ComponentTile icon={AlignLeft} label="Thanh trượt" type="slider" />
            <ComponentTile icon={RotateCcw} label="Vòng xoay chờ" type="spinner" />
            <ComponentTile icon={Check} label="Công tắc" type="switch" />
            <ComponentTile icon={Table} label="Bảng dữ liệu" type="table" />
            <ComponentTile icon={Layout} label="Các tab" type="tabs" />
            <ComponentTile icon={AlignLeft} label="Điều hướng tab" type="tab-nav" />
            <ComponentTile icon={FormInput} label="Vùng văn bản" type="text-area" />
            <ComponentTile icon={FormInput} label="Ô nhập liệu" type="text-field" />
            <ComponentTile icon={MessageSquare} label="Gợi ý (Tooltip)" type="tooltip" />
          </SidebarGroup>

          <SidebarGroup id="utilities" title="Tiện ích" icon={Settings}>
            <ComponentTile icon={Check} label="Icon hỗ trợ" type="accessible-icon" />
            <ComponentTile icon={Maximize} label="Cổng (Portal)" type="portal" />
            <ComponentTile icon={RotateCcw} label="Đặt lại" type="reset" />
            <ComponentTile icon={Square} label="Khe cắm (Slot)" type="slot" />
            <ComponentTile icon={Droplets} label="Chủ đề" type="theme-util" />
            <ComponentTile icon={Eye} label="Ẩn trực quan" type="visually-hidden" />
          </SidebarGroup>
        </div>

        <div className={styles.builderMain}>
          <div className={styles.builderHeader}>
            <div className={styles.headerInputs}>
              <div className={styles.headerInputGroup}>
                <span className={styles.headerLabel}>Trang:</span>
                <input 
                  className={styles.headerInput} 
                  value={pageInfo.title} 
                  onChange={e => setPageInfo({...pageInfo, title: e.target.value})} 
                />
              </div>
              {isInspectorCollapsed && (
                <button 
                  onClick={() => setIsInspectorCollapsed(false)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '4px', color: '#f97316', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <PanelRightOpen size={14} /> Công cụ
                </button>
              )}
            </div>
            <div className={styles.headerActions}>
              <button className={`${styles.actionBtn} ${styles.exitBtn}`} onClick={() => router.back()}><X size={14} /></button>
              <button className={`${styles.actionBtn} ${styles.saveBtn}`}><Save size={14} /> Lưu</button>
            </div>
          </div>
          
          <div 
            className={`${styles.canvasArea} ${isDraggingOver ? styles.canvasDragging : ''}`} 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleDrop} 
            onDragEnter={() => setIsDraggingOver(true)} 
            onDragLeave={() => setIsDraggingOver(false)}
            onClick={() => setSelectedId(null)}
          >
            <div style={{ width: '100%', height: '100%', minHeight: '1000px', position: 'relative' }}>
              {canvasComponents.length === 0 ? (
                <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                   <div style={{ padding: '24px', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <MousePointer2 size={40} strokeWidth={1} />
                      <p style={{ fontSize: '13px' }}>Kéo thả thành phần vào đây</p>
                   </div>
                </div>
              ) : (
                canvasComponents.map(comp => (
                  <div 
                    key={comp.id} 
                    onMouseDown={(e) => startDragging(e, comp.id)}
                    onClick={(e) => e.stopPropagation()}
                    className={`${styles.canvasComponent} ${selectedId === comp.id ? styles.canvasComponentSelected : ''}`}
                    style={{ 
                      width: `${comp.config.w}px`, 
                      height: `${comp.config.h}px`,
                      left: `${comp.config.x}px`,
                      top: `${comp.config.y}px`,
                      position: 'absolute'
                    }}
                  >
                    {selectedId === comp.id && (
                      <span style={{ position: 'absolute', top: '-22px', left: '-2px', background: '#f97316', color: 'white', fontSize: '10px', padding: '2px 10px', borderRadius: '4px 4px 0 0', fontWeight: 600, zIndex: 30 }}>
                        {comp.label}
                      </span>
                    )}
                    
                    <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                       {comp.type === 'breadcrumbs' && (
                         <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                           <ImageIcon size={14} /> <span>Tiện ích</span>
                         </div>
                       )}

                       {comp.type === 'control-panel' && (
                         <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                               <div style={{ width: '200px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', padding: '0 8px', display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '11px' }}>Tìm kiếm...</div>
                               <div style={{ width: '100px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }}></div>
                            </div>
                            <div style={{ width: '100px', height: '32px', background: '#f97316', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 600 }}>+ Tạo mới</div>
                         </div>
                       )}

                       {(comp.type === 'table' || comp.type === 'template-management-table') && (
                         <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {comp.type === 'template-management-table' && (
                               <>
                                  <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                                    <ImageIcon size={14} /> <span>Trang chủ / Quản lý / Danh sách</span>
                                  </div>
                                  <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc', borderBottom: '1px solid #f1f5f9' }}>
                                     <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ width: '200px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', padding: '0 8px', display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '11px' }}>Tìm kiếm...</div>
                                        <div style={{ width: '100px', height: '32px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white' }}></div>
                                     </div>
                                     <div style={{ width: '100px', height: '32px', background: '#f97316', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 600 }}>+ Tạo mới</div>
                                  </div>
                               </>
                            )}
                            <div style={{ height: '40px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', padding: '0 16px', alignItems: 'center', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                               <div style={{ width: '40px' }}>STT</div>
                               <div style={{ width: '80px' }}>Hình ảnh</div>
                               <div style={{ flex: 2 }}>Tên thành phần</div>
                               <div style={{ flex: 3 }}>Mô tả chi tiết</div>
                               <div style={{ width: '100px' }}>Trạng thái</div>
                               <div style={{ width: '80px' }}>Thao tác</div>
                            </div>
                            {[...Array(comp.type === 'template-management-table' ? 6 : 5)].map((_, i) => (
                              <div key={i} style={{ height: '56px', borderBottom: '1px solid #f8fafc', display: 'flex', padding: '0 16px', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                                 <div style={{ width: '40px' }}>{i+1}</div>
                                 <div style={{ width: '60px', height: '40px', background: '#f1f5f9', borderRadius: '4px', marginRight: '20px' }}></div>
                                 <div style={{ flex: 2, fontWeight: 500, color: '#1e293b' }}>Dữ liệu mẫu {i+1}</div>
                                 <div style={{ flex: 3 }}>Mô tả nội dung cho dòng dữ liệu thứ {i+1}</div>
                                 <div style={{ width: '100px' }}>
                                    <span style={{ padding: '2px 8px', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px', fontSize: '10px' }}>Hoạt động</span>
                                 </div>
                                 <div style={{ width: '80px', display: 'flex', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Code size={12} /></div>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></div>
                                 </div>
                              </div>
                            ))}
                            {comp.type === 'template-management-table' && (
                               <div style={{ padding: '0 16px', height: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                                  <div>Hiển thị 1-6 trên tổng 60 kết quả</div>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                     <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</div>
                                     <div style={{ width: '24px', height: '24px', background: '#f97316', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                                     <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                                     <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</div>
                                  </div>
                               </div>
                            )}
                         </div>
                       )}

                       {comp.type === 'pagination' && (
                         <div style={{ padding: '0 16px', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9' }}>
                            <div>Hiển thị 1-5 trên tổng 50 kết quả</div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                               <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&lt;</div>
                               <div style={{ width: '24px', height: '24px', background: '#f97316', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                               <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                               <div style={{ width: '24px', height: '24px', border: '1px solid #e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&gt;</div>
                            </div>
                         </div>
                       )}

                       {!['breadcrumbs', 'control-panel', 'table', 'pagination', 'template-management-table'].includes(comp.type) && (
                         <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              Xem trước {comp.label}
                            </span>
                         </div>
                       )}
                    </div>

                    {selectedId === comp.id && (
                      <>
                        {/* Edges */}
                        <div className={`${styles.resizeHandle} ${styles.handleEdgeV} ${styles.handleT}`} onMouseDown={(e) => startResizing(e, comp.id, 't')} />
                        <div className={`${styles.resizeHandle} ${styles.handleEdgeV} ${styles.handleB}`} onMouseDown={(e) => startResizing(e, comp.id, 'b')} />
                        <div className={`${styles.resizeHandle} ${styles.handleEdgeH} ${styles.handleL}`} onMouseDown={(e) => startResizing(e, comp.id, 'l')} />
                        <div className={`${styles.resizeHandle} ${styles.handleEdgeH} ${styles.handleR}`} onMouseDown={(e) => startResizing(e, comp.id, 'r')} />
                        {/* Corners */}
                        <div className={`${styles.resizeHandle} ${styles.handleCorner} ${styles.handleTL}`} onMouseDown={(e) => startResizing(e, comp.id, 'tl')} />
                        <div className={`${styles.resizeHandle} ${styles.handleCorner} ${styles.handleTR}`} onMouseDown={(e) => startResizing(e, comp.id, 'tr')} />
                        <div className={`${styles.resizeHandle} ${styles.handleCorner} ${styles.handleBL}`} onMouseDown={(e) => startResizing(e, comp.id, 'bl')} />
                        <div className={`${styles.resizeHandle} ${styles.handleCorner} ${styles.handleBR}`} onMouseDown={(e) => startResizing(e, comp.id, 'br')} />
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={`${styles.builderInspector} ${isInspectorCollapsed ? styles.inspectorCollapsed : ''}`}>
          <div className={styles.inspectorTabs}>
            <div className={`${styles.tabItem} ${styles.tabItemActive}`}>Thiết kế</div>
            <div className={styles.tabItem}>Nguyên mẫu</div>
            <div style={{ marginLeft: 'auto' }}>
              <button className={styles.toggleInspectorBtn} onClick={() => setIsInspectorCollapsed(true)}>
                <PanelRightClose size={16} />
              </button>
            </div>
          </div>
          <div className={styles.inspectorSection}>
            <div className={styles.sectionHeader}><span className={styles.sectionTitle}>Vị trí</span></div>
            <div className={styles.alignRow}>
              <AlignLeft size={14} className={styles.alignIcon} />
              <AlignCenter size={14} className={styles.alignIcon} />
              <AlignRight size={14} className={styles.alignIcon} />
              <AlignStartVertical size={14} className={styles.alignIcon} />
              <AlignCenterVertical size={14} className={styles.alignIcon} />
              <AlignEndVertical size={14} className={styles.alignIcon} />
            </div>
            <div className={styles.grid2x2}>
              <div className={styles.figmaInputGroup}>
                <span className={styles.figmaInputLabel}>X</span>
                <input className={styles.figmaInput} value={Math.round(selectedComponent?.config.x || 0)} readOnly />
              </div>
              <div className={styles.figmaInputGroup}>
                <span className={styles.figmaInputLabel}>Y</span>
                <input className={styles.figmaInput} value={Math.round(selectedComponent?.config.y || 0)} readOnly />
              </div>
              <div className={styles.figmaInputGroup}>
                <span className={styles.figmaInputLabel}>W</span>
                <input className={styles.figmaInput} value={Math.round(selectedComponent?.config.w || 0)} readOnly />
              </div>
              <div className={styles.figmaInputGroup}>
                <span className={styles.figmaInputLabel}>H</span>
                <input className={styles.figmaInput} value={Math.round(selectedComponent?.config.h || 0)} readOnly />
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#64748b' }}>?</div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
