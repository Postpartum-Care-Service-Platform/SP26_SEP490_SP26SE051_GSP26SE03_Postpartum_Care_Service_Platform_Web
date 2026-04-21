'use client';

import React from 'react';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from './DateRangePicker';
import styles from './category-revenue-chart.module.css';
import packageTypeService from '@/services/package-type.service';
import statisticsService from '@/services/statistics.service';
import { PackageType } from '@/types/package-type';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown';

interface RevenueByPackage {
  packageTypeName: string;
  totalRevenue: number;
  bookingCount: number;
}

export const CategoryRevenueChart = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 7)),
    to: endOfMonth(new Date()),
  });
  const [packageTypes, setPackageTypes] = React.useState<PackageType[]>([]);
  const [selectedType, setSelectedType] = React.useState<PackageType | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [revenueData, setRevenueData] = React.useState<RevenueByPackage[]>([]);

  const fetchTypes = React.useCallback(async () => {
    try {
      const types = await packageTypeService.getAllPackageTypes();
      setPackageTypes(types);
    } catch (error) {
      console.error('Failed to fetch package types', error);
    }
  }, []);

  const fetchRevenueData = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = dateRange?.from && dateRange?.to ? {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd')
      } : undefined;

      const response = await statisticsService.getRevenueByServicePackage(params);
      setRevenueData(response || []);
    } catch (error) {
      console.error('Failed to fetch revenue by package', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  React.useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  React.useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const filteredData = React.useMemo(() => {
    if (!selectedType) return revenueData;
    return revenueData.filter(item => item.packageTypeName === selectedType.typeName);
  }, [revenueData, selectedType]);

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const maxRevenue = Math.max(...revenueData.map(item => item.totalRevenue), 1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <span className={styles.titleText}>Doanh thu theo danh mục</span>
          <span className={styles.titleValue}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </span>
        </div>

        <div className={styles.filterGroup}>
          <DropdownMenu>
            <DropdownMenuTrigger className={styles.typeFilter}>
              <span>{selectedType ? selectedType.typeName : 'Tất cả danh mục'}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={styles.dropdownContent}>
              <DropdownMenuItem className={styles.dropdownItem} onClick={() => setSelectedType(null)}>
                Tất cả danh mục
              </DropdownMenuItem>
              {packageTypes.map((type) => (
                <DropdownMenuItem 
                  key={type.id} 
                  className={styles.dropdownItem} 
                  onClick={() => setSelectedType(type)}
                >
                  {type.typeName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>


      <div className={styles.chartWrapper}>
        <div className={styles.yAxis}>
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
          <div className={styles.yDashedLine} />
        </div>

        <div className={styles.chartArea}>
          {loading ? (
            <div className={styles.loadingOverlay}>Đang tải...</div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div key={index} className={styles.barTrack} title={`${item.packageTypeName}: ${item.totalRevenue.toLocaleString('vi-VN')}đ`}>
                <div
                  className={styles.barFill}
                  style={{ height: `${(item.totalRevenue / maxRevenue) * 100}%` }}
                />
                <div className={styles.barLabel}>{item.packageTypeName}</div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>Không có dữ liệu</div>
          )}
        </div>

        <div className={styles.xAxis}>
          <span>{dateRange?.from ? format(dateRange.from, "dd 'THG' MM") : ''}</span>
          <span>{dateRange?.to ? format(dateRange.to, "dd 'THG' MM yyyy") : ''}</span>
        </div>
      </div>
    </div>
  );
};
