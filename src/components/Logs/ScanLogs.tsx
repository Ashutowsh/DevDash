'use client'

import { trpc } from '@/app/_trpc/client'
import { useProject } from '@/hooks/use-project'
import React from 'react'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

function ScanLogs() {
  const { projectId, project } = useProject()
  const { data: commits } = trpc.getCommitSecurityScans.useQuery({ projectId })

  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-600 border-red-400'
      case 'IMPORTANT':
        return 'bg-yellow-400/10 text-yellow-700 border-yellow-500'
      case 'OK':
        return 'bg-green-500/10 text-green-700 border-green-400'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <ul className="space-y-6">
      {commits?.map((commit, idx) => (
        <li key={commit.id} className="relative flex gap-x-4">
            {/* Vertical Timeline Line */}
            <div
              className={cn(
                idx === commits.length - 1 ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px translate-x-1 bg-muted-foreground/30 dark:bg-white/30" />
            </div>

            {/* Commit Avatar */}
            <img
              src={commit.commit.commitAuthorAvatar || '/default-avatar.png'}
              alt="commit avatar"
              width={32}
              height={32}
              className="relative mt-4 size-8 flex-none rounded-full bg-muted object-cover ring-2 ring-background"
            />

          {/* Commit Card */}
          <div className="flex-auto rounded-xl bg-card p-4 shadow-sm border border-border space-y-2">
            <div className="flex justify-between items-center">
              <Link
                href={`${project?.githubUrl}/commit/${commit.commit.commitHash}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
              >
                <span className="font-medium text-foreground">
                  {commit.commit.commitAuthorName}
                </span>
                committed
                <ExternalLink className="size-4" />
              </Link>

              {/* Severity Badge */}
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium border',
                  getSeverityClasses(commit.severity)
                )}
              >
                {commit.severity}
              </span>
            </div>

            {/* Commit Message */}
            <div className="text-base font-semibold text-foreground">
              {commit.commit.commitMessage}
            </div>

            {/* Summary */}
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
              {commit.commit.summary.slice(0, 150)}
              {commit.commit.summary.length > 150 && (
                <Link
                  href={`/dashboard`}
                  className="text-primary hover:underline ml-1"
                >
                  …Show more
                </Link>
              )}
            </pre>

            {/* Suggestion */}
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Suggestion:</span>{' '}
              {commit.suggestions}
            </div>

            {/* Affected Files */}
            {commit.fileNames?.length > 0 && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Affected Files:</span>
                <ul className="list-disc list-inside">
                  {commit.fileNames.map((file, idx) => (
                    <li key={idx}>{file}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ScanLogs
