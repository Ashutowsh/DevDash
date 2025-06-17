'use client'

import { useProject } from '@/hooks/use-project'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Dialog, DialogHeader } from './ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import Image from 'next/image'

function AskQuestionCard() {
    const {project} = useProject()
    const [question, setQuestion] = useState('')
    const [open, setOpen] = useState(false)

    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setOpen(true)
    }
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogHeader>
                <DialogTitle>
                    <Image src='./logo.png' alt='project-name' width={40} height={40}/>
                </DialogTitle>
            </DialogHeader>
            <DialogContent>
                
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
                <Button type='submit'>
                    Ask Me
                </Button>
            </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AskQuestionCard
