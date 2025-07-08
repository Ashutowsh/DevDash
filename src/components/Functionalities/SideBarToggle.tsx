'use client'
import { Menu } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function SidebarToggleButton() {
  const {toggleSidebar} = useSidebar()
  return (
    <button onClick={toggleSidebar} className="sm:hidden p-2 text-foreground">
      <Menu className="h-6 w-6" />
    </button>
  )
}