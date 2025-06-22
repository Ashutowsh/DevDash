'use client'

import { trpc } from '@/app/_trpc/client'
import ScanLogs from '@/components/Logs/ScanLogs'
import { SeverityBarChart } from '@/components/Charts/SeverityBarChart'
import { columns } from '@/components/severityTable/columns'
import { DataTable } from '@/components/severityTable/data-table'
import { useProject } from '@/hooks/use-project'
import React from 'react'

function CommitSecurityPage() {
  const { projectId } = useProject()
  const { data: commits } = trpc.getCommitSecurityScans.useQuery({ projectId })

  const tableData =
    commits?.map((c) => ({
      commitMessage: c.commit.commitMessage,
      commitAuthor: c.commit.commitAuthorName,
      severity: c.severity,
    })) ?? []

  const pieData = commits?.map((c) => c.severity) ?? []

  return (
    <div className="p-4 md:p-6 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Security Scan Results</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table Section */}
        <div className="w-full lg:w-1/2">
          <div className="bg-card border border-border shadow-sm rounded-xl p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Commit Severities</h2>
            <DataTable columns={columns} data={tableData} />
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="w-full lg:w-1/2">
          <div className="bg-card border border-border shadow-sm rounded-xl p-4 h-full flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-foreground mb-4">Severity Distribution</h2>
            <div className="w-full md:w-[300px] lg:w-[350px] xl:w-[400px]">
              <SeverityBarChart severities={pieData} />
            </div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Scan Logs</h2>
        <div className="bg-card border border-border shadow-sm rounded-xl p-4">
          <ScanLogs />
        </div>
      </div>
    </div>
  )
}

export default CommitSecurityPage
