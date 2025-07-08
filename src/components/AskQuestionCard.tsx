'use client'

import { useProject } from '@/hooks/use-project'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { askQuestion } from '@/lib/qaBot'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import RelatedCodes from './RelatedCodes'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
import { useRefetch } from '@/hooks/use-refetch'

function AskQuestionCard() {
  const { project } = useProject()
  const [question, setQuestion] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileReferences, setFileReferences] = useState<
    { fileName: string; summary: string; sourceCode: string }[]
  >()
  const [answer, setAnswer] = useState('')
  const savedQnA = trpc.saveQnA.useMutation()

  const refetch = useRefetch()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAnswer('')
    setFileReferences([])
    if (!project?.id) return
    setLoading(true)

    const { output, filesReferenced } = await askQuestion(question, project.id)
    setOpen(true)
    setFileReferences(filesReferenced)

    for await (const chunk of readStreamableValue(output)) {
      if (chunk) {
        setAnswer((ans) => ans + chunk)
      }
    }
    setLoading(false)
  }

  return (
    <div>
      {/* Dialog for Answer Preview */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[90vw] max-h-[90vh] overflow-y-auto p-6 bg-background border-border shadow-lg">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              AI Answer Preview
            </DialogTitle>
            <Button
              variant="outline"
              disabled={savedQnA.isPending}
              onClick={() => {
                savedQnA.mutate(
                  {
                    projectId: project!.id,
                    question,
                    answer,
                    files: fileReferences,
                  },
                  {
                    onSuccess: () => {
                      toast.success('Answer saved successfully!')
                      refetch()
                    },
                    onError: () => {
                      toast.error('Failed to save answer!')
                    },
                  }
                )
              }}
            >
              Save Answer
            </Button>
          </DialogHeader>

          {/* Render Answer Markdown */}
          <div className="mt-4 overflow-auto rounded-md border p-4 bg-muted/50 max-h-[40vh]">
            <MDEditor.Markdown
              source={answer}
              className="prose max-w-none dark:prose-invert"
            />
          </div>

          {/* Related File References */}
          <div className="mt-6 space-y-2">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Related Code Files
            </h2>
            <RelatedCodes fileReferences={fileReferences ?? []} />
          </div>

          {/* Raw File List */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground">Raw File List</h3>
            <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground space-y-1">
              {fileReferences?.map((file, index) => (
                <li key={`${file.fileName}-${index}`}>{file.fileName}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ask a Question Card */}
      <Card className="bg-muted/40 border border-border shadow-sm rounded-2xl transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
            Ask a Question
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Thinking...' : 'Ask Me'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AskQuestionCard
