'use client'

import React from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  useSidebar,
} from './ui/sidebar'
import { sidebarItems } from '@/constants'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { useProject } from '@/hooks/use-project'

export const AppSideBar = () => {
  const pathname = usePathname()
  const { open } = useSidebar()
  const { projects, projectId, setProjectId } = useProject()

  return (
    <Sidebar collapsible="icon" variant="floating" className="bg-muted/40 border-r border-border shadow-sm">
      <SidebarHeader className="font-bold text-lg text-foreground px-4 py-2">
        🚀 DevDash
      </SidebarHeader>

      <SidebarContent>
        {/* App Nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4">
            Application
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-accent text-sm font-medium',
                        pathname === item.url
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="size-4" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Project Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4 mt-2">
            Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => (
                <SidebarMenuItem key={project.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => setProjectId(project.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-accent text-sm font-medium w-full', 'text-muted-foreground'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-sm border bg-background text-xs font-semibold',
                          project.id === projectId
                            ? 'bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground'
                        )}
                      >
                        {project.title[0]}
                      </div>
                      <span className="truncate">{project.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Add project button */}
              <SidebarMenuItem className="mt-4 px-3">
                <Link href="/new-project" className="w-full">
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Plus className="size-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
