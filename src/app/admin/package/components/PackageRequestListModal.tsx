import React, { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import packageRequestService from '@/services/package-request.service';
import type { PackageRequest } from '@/types/package-request';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Search, User, ChevronLeft, ChevronRight, X, Eye, Check } from 'lucide-react';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { healthRecordService } from '@/services/health-record.service';
import activityService from '@/services/activity.service';
import { HealthRecord } from '@/types/health-record';
import { Activity } from '@/types/activity';
import { useToast } from '@/components/ui/toast/use-toast';
import styles from './package-request-list-modal.module.css';

interface PackageRequestListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

const PACKAGE_TYPE_OPTIONS = [
  { label: 'Gói tại trung tâm', value: '1' },
  { label: 'Gói tại nhà', value: '2' },
];

const ROOM_TYPE_OPTIONS = [
  { label: 'Phòng thường', value: '1' },
  { label: 'Phòng VIP', value: '2' },
];

export function PackageRequestListModal({ open, onOpenChange }: PackageRequestListModalProps) {
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
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [selectedPackageType, setSelectedPackageType] = useState('1');
  const [selectedRoomType, setSelectedRoomType] = useState('1');
  const [basePrice, setBasePrice] = useState('0');

  useEffect(() => {
    if (open) {
      fetchRequests();
      fetchAllActivities();
    } else {
      setView('list');
      setSelectedRequest(null);
      setSelectedActivityIds([]);
      setActiveProfileId(null);
    }
  }, [open]);

  const fetchAllActivities = async () => {
    try {
      const data = await activityService.getAllActivities();
      if (data && data.length > 0) {
        setAllActivities(data);
      } else {
        const fallbackData: Activity[] = [
          { id: 6, name: "Thay tã & vệ sinh bé", description: "Thay tã đúng cách, vệ sinh vùng kín, chống hăm, ghi nhận lượng tiểu/đại tiện.", price: 1000, target: "Baby", activityTypeId: 3, activityTypeName: "Center&Home", duration: 60, status: "Active" },
          { id: 4, name: "Check sức khỏe mẹ buổi sáng", description: "Đo mạch, huyết áp, nhiệt độ; đánh giá đau, sản dịch, mức độ mệt; nhắc uống nước/thuốc theo chỉ định.", price: 1000, target: "Mom", activityTypeId: 1, activityTypeName: "Center", duration: 60, status: "Active" },
          { id: 5, name: "Check sức khỏe bé buổi sáng", description: "Kiểm tra thân nhiệt, da-niêm mạc, rốn; theo dõi vàng da/ban đỏ; ghi nhận tiểu/đại tiện.", price: 1000, target: "Baby", activityTypeId: 1, activityTypeName: "Center", duration: 60, status: "Active" }
        ];
        setAllActivities(fallbackData);
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

  const getStatusIndicator = (status: any, statusName: string | null | undefined) => {
    let color = "#94a3b8";
    const statusVal = typeof status === 'string' ? parseInt(status) : status;
    switch (statusVal) {
      case 0: color = "#f59e0b"; break;
      case 1: color = "#3b82f6"; break;
      case 2: color = "#ef4444"; break;
      case 3: color = "#10b981"; break;
    }
    return (
      <div className={styles.statusIndicatorWrapper}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statusDot} style={{ color: color, backgroundColor: color }}></div>
          </TooltipTrigger>
          <TooltipContent side="top" className="border-none">{statusName || 'Không xác định'}</TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const handleViewDetails = async (request: PackageRequest) => {
    setSelectedRequest(request);
    if (request.familyProfiles && request.familyProfiles.length > 0) {
      setActiveProfileId(request.familyProfiles[0].id);
    }
    setView('details');
    if (request.familyProfiles) {
      setHealthLoading(true);
      const records: Record<number, HealthRecord> = {};
      try {
        await Promise.all(
          request.familyProfiles.map(async (profile) => {
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
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    if (selectedActivityIds.length === 0) {
      toast({
        title: "Chưa chọn hoạt động",
        description: "Vui lòng chọn ít nhất một hoạt động để phê duyệt yêu cầu.",
        variant: "error"
      });
      return;
    }

    try {
      setIsApproving(true);
      
      const activitiesPayload = selectedActivityIds.map(id => ({
        activityId: id,
        dayNo: 1,
        homeServiceDate: selectedRequest.requestedStartDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        startTime: "08:00",
        endTime: "09:00",
        instruction: "Bắt đầu dịch vụ"
      }));

      const payload = {
        packageName: selectedRequest.title,
        description: selectedRequest.description || "",
        packageTypeId: parseInt(selectedPackageType),
        roomTypeId: parseInt(selectedRoomType),
        basePrice: parseFloat(basePrice) || 0,
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
        description: error.response?.data?.message || "Đã có lỗi xảy ra khi gọi API.",
        variant: "error"
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.modalContent} hide-close !max-w-[90vw] w-[90vw] !max-h-[85vh] h-[85vh] !p-0 !gap-0 flex flex-col`}>
        <div className={styles.modalHeader}>
          {view === 'details' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className={styles.backButton} onClick={() => setView('list')}>
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="border-none">Quay lại danh sách</TooltipContent>
            </Tooltip>
          )}
          <h2 className={styles.modalTitle}>
            {view === 'list' ? 'Duyệt yêu cầu gói dịch vụ' : `Chi tiết yêu cầu: ${selectedRequest?.title}`}
          </h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={styles.closeButton} onClick={() => onOpenChange(false)} aria-label="Close">
                <X size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="border-none">Đóng</TooltipContent>
          </Tooltip>
        </div>

        {view === 'list' ? (
          <>
            <div className={styles.controlsRow}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm theo khách hàng, gói dịch vụ..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <CustomDropdown
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={setStatusFilter}
                triggerClassName="min-w-[180px] !rounded-lg"
              />
            </div>

            <ScrollArea className={`${styles.scrollArea} flex-1`}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-4"></div>
                  <span>Đang tải danh sách yêu cầu...</span>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className={styles.emptyContainer}>
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Search size={40} className="text-gray-300" />
                  </div>
                  <span className="text-lg font-medium text-gray-500">Không tìm thấy yêu cầu nào</span>
                </div>
              ) : (
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead className={styles.thead}>
                      <tr>
                        <th className={`${styles.th} ${styles.stt}`}>STT</th>
                        <th className={styles.th}>Khách hàng</th>
                        <th className={styles.th}>Tiêu đề</th>
                        <th className={styles.th}>Gói gốc</th>
                        <th className={styles.th}>Ngày bắt đầu</th>
                        <th className={styles.th}>Số ngày</th>
                        <th className={styles.th}>Mô tả</th>
                        <th className={styles.th}>Trạng thái</th>
                        <th className={`${styles.th} text-center`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRequests.map((request, index) => (
                        <tr key={request.id} className={styles.tr}>
                          <td className={`${styles.td} ${styles.stt}`}>
                            {(currentPage - 1) * parseInt(pageSize) + index + 1}
                          </td>
                          <td className={styles.td}>
                            <div className={styles.customerCell}>
                              <div className={styles.avatar}>
                                {request.customerAvatar ? (
                                  <img src={request.customerAvatar} alt={request.customerName || ''} className={styles.avatarImg} />
                                ) : (
                                  <div className="flex items-center justify-center h-full w-full bg-orange-100 text-orange-600 font-bold text-xs">
                                    {request.customerName?.substring(0, 2).toUpperCase() || 'KH'}
                                  </div>
                                )}
                              </div>
                              <span className={styles.customerName}>{request.customerName}</span>
                            </div>
                          </td>
                          <td className={styles.td}><span className={styles.titleText}>{request.title}</span></td>
                          <td className={styles.td}>{request.basePackageName || '-'}</td>
                          <td className={styles.td}>{request.requestedStartDate ? format(new Date(request.requestedStartDate), 'dd/MM/yyyy') : '-'}</td>
                          <td className={styles.td}>{request.totalDays} ngày</td>
                          <td className={styles.td}><div className={styles.description} title={request.description || ''}>{request.description || '-'}</div></td>
                          <td className={`${styles.td} text-center`}>{getStatusIndicator(request.status, request.statusName)}</td>
                          <td className={`${styles.td} text-center`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className={styles.eyeButton} onClick={() => handleViewDetails(request)}>
                                  <Eye size={22} strokeWidth={1.5} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="border-none">Xem chi tiết</TooltipContent>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ScrollArea>

            <div className={styles.modalFooter}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={styles.paginationInfo}>Dòng/trang:</span>
                  <CustomDropdown
                    options={PAGE_SIZE_OPTIONS}
                    value={pageSize}
                    onChange={setPageSize}
                    triggerClassName="!w-[70px] !min-h-[32px] !py-1 !px-2 !rounded-md"
                    contentClassName="!top-auto !bottom-full !mb-1 !min-w-[70px]"
                  />
                </div>
                <span className={styles.paginationInfo}>
                  Hiển thị <span className="text-orange-500 font-semibold">{(currentPage - 1) * parseInt(pageSize) + 1} - {Math.min(currentPage * parseInt(pageSize), filteredRequests.length)}</span> trên tổng <span className="text-orange-500 font-semibold">{filteredRequests.length}</span> kết quả
                </span>
              </div>
              <div className={styles.pagination}>
                <button className={styles.pageBtn} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className={styles.pageBtn} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.detailsContainer}>
            <ScrollArea className="flex-1">
              <div className={styles.summaryHeader}>
                <div className={styles.summaryTop}>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Khách hàng</p>
                    <div className={styles.summaryValue}>
                      <div className={styles.summaryCustomerAvatar}>
                        {selectedRequest?.customerAvatar ? (
                          <img src={selectedRequest.customerAvatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px]">
                            {selectedRequest?.customerName?.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span>{selectedRequest?.customerName}</span>
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Trạng thái</p>
                    <div className={styles.summaryValue}>{getStatusIndicator(selectedRequest?.status, selectedRequest?.statusName)}<span className="ml-1">{selectedRequest?.statusName}</span></div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Gói dịch vụ</p>
                    <div className={styles.summaryValue}>{selectedRequest?.basePackageName || 'Tùy chỉnh'}</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Ngày bắt đầu</p>
                    <div className={styles.summaryValue}>{selectedRequest?.requestedStartDate ? format(new Date(selectedRequest.requestedStartDate), 'dd/MM/yyyy') : '-'}</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Số ngày</p>
                    <div className={styles.summaryValue}>{selectedRequest?.totalDays} ngày</div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Loại gói</p>
                    <div className="h-[40px] flex items-center">
                      <CustomDropdown options={PACKAGE_TYPE_OPTIONS} value={selectedPackageType} onChange={setSelectedPackageType} triggerClassName="!min-w-[160px] !h-[36px] !rounded" />
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Loại phòng</p>
                    <div className="h-[40px] flex items-center">
                      <CustomDropdown options={ROOM_TYPE_OPTIONS} value={selectedRoomType} onChange={setSelectedRoomType} triggerClassName="!min-w-[160px] !h-[36px] !rounded" />
                    </div>
                  </div>
                  <div className={styles.summaryItem}>
                    <p className={styles.summaryLabel}>Giá (VNĐ)</p>
                    <div className="h-[40px] flex items-center">
                      <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className={styles.priceInput} placeholder="0" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.detailsContent}>
                <div className={styles.detailsRow}>
                  <div className="space-y-6">
                    <h3 className={styles.cardTitle}>Hồ sơ sức khỏe</h3>
                    {selectedRequest?.familyProfiles && selectedRequest.familyProfiles.length > 0 ? (
                      <div className="space-y-4">
                        <div className={styles.tabsList}>
                          {selectedRequest.familyProfiles.map(profile => (
                            <button key={profile.id} className={`${styles.tabItem} ${activeProfileId === profile.id ? styles.tabItemActive : ''}`} onClick={() => setActiveProfileId(profile.id)}>
                              {profile.fullName}<span className={styles.tabBadge}>{profile.memberType}</span>
                            </button>
                          ))}
                        </div>
                        <div className="min-h-[300px]">
                          {healthLoading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-gray-500 bg-white rounded-xl border border-dashed"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div><span>Đang đồng bộ dữ liệu...</span></div>
                          ) : (
                            selectedRequest.familyProfiles.filter(p => p.id === activeProfileId).map(profile => {
                              const record = healthRecords[profile.id];
                              return (
                                <div key={profile.id} className={styles.familyItem}>
                                  <div className="flex flex-col gap-6 w-full">
                                    {record ? (
                                      <div className="w-full space-y-8">
                                        <div><span className={styles.healthLabel}>Tình trạng bệnh lý</span><div className="flex flex-wrap gap-4">{record.conditions.length > 0 ? record.conditions.map(c => (<span key={c.id} className={styles.healthBadge}>{c.name}</span>)) : null}</div></div>
                                        <div className={styles.healthMetricGrid}>
                                          <div className={styles.healthMetricCard}><p className={styles.healthMetricLabel}>Cân nặng</p><p className={styles.healthMetricValue}>{record.weight}<span className={styles.healthMetricUnit}>kg</span></p></div>
                                          <div className={styles.healthMetricCard}><p className={styles.healthMetricLabel}>Chiều cao</p><p className={styles.healthMetricValue}>{record.height}<span className={styles.healthMetricUnit}>cm</span></p></div>
                                          <div className={styles.healthMetricCard}><p className={styles.healthMetricLabel}>Nhiệt độ</p><p className={styles.healthMetricValue}>{record.temperature}<span className={styles.healthMetricUnit}>°C</span></p></div>
                                          {record.gestationalAgeWeeks !== undefined && record.gestationalAgeWeeks > 0 && (<div className={styles.healthMetricCard}><p className={styles.healthMetricLabel}>Tuổi thai</p><p className={styles.healthMetricValue}>{record.gestationalAgeWeeks}<span className={styles.healthMetricUnit}>tuần</span></p></div>)}
                                          {record.birthWeightGrams !== undefined && record.birthWeightGrams > 0 && (<div className={styles.healthMetricCard}><p className={styles.healthMetricLabel}>Cân nặng khi sinh</p><p className={styles.healthMetricValue}>{record.birthWeightGrams}<span className={styles.healthMetricUnit}>g</span></p></div>)}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {record.generalCondition && (<div><span className={styles.healthLabel}>Đánh giá chung</span><p className={styles.healthGeneralCondition}>{record.generalCondition}</p></div>)}
                                          {record.note && (<div><span className={styles.healthLabel}>Ghi chú thêm</span><div className={styles.healthNoteBox}><p>"{record.note}"</p></div></div>)}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200"><p className="text-sm text-gray-400 italic">Chưa có hồ sơ sức khỏe mới nhất cho thành viên này.</p></div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic py-8 text-center bg-white rounded-xl border border-dashed">Không có hồ sơ gia đình đi kèm.</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h3 className={styles.cardTitle}>Danh sách hoạt động ({allActivities.length})</h3>
                    <div className={styles.activitiesList}>
                      {allActivities.length > 0 ? (
                        allActivities.map(activity => (
                          <div key={activity.id} className={`${styles.activityCard} ${selectedActivityIds.includes(activity.id) ? styles.activityCardActive : ''}`} onClick={() => toggleActivity(activity.id)}>
                            <div className={styles.activityInfo}>
                              <p className={styles.activityName} title={activity.name}>{activity.name}</p>
                              <p className={styles.activityType}>{activity.activityTypeName}</p>
                            </div>
                            <div className={`${styles.activityCheckbox} ${selectedActivityIds.includes(activity.id) ? styles.activityCheckboxActive : ''}`}>
                              {selectedActivityIds.includes(activity.id) && <Check size={10} />}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-gray-500 bg-white rounded-xl border border-dashed"><span>Không tìm thấy hoạt động nào.</span></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className={styles.actionFooter}>
              <button className={styles.btnBack} onClick={() => setView('list')}>Quay lại danh sách</button>
              {selectedRequest?.status === 0 && (
                <>
                  <button className={styles.btnReject}>Từ chối</button>
                  <button className={styles.btnApprove} onClick={handleApprove} disabled={isApproving}>
                    {isApproving ? (
                      <div className="flex items-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Đang xử lý...</div>
                    ) : (
                      'Phê duyệt yêu cầu'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
