'use client'

import { Link as LinkIcon } from 'lucide-react'
import React from 'react'

export const GitHubRepoCard = () => {
  return (
    <div className="w-full max-w-md bg-muted/40 dark:bg-muted p-6 rounded-xl border border-border shadow-md text-center space-y-4">
      <div className="flex justify-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <LinkIcon className="w-10 h-10 text-primary" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground">
        Link Your GitHub Repository
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Seamlessly connect your GitHub repository to automatically sync commits,
        track code changes, and unlock smart insights for your project.
      </p>
    </div>
  )
}