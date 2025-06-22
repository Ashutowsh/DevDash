'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type SeverityBarChartProps = {
  severities: ('CRITICAL' | 'IMPORTANT' | 'OK')[]
}

const COLORS: Record<string, string> = {
  CRITICAL: '#EF4444',
  IMPORTANT: '#F59E0B',
  OK: '#10B981',
}

const getSeverityData = (severities: SeverityBarChartProps['severities']) => {
  const counts = {
    CRITICAL: 0,
    IMPORTANT: 0,
    OK: 0,
  }

  severities.forEach((s) => {
    if (s in counts) counts[s]++
  })

  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export function SeverityBarChart({ severities }: SeverityBarChartProps) {
  const severityData = getSeverityData(severities)

  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(resolvedTheme === 'dark')
  }, [resolvedTheme])

  return (
    <div className="w-full md:w-[320px] bg-card border border-border rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold text-foreground mb-3">Severity Overview</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={severityData}
          margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#374151' : '#e5e7eb'} // gray-700 / gray-200
          />
          <XAxis
            dataKey="name"
            stroke={isDark ? '#d1d5db' : '#4b5563'} // gray-300 / gray-600
            tick={{ fontSize: 12, fill: isDark ? '#d1d5db' : '#374151' }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
            tickLine={false}
          />
          <YAxis
            stroke={isDark ? '#d1d5db' : '#4b5563'}
            tick={{ fontSize: 12, fill: isDark ? '#d1d5db' : '#374151' }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff', // dark: gray-800, light: white
              border: '1px solid #ccc',
              fontSize: '0.875rem',
              color: isDark ? '#f3f4f6' : '#111827',
            }}
            labelStyle={{
              color: isDark ? '#f3f4f6' : '#111827',
            }}
            itemStyle={{
              color: isDark ? '#f3f4f6' : '#111827',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '0.75rem',
              color: isDark ? '#d1d5db' : '#4b5563',
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {severityData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
