'use client'

import { useProject } from '@/hooks/use-project'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import Image from 'next/image'
import { askQuestion } from '@/lib/qaBot'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import RelatedCodes from './RelatedCodes'

function AskQuestionCard() {
    const {project} = useProject()
    const [question, setQuestion] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fileReferences, setFileReferences] = useState<{fileName: string, summary: string, sourceCode: string}[]>()
    const [answer, setAnswer] = useState('')

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setAnswer('')
        setFileReferences([])
        if(!project?.id) return
        setLoading(true)

        const {output, filesReferenced} = await askQuestion(question, project.id)
        setOpen(true)
        setFileReferences(filesReferenced)
        
        for await (const chunk of readStreamableValue(output)){
            if(chunk) {
                setAnswer(ans =>  ans + chunk)
            }
        }
        setLoading(false)
    }
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-5xl sm:w-[80vw] sm:max-w-4xl md:w-[70vw] md:max-w-3xl">
            <DialogHeader>
            <DialogTitle>
                {/* Optional Title or Image */}
            </DialogTitle>
            </DialogHeader>

            <MDEditor.Markdown
            source={answer}
            className="max-w-[70vw] !h-full max-h-[40vh] overflow-scroll"
            />

            <div className="h-4" />

            <RelatedCodes fileReferences={fileReferences ?? []} />

            <Button type="button" onClick={() => setOpen(false)}>
            Close
            </Button>

            <h1 className="font-semibold mt-4">File References</h1>
            {fileReferences?.map((file, index) => (
            <div key={`${file.fileName}-${index}`}>
                {file.fileName}
            </div>
            ))}
        </DialogContent>
        </Dialog>


      <Card>
        <CardHeader>
            <CardTitle>
                Ask a question
            </CardTitle>
        </CardHeader>

        <CardContent>
            <form onSubmit={onSubmit}>
                <Textarea placeholder='Which file should I edit to change the home page?' value={question} onChange={e => setQuestion(e.target.value)}/>
                <div className="h-4"></div>
                <Button type='submit' disabled={loading}>
                    Ask Me
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AskQuestionCard
