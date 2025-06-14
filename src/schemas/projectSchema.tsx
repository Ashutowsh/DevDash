import { z } from "zod"

export const projectSchema = z.object({
  projectTitle : z.string().min(1, {message : "Title must contain atleast 2 letters."}).max(100),
  githubUrl : z.string().url(),
  githubToken : z.string().max(100).optional(),
})
