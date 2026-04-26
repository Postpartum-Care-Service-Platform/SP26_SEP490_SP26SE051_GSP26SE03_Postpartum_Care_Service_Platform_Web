'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import { StaffSkillHeader, StaffSkillTable, StaffSkillTableControls } from './components';

// Mock Data
const MOCK_SKILLS = [
  { id: 1, staffName: 'Nguyễn Thị Hương', role: 'Nữ hộ sinh', skill: 'Chăm sóc trẻ sơ sinh', level: 'Expert', lastUpdated: '2024-03-15', progress: 95 },
  { id: 2, staffName: 'Trần Minh Tâm', role: 'Bác sĩ sản khoa', skill: 'Tư vấn dinh dưỡng', level: 'Advanced', lastUpdated: '2024-03-18', progress: 85 },
  { id: 3, staffName: 'Lê Thanh Hải', role: 'Nhân viên chăm sóc', skill: 'Massage phụ nữ sau sinh', level: 'Expert', lastUpdated: '2024-03-10', progress: 90 },
  { id: 4, staffName: 'Phạm Hồng Nhung', role: 'Nữ hộ sinh', skill: 'Tắm bé & Vệ sinh rốn', level: 'Advanced', lastUpdated: '2024-03-20', progress: 80 },
  { id: 5, staffName: 'Hoàng Gia Bảo', role: 'Chuyên gia phục hồi', skill: 'Yoga sau sinh', level: 'Basic', lastUpdated: '2024-03-12', progress: 65 },
];

export default function StaffSkillPage() {
  const [view, setView] = useState<'table' | 'ui'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 p-4">
      <AdminPageLayout
        noCard={view === 'ui'}
        header={<StaffSkillHeader view={view} onViewChange={setView} />}
        controlPanel={
          view === 'table' ? (
            <StaffSkillTableControls 
              onSearch={(q) => console.log('Search:', q)}
              onNewSkill={() => console.log('New Skill')}
            />
          ) : null
        }
        pagination={
          view === 'table' ? (
            <Pagination
              currentPage={currentPage}
              totalPages={1}
              pageSize={pageSize}
              totalItems={MOCK_SKILLS.length}
              onPageChange={setCurrentPage}
              pageSizeOptions={[10, 20, 50]}
              onPageSizeChange={setPageSize}
              showResultCount={true}
            />
          ) : null
        }
      >
        {view === 'table' ? (
          <StaffSkillTable 
            skills={MOCK_SKILLS}
            onEdit={(s) => console.log('Edit:', s)}
            onDelete={(s) => console.log('Delete:', s)}
            onConfirm={(s) => console.log('Confirm:', s)}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl shadow-sm border border-dashed border-slate-300 text-slate-400 font-medium">
            Dạng xem UI đang được cập nhật...
          </div>
        )}
      </AdminPageLayout>
    </div>
  );
}
