'use client'

import { trpc } from '@/app/_trpc/client'
import AskQuestionCard from '@/components/AskQuestionCard'
import RelatedCodes from '@/components/RelatedCodes'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useProject } from '@/hooks/use-project'
import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'

function QnABot() {
  const { projectId } = useProject()
  const { data: questions } = trpc.getQnAs.useQuery({ projectId })
  const [questionIndex, setQuestionIndex] = useState(0)
  const question = questions?.[questionIndex]

  return (
    <Sheet>
      <AskQuestionCard />

      <div className="h-6" />

      <h2 className="text-xl font-semibold text-foreground">Saved Questions</h2>
      <div className="h-2" />

      <div className="flex flex-col gap-4">
        {questions?.map((question: any, index) => (
          <React.Fragment key={question.id}>
            <SheetTrigger
              onClick={() => setQuestionIndex(index)}
              className="rounded-xl border border-border bg-muted/40 p-4 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-4"
            >
              <img
                src={question.user.imageUrl ?? '/default-avatar.png'}
                alt="user avatar"
                height={32}
                width={32}
                className="rounded-full object-cover border border-border"
              />

              <div className="flex flex-col text-left flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {question.question}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-1">
                  {question.answer}
                </p>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>

      {question && (
        <SheetContent className="sm:max-w-[80vw] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg sm:text-xl text-foreground">
              {question.question}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-md border border-border bg-muted/40 p-4 max-h-[50vh] overflow-y-auto">
              <MDEditor.Markdown
                source={question.answer}
                className="prose max-w-none dark:prose-invert"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                File References
              </h3>
              <RelatedCodes fileReferences={question.filesReferences ? (question.filesReferences as unknown as any[]) : []} />
            </div>
          </div>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QnABot
