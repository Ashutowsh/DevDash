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

export const SecuritySeverityEnum = z.enum(['CRITICAL', 'IMPORTANT', 'OK'])

export const CommitSecurityScanSchema = z.object({
  commitId: z.string().min(1, "Commit ID is required"),
  userId: z.string().min(1, "User ID is required"),
  projectId: z.string().min(1, "Project ID is required"),

  suggestions: z.string().min(1, "Suggestions cannot be empty"),
  severity: SecuritySeverityEnum,
  fileNames: z.array(z.string()),
})
const scanSevertySchemaTable = z.object({
  commitMessage: z.string(),
  commitAuthor: z.string(),
  severity: SecuritySeverityEnum
})

export type ScanSeverityRow = z.infer<typeof scanSevertySchemaTable>