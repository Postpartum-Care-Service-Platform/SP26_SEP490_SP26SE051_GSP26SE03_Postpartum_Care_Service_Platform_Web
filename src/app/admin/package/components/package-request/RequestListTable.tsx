'use client';

import React from 'react';
import { format } from 'date-fns';
import { Eye, RotateCcw, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PackageRequest } from '@/types/package-request';
import styles from '../package-request-list-modal.module.css';

interface RequestListTableProps {
  requests: PackageRequest[];
  currentPage: number;
  pageSize: number;
  onViewDetails: (request: PackageRequest) => void;
  getStatusIndicator: (status: any, statusName: string | null | undefined) => React.ReactNode;
  onResetStatus: (request: PackageRequest) => void;
  onReject: (request: PackageRequest) => void;
}

export const RequestListTable: React.FC<RequestListTableProps> = ({
  requests,
  currentPage,
  pageSize,
  onViewDetails,
  getStatusIndicator,
  onResetStatus,
  onReject,
}) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={`${styles.th} ${styles.stt}`}>STT</th>
            <th className={styles.th}>Khách hàng</th>
            <th className={styles.th}>Tiêu đề</th>
            <th className={styles.th}>Gói gốc</th>
            <th className={styles.th}>Người lập</th>
            <th className={styles.th}>Ngày tạo</th>
            <th className={styles.th}>Bắt đầu</th>
            <th className={styles.th}>Số ngày</th>
            <th className={styles.th}>Mô tả</th>
            <th className={styles.th}>Lý do/Phản hồi</th>
            <th className={styles.th}>Trạng thái</th>
            <th className={`${styles.th} ${styles.actions} text-center`}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request.id} className={styles.tr}>
              <td className={`${styles.td} ${styles.stt}`}>
                {(currentPage - 1) * pageSize + index + 1}
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
              <td className={styles.td}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`${styles.titleText} max-w-[150px] truncate block cursor-help`}>
                      {request.title}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px]">
                    <p className="text-xs font-medium">{request.title}</p>
                  </TooltipContent>
                </Tooltip>
              </td>
              <td className={styles.td}>{request.basePackageName || '-'}</td>
              <td className={styles.td}>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {request.draftedByName || 'Admin'}
                </span>
              </td>
              <td className={styles.td}>{request.createdAt ? format(new Date(request.createdAt), 'dd/MM/yyyy') : '-'}</td>
              <td className={styles.td}>{request.requestedStartDate ? format(new Date(request.requestedStartDate), 'dd/MM/yyyy') : '-'}</td>
              <td className={styles.td}>{request.totalDays} ngày</td>
              <td className={styles.td}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${styles.description} cursor-help`} style={{ maxWidth: '180px' }}>
                      {request.description || '-'}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[400px]">
                    <div className="space-y-1">
                      <p className="font-bold text-xs text-orange-500">Mô tả đầy đủ:</p>
                      <p className="text-xs leading-relaxed">{request.description || 'Không có mô tả'}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </td>
              <td className={styles.td}>
                {request.rejectReason || request.customerFeedback ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="max-w-[100px] truncate text-xs text-slate-500 cursor-help italic">
                        {request.rejectReason || request.customerFeedback}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[300px] border-none">
                      {request.rejectReason && (
                        <div className="mb-2">
                          <p className="font-bold text-red-500">Lý do từ chối:</p>
                          <p className="text-xs">{request.rejectReason}</p>
                        </div>
                      )}
                      {request.customerFeedback && (
                        <div>
                          <p className="font-bold text-blue-500">Phản hồi khách hàng:</p>
                          <p className="text-xs">{request.customerFeedback}</p>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-slate-300">-</span>
                )}
              </td>
              <td className={`${styles.td} text-center`}>{getStatusIndicator(request.status, request.statusName)}</td>
              <td className={`${styles.td} ${styles.actions} text-center`}>
                <div className="flex items-center justify-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className={styles.eyeButton} onClick={() => onViewDetails(request)}>
                        <Eye size={18} strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="border-none">Xem chi tiết</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={styles.eyeButton} 
                        style={{ color: '#f59e0b' }} 
                        onClick={() => onResetStatus(request)}
                      >
                        <RotateCcw size={18} strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="border-none">Đổi trạng thái</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className={styles.eyeButton} 
                        style={{ color: '#ef4444' }} 
                        onClick={() => onReject(request)}
                      >
                        <XCircle size={18} strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="border-none">Từ chối</TooltipContent>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
