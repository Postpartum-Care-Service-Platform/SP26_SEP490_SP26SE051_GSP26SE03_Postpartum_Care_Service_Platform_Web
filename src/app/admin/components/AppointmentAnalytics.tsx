'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, Legend
} from 'recharts';
import styles from './appointment-analytics.module.css';

// 1. Phễu xử lý (Processing Funnel)
const FUNNEL_DATA = [
  { name: 'Pending (Chờ)', value: 450, fill: '#e9ecef' },
  { name: 'Upcoming (Sắp tới)', value: 380, fill: '#F5D178' },
  { name: 'Completed (Xong)', value: 340, fill: '#15803d' },
];

// 2. Phân bổ kết quả (Outcome Analysis)
const STATUS_DATA = [
  { name: 'Completed', value: 70, color: '#A47BC8' },
  { name: 'Cancelled', value: 15, color: '#FD6161' },
  { name: 'No-show', value: 5, color: '#ffb300' },
  { name: 'Rescheduled', value: 10, color: '#3b82f6' },
];

// 3. Xu hướng trạng thái (Status Trends)
const TREND_DATA = [
  { month: 'Thg 1', completed: 65, cancelled: 12 },
  { month: 'Thg 2', completed: 78, cancelled: 10 },
  { month: 'Thg 3', completed: 72, cancelled: 15 },
  { month: 'Thg 4', completed: 85, cancelled: 8 },
  { month: 'Thg 5', completed: 90, cancelled: 12 },
];

export const AppointmentAnalytics = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Phân tích trạng thái Lịch hẹn</h3>
        <p className={styles.subtitle}>Theo dõi vòng đời từ khi đặt lịch đến khi hoàn tất hoặc hủy</p>
      </div>
      
      <div className={styles.chartGrid}>
        {/* Chart 1: Funnel */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Tiến độ xử lý Lịch hẹn</h4>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart layout="vertical" data={FUNNEL_DATA} margin={{ left: 30, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#6c757d' }}
                  width={100}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {FUNNEL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.chartDesc}>Tỉ lệ xử lý thành công (Pending {"->"} Completed): 75.5%</p>
        </div>

        {/* Chart 2: Outcome */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Phân bổ kết quả cuối cùng</h4>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.chartDesc}>10% lịch hẹn phải dời lịch (Rescheduled).</p>
        </div>

        {/* Chart 3: Status Trend */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Biến động Hoàn tất & Hủy</h4>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="completed" stroke="#15803d" name="Hoàn tất" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cancelled" stroke="#FD6161" name="Bị hủy" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className={styles.chartDesc}>Tỉ lệ hủy đang có xu hướng giảm trong 2 tháng qua.</p>
        </div>
      </div>

      <div className={styles.insightSection}>
        <div className={styles.insightCard}>
          <div className={styles.insightIcon}>📈</div>
          <div className={styles.insightContent}>
            <h4>Chiến lược vận hành đề xuất</h4>
            <p>Dữ liệu phễu cho thấy 15% hợp đồng bị kẹt ở bước "Xác nhận/Cọc". Đề xuất bộ phận Sales gọi điện nhắc nhở thanh toán 48h trước check-in để đảm bảo doanh thu chốt sớm.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
