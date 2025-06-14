import { auth } from "@clerk/nextjs/server";
import {initTRPC, TRPCError} from "@trpc/server";

const t = initTRPC.create();

const authMiddleware = t.middleware(async({next, ctx}) => {
    const user = await auth();
    if(!user){
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Access requires login.'
        })
    }

    return next({
        ctx :{
            ...ctx,
            user
        }
    })
})

export const router = t.router;
export const protectedProcedures = t.procedure.use(authMiddleware);