// import { pollCommits } from "@/helpers/github";
import { projectSchema } from "@/schemas/projectSchema";
import { protectedProcedures, router } from "./trpc";
import prismaDb from "@/lib/prisma";


// export const appRouter = router({
//     createProject: protectedProcedures.input(projectSchema)

//     .mutation(async({ctx, input}) => {
//         console.log(" Input : ", input)
//         const user = ctx?.user
//         const newProject = await prismaDb.project.create({
//             data : {
//                 title : input.projectTitle,
//                 githubUrl : input.githubUrl,
//                 githubToken : input.githubToken,
                
//                 usersToProjects : {
//                     create : {
//                         userId : user.userId!,
//                     }
//                 }
//             }
//         })
//         await pollCommits(newProject.id)
//         // console.log(newProject)
//         return newProject
//     }),

//     getProjects : protectedProcedures.query(async ({ctx}) => {
//        const user = ctx.user

//        const projects = await prismaDb.project.findMany({
//         where : {
//             usersToProjects : {
//                 some : {
//                     userId : user.userId!
//                 }
//             }, deletedAt : null
//         }
//        })

//        return projects
//     })
// });

export const appRouter = router({
    createProject: protectedProcedures.query(async() => {
        return [1, 2, 3, 4, 5]
    })
})

export type AppRouter = typeof appRouter;