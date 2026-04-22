import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import styles from './average-patient-visit.module.css';

type MonthlyData = {
  month: string;
  expected: number;
  actual: number;
};

type FulfillmentSummary = {
  expectedTotal: number;
  actualTotal: number;
  peakMonth: string;
  fulfillmentRate: number;
};

type AveragePatientVisitProps = {
  // data is now fetched internally or can be passed if needed
};

// Custom shape and components unchanged for UI consistency
type BarShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: string | number;
};

const CustomBarShape = (props: BarShapeProps) => {
  const { x, y, width, height, opacity = 0.8 } = props;
  const opacityValue = typeof opacity === 'string' ? parseFloat(opacity) : opacity ?? 0.8;
  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof width === 'number' &&
    typeof height === 'number'
  ) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="url(#barGradient)"
          opacity={opacityValue}
        />
        <line
          x1={x}
          y1={y}
          x2={x + width}
          y2={y}
          stroke="#fa8314"
          strokeWidth={2}
        />
      </g>
    );
  }
  return null;
};

type CursorProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

const CustomCursor = (props: CursorProps) => {
  const { x, y, width, height } = props;
  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof width === 'number' &&
    typeof height === 'number'
  ) {
    const centerX = x + width / 2;
    // Don't render cursor if it's over the Y axis label area (width 35)
    if (centerX < 35) return null;

    return (
      <line
        x1={centerX}
        y1={y}
        x2={centerX}
        y2={y + height}
        stroke="#6c757d"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
    );
  }
  return null;
};

type TooltipPayloadItem = {
  value: number;
  dataKey: string;
};

type AvgTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
};

const CustomTooltip = ({ active, payload, label }: AvgTooltipProps) => {
  if (active && payload && payload.length) {
    const expected = payload.find(p => p.dataKey === 'expected')?.value || 0;
    const actual = payload.find(p => p.dataKey === 'actual')?.value || 0;
    
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: '#fa8314' }}
            />
            <span>Thực tế: {actual}</span>
          </div>
          <div className={styles.tooltipItem}>
            <span
              className={styles.tooltipLine}
              style={{ borderColor: '#fa8314' }}
            />
            <span>Đã lên lịch: {expected}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function AveragePatientVisit({ }: AveragePatientVisitProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [trends, setTrends] = useState<MonthlyData[]>([]);
  const [summary, setSummary] = useState<FulfillmentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate years for filter (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  // Map English month names to Vietnamese for display
  const monthMapVn: Record<string, string> = {
    'Jan': 'Th1', 'Feb': 'Th2', 'Mar': 'Th3', 'Apr': 'Th4',
    'May': 'Th5', 'Jun': 'Th6', 'Jul': 'Th7', 'Aug': 'Th8',
    'Sep': 'Th9', 'Oct': 'Th10', 'Nov': 'Th11', 'Dec': 'Th12'
  };

  const fetchTrends = async (year: number) => {
    try {
      setLoading(true);
      const res = await statisticsService.getServiceFulfillmentTrends({
        year: year
      });
      
      // Map month names to Vietnamese
      const mappedData = res.monthlyData.map((d: any) => ({
        ...d,
        monthDisplay: monthMapVn[d.month] || d.month
      }));

      setTrends(mappedData);
      setSummary(res.summary);
    } catch (err) {
      console.error('Failed to fetch service fulfillment trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(selectedYear);
  }, [selectedYear]);

  if (loading) {
    return <div className={styles.container} style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải...</div>;
  }

  const expectedTotal = summary?.expectedTotal || 0;
  const actualTotal = summary?.actualTotal || 0;
  const peakMonthNameRaw = summary?.peakMonth || 'N/A';
  const peakMonthVn = monthMapVn[peakMonthNameRaw] || peakMonthNameRaw;
  const peakValue = trends.find(t => t.month === peakMonthNameRaw)?.expected || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Xu hướng hoàn thành dịch vụ</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.periodButton} aria-label="Chọn năm">
              <span>Năm {selectedYear}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.chevron}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={styles.dropdownContent} align="end">
            {availableYears.map(year => (
              <DropdownMenuItem
                key={year}
                className={`${styles.dropdownItem} ${
                  selectedYear === year ? styles.dropdownItemActive : ''
                }`}
                onClick={() => setSelectedYear(year)}
              >
                Năm {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={styles.body}>
        <div className={styles.metrics}>
          <div className={styles.metricItem}>
            <span className={styles.metricDescription}>Công việc đã lên lịch:</span>
            <span className={styles.metricValue}>{expectedTotal.toLocaleString('vi-VN')}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricDescription}>Công việc hoàn thành:</span>
            <span className={styles.metricValue}>{actualTotal.toLocaleString('vi-VN')}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricDescription}>Tháng cao điểm:</span>
            <span className={styles.metricValue}>{peakMonthVn} ({peakValue.toLocaleString('vi-VN')})</span>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart
              data={trends}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              barCategoryGap={0}
            >
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fa8314" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#fa8314" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="monthDisplay"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#6c757d',
                  fontSize: 12,
                  fontFamily: 'Funnel Sans, sans-serif',
                }}
              />
              <YAxis
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                width={35}
                tick={{
                  fill: '#6c757d',
                  fontSize: 12,
                  fontFamily: 'Funnel Sans, sans-serif',
                }}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} cursor={<CustomCursor />} />
              <Bar
                dataKey="expected"
                onMouseEnter={(_, index) => {
                  if (typeof index === 'number') {
                    setHoveredIndex(index);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape={(props: any) => {
                  const index = props.background?.index;
                  const opacity = hoveredIndex === index ? 1 : 0.4;
                  return <CustomBarShape {...props} opacity={opacity} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
