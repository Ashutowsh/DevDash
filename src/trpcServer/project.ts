import { projectSchema } from "@/schemas/projectSchema";
import { protectedProcedures, router } from "./trpc";
import prismaDb from "@/lib/prisma";

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
    })
})

export type AppRouter = typeof appRouter;