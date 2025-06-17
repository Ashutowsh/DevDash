import { z } from "zod"

type ResultRow = {
  fileName: string
  sourceCode: string
  summary: string
  similarity: number
}

export const projectSchema = z.object({
  projectTitle : z.string().min(1, {message : "Title must contain atleast 2 letters."}).max(100),
  githubUrl : z.string().url(),
  githubToken : z.string().max(100).optional(),
})

export const qnASchema = z.object({
  projectId: z.string(),
  question: z.string(),
  answer: z.string(),
  files: z.any()
})