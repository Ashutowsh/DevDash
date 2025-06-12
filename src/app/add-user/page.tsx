import prismaDb from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation';


const AddUser = async() =>  {
    const {userId} = await auth();
    if(!userId) notFound();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if(!user.emailAddresses[0]?.emailAddress) 
        return new Error('User email not found');

    try {
        await prismaDb.user.upsert({
            where: {
              email: user.emailAddresses[0].emailAddress ?? "",
            },
            update: {
              imageUrl: user.imageUrl,
              firstName: user.firstName,
              lastName: user.lastName
            },
            create: {
                id: user.id,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
                username: user.username ?? "",
                firstName: user.firstName,
                lastName: user.lastName,
            },
          })
    } catch (error:any) {
        return new Error("Error in adding user details : ", error.message);
    }

  return redirect('/dashboard');
}

export default AddUser