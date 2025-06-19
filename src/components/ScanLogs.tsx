import { trpc } from '@/app/_trpc/client'
import { useProject } from '@/hooks/use-project'
import React from 'react'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

function ScanLogs() {
    const { projectId, project } = useProject()
    const { data: commits } = trpc.getCommitSecurityScans.useQuery({projectId})

    const getSeverityColor = (severity: string) => {
        switch (severity) {
        case 'CRITICAL':
            return 'bg-red-100 text-red-800 border-red-300'
        case 'IMPORTANT':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300'
        case 'OK':
            return 'bg-green-100 text-green-800 border-green-300'
        default:
            return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }
    return (
        <div>
            <ul className="space-y-6">
                {commits?.map((commit, idx) => (
                <li key={commit.id} className="relative flex gap-x-4">
                    <div className={cn(
                        idx === commits.length - 1 ? 'h-6' : '-bottom-6',
                        'absolute left-0 top-0 flex w-6 justify-center'
                    )}
                    >
                    <div className="w-px translate-x-1 bg-gray-200"></div>
                    </div>

                    <img
                    src={commit.commit.commitAuthorAvatar || '/default-avatar.png'}
                    alt="commit avatar"
                    className="relative mt-4 size-8 flex-none rounded-full bg-gray-100 border"
                    />

                    <div className="flex-auto rounded-md bg-white p-4 ring-1 ring-inset ring-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <Link
                        target="_blank"
                        href={`${project?.githubUrl}/commit/${commit.commit.commitHash}`}
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                        <span className="font-medium text-gray-800">
                            {commit.commit.commitAuthorName}
                        </span>
                        committed
                        <ExternalLink className="size-4" />
                        </Link>

                        <span
                        className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-semibold border',
                            getSeverityColor(commit.severity)
                        )}
                        >
                        {commit.severity}
                        </span>
                    </div>

                    <div className="text-gray-900 font-semibold mb-2">
                        {commit.commit.commitMessage}
                    </div>

                    <pre className="text-sm text-gray-600 whitespace-pre-wrap mb-3">
                        {commit.commit.summary.slice(0, 150)}{commit.commit.summary.length > 150 && (
                            <Link
                            href={`/dashboard`}
                            className="text-gray-800 hover:underline inline"
                            >
                            …Show more
                            </Link>
                        )}
                    </pre>

                    <div className="text-sm mb-2">
                        <strong className="text-gray-700">Suggestion:</strong>{' '}
                        <span className="text-gray-600">{commit.suggestions}</span>
                    </div>

                    {commit.fileNames?.length > 0 && (
                        <div className="text-sm mt-2">
                        <strong className="text-gray-700">Affected Files:</strong>
                        <ul className="list-disc list-inside text-gray-600">
                            {commit.fileNames.map((file, index) => (
                            <li key={index}>{file}</li>
                            ))}
                        </ul>
                        </div>
                    )}
                    </div>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default ScanLogs
