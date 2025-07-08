'use client'

import React from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Info, Link as LinkIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema } from '@/schema'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
import { useRefetch } from '@/hooks/use-refetch'
import { GitHubRepoCard } from '@/components/GithubRepoCard'

const NewProjectPage = () => {
  const newProject = trpc.newProject.useMutation()
  const checkCredits = trpc.checkCredits.useMutation()
  const refetch = useRefetch()

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: '',
      githubUrl: '',
      githubToken: '',
    },
  })

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    if (!!checkCredits.data) {
      console.log('Creating new project with:', values.githubUrl, values.projectTitle, values.githubToken)
      newProject.mutate(
        {
          githubUrl: values.githubUrl,
          projectTitle: values.projectTitle,
          githubToken: values.githubToken,
        },
        {
          onSuccess: () => {
            toast.success('Project created successfully!')
            refetch()
            form.reset()
          },
          onError: () => {
            toast.error('Failed to create project. Please try again.')
          },
        }
      )
    } else {
      console.log('Checking credits for:', values.githubUrl, values.githubToken)
      checkCredits.mutate({
        githubUrl: values.githubUrl,
        githubToken: values.githubToken,
      })
    }
  }

  

  const hasEnoughCredits =
  checkCredits.data?.userCredits !== undefined &&
  checkCredits.data?.fileCount !== undefined &&
  checkCredits.data.fileCount <= checkCredits.data.userCredits


  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-full gap-8 px-4">
      
      <GitHubRepoCard />      

      {/* Form Section */}
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">
            Link your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it with your project.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title of your project..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Provide project's GitHub URL..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Token (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Token for your private repository." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!!checkCredits.data && (
              <div className="mt-4 rounded-md border p-4 bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-100 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <p className="text-sm">
                      You will be charged{' '}
                      <strong>{checkCredits.data.fileCount}</strong> credits for this repository
                    </p>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 ml-6 sm:ml-0">
                    You have <strong>{checkCredits.data.userCredits}</strong> credits remaining
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={newProject.isPending || checkCredits.isPending || (checkCredits.data && !hasEnoughCredits)}
              className="w-full"
            >
              {!!checkCredits.data ? 'Create Project' : 'Check Credits'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default NewProjectPage
