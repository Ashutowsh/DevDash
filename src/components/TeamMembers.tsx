'use client'

import { trpc } from '@/app/_trpc/client'
import { useProject } from '@/hooks/use-project'
import React from 'react'

function TeamMembers() {
    const {projectId} = useProject()
    const {data: members} = trpc.getTeamMembers.useQuery({projectId})

  return (
    <div className='flex items-center gap-2'>
      {members?.map(member => (
        <img key={member.id} src={member.user.imageUrl || ''} alt={member.user.firstName || ''} height={30} width={30}/>
      ))}
    </div>
  )
}

export default TeamMembers
