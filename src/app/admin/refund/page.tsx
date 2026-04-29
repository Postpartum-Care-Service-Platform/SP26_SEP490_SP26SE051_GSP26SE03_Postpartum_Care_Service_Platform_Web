'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/components/ui/toast/use-toast';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import refundRequestService from '@/services/refund-request.service';
import { RefundRequest } from '@/types/refund-request';

import { ImportRefundModal, RefundActionModal, RefundListHeader, RefundTable, RefundTableControls } from './components';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === 'object' && error !== null && 'message' in error) return (error as any).message;
  return fallback;
};

import { Pagination } from '@/components/ui/pagination';

// Internal Premium Skeleton Component for consistent look
const SkeletonBone = ({ width, height, circle = false, margin = '0' }: { width?: string | number, height?: string | number, circle?: boolean, margin?: string }) => (
  <div 
    style={{ 
      width: width || '100%', 
      height: height || '20px', 
      backgroundColor: '#f1f5f9',
      borderRadius: circle ? '50%' : '4px',
      position: 'relative',
      overflow: 'hidden',
      margin: margin
    }}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'skeleton-shimmer-run 1.8s infinite linear',
      transform: 'translateX(-100%)'
    }} />
  </div>
);

export default function AdminRefundPage() {
  const { toast } = useToast();
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalType, setModalType] = useState<'approve' | 'reject' | 'view' | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      setError(null);
      // Wait for 2s for premium skeleton feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      let data = await refundRequestService.getAll();
      
      // Handle wrapped API responses ($values)
      if (data && !Array.isArray(data) && (data as any).$values) {
        data = (data as any).$values;
      }
      
      setRefunds(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Không thể tải danh sách hoàn tiền');
      setError(msg);
      toast({ title: msg, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const filteredRefunds = useMemo(() => {
    const rawData = Array.isArray(refunds) ? refunds : (refunds as any)?.$values || [];
    let filtered = [...rawData];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.bookingId.toString().includes(q) || 
        r.customerId.toLowerCase().includes(q) ||
        r.accountHolder.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      switch (sortKey) {
        case 'date-asc': return aTime - bTime;
        case 'date-desc': return bTime - aTime;
        case 'amount-asc': return a.requestedAmount - b.requestedAmount;
        case 'amount-desc': return b.requestedAmount - a.requestedAmount;
        default: return bTime - aTime;
      }
    });

    return filtered;
  }, [refunds, searchQuery, statusFilter, sortKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedRefunds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRefunds.slice(start, start + pageSize);
  }, [filteredRefunds, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRefunds.length / pageSize);

  const handleAction = async (data: { amount?: number; note: string }) => {
    if (!selectedRefund || !modalType) return;
    try {
      if (modalType === 'approve') {
        await refundRequestService.approve(selectedRefund.id, {
          approvedAmount: data.amount!,
          adminNote: data.note
        });
        toast({ title: 'Đã duyệt yêu cầu hoàn tiền', variant: 'success' });
      } else {
        await refundRequestService.reject(selectedRefund.id, {
          adminNote: data.note
        });
        toast({ title: 'Đã từ chối yêu cầu hoàn tiền', variant: 'success' });
      }
      fetchRefunds();
    } catch (err) {
      toast({ title: getErrorMessage(err, 'Xử lý thất bại'), variant: 'error' });
      throw err;
    }
  };



  const handleExport = async () => {
    try {
      toast({ title: 'Đang chuẩn bị dữ liệu xuất...', variant: 'default' });
      await refundRequestService.exportRefundRequests();
      toast({ title: 'Xuất dữ liệu thành công', variant: 'success' });
    } catch (err) {
      toast({ title: 'Xuất dữ liệu thất bại', variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <style>{`
          @keyframes skeleton-shimmer-run {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls Area Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={320} height={42} />
              <SkeletonBone width={180} height={42} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SkeletonBone width={120} height={42} />
              <SkeletonBone width={100} height={42} />
              <SkeletonBone width={120} height={42} />
            </div>
          </div>

          {/* Table Area Placeholder */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '4px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden'
          }}>
            <div style={{ height: '48px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }} />
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} style={{ 
                height: '64px', 
                borderBottom: i === pageSize - 1 ? 'none' : '1px solid #f8fafc', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 24px', 
                gap: '24px' 
              }}>
                <SkeletonBone width={40} height={16} />
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="70%" height={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <SkeletonBone width="50%" height={16} />
                </div>
                <SkeletonBone width={100} height={16} />
                <SkeletonBone width={100} height={32} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<RefundListHeader />}
        controlPanel={
          <RefundTableControls
            onSearch={setSearchQuery}
            onStatusChange={setStatusFilter}
            onSortChange={setSortKey}
            onImport={() => setIsImportModalOpen(true)}
            onExport={handleExport}
          />
        }
        pagination={
          totalPages > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredRefunds.length}
              onPageChange={setCurrentPage}
              pageSizeOptions={[10, 20, 50]}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              showResultCount={true}
            />
          ) : null
        }
      >
        <RefundTable
          refunds={paginatedRefunds}
          onApprove={(r) => { setSelectedRefund(r); setModalType('approve'); }}
          onReject={(r) => { setSelectedRefund(r); setModalType('reject'); }}
          onView={(r) => { setSelectedRefund(r); setModalType('view'); }}
          pagination={{
            currentPage,
            pageSize
          } as any}
        />


        <RefundActionModal
          isOpen={modalType !== null}
          onClose={() => { setModalType(null); setSelectedRefund(null); }}
          type={modalType || 'approve'}
          refund={selectedRefund}
          onConfirm={handleAction}
        />

        <ImportRefundModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onSuccess={fetchRefunds}
        />
      </AdminPageLayout>
    </div>
  );
}
