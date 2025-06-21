'use client'

import { trpc } from '@/app/_trpc/client'
import ScanLogs from '@/components/ScanLogs'
import { SeverityPieChart } from '@/components/SeverityPieChart'
import { columns } from '@/components/severityTable/columns'
import { DataTable } from '@/components/severityTable/data-table'
import { useProject } from '@/hooks/use-project'
import React from 'react'

function CommitSecurityPage() {
  const { projectId, project } = useProject()
  const { data: commits } = trpc.getCommitSecurityScans.useQuery({projectId})

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">Security Scan Results</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className="w-full lg:w-1/2">
          <DataTable
            columns={columns}
            data={commits?.map(c => ({
              commitMessage: c.commit.commitMessage,
              commitAuthor: c.commit.commitAuthorName,
              severity: c.severity
            })) ?? []}
          />
        </div>
        <div className='w-full lg:w-1/2'>
          <div className='w-full lg:w-[350px] xl:w-[400px] bg-white rounded-xl shadow p-4'>
            <SeverityPieChart severities={commits?.map((c) => c.severity) ?? []}/>
          </div>
        </div>
      </div>
      <div className="h-6"></div>
      <ScanLogs />
    </div>
  )
}

export default CommitSecurityPage
