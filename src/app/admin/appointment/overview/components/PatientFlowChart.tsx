'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import { mockPatientFlowData } from './mockPatientFlowData';
import styles from './patient-flow-chart.module.css';

export function PatientFlowChart() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Patient Flow</h3>
        <span className={styles.timeframe}>Weekly</span>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockPatientFlowData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis
              dataKey="day"
              stroke="#6c757d"
              style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
            />
            <YAxis stroke="#6c757d" style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', fontFamily: 'var(--font-body)', paddingTop: '16px' }}
            />
            <Line
              type="monotone"
              dataKey="new"
              stroke="#5288AF"
              strokeWidth={2}
              dot={false}
              name="New Patients"
            />
            <Line
              type="monotone"
              dataKey="returning"
              stroke="#FD6161"
              strokeWidth={2}
              dot={false}
              name="Returning"
            />
            <Line
              type="monotone"
              dataKey="followup"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              name="Follow-up"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

