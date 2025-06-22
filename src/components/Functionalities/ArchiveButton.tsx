'use client'
import { trpc } from '@/app/_trpc/client'
import React from 'react'
import { Button } from '../ui/button'
import { useProject } from '@/hooks/use-project'
import { toast } from 'sonner'
import { useRefetch } from '@/hooks/use-refetch'

function ArchiveButton() {
    const archiveProject = trpc.archiveProject.useMutation()
    const {projectId} = useProject()
    const refetch = useRefetch()
  return (
    <Button disabled = {archiveProject.isPending} size = 'sm' variant='destructive' onClick={() => {
        const confirm = window.confirm("Are you sure, you want to archive this project?")

        if(confirm) archiveProject.mutate({projectId}, {
            onSuccess: () => {
                toast.success("project archived")
                refetch()
            }, 
            onError: () => {
                toast.error("Failed to archive project")
            }
        })
    }}>
    Archive
    </Button>
  )
}

export default ArchiveButton
