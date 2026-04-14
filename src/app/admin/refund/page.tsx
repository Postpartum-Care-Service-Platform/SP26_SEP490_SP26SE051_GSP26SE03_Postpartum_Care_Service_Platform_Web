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
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500 italic">
            Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : (
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
        )}

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
