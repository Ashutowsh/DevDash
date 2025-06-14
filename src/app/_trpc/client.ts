import {createTRPCReact} from "@trpc/react-query"
import { type AppRouter } from "@/trpcServer/project";

export const trpc = createTRPCReact<AppRouter>();