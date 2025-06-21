
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

type SeverityPieChartProps = {
  severities: ("CRITICAL" | "IMPORTANT" | "OK")[]
}

const COLORS: Record<string, string> = {
  CRITICAL: "#EF4444",
  IMPORTANT: "#F59E0B",
  OK: "#10B981",
}

const getSeverityData = (severities: SeverityPieChartProps["severities"]) => {
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

export function SeverityPieChart({ severities }: SeverityPieChartProps) {
  const severityData = getSeverityData(severities)

  return (
    <div className="w-full md:w-[300px]">
      <h2 className="text-lg font-semibold mb-2">Severity Overview</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={severityData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {severityData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
