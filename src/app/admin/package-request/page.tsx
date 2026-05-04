'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Search } from 'lucide-react';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import { useToast } from '@/components/ui/toast/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import packageRequestService from '@/services/package-request.service';
import { healthRecordService } from '@/services/health-record.service';
import activityService from '@/services/activity.service';
import packageTypeService from '@/services/package-type.service';
import roomTypeService from '@/services/room-type.service';

import type { PackageRequest } from '@/types/package-request';
import { HealthRecord } from '@/types/health-record';
import { Activity } from '@/types/activity';

import { RequestListControls } from '../package/components/package-request/RequestListControls';
import { RequestListTable } from '../package/components/package-request/RequestListTable';
import { RequestListPagination } from '../package/components/package-request/RequestListPagination';
import { RequestDetailsView } from '../package/components/package-request/RequestDetailsView';
import { RequestListHeader } from './components/RequestListHeader';
import { RejectRequestModal } from '../package/components/package-request/RejectRequestModal';

import styles from '../package/components/package-request-list-modal.module.css';

const STATUS_OPTIONS = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Chờ duyệt', value: '0' },
  { label: 'Đã duyệt', value: '1' },
  { label: 'Từ chối', value: '2' },
  { label: 'Đang thực hiện', value: '3' },
  { label: 'Hoàn thành', value: '4' },
];

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
];

// No fallbacks, use empty arrays initially

