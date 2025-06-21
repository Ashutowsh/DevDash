import prismaDb from '@/lib/prisma'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

type Props = {
    params: Promise<{projectId: string}>
}

async function JoinHandler(props: Props) {
    const {projectId} = await props.params
    const {userId} = await auth()
    if(!userId) return redirect('/sign-in')

    const dbUser = await prismaDb.user.findUnique({
        where:{
            id: userId
        }
    })

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    if(!dbUser) {
        await prismaDb.user.create({
            data: {
                id: userId,
                email: user.emailAddresses[0]!.emailAddress,
                imageUrl: user.firstName,
                lastName: user.lastName
            }
        })
    }

    const project = await prismaDb.project.findUnique({
        where: {
            id: projectId
        }
    })

    if(!project) return redirect("/dashboard")
    
    try {
        await prismaDb.usersToProjects.create({
            data: {
                userId,
                projectId
            }
        })
        } catch (error) {
            console.log('user already in the project : ',error)
        }

  return redirect(`/dashboard`)
}

export default JoinHandler
