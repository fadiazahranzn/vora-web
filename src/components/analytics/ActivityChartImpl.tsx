'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import styles from './ActivityLineChart.module.css'

interface ChartDataPoint {
  date: string
  rate: number
}

interface ActivityChartImplProps {
  data: ChartDataPoint[]
  view: 'weekly' | 'monthly' | 'yearly'
}

const ActivityChartImpl: React.FC<ActivityChartImplProps> = ({
  data,
  view: _view,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No activity data available for this period</p>
      </div>
    )
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // label is likely the date string
      const dateStr = label
      const rate = payload[0].payload.rate

      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipDate}>{dateStr}</div>
          <div className={styles.tooltipValue}>{rate}%</div>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--vora-color-border)"
        />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--vora-color-text-secondary)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          minTickGap={30}
        />
        <YAxis
          tick={{ fill: 'var(--vora-color-text-secondary)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(val) => `${val}%`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'var(--vora-color-border)', strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="var(--vora-color-primary)"
          strokeWidth={3}
          activeDot={{ r: 6, strokeWidth: 0 }}
          dot={{
            r: 4,
            fill: 'var(--vora-color-primary)',
            strokeWidth: 2,
            stroke: 'var(--vora-color-bg-surface)',
          }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ActivityChartImpl
