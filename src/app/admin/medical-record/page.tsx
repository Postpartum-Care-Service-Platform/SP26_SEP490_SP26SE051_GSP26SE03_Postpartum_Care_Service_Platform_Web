'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { Pagination } from '@/components/ui/pagination';
import { MedicalRecordHeader, MedicalRecordTable, MedicalRecordTableControls } from './components';

// Mock Data
const MOCK_RECORDS = [
  { id: 1, patientName: 'Nguyễn Thị A', age: 28, diagnosis: 'Chăm sóc sau sinh thường', date: '2024-03-20', status: 'Hoàn thành', doctor: 'BS. Lê Văn B' },
  { id: 2, patientName: 'Trần Văn C', age: 1, diagnosis: 'Kiểm tra sức khỏe định kỳ bé', date: '2024-03-21', status: 'Đang điều trị', doctor: 'BS. Phạm Thị D' },
  { id: 3, patientName: 'Lê Thị E', age: 32, diagnosis: 'Chăm sóc sau sinh mổ', date: '2024-03-22', status: 'Chờ kết quả', doctor: 'BS. Nguyễn Văn F' },
  { id: 4, patientName: 'Phạm Văn G', age: 0, diagnosis: 'Vàng da sinh lý', date: '2024-03-23', status: 'Đang điều trị', doctor: 'BS. Lê Văn B' },
  { id: 5, patientName: 'Hoàng Thị H', age: 25, diagnosis: 'Tư vấn dinh dưỡng', date: '2024-03-24', status: 'Hoàn thành', doctor: 'BS. Phạm Thị D' },
];

export default function MedicalRecordPage() {
  const [view, setView] = useState<'table' | 'ui'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 p-4">
      <AdminPageLayout
        noCard={view === 'ui'}
        header={<MedicalRecordHeader view={view} onViewChange={setView} />}
        controlPanel={
          view === 'table' ? (
            <MedicalRecordTableControls 
              onSearch={(q) => console.log('Search:', q)}
              onNewRecord={() => console.log('New Record')}
            />
          ) : null
        }
        pagination={
          view === 'table' ? (
            <Pagination
              currentPage={currentPage}
              totalPages={1}
              pageSize={pageSize}
              totalItems={MOCK_RECORDS.length}
              onPageChange={setCurrentPage}
              pageSizeOptions={[10, 20, 50]}
              onPageSizeChange={setPageSize}
              showResultCount={true}
            />
          ) : null
        }
      >
        {view === 'table' ? (
          <MedicalRecordTable 
            records={MOCK_RECORDS}
            onEdit={(r) => console.log('Edit:', r)}
            onDelete={(r) => console.log('Delete:', r)}
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
