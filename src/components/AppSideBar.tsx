'use client'
import React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton, SidebarMenu, useSidebar } from './ui/sidebar'
import {sidebarItems } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { useProject } from '@/hooks/use-project'


export const AppSideBar = () => {
    const pathname = usePathname()
    const {open} = useSidebar()
    const {projects, projectId, setProjectId} = useProject()
  return (
    <div>
      <Sidebar collapsible='icon' variant='floating'>
        <SidebarHeader>
            Logo
        </SidebarHeader>

        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>
                    Application
                </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                                    {sidebarItems.map(item => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url} className={cn({
                                '|bg-primary |text-white': pathname === item.url
                            }, 'list-none')}>
                                <item.icon />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>
                    Projects
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {projects?.map(project => (
                            <SidebarMenuItem key={project.title}>
                                <SidebarMenuButton asChild>
                                    <div onClick={() => {
                                        setProjectId(project.id)
                                    }}>
                                        <div className= {cn('rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary', {
                                            'bg-primary text-white': project.id === projectId
                                        })}>
                                            {project.title[0]}
                                        </div>
                                        <span>{project.title}</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}

                        <div className='h-2'></div>
                        <SidebarMenuItem>
                            <Link href='/new-project'>
                                <Button size = 'sm' variant = {'outline'} className='"w-fit'>
                                    <Plus />
                                    Create Project
                        </Button>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>


        </SidebarContent>

      </Sidebar>
    </div>
  )
}
