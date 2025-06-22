'use client'

import { trpc } from '@/app/_trpc/client'
import { useProject } from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CommitLogs() {
  const { projectId, project } = useProject()
  const { data: commits } = trpc.getCommits.useQuery({ projectId })

  return (
    <ul className="space-y-6 relative">
      {commits?.map((commit, idx) => {
        return (
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
              src={commit.commitAuthorAvatar || '/default-avatar.png'}
              alt="commit avatar"
              width={32}
              height={32}
              className="relative mt-4 size-8 flex-none rounded-full bg-muted object-cover ring-2 ring-background"
            />

            {/* Commit Block */}
            <div className="flex-auto rounded-xl bg-muted/40 p-4 ring-1 ring-border shadow-sm transition hover:shadow-md">
              <div className="flex justify-between gap-x-4">
                <Link
                  target="_blank"
                  href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                  className="py-0.5 text-xs leading-5 text-muted-foreground hover:underline flex items-center gap-1"
                >
                  <span className="font-medium text-foreground">
                    {commit.commitAuthorName ?? 'Unknown'}
                  </span>
                  <span className="inline-flex items-center">
                    committed
                    <ExternalLink className="ml-1 size-4" />
                  </span>
                </Link>
              </div>

              <p className="mt-1 font-semibold text-sm text-foreground">
                {commit.commitMessage}
              </p>

              {commit.summary && (
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground font-mono">
                  {commit.summary}
                </pre>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default CommitLogs