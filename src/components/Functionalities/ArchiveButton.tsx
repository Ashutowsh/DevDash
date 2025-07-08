'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Archive } from 'lucide-react'
import { trpc } from '@/app/_trpc/client'
import { useProject } from '@/hooks/use-project'
import { useRefetch } from '@/hooks/use-refetch'

const ArchiveProjectButton = () => {
  const { projectId } = useProject()
  const refetch = useRefetch()

  const archiveProject = trpc.archiveProject.useMutation()

  const handleArchive = () => {
    toast("Are you sure you want to archive this project?", {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("Project archived successfully!")
                refetch()
              },
              onError: () => {
                toast.error("Failed to archive the project.")
              },
            }
          )
        },
      },
    })
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleArchive}
      disabled={archiveProject.isPending}
    >
      <Archive className="w-4 h-4 mr-2" />
      {archiveProject.isPending ? 'Archiving...' : 'Archive Project'}
    </Button>
  )
}

export default ArchiveProjectButton
