import { trpc } from "@/app/_trpc/client"
import { useLocalStorage} from 'usehooks-ts'

// export const useProject = () => {
//     const getProjects = trpc.getProjects.useQuery()
//     const projects = getProjects.data
//     const [projectId, setProjectId] = useLocalStorage("GitHubAI-projectId", " ");
//     const project = projects?.find(project => project.id === projectId)
//     return {
//         getProjects,
//         projects,
//         project,
//         projectId,
//         setProjectId
//     }
// }