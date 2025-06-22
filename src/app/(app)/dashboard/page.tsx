'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Github, ExternalLink } from 'lucide-react'
import ArchiveButton from '@/components/Functionalities/ArchiveButton'
import AskQuestionCard from '@/components/AskQuestionCard'
import CommitLogs from '@/components/Logs/CommitLogs'
import TeamMembers from '@/components/Functionalities/Invite/TeamMembers'
import { useProject } from '@/hooks/use-project'
import { trpc } from '@/app/_trpc/client'

// Dynamically import InviteButton
const InviteButton = dynamic(() => import('@/components/Functionalities/Invite/InviteButton'), { ssr: false })

// Import your new chart
import { CommitPieChart } from '@/components/Charts/CommitsPieChart'

function Dashboard() {
  const { projectId, project } = useProject()
  const { data: commits = [] } = trpc.getCommits.useQuery({ projectId })

  return (
    <div className="space-y-8 px-4 py-6 sm:px-8">
      {/* Project GitHub Info */}
      <div className="rounded-2xl border bg-muted/40 p-5 shadow-sm dark:border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex items-center justify-center rounded-md bg-primary p-2">
              <Github className="h-5 w-5 text-white dark:text-black"/>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                This project is linked to{' '}
                <Link
                  href={project?.githubUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <TeamMembers />
            <InviteButton />
            <ArchiveButton />
          </div>
        </div>
      </div>

    {/* Ask Question + Commit Chart */}
    <div className="flex flex-col lg:flex-row items-center justify-center gap-24 w-full max-w-5xl mx-auto">
      {/* Ask Question Card */}
      <div className="w-full max-w-xl">
        <AskQuestionCard />
      </div>

      {/* Commit Pie Chart */}
      <div className="w-full max-w-5xl">
        <CommitPieChart
          commits={
            commits.map(c => ({
              commitAuthorName: c.commitAuthorName
            }))
          }
        />
      </div>
    </div>

      {/* Commit Logs */}
      <div>
        <CommitLogs />
      </div>
    </div>
  )
}

export default Dashboard
