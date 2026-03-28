'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, Search, Upload } from 'lucide-react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import { useToast } from '@/components/ui/toast/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { AdminPageLayout } from '@/components/layout/admin/AdminPageLayout';
import amenityTicketService from '@/services/amenity-ticket.service';
import amenityServiceService from '@/services/amenity-service.service';
import userService from '@/services/user.service';
import type { AmenityTicket } from '@/types/amenity-ticket';
import type { AmenityService } from '@/types/amenity-service';
import type { Account } from '@/types/account';
import { AmenityTicketListHeader } from './components/AmenityTicketListHeader';
import styles from './amenity-ticket.module.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Booked', label: 'Đã đặt' },
  { value: 'Accepted', label: 'Chấp nhận' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
];

const SORT_OPTIONS = [
  { value: 'startTime-desc', label: 'Thời gian bắt đầu: Mới nhất' },
  { value: 'startTime-asc', label: 'Thời gian bắt đầu: Cũ nhất' },
  { value: 'id-desc', label: 'Mã số: Giảm dần' },
  { value: 'id-asc', label: 'Mã số: Tăng dần' },
];

export default function AdminAmenityTicketPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<AmenityTicket[]>([]);
  const [services, setServices] = useState<AmenityService[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('startTime-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PAGE_SIZE_OPTIONS = [10, 20, 50];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ticketData, serviceData, accountData] = await Promise.all([
        amenityTicketService.getAllAmenityTickets(),
        amenityServiceService.getAllAmenityServices(),
        userService.getAllAccounts(),
      ]);
      setTickets(ticketData);
      setServices(serviceData);
      setAccounts(accountData);
    } catch (err: unknown) {
      setError('Không thể tải dữ liệu ticket tiện ích');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getServiceName = (id: number) => {
    return services.find(s => s.id === id)?.name || `Dịch vụ #${id}`;
  };

  const getCustomerName = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return `Khách hàng #${id.slice(0, 8)}`;
    return acc.ownerProfile?.fullName || acc.email || acc.username || `Khách hàng #${id.slice(0, 8)}`;
  };

  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const serviceName = getServiceName(item.amenityServiceId).toLowerCase();
        const customerName = getCustomerName(item.customerId).toLowerCase();
        return (
          serviceName.includes(q) ||
          customerName.includes(q) ||
          item.id.toString().includes(q) ||
          item.status.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      switch (sortKey) {
        case 'startTime-asc':
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case 'startTime-desc':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        default:
          return 0;
      }
    });
  }, [tickets, searchQuery, statusFilter, sortKey, services, accounts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortKey]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTickets.slice(start, start + pageSize);
  }, [filteredTickets, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTickets.length / pageSize);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <AdminPageLayout
        header={<AmenityTicketListHeader />}
        controlPanel={
          <div className={styles.controls}>
            <div className={styles.left}>
              <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input
                  type="text"
                  placeholder="Tìm theo khách hàng, dịch vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={styles.filterButton}>
                    <span>{STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Trạng thái'}</span>
                    <ChevronDownIcon className={styles.chevronIcon} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent}>
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`${styles.dropdownItem} ${statusFilter === option.value ? styles.dropdownItemActive : ''}`}
                      onClick={() => setStatusFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={styles.filterButton}>
                    <span>{SORT_OPTIONS.find(opt => opt.value === sortKey)?.label || 'Sắp xếp'}</span>
                    <ChevronDownIcon className={styles.chevronIcon} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent}>
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`${styles.dropdownItem} ${sortKey === option.value ? styles.dropdownItemActive : ''}`}
                      onClick={() => setSortKey(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className={styles.right}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className={styles.exportButton}>
                    <Download className={styles.exportIcon} />
                    Nhập/Xuất
                    <ChevronDownIcon className={styles.chevronIcon} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={styles.dropdownContent} align="end">
                  <DropdownMenuItem className={styles.dropdownItem} onClick={() => console.log('Import')}>
                    <Upload size={16} className={styles.itemIcon} />
                    Nhập từ Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem className={styles.dropdownItem} onClick={() => console.log('Export')}>
                    <Download size={16} className={styles.itemIcon} />
                    Xuất ra Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        }
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredTickets.length}
            onPageChange={handlePageChange}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size: number) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            showResultCount={true}
          />
        }
      >
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sttCol}>STT</th>
                <th className={styles.codeCol}>Mã Ticket</th>
                <th>Khách hàng</th>
                <th>Tên tiện ích</th>
                <th className={styles.dateCol}>Bắt đầu</th>
                <th className={styles.dateCol}>Kết thúc</th>
                <th className={styles.statusCol}>Trạng thái</th>
                <th className={styles.stickyActionsCol}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.loadingCell}>Đang tải dữ liệu...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className={styles.errorCell}>{error}</td>
                </tr>
              ) : paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>
                    <div className={styles.emptyState}>
                      <p>Không có dữ liệu khớp với tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTickets.map((ticket, index) => (
                  <tr key={ticket.id}>
                    <td className={styles.sttCol}>{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className={styles.codeCol}><b>#{ticket.id}</b></td>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate}>{getCustomerName(ticket.customerId)}</span>
                        <span className={styles.tooltip}>{getCustomerName(ticket.customerId)}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.tooltipWrapper}>
                        <span className={styles.textTruncate}>{getServiceName(ticket.amenityServiceId)}</span>
                        <span className={styles.tooltip}>{getServiceName(ticket.amenityServiceId)}</span>
                      </div>
                    </td>
                    <td className={styles.dateCol}>{formatDateTime(ticket.startTime)}</td>
                    <td className={styles.dateCol}>{formatDateTime(ticket.endTime)}</td>
                    <td className={styles.statusCol}>
                      <span className={`${styles.statusBadge} ${styles[`status-${ticket.status}`]}`}>
                        {STATUS_OPTIONS.find(opt => opt.value === ticket.status)?.label || ticket.status}
                      </span>
                    </td>
                    <td className={styles.stickyActionsCol}>
                      <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <button className={`${styles.actionButton} ${styles.viewButton}`} type="button">
                            <Eye size={16} />
                          </button>
                          <span className={styles.tooltip}>Xem chi tiết</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminPageLayout>
    </div>
  );
}
