'use client'

import { trpc } from '@/app/_trpc/client'
import ScanLogs from '@/components/ScanLogs'
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
        <DataTable
            columns={columns}
            data={commits?.map(c => ({
              commitMessage: c.commit.commitMessage,
              commitAuthor: c.commit.commitAuthorName,
              severity: c.severity
            })) ?? []}
          />
        <div className="h-4"></div>
        <ScanLogs />
    </div>
  )
}

export default CommitSecurityPage
