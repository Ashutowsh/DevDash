'use client'

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from 'next-themes'

type Commit = {
  commitAuthorName: string
}

type CommitPieChartProps = {
  commits: Commit[]
}

const COLORS = [
  '#6366F1', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6',
  '#F43F5E', '#06B6D4', '#84CC16', '#F97316', '#3B82F6',
]

const getCommitData = (commits: Commit[]) => {
  const authorMap: Record<string, number> = {}

  commits.forEach(({ commitAuthorName }) => {
    if (!commitAuthorName) return
    authorMap[commitAuthorName] = (authorMap[commitAuthorName] || 0) + 1
  })

  return Object.entries(authorMap).map(([name, value]) => ({ name, value }))
}

// 🧠 Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const { name, value } = payload[0].payload
    return (
      <div className="rounded-md border border-border bg-background p-2 shadow-md text-foreground text-sm">
        <strong>{name}</strong>: {value} commits
      </div>
    )
  }
  return null
}

export function CommitPieChart({ commits }: CommitPieChartProps) {
  const data = getCommitData(commits)

  return (
    <div className="w-full max-w-xl bg-card text-card-foreground shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-3">Commits per Author</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
