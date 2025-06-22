'use client'

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              borderRadius: '0.375rem',
              padding: '0.5rem',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          />

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