export default function PackageRequestPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedRequest, setSelectedRequest] = useState<PackageRequest | null>(null);
  const [healthRecords, setHealthRecords] = useState<Record<number, HealthRecord>>({});
  const [healthLoading, setHealthLoading] = useState(false);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
  const [requests, setRequests] = useState<PackageRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeProfileId, setActiveProfileId] = useState<number | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [selectedPackageType, setSelectedPackageType] = useState('1');
  const [selectedRoomType, setSelectedRoomType] = useState('1');
  const [basePrice, setBasePrice] = useState('0');
  const [packageTypeOptions, setPackageTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [roomTypeOptions, setRoomTypeOptions] = useState<{ label: string; value: string }[]>([]);
  const [localActivities, setLocalActivities] = useState<any[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchAllActivities();
    fetchConfigurationOptions();
  }, []);

  const fetchConfigurationOptions = async () => {
    // Fetch Package Types
    try {
      const ptRes = await packageTypeService.getAllPackageTypes();
      if (ptRes && Array.isArray(ptRes)) {
        setPackageTypeOptions(ptRes.map(pt => ({ label: (pt as any).typeName || (pt as any).name || '', value: pt.id.toString() })));
        if (ptRes.length > 0) {
          setSelectedPackageType(ptRes[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch admin package types:', error);
      // Fallback to non-admin or leave as fallback if needed
    }

    // Fetch Room Types
    try {
      const rtRes = await roomTypeService.getAdminRoomTypes();
      if (rtRes && Array.isArray(rtRes)) {
        setRoomTypeOptions(rtRes.map(rt => ({ label: rt.name, value: rt.id.toString() })));
        if (rtRes.length > 0) {
          setSelectedRoomType(rtRes[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch admin room types:', error);
    }
  };

  // Sync state with URL on initial load
  useEffect(() => {
    const requestId = searchParams.get('requestId');
    const viewMode = searchParams.get('view');

    if (viewMode === 'details' && requestId) {
      const id = parseInt(requestId);
      if (!isNaN(id)) {
        if (requests.length > 0) {
          const req = requests.find(r => r.id === id);
          if (req) {
            handleViewDetails(req);
          }
        }
      }
    } else if (viewMode !== 'details') {
      setView('list');
      setSelectedRequest(null);
    }
  }, [requests.length, searchParams]);

  const fetchAllActivities = async () => {
    try {
      const data = await activityService.getAllActivities();
      if (data && data.length > 0) {
        setAllActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  const toggleActivity = (id: number) => {
    setSelectedActivityIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await packageRequestService.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu cầu gói:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch =
        req.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.statusName?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredRequests.length / parseInt(pageSize));
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * parseInt(pageSize);
    return filteredRequests.slice(start, start + parseInt(pageSize));
  }, [filteredRequests, currentPage, pageSize]);

  const getStatusLabel = (status: any, fallbackName?: string | null) => {
    const statusVal = typeof status === 'string' ? parseInt(status) : status;
    switch (statusVal) {
      case 0: return 'Chờ duyệt';
      case 1: return 'Đã phê duyệt';
      case 2: return 'Đã từ chối';
      case 3: return 'Đang xử lý';
      case 4: return 'Đã hoàn thành';
      case 5: return 'Cần chỉnh sửa';
      default: return fallbackName || 'Không xác định';
    }
  };

  const getStatusIndicator = (status: any, statusName: string | null | undefined) => {
    let color = "#94a3b8";
    const statusVal = typeof status === 'string' ? parseInt(status) : status;
    switch (statusVal) {
      case 0: color = "#f59e0b"; break; // Orange
      case 1: color = "#3b82f6"; break; // Blue
      case 2: color = "#ef4444"; break; // Red
      case 3: color = "#8b5cf6"; break; // Purple/Violet
      case 4: color = "#10b981"; break; // Green
      case 5: color = "#ec4899"; break; // Pink
    }
    const label = getStatusLabel(status, statusName);
    return (
      <div className={styles.statusIndicatorWrapper}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statusDot} style={{ color: color, backgroundColor: color }}></div>
          </TooltipTrigger>
          <TooltipContent side="top" className="border-none">{label}</TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const handleViewDetails = async (request: PackageRequest) => {
    try {
      setLoading(true);

      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', 'details');
      params.set('requestId', request.id.toString());
      router.push(`?${params.toString()}`);

      const fullRequest = await packageRequestService.getById(request.id);
      setSelectedRequest(fullRequest);

      if (fullRequest.familyProfiles && fullRequest.familyProfiles.length > 0) {
        setActiveProfileId(fullRequest.familyProfiles[0].id);
      }

      if (fullRequest.basePackageActivities) {
        setLocalActivities(fullRequest.basePackageActivities);
      } else {
        setLocalActivities([]);
      }

      setView('details');

      if (fullRequest.familyProfiles) {
        setHealthLoading(true);
        const records: Record<number, HealthRecord> = {};
        try {
          await Promise.all(
            fullRequest.familyProfiles.map(async (profile) => {
              try {
                const record = await healthRecordService.getLatest(profile.id);
                if (record) records[profile.id] = record;
              } catch (err) {
                console.error(`Failed to fetch health record for ${profile.id}:`, err);
              }
            })
          );
          setHealthRecords(records);
        } finally {
          setHealthLoading(false);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết yêu cầu:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải chi tiết yêu cầu.",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('view');
    params.delete('requestId');
    router.push(`?${params.toString()}`);
    setView('list');
    setSelectedRequest(null);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    if (localActivities.length === 0) {
      toast({
        title: "Chưa chọn hoạt động",
        description: "Vui lòng chọn ít nhất một hoạt động để phê duyệt yêu cầu.",
        variant: "error"
      });
      return;
    }

    try {
      setIsApproving(true);

      const activitiesPayload = localActivities.map(a => ({
        activityId: a.activityId || a.id,
        dayNo: a.dayNo || 1,
        homeServiceDate: selectedRequest.requestedStartDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        startTime: a.startTime.length > 5 ? a.startTime.substring(0, 5) : a.startTime,
        endTime: a.endTime.length > 5 ? a.endTime.substring(0, 5) : a.endTime,
        instruction: a.instruction || ""
      }));

      const totalPrice = localActivities.reduce((sum, a) => sum + (a.price || 0), 0);

      const payload = {
        packageName: selectedRequest.title,
        description: selectedRequest.description || "",
        packageTypeId: parseInt(selectedPackageType),
        roomTypeId: parseInt(selectedRoomType),
        basePrice: totalPrice,
        durationDays: selectedRequest.totalDays,
        isActive: true,
        activities: activitiesPayload
      };

      await packageRequestService.createDraftPackage(selectedRequest.id, payload);

      toast({
        title: "Phê duyệt thành công",
        description: `Đã tạo gói dịch vụ nháp cho yêu cầu "${selectedRequest.title}"`,
        variant: "success"
      });

      await fetchRequests();
      setView('list');
      setSelectedRequest(null);
      setSelectedActivityIds([]);
    } catch (error: any) {
      console.error('Lỗi khi phê duyệt yêu cầu:', error);
      toast({
        title: "Phê duyệt thất bại",
        description: error.message || "Đã có lỗi xảy ra khi gọi API.",
        variant: "error"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleResetStatus = async (request?: PackageRequest) => {
    const targetRequest = request || selectedRequest;
    if (!targetRequest) return;
    
    try {
      setLoading(true);
      await packageRequestService.attachPackage(targetRequest.id, 0);
      toast({
        title: "Đã đổi trạng thái",
        description: `Yêu cầu "${targetRequest.title}" đã được chuyển về trạng thái chờ duyệt.`,
        variant: "success"
      });
      await fetchRequests();
      if (view === 'details') {
        setView('list');
        setSelectedRequest(null);
      }
    } catch (error: any) {
      console.error('Lỗi khi đổi trạng thái:', error);
      toast({
        title: "Đổi trạng thái thất bại",
        description: error.message || "Đã có lỗi xảy ra.",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const [rejectingRequest, setRejectingRequest] = useState<PackageRequest | null>(null);

  const handleOpenRejectModal = (request: PackageRequest) => {
    setRejectingRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleRejectStatus = async (reason: string) => {
    const targetRequest = rejectingRequest || selectedRequest;
    if (!targetRequest) return;
    
    try {
      setIsApproving(true);
      await packageRequestService.reject(targetRequest.id, reason);
      toast({
        title: "Đã từ chối yêu cầu",
        description: `Yêu cầu "${targetRequest.title}" đã bị từ chối.`,
        variant: "success"
      });
      setIsRejectModalOpen(false);
      setRejectingRequest(null);
      await fetchRequests();
      if (view === 'details') {
        setView('list');
        setSelectedRequest(null);
      }
    } catch (error: any) {
      console.error('Lỗi khi từ chối yêu cầu:', error);
      toast({
        title: "Từ chối thất bại",
        description: error.message || "Đã có lỗi xảy ra.",
        variant: "error"
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <AdminPageLayout
      header={
        <RequestListHeader
          view={view}
          onBack={handleBackToList}
          title={selectedRequest?.title}
          onResetStatus={() => handleResetStatus()}
          onReject={() => handleOpenRejectModal(selectedRequest!)}
        />
      }
      isLoading={loading}
      noCard={view === 'details'}
      controlPanel={view === 'list' ? (
        <RequestListControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={STATUS_OPTIONS}
        />
      ) : null}
      pagination={view === 'list' && totalPages > 0 ? (
        <RequestListPagination
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={filteredRequests.length}
          totalPages={totalPages}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      ) : null}
    >
      {view === 'list' ? (
        filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Không tìm thấy yêu cầu nào</p>
          </div>
        ) : (
          <RequestListTable
            requests={paginatedRequests}
            currentPage={currentPage}
            pageSize={parseInt(pageSize)}
             onViewDetails={handleViewDetails}
             getStatusIndicator={getStatusIndicator}
             onResetStatus={handleResetStatus}
             onReject={handleOpenRejectModal}
           />
        )
      ) : (
        <RequestDetailsView
          selectedRequest={selectedRequest}
          healthRecords={healthRecords}
          healthLoading={healthLoading}
          activeProfileId={activeProfileId}
          setActiveProfileId={setActiveProfileId}
          allActivities={allActivities}
          selectedActivityIds={selectedActivityIds}
          toggleActivity={toggleActivity}
          selectedPackageType={selectedPackageType}
          setSelectedPackageType={setSelectedPackageType}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          basePrice={basePrice}
          setBasePrice={setBasePrice}
          onApprove={handleApprove}
          isApproving={isApproving}
          setView={setView}
          getStatusIndicator={getStatusIndicator}
          getStatusLabel={getStatusLabel}
          packageTypeOptions={packageTypeOptions}
          roomTypeOptions={roomTypeOptions}
           localActivities={localActivities}
           setLocalActivities={setLocalActivities}
           onResetStatus={() => handleResetStatus()}
           onReject={() => handleOpenRejectModal(selectedRequest!)}
         />
      )}
      <RejectRequestModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectStatus}
         isSubmitting={isApproving}
         requestTitle={rejectingRequest?.title || selectedRequest?.title}
       />
    </AdminPageLayout>
  );
}
