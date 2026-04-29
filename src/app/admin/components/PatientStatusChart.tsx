'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import statisticsService from '@/services/statistics.service';
import styles from './patient-status-chart.module.css';

const TIME_OPTIONS = [
  { value: 'weekly', label: 'Theo tuần' },
  { value: 'monthly', label: 'Theo tháng' },
  { value: 'yearly', label: 'Theo năm' },
];

type TooltipItem = {
  dataKey?: string;
  value?: number;
  payload?: {
    month?: string;
    monthLabel?: string;
  };
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipItem[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const growthData = payload.find((p) => p.dataKey === 'count');
    const row = payload[0]?.payload;
    const monthLabel = row?.monthLabel || '';

    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{monthLabel}</div>
        {growthData && (
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipIcon}
              style={{ backgroundColor: '#A47BC8' }}
            ></span>
            <span>
              Khách hàng mới: <strong>{growthData.value}</strong>
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const formatMonthLabel = (monthStr: string) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  return `Tháng ${parseInt(month)}/${year}`;
};

export function PatientStatusChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Hiện tại chỉ có API Monthly Growth, ta mockup hoặc dùng tạm dữ liệu này cho các options khác
        const res = await statisticsService.getCustomerGrowth();
        if (Array.isArray(res)) {
          const formattedData = res.map((item: any) => ({
            ...item,
            monthLabel: formatMonthLabel(item.month),
            shortLabel: item.month.split('-')[1],
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch customer growth data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTimeframe]);

  const selectedLabel =
    TIME_OPTIONS.find((opt) => opt.value === selectedTimeframe)?.label ||
    'Theo tháng';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h4 className={styles.title}>Tăng trưởng khách hàng</h4>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className={styles.timeframeButton}>
              {selectedLabel}
              <ChevronDownIcon className={styles.chevronIcon} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent}>
            {TIME_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={`${styles.dropdownItem} ${
                  selectedTimeframe === option.value
                    ? styles.dropdownItemActive
                    : ''
                }`}
                onClick={() => setSelectedTimeframe(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.cardBody}>
        {loading ? (
          <div className={styles.loadingState}>Đang tải dữ liệu...</div>
        ) : data.length > 0 ? (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
                <XAxis 
                  dataKey="shortLabel" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#888' }}
                  interval={0}
                  tickFormatter={(val) => `T${val}`}
                />
                <YAxis hide />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: '#A47BC8',
                    strokeWidth: 1,
                    strokeDasharray: '3 3',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#A47BC8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#A47BC8', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Khách hàng mới"
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={styles.emptyState}>Chưa có dữ liệu tăng trưởng</div>
        )}
      </div>
    </div>
  );
}
