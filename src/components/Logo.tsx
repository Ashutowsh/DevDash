'use client'

import React from 'react'
import Link from 'next/link'
import { Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-3 group', className)}>
      {/* Rocket Icon with animated glow */}
      <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 p-2 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
        <Rocket className="h-5 w-5 text-white animate-pulse" />
      </div>

      {/* DevDash Text */}
      <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        DevDash
      </span>
    </Link>
  )
}
