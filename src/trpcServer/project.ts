import { projectSchema } from "@/schemas/projectSchema";
import { protectedProcedures, router } from "./trpc";
import prismaDb from "@/lib/prisma";
import { pollCommits } from "@/lib/github";
import { z } from "zod";
import { indexGithubRepo } from "@/lib/gitInfo";

export const appRouter = router({
    newProject: protectedProcedures.input(projectSchema).mutation(async({ctx, input}) => {
        const project = await prismaDb.project.create({
            data: {
                title: input.projectTitle,
                githubUrl: input.githubUrl,
                githubToken: input.githubToken,

                usersToProjects: {
                    create: {
                        userId: ctx.user.userId!,
                    }
                }
            }
        })
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken!)
        await pollCommits(project.id)

        return project
    }),

    getProjects: protectedProcedures.query(async({ctx}) => {
        return await prismaDb.project.findMany({
            where: {
                usersToProjects: {
                    some: {
                        userId: ctx.user.userId!,
                    }
                },
                deletedAt: null
            }
        })
    }),

    getCommits: protectedProcedures.input(z.object({
        projectId: z.string()
    })).query(async({ctx, input}) => {
        await pollCommits(input.projectId).then().catch(console.error)
        return await prismaDb.commit.findMany({
            where: {
                projectId: input.projectId,
            }
        })
    })
})

export type AppRouter = typeof appRouter;