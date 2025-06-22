'use client'

import React, { useState } from 'react'
import { Dialog, DialogHeader, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProject } from '@/hooks/use-project'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function InviteButton() {
    const {projectId} = useProject()
    const [open, setOpen] = useState(false)
  return (
    <div>
      <Dialog open = {open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Invite Team Members
                </DialogTitle>
            </DialogHeader>

            <p className='text-sm text-gray-500'>
                Ask them to copy and paste this link
            </p>
            <Input 
            className='mt-4'
            readOnly
            onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                toast.success("Copied to clipboard")
            }}
            value={`${window.location.origin}/join/${projectId}`}
            />
        </DialogContent>
        <Button size='sm' onClick={() => setOpen(true)}>
            Invite Members
        </Button>
      </Dialog>
    </div>
  )
}

export default InviteButton