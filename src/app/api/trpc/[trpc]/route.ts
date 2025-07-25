import { appRouter } from "@/trpcServer/project";
import {fetchRequestHandler} from "@trpc/server/adapters/fetch"

const handler = async (req : Request) => {
    return fetchRequestHandler({
        endpoint : "/api/trpc",
        req,
        router : appRouter,
        createContext : () => ({})
    });
}

export {handler as GET, handler as POST}