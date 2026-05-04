'use client';

import React, { useMemo, useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, addMonths, subMonths, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronDown, ChevronRight, ChevronUp, Activity as ActivityIcon, ChevronLeft, Calendar, Grid, Info, AlertCircle, Search, Settings, RotateCcw, XCircle, Package, Home, Library } from 'lucide-react';
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/toast/use-toast';
import { Clock, Check, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PackageRequest, RequestActivity } from '@/types/package-request';
import { Activity } from '@/types/activity';
import { HealthRecord } from '@/types/health-record';
import familyProfileService from '@/services/family-profile.service';
import styles from './request-calendar-view.module.css';

interface RequestDetailsViewProps {
  selectedRequest: PackageRequest | null;
  allActivities: Activity[];
  healthRecords: Record<number, HealthRecord>;
  healthLoading: boolean;
  activeProfileId: number | null;
  setActiveProfileId: (id: number | null) => void;
  selectedActivityIds: number[];
  toggleActivity: (id: number) => void;
  selectedPackageType: string;
  setSelectedPackageType: (val: string) => void;
  selectedRoomType: string;
  setSelectedRoomType: (val: string) => void;
  basePrice: string;
  onApprove: () => void;
  isApproving: boolean;
  setView: (view: 'list' | 'details') => void;
  getStatusIndicator: (status: any, statusName: string | null | undefined) => React.ReactNode;
  getStatusLabel: (status: any, fallbackName?: string | null) => string;
  packageTypeOptions: { label: string; value: string }[];
  roomTypeOptions: { label: string; value: string }[];
  localActivities: any[];
  setLocalActivities: React.Dispatch<React.SetStateAction<any[]>>;
  setBasePrice: (val: string) => void;
  onResetStatus?: () => void;
  onReject?: () => void;
}

export const RequestDetailsView: React.FC<RequestDetailsViewProps> = ({
  selectedRequest,
  allActivities,
  healthRecords,
  healthLoading,
  activeProfileId,
  setActiveProfileId,
  selectedActivityIds,
  toggleActivity,
  selectedPackageType,
  setSelectedPackageType,
  selectedRoomType,
  setSelectedRoomType,
  basePrice,
  setBasePrice,
  onApprove,
  isApproving,
  setView,
  getStatusIndicator,
  getStatusLabel,
  packageTypeOptions,
  roomTypeOptions,
  localActivities,
  setLocalActivities,
  onResetStatus,
  onReject,
}) => {
  const { toast } = useToast();
  const [expandedProfiles, setExpandedProfiles] = useState<Record<number, boolean>>({});
  const [isHealthExpanded, setIsHealthExpanded] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
  const [isPackageTypeExpanded, setIsPackageTypeExpanded] = useState(false);
  const [isRoomTypeExpanded, setIsRoomTypeExpanded] = useState(false);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [unsuitableActivityMap, setUnsuitableActivityMap] = useState<Record<number, number[]>>({});
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [confirmWarnings, setConfirmWarnings] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, activityId: number } | null>(null);
  const [editingTime, setEditingTime] = useState<{ id: number, start: string, end: string } | null>(null);
  const initialStartDate = useMemo(() => {
    return selectedRequest?.requestedStartDate ? new Date(selectedRequest.requestedStartDate) : new Date();
  }, [selectedRequest]);

  const [calendarDate, setCalendarDate] = useState<Date>(initialStartDate);

  // Sync calendarDate when selectedRequest changes
  React.useEffect(() => {
    setCalendarDate(initialStartDate);
    if (selectedRequest?.basePackageActivities) {
      setLocalActivities(selectedRequest.basePackageActivities);
    }

    // Fetch unsuitable activities for all profiles
    if (selectedRequest?.familyProfiles) {
      selectedRequest.familyProfiles.forEach(async (profile) => {
        try {
          const res = await familyProfileService.getUnsuitableActivities(profile.id);
          // The API returns { familyProfileId, fullName, activities: [...] }
          const activities = res?.activities || (Array.isArray(res) ? res : []);
          const ids = activities.map((a: any) => a.id);
          setUnsuitableActivityMap(prev => ({ ...prev, [profile.id]: ids }));
        } catch (error) {
          console.error(`Failed to fetch unsuitable activities for profile ${profile.id}:`, error);
        }
      });
    }
  }, [initialStartDate, selectedRequest]);

  const recordsArray = useMemo(() => Object.values(healthRecords), [healthRecords]);
  const activeRecord = activeProfileId ? healthRecords[activeProfileId] : recordsArray[0];
  const activeProfile = selectedRequest?.familyProfiles?.find(p => p.id === (activeProfileId || recordsArray[0]?.familyProfileId));

  const toggleProfile = (id: number) => {
    setExpandedProfiles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Use calendarDate for navigation instead of fixed startDate
  const weekStart = useMemo(() => startOfWeek(calendarDate, { weekStartsOn: 0 }), [calendarDate]);

  const packageDays = useMemo(() => {
    // Default to 30 days or the package's total days, whichever is greater
    const duration = Math.max(selectedRequest?.totalDays || 0, 30);
    const start = selectedRequest?.requestedStartDate ? new Date(selectedRequest.requestedStartDate) : new Date();
    return Array.from({ length: duration }, (_, i) => addDays(start, i));
  }, [selectedRequest]);

  const handleToday = () => setCalendarDate(new Date());
  const handlePrevMonth = () => setCalendarDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCalendarDate(prev => addMonths(prev, 1));

  const HOURS = Array.from({ length: 24 }, (_, i) => i);

  const getEventPosition = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours + minutes / 60) * 80;
  };

  const getEventHeight = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const duration = (endH + endM / 60) - (startH + startM / 60);
    return Math.max(duration * 80, 40);
  };

  const dayLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  // Helper to get Vietnamese day label
  const getDayLabel = (date: Date) => {
    const day = date.getDay();
    if (day === 0) return 'Chủ nhật';
    return `Thứ ${day + 1}`;
  };

  const isUnsuitable = (activityId: number) => {
    const targetId = Number(activityId);
    return Object.values(unsuitableActivityMap).some(ids =>
      ids.some(id => Number(id) === targetId)
    );
  };

  const getIneligibleMembers = (activityId: number) => {
    const targetId = Number(activityId);
    return selectedRequest?.familyProfiles
      ?.filter(p => unsuitableActivityMap[p.id]?.some(id => Number(id) === targetId))
      .map(p => p.fullName) || [];
  };

  const totalPrice = useMemo(() => {
    return localActivities.reduce((sum, a) => sum + (a.price || 0), 0);
  }, [localActivities]);

  const isActionable = useMemo(() => {
    // 0: Chờ duyệt, 3: Đang xử lý, 5: Cần chỉnh sửa
    return selectedRequest?.status === 0 || selectedRequest?.status === 3 || selectedRequest?.status === 5;
  }, [selectedRequest]);

  const warningActivitiesCount = useMemo(() => {
    return localActivities.filter(a => a.isRestricted || isUnsuitable(a.activityId)).length;
  }, [localActivities, unsuitableActivityMap]);

  const toggleEventSelection = (id: number) => {
    setSelectedEventIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectColumn = (dayNo: number) => {
    const columnIds = localActivities
      .filter(a => a.dayNo === dayNo)
      .map(a => a.id);

    if (columnIds.length === 0) return;

    setSelectedEventIds(prev => {
      const allSelected = columnIds.every(id => prev.includes(id));
      if (allSelected) {
        return prev.filter(id => !columnIds.includes(id));
      } else {
        return Array.from(new Set([...prev, ...columnIds]));
      }
    });
  };

  const selectRow = (hour: number) => {
    const rowIds = localActivities
      .filter(a => {
        const [h] = a.startTime.split(':').map(Number);
        return h === hour;
      })
      .map(a => a.id);

    if (rowIds.length === 0) return;

    setSelectedEventIds(prev => {
      const allSelected = rowIds.every(id => prev.includes(id));
      if (allSelected) {
        return prev.filter(id => !rowIds.includes(id));
      } else {
        return Array.from(new Set([...prev, ...rowIds]));
      }
    });
  };

  const handleRightClick = (e: React.MouseEvent, activityId: number) => {
    e.preventDefault();
    const activity = localActivities.find(a => a.id === activityId);
    if (activity) {
      setContextMenu({ x: e.clientX, y: e.clientY, activityId });
      setEditingTime({ 
        id: activityId, 
        start: activity.startTime.substring(0, 5), 
        end: activity.endTime.substring(0, 5) 
      });
    }
  };

  const handleSaveTime = () => {
    if (!editingTime) return;

    setLocalActivities(prev => prev.map(a => {
      if (a.id === editingTime.id) {
        return {
          ...a,
          startTime: `${editingTime.start}:00`,
          endTime: `${editingTime.end}:00`,
          isModified: true
        };
      }
      return a;
    }));

    setContextMenu(null);
    setEditingTime(null);
    
    toast({
      title: "Đã cập nhật thời gian",
      description: `Thời gian mới: ${editingTime.start} - ${editingTime.end}`,
      variant: "success"
    });
  };
  const handleBulkReplace = (libActivity: Activity) => {
    if (selectedEventIds.length === 0) return;

    setLocalActivities(prev => prev.map(activity => {
      if (selectedEventIds.includes(activity.id)) {
        return {
          ...activity,
          activityId: libActivity.id,
          activityName: libActivity.name,
          instruction: libActivity.description || '',
          price: libActivity.price || 0,
          isModified: true,
          isRestricted: false
        };
      }
      return activity;
    }));

    // Clear selection after replacement
    setSelectedEventIds([]);
    
    toast({
      title: "Đã thay thế hàng loạt",
      description: `Đã thay thế ${selectedEventIds.length} hoạt động bằng "${libActivity.name}"`,
      variant: "success"
    });
  };

  return (
    <TooltipProvider>
      {/* Request Info Banner */}
      <div className={styles.requestInfoBanner}>
        <div className={styles.requestMetaGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Gói dịch vụ</span>
            <span className={styles.metaValue}>{selectedRequest?.basePackageName}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Tổng thời gian</span>
            <span className={styles.metaValue}>{selectedRequest?.totalDays} ngày</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Ngày bắt đầu</span>
            <span className={styles.metaValue}>{selectedRequest?.requestedStartDate}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Trạng thái</span>
            <div className="flex items-center gap-2">
              {getStatusIndicator(selectedRequest?.status, selectedRequest?.statusName)}
              <span className={styles.metaValue}>{getStatusLabel(selectedRequest?.status, selectedRequest?.statusName)}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Tổng giá dự kiến</span>
            <span className={`${styles.metaValue} text-green-600 font-bold`}>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Khách hàng</span>
            <span className={styles.metaValue}>{selectedRequest?.customerName}</span>
          </div>
        </div>

        <div className={styles.calendarControls}>

          <button className={styles.btnReject} onClick={onReject} title="Từ chối yêu cầu này">
            <XCircle size={14} />
            Từ chối
          </button>

          <button className={styles.btnToday} onClick={handleToday}>
            Hôm nay
          </button>

          <div className={styles.dateNavigator}>
            <button className={styles.navBtn} onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <div className={styles.currentDateDisplay}>
              {format(calendarDate, 'MMMM yyyy', { locale: vi })}
            </div>
            <button className={styles.navBtn} onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>

      <div className={styles.mainContentWrapper}>
        <div className={styles.leftColumn}>
          {/* Unified Header Row for Health Records */}
          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fcfcfc', width: '100%' }}>
            {/* Health Records Trigger */}
            <div
              className={styles.healthRowHeader}
              onClick={() => setIsHealthExpanded(!isHealthExpanded)}
              style={{ flex: isHealthExpanded ? 1 : 'none' }}
            >
              <div className={`${styles.dropdownIcon} ${isHealthExpanded ? styles.dropdownIconExpanded : ''}`}>
                <ChevronDown size={18} />
              </div>
              <span className={styles.headerTitle}>Hồ sơ sức khỏe thành viên</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                {recordsArray.map(record => {
                  const profile = selectedRequest?.familyProfiles?.find(p => p.id === record.familyProfileId);
                  const isMom = profile?.memberType?.toLowerCase() === 'mom';
                  const isBaby = profile?.memberType?.toLowerCase() === 'baby';
                  const isActive = activeProfileId === record.familyProfileId;

                  return (
                    <button
                      key={record.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProfileId(record.familyProfileId);
                        if (!isHealthExpanded) setIsHealthExpanded(true);
                      }}
                      className={`${styles.healthTab} ${isActive ? styles.tabActive : styles.tabInactive}`}
                      style={{
                        backgroundColor: isActive ? '#f97316' : 'transparent',
                        color: isActive ? '#fff' : '#64748b',
                        borderColor: isActive ? '#f97316' : '#e2e8f0'
                      }}
                    >
                      {profile?.fullName?.toUpperCase() || '---'} ({isMom ? 'MẸ' : (isBaby ? 'BÉ' : 'KHÁCH')})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Health Records Expandable Content */}
          <div className={styles.healthRecordsArea} style={{ borderBottom: 'none' }}>
            {healthLoading ? (
              <div className="py-6 text-center text-sm text-orange-500 font-medium">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Đang tải dữ liệu hồ sơ sức khỏe...
              </div>
            ) : recordsArray.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400 italic bg-gray-50">
                Không tìm thấy dữ liệu hồ sơ sức khỏe cho các thành viên trong yêu cầu này.
              </div>
            ) : (
              <div className={`${styles.healthExpandable} ${isHealthExpanded ? styles.healthExpandableExpanded : ''}`}>
                <div className={styles.healthContentWrapper}>
                  <div className={styles.healthContent}>
                    {activeRecord ? (
                      <>
                        <div className={styles.healthStatsGrid}>
                          <div className={styles.healthStatItem}>
                            <div className={styles.healthStatLabel}>CÂN NẶNG</div>
                            <div className={styles.healthStatValue}>{activeRecord.weight} kg</div>
                          </div>
                          <div className={styles.healthStatItem}>
                            <div className={styles.healthStatLabel}>CHIỀU CAO</div>
                            <div className={styles.healthStatValue}>{activeRecord.height} cm</div>
                          </div>
                          <div className={styles.healthStatItem}>
                            <div className={styles.healthStatLabel}>THÂN NHIỆT</div>
                            <div className={styles.healthStatValue}>{activeRecord.temperature}°C</div>
                          </div>
                          {activeProfile?.memberType?.toLowerCase() === 'baby' && (
                            <div className={styles.healthStatItem}>
                              <div className={styles.healthStatLabel}>CÂN NẶNG LÚC SINH</div>
                              <div className={styles.healthStatValue}>{activeRecord.birthWeightGrams || 0} g</div>
                            </div>
                          )}
                          <div className={styles.healthStatItem} style={{ gridColumn: activeProfile?.memberType?.toLowerCase() === 'baby' ? 'span 1' : 'span 2' }}>
                            <div className={styles.healthStatLabel}>TÌNH TRẠNG CHUNG</div>
                            <div className={styles.healthStatValue}>{activeRecord.generalCondition || 'Bình thường'}</div>
                          </div>
                        </div>

                        <div className={styles.healthNotesGrid} style={{ paddingTop: 0 }}>
                          <div 
                            className={styles.healthNotesArea} 
                            style={{ gridColumn: activeProfile?.memberType?.toLowerCase() === 'baby' ? 'span 4' : 'span 3' }}
                          >
                            <div className={styles.healthStatLabel}>BỆNH LÝ / LƯU Ý ĐẶC BIỆT</div>
                            <div className={styles.conditionList}>
                              {activeRecord.conditions && activeRecord.conditions.length > 0 ? (
                                activeRecord.conditions.map(c => (
                                  <span key={c.id} className={styles.conditionChip}>{c.name}</span>
                                ))
                              ) : activeRecord.note ? (
                                <span className={styles.conditionChip}>{activeRecord.note}</span>
                              ) : (
                                <span className="text-xs text-gray-400 italic">Không có lưu ý đặc biệt</span>
                              )}
                            </div>
                          </div>

                          <div 
                            className={styles.healthNotesArea}
                            style={{ gridColumn: activeProfile?.memberType?.toLowerCase() === 'baby' ? 'span 1' : 'span 2' }}
                          >
                            <div className={styles.healthStatLabel}>PHẢN HỒI KHÁCH HÀNG</div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={styles.feedbackTextTruncated}>
                                  {selectedRequest?.customerFeedback || 'Không có phản hồi'}
                                </div>
                              </TooltipTrigger>
                              {selectedRequest?.customerFeedback && (
                                <TooltipContent className={styles.tooltipContent} side="top">
                                  <div style={{ maxWidth: '400px', lineHeight: '1.5' }}>
                                    {selectedRequest.customerFeedback}
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center text-gray-400 text-sm italic">
                        Vui lòng chọn thành viên để xem hồ sơ sức khỏe
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className={styles.calendarWrap}>
            <div className={styles.calendarScroll}>
              <div
                className={styles.calendarContent}
                style={{
                  width: `${80 + (packageDays.length * 200)}px`,
                  minWidth: '100%'
                }}
              >
                {/* Header Row - Sticky Top */}
                <div
                  className={styles.calendarHeader}
                  style={{
                    gridTemplateColumns: `80px repeat(${packageDays.length}, 200px)`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 50
                  }}
                >
                  {/* GIỜ Cell - Sticky Top & Left */}
                  <div className={styles.headerCell} style={{ borderRight: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'sticky', left: 0, zIndex: 60 }}>
                    <span className={styles.dayLabel}>GIỜ</span>
                  </div>
                  {packageDays.map((date, i) => {
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    const dayNo = i + 1;

                    return (
                      <div 
                        key={i} 
                        className={styles.headerCell}
                        onClick={() => selectColumn(dayNo)}
                        style={{ cursor: 'pointer' }}
                        title={`Nhấp để chọn tất cả hoạt động ngày ${dayNo}`}
                      >
                        <span className={`${styles.dateLabel} ${isToday ? styles.todayDate : ''}`}>
                          {`NGÀY ${dayNo}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Grid - Sticky Left Column */}
                <div
                  className={styles.calendarGrid}
                  style={{
                    gridTemplateColumns: `80px repeat(${packageDays.length}, 200px)`
                  }}
                >
                  {/* Time Column - Sticky Left */}
                  <div className={styles.timeColumn} style={{ position: 'sticky', left: 0, zIndex: 40, backgroundColor: '#f8fafc' }}>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={styles.timeSlot}
                        onClick={() => selectRow(i)}
                        style={{ cursor: 'pointer' }}
                        title={`Nhấp để chọn tất cả hoạt động lúc ${i}:00`}
                      >
                        {i}:00
                      </div>
                    ))}
                  </div>

                  {/* Day Columns */}
                  {packageDays.map((date, i) => {
                    const dayActivities = (() => {
                      const currentDayNo = i + 1;
                      return localActivities.filter(a => a.dayNo === currentDayNo);
                    })();

                    return (
                      <div key={i} className={styles.dayColumn}>
                        {Array.from({ length: 24 }).map((_, j) => (
                          <div
                            key={j}
                            className={styles.hourRow}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.backgroundColor = '#fef3c7'; // Light orange highlight
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.backgroundColor = 'transparent';
                              const activityData = e.dataTransfer.getData('activity');
                              if (activityData) {
                                const libActivity = JSON.parse(activityData);
                                const newActivity: RequestActivity & { isModified?: boolean } = {
                                  id: Math.floor(Math.random() * -10000), // Temporary negative ID
                                  packageId: selectedRequest?.packageId || 0,
                                  activityId: libActivity.id,
                                  activityName: libActivity.name,
                                  dayNo: i + 1,
                                  homeServiceDate: null,
                                  startTime: `${j.toString().padStart(2, '0')}:00:00`,
                                  endTime: `${(j + 1).toString().padStart(2, '0')}:00:00`,
                                  instruction: libActivity.description || '',
                                  isModified: true
                                };
                                setLocalActivities(prev => [...prev, newActivity]);
                              }
                            }}
                          />
                        ))}

                        {dayActivities.map(activity => {
                          const [startH, startM] = activity.startTime.split(':').map(Number);
                          const [endH, endM] = activity.endTime.split(':').map(Number);
                          const top = (startH * 80) + (startM / 60 * 80);
                          const duration = (endH * 60 + endM) - (startH * 60 + startM);
                          const height = (duration / 60 * 80);

                          return (
                            <Tooltip key={activity.id}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`${styles.eventCard} ${(activity as any).isModified ? styles.modifiedCard : ''
                                    } ${activity.isRestricted || isUnsuitable(activity.activityId || (activity as any).id) ? styles.warningCard : ''}`}
                                  style={{ top: `${top}px`, height: `${height}px` }}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.boxShadow = '0 0 0 3px #f59e0b'; // Strong orange border for replacement hint
                                    e.currentTarget.style.zIndex = '100';
                                  }}
                                  onDragLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.zIndex = '';
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.zIndex = '';
                                    const activityData = e.dataTransfer.getData('activity');
                                    if (activityData) {
                                      const libActivity = JSON.parse(activityData);
                                      const replacedActivity = {
                                        ...activity,
                                        activityId: libActivity.id,
                                        activityName: libActivity.name,
                                        instruction: libActivity.description || '',
                                        price: libActivity.price || 0,
                                        isModified: true,
                                        isRestricted: false // Clear warning state since it's replaced
                                      };
                                      setLocalActivities(prev => prev.map(a => a.id === activity.id ? replacedActivity : a));
                                    }
                                  }}
                                  onContextMenu={(e) => handleRightClick(e, activity.id)}
                                  onClick={() => toggleEventSelection(activity.id)}
                                >
                                    <input
                                      type="checkbox"
                                      className={styles.eventCheckbox}
                                      checked={selectedEventIds.includes(activity.id)}
                                      readOnly
                                      title="Chọn để thay thế hàng loạt"
                                    />
                                    <span className={styles.eventTime}>
                                    {activity.startTime.substring(0, 5)} - {activity.endTime.substring(0, 5)}
                                  </span>
                                  {activity.price !== undefined && activity.price > 0 && (
                                    <span className={styles.eventPriceBadge}>
                                      {activity.price.toLocaleString()}đ
                                    </span>
                                  )}
                                  <h4 className={styles.eventName}>{activity.activityName}</h4>
                                  <p className={styles.eventInstruction}>{activity.instruction}</p>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className={styles.tooltipContent} side="right" sideOffset={10}>
                                <div className={styles.tooltipHeader}>
                                  <span className={styles.tooltipTitle}>{activity.activityName}</span>
                                  <span className={styles.tooltipTime}>Ngày {activity.dayNo} | {activity.startTime.substring(0, 5)} - {activity.endTime.substring(0, 5)}</span>
                                </div>
                                <p className={styles.tooltipInstruction}>{activity.instruction}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        {/* Sidebar Toggle Button (Floating) */}
        <button 
          className={styles.sidebarToggleBtn}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{ 
            right: isSidebarCollapsed ? '0px' : '350px',
            zIndex: 100
          }}
          title={isSidebarCollapsed ? "Mở rộng thanh công cụ" : "Thu gọn thanh công cụ"}
        >
          {isSidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        </div>

        <div 
          className={`${styles.activityLibraryColumn} ${isSidebarCollapsed ? styles.activityLibraryColumnCollapsed : ''}`} 
          style={{ borderLeft: isSidebarCollapsed ? 'none' : '1px solid #e2e8f0', position: 'relative', overflow: 'visible' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '350px', overflow: 'hidden' }}>
          {/* Configuration Area */}
          <div className={styles.sidebarConfigArea}>
            <div className={styles.configAccordionItem}>
              <div
                className={styles.configAccordionHeader}
                onClick={() => setIsPackageTypeExpanded(!isPackageTypeExpanded)}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Package size={20} style={{ color: '#f97316' }} />
                  <span className={styles.configHeaderText}>LOẠI GÓI</span>
                </div>
                <ChevronDown className={`${styles.configChevron} ${isPackageTypeExpanded ? styles.configChevronExpanded : ''}`} size={16} />
              </div>
              <div className={`${styles.healthExpandable} ${isPackageTypeExpanded ? styles.healthExpandableExpanded : ''}`}>
                <div className={styles.healthContentWrapper}>
                  <div className={styles.configAccordionContent}>
                    {packageTypeOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className={`${styles.configOptionCard} ${selectedPackageType === opt.value ? styles.configOptionCardActive : ''}`}
                        onClick={() => setSelectedPackageType(opt.value)}
                      >
                        <div className={styles.configOptionInfo}>
                          <span className={styles.configOptionLabel}>{opt.label}</span>
                        </div>
                        <div className={`${styles.configCheckbox} ${selectedPackageType === opt.value ? styles.configCheckboxActive : ''}`}>
                          {selectedPackageType === opt.value && <div className={styles.configCheckboxInner} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.configAccordionItem}>
              <div
                className={styles.configAccordionHeader}
                onClick={() => setIsRoomTypeExpanded(!isRoomTypeExpanded)}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Home size={20} style={{ color: '#f97316' }} />
                  <span className={styles.configHeaderText}>LOẠI PHÒNG</span>
                </div>
                <ChevronDown className={`${styles.configChevron} ${isRoomTypeExpanded ? styles.configChevronExpanded : ''}`} size={16} />
              </div>
              <div className={`${styles.healthExpandable} ${isRoomTypeExpanded ? styles.healthExpandableExpanded : ''}`}>
                <div className={styles.healthContentWrapper}>
                  <div className={styles.configAccordionContent}>
                    {roomTypeOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className={`${styles.configOptionCard} ${selectedRoomType === opt.value ? styles.configOptionCardActive : ''}`}
                        onClick={() => setSelectedRoomType(opt.value)}
                      >
                        <div className={styles.configOptionInfo}>
                          <span className={styles.configOptionLabel}>{opt.label}</span>
                        </div>
                        <div className={`${styles.configCheckbox} ${selectedRoomType === opt.value ? styles.configCheckboxActive : ''}`}>
                          {selectedRoomType === opt.value && <div className={styles.configCheckboxInner} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.configAccordionItem} ${isLibraryExpanded ? styles.libraryAccordionItem : ''}`}>
            <div
              className={styles.configAccordionHeader}
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
              style={{ justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ActivityIcon size={20} style={{ color: '#f97316' }} />
                <span className={styles.configHeaderText}>THƯ VIỆN HOẠT ĐỘNG</span>
              </div>
              <ChevronDown className={`${styles.configChevron} ${isLibraryExpanded ? styles.configChevronExpanded : ''}`} size={16} />
            </div>

            <div className={`${styles.healthExpandable} ${isLibraryExpanded ? styles.healthExpandableExpanded : ''}`} style={isLibraryExpanded ? { flex: 1 } : {}}>
              <ScrollArea className={styles.activityScroll}>
                <div className={styles.libraryList}>
                  {allActivities.map(activity => (
                    <Tooltip key={activity.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={`${styles.smallActivityCard} ${isUnsuitable(activity.id) ? styles.warningLibraryCard : ''}`}
                          draggable="true"
                          onDragStart={(e) => {
                            e.dataTransfer.setData('activity', JSON.stringify(activity));
                            e.dataTransfer.effectAllowed = 'copy';
                          }}
                          onClick={() => {
                            if (selectedEventIds.length > 0) {
                              handleBulkReplace(activity);
                            }
                          }}
                        >
                          <span className={styles.smallActivityPrice}>{activity.price?.toLocaleString()} đ</span>
                          {isUnsuitable(activity.id) && (
                            <div className={styles.ineligibleBadge}>
                              <AlertCircle size={10} />
                              KHÔNG PHÙ HỢP
                            </div>
                          )}
                          <p className={styles.smallActivityName}>{activity.name}</p>
                          <p className={styles.smallActivityDesc}>{activity.description}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className={styles.tooltipContent} side="left" sideOffset={10}>
                        <div className={styles.tooltipHeader}>
                          <span className={styles.tooltipTitle}>{activity.name}</span>
                          {isUnsuitable(activity.id) && (
                            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-red-600 font-bold">
                              <AlertCircle size={14} />
                              <span>Không phù hợp với: {getIneligibleMembers(activity.id).join(', ')}</span>
                            </div>
                          )}
                        </div>
                        <p className={styles.tooltipInstruction}>{activity.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Action Footer in Sidebar */}
          <div className={styles.sidebarFooter}>
            {warningActivitiesCount > 0 && (
              <div className={styles.warningAcknowledgeBox}>
                <div className={styles.warningBoxHeader}>
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="font-bold text-red-600">Phát hiện {warningActivitiesCount} cảnh báo</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-3">
                  Có hoạt động không phù hợp với tình trạng sức khỏe của thành viên. Bạn vẫn muốn tiếp tục?
                </p>
                <label className={styles.acknowledgeLabel}>
                  <input 
                    type="checkbox" 
                    checked={confirmWarnings} 
                    onChange={(e) => setConfirmWarnings(e.target.checked)}
                  />
                  <span>Tôi xác nhận và chịu trách nhiệm</span>
                </label>
              </div>
            )}

            <button
              className={styles.btnApprove}
              onClick={onApprove}
              disabled={isApproving || !isActionable || (warningActivitiesCount > 0 && !confirmWarnings)}
              title={
                !isActionable ? "Chỉ có thể tạo gói nháp cho yêu cầu đang chờ duyệt" : 
                (warningActivitiesCount > 0 && !confirmWarnings) ? "Vui lòng xác nhận các cảnh báo trước khi tiếp tục" : ""
              }
            >
              {isApproving ? (
                <>
                  <div className={styles.spinnerSmall} />
                  Đang xử lý...
                </>
              ) : (
                'PHÊ DUYỆT & TẠO GÓI'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
      {/* Context Menu Time Picker */}
      {contextMenu && editingTime && (
        <div 
          className={styles.timePickerPopup}
          style={{ 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.timePickerHeader}>
            <Clock size={14} className="text-orange-500" />
            <span>Điều chỉnh thời gian</span>
          </div>
          <div className={styles.timePickerGrid}>
            {/* Start Time Section */}
            <div className={styles.timeInputGroup}>
              <label>Bắt đầu</label>
              <div className={styles.customTimePicker}>
                <div className={styles.timeScrollColumn}>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const hour = h.toString().padStart(2, '0');
                    const isActive = editingTime.start.startsWith(hour);
                    return (
                      <div 
                        key={h} 
                        className={`${styles.timeScrollItem} ${isActive ? styles.timeScrollItemActive : ''}`}
                        onClick={() => {
                          const [_, m] = editingTime.start.split(':');
                          setEditingTime({ ...editingTime, start: `${hour}:${m}` });
                        }}
                      >
                        {hour}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.timeSeparator}>:</div>
                <div className={styles.timeScrollColumn}>
                  {['00', '15', '30', '45'].map((m) => {
                    const isActive = editingTime.start.endsWith(m);
                    return (
                      <div 
                        key={m} 
                        className={`${styles.timeScrollItem} ${isActive ? styles.timeScrollItemActive : ''}`}
                        onClick={() => {
                          const [h, _] = editingTime.start.split(':');
                          setEditingTime({ ...editingTime, start: `${h}:${m}` });
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* End Time Section */}
            <div className={styles.timeInputGroup}>
              <label>Kết thúc</label>
              <div className={styles.customTimePicker}>
                <div className={styles.timeScrollColumn}>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const hour = h.toString().padStart(2, '0');
                    const isActive = editingTime.end.startsWith(hour);
                    return (
                      <div 
                        key={h} 
                        className={`${styles.timeScrollItem} ${isActive ? styles.timeScrollItemActive : ''}`}
                        onClick={() => {
                          const [_, m] = editingTime.end.split(':');
                          setEditingTime({ ...editingTime, end: `${hour}:${m}` });
                        }}
                      >
                        {hour}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.timeSeparator}>:</div>
                <div className={styles.timeScrollColumn}>
                  {['00', '15', '30', '45'].map((m) => {
                    const isActive = editingTime.end.endsWith(m);
                    return (
                      <div 
                        key={m} 
                        className={`${styles.timeScrollItem} ${isActive ? styles.timeScrollItemActive : ''}`}
                        onClick={() => {
                          const [h, _] = editingTime.end.split(':');
                          setEditingTime({ ...editingTime, end: `${h}:${m}` });
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.timePickerActions}>
            <button className={styles.btnTimeCancel} onClick={() => { setContextMenu(null); setEditingTime(null); }}>
              <X size={14} /> Hủy
            </button>
            <button className={styles.btnTimeSave} onClick={handleSaveTime}>
              <Check size={14} /> Lưu
            </button>
          </div>
        </div>
      )}

      {/* Close context menu on outside click */}
      {contextMenu && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => { setContextMenu(null); setEditingTime(null); }}
          onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); setEditingTime(null); }}
        />
      )}
    </TooltipProvider>
  );
};
