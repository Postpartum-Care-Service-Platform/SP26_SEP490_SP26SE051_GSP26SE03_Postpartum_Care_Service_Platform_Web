'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { PlusIcon, ExternalLink, Trash2 } from 'lucide-react';
import { dynamicPageService, DynamicPage } from '@/services/dynamicPageService';
import { ConfigDrivenManager } from '@/components/shared/management/ConfigDrivenManager';

import styles from './page-builder.module.css';

export default function PageBuilderList() {
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<DynamicPage | null>(null);

  useEffect(() => {
    setPages(dynamicPageService.getPages());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có muốn xóa trang này?')) return;
    dynamicPageService.deletePage(id);
    setPages(dynamicPageService.getPages());
    if (selectedPage?.id === id) setSelectedPage(null);
  };

  const header = <Breadcrumbs items={[{ label: 'Page Builder' }]} />;
  
  const controlPanel = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Quản lý Trang động</h1>
      <Link href="/admin/page-builder/create">
        <Button className={styles.designBtn}>
          <PlusIcon size={18} /> Thiết kế trang mới
        </Button>
      </Link>
    </div>
  );

  return (
    <AdminPageLayout header={header} controlPanel={controlPanel}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Left Sidebar: List of pages */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, background: '#f8fafc' }}>
            Danh sách trang đã thiết kế
          </div>
          {pages.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              Chưa có trang nào. Hãy nhấn nút "Thiết kế" để bắt đầu.
            </div>
          ) : (
            pages.map(page => (
              <div 
                key={page.id} 
                onClick={() => setSelectedPage(page)}
                style={{ 
                  padding: '12px 16px', 
                  borderBottom: '1px solid #f8fafc',
                  cursor: 'pointer',
                  background: selectedPage?.id === page.id ? '#eff6ff' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, color: '#1e293b' }}>{page.schema.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{page.schema.apiEndpoint}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(page.id); }} style={{ color: '#ef4444', border: 'none', background: 'transparent' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Area: Live Preview */}
        <div style={{ minHeight: '400px' }}>
          {selectedPage ? (
            <div key={selectedPage.id}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Đang xem Preview của trang: <strong>{selectedPage.schema.title}</strong>
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {selectedPage.id}</span>
              </div>
              {/* Đây là nơi phép màu xảy ra: Render UI hoàn toàn từ config */}
              <ConfigDrivenManager schema={selectedPage.schema} />
            </div>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px dashed #e2e8f0',
              color: '#94a3b8',
              padding: '40px'
            }}>
              <ExternalLink size={48} strokeWidth={1} style={{ marginBottom: '16px' }} />
              <div>Chọn một trang ở danh sách bên trái để xem kết quả (Live Preview)</div>
            </div>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
