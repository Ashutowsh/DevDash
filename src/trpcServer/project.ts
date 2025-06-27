import {projectSchema, qnASchema } from "@/schema";
import { protectedProcedures, router } from "./trpc";
import prismaDb from "@/lib/prisma";
import {pollCommits } from "@/lib/github";
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
        // await pollCommits(project.id)
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
    }),

    saveQnA: protectedProcedures.input(qnASchema).mutation(async({ctx, input}) => {
        const qnA = await prismaDb.question.create({
            data: {
                question: input.question,
                answer: input.answer,
                filesReferences: input.files,
                projectId: input.projectId,
                userId: ctx.user.userId!
            }
        })

        return qnA
    }),

    getQnAs : protectedProcedures.input(z.object({
        projectId: z.string()
    })).query(async({input}) => {
        const qnAs = await prismaDb.question.findMany({
            where:{
                projectId: input.projectId
            },
            include: {
                user: true
            },

            orderBy: {
                createdAt: 'desc'
            }
        })

        return qnAs
    }),

    getCommitSecurityScans: protectedProcedures.input(z.object({
        projectId: z.string()
    }))
    .query(async({ctx, input}) => {
        const savedScan = await prismaDb.commitSecurityScan.findMany({
            where: {
                projectId: input.projectId
            },

            include:{
                commit: true
            }
        })

        return savedScan
    }),

    archiveProject: protectedProcedures.input(z.object({
        projectId : z.string()
    })).mutation(async({input}) => {
        return await prismaDb.project.update({
            where: { id: input.projectId},
            data: {
                deletedAt: new Date()
            }
        })
    }),

    getTeamMembers: protectedProcedures.input(z.object({
        projectId: z.string()
    })).query(async({ctx, input}) => {
        return prismaDb.usersToProjects.findMany({
            where: {projectId: input.projectId}, include: {user:true}
        })
    }),

    getMyCredits: protectedProcedures.query(async({ctx}) => {
        return await prismaDb.user.findUnique({
            where: {id: ctx.user.userId!},
            select: {credits: true}
        })
    })
})

export type AppRouter = typeof appRouter;