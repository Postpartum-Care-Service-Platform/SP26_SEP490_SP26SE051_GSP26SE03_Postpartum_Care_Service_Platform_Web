'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast/use-toast';
import { dynamicPageService } from '@/services/dynamicPageService';
import { 
  Trash, Plus, Settings, Table, FormInput, Save, X, Minus, 
  Layout, Type, Image as ImageIcon, List, CreditCard
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import styles from '../page-builder.module.css';

interface CanvasComponent {
  id: string;
  type: 'hero' | 'table' | 'form' | 'faq' | 'pricing';
  label: string;
  config: any;
}

export default function CreatePageBuilder() {
  const router = useRouter();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [pageInfo, setPageInfo] = useState({
    title: '',
    apiEndpoint: '',
  });

  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);

  const addComponent = (type: CanvasComponent['type'], label: string) => {
    const newComponent: CanvasComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label,
      config: type === 'table' ? { columns: [] } : type === 'form' ? { fields: [] } : {}
    };
    setCanvasComponents([...canvasComponents, newComponent]);
    setSelectedId(newComponent.id);
    toast({ title: 'Đã thêm linh kiện', description: `Vừa thêm ${label} vào trang`, variant: 'success' });
  };

  const removeComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvasComponents(canvasComponents.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSave = () => {
    if (!pageInfo.title) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền tên trang', variant: 'error' });
      return;
    }
    toast({ title: 'Thành công', description: 'Đã lưu cấu hình thiết kế', variant: 'success' });
    router.push('/admin/page-builder');
  };

  const header = (
    <Breadcrumbs items={[{ label: 'Page Builder', href: '/admin/page-builder' }, { label: 'Thiết kế' }]} />
  );

  const ComponentItem = ({ icon: Icon, label, type }: { icon: any, label: string, type: CanvasComponent['type'] }) => (
    <div onClick={() => addComponent(type, label)} className={styles.componentItem}>
      <Icon size={16} />
      <span className={isCollapsed ? styles.collapsedHide : ''}>{label}</span>
    </div>
  );

  return (
    <AdminPageLayout header={header} noCard noScroll>
      <div className={styles.builderLayout}>
        {/* Sidebar TRÁI: Thư viện linh kiện */}
        <div className={`${styles.builderSidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
          <div className={styles.sidebarTitle}>
            <span className={isCollapsed ? styles.collapsedHide : ''}>Linh kiện</span>
            <button className={styles.toggleBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? <Plus size={16} style={{ transform: 'rotate(45deg)' }} /> : <Minus size={16} />}
            </button>
          </div>
          
          <div className={isCollapsed ? styles.collapsedHide : ''}>
            <div style={{ padding: '16px', fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Thêm nhanh</div>
            <ComponentItem icon={Layout} label="Hero Section" type="hero" />
            <ComponentItem icon={CreditCard} label="Pricing Table" type="pricing" />
            <ComponentItem icon={List} label="FAQ Section" type="faq" />
            <ComponentItem icon={Table} label="Data Table" type="table" />
            <ComponentItem icon={FormInput} label="Dynamic Form" type="form" />
          </div>
        </div>

        {/* Khu vực GIỮA: Canvas & Header tích hợp */}
        <div className={styles.builderMain}>
          <div className={styles.builderHeader}>
            <div className={styles.headerInputs}>
              <div className={styles.headerInputGroup}>
                <span className={styles.headerLabel}>Tên trang:</span>
                <input 
                  className={styles.headerInput} 
                  placeholder="Nhập tên trang..."
                  value={pageInfo.title}
                  onChange={e => setPageInfo({...pageInfo, title: e.target.value})}
                />
              </div>
              <div className={styles.headerInputGroup}>
                <span className={styles.headerLabel}>API:</span>
                <input 
                  className={styles.headerInput} 
                  placeholder="/Endpoint"
                  value={pageInfo.apiEndpoint}
                  onChange={e => setPageInfo({...pageInfo, apiEndpoint: e.target.value})}
                />
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <button className={`${styles.actionBtn} ${styles.exitBtn}`} onClick={() => router.back()}>
                <X size={14} /> Thoát
              </button>
              <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleSave}>
                <Save size={14} /> Lưu trang
              </button>
            </div>
          </div>

          <div className={styles.canvasArea}>
            <div className={styles.canvasDropZone}>
              {canvasComponents.length === 0 ? (
                <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <Plus size={48} strokeWidth={1} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '12px' }}>Hãy chọn linh kiện bên trái để bắt đầu thiết kế</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {canvasComponents.map((comp) => (
                    <div 
                      key={comp.id} 
                      onClick={() => setSelectedId(comp.id)}
                      style={{ 
                        padding: '20px', 
                        background: '#f8fafc', 
                        border: `2px solid ${selectedId === comp.id ? '#f97316' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                          {comp.type === 'hero' && <Layout size={18} color="#f97316" />}
                          {comp.type === 'table' && <Table size={18} color="#f97316" />}
                          {comp.type === 'form' && <FormInput size={18} color="#f97316" />}
                          {comp.type === 'faq' && <List size={18} color="#f97316" />}
                          {comp.type === 'pricing' && <CreditCard size={18} color="#f97316" />}
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{comp.label}</div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {comp.id}</div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => removeComponent(comp.id, e)}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}
