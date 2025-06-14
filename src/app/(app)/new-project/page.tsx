'use client'

import Image from 'next/image'
import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { projectSchema } from '@/schemas/projectSchema'
// import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
// import { useProject } from '@/hooks/use-project'

const NewProjectPage = () => {
  const {getProjects} = useProject()
  const createProject = trpc.createProject.useMutation({
    onSuccess : () => {
      toast.success("Project created successfully.")
      getProjects.refetch()
      form.reset()
    },

    onError : () => {
      toast.error("Failed to create project.")
    },
  });
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: "",
      githubUrl: "",
      githubToken: "",
    }
  })


  function onSubmit(values: z.infer<typeof projectSchema>) {
    // console.log(values)
    createProject.mutate(values)
  }


  return (
    <div className='flex items-center gap-12 h-full justify-center'>
      <Image src="/createProject.jpg" alt='This is just a pic.' height={400} width={400} className='rounded-md mr-4 object-cover'/>
      <div>
        <div>
          <h1 className='font-semibold text-2xl'>
            Link your Github Repository.
          </h1>
          <p className='text-sm text-muted-foreground'>
            Enter the URL of your repository to link it with your project.
          </p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <FormLabel>Github URL</FormLabel>
                    <FormControl>
                        <Input placeholder="Provide project's Github URL..." {...field} />
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
                    <FormLabel>Github Token(Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Token for your private repository." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default NewProjectPage