import {Octokit} from "octokit";
import prismaDb from "./prisma";
import axios from "axios";
import { aiSummarise } from "./ai";

export const octokit = new Octokit({
    auth : process.env.GITHUB_TOKEN,
})

type CommitResponse = {
    commitHash : string,
    commitMessage : string,
    commitAuthorName : string,
    commitAuthorAvatar: string,
    commitDate: string
}

const fetchProjectGithubUrl = async (projectId : string) => {
    const project = await prismaDb.project.findUnique({
        where : {
            id : projectId
        },
        select : {
            githubUrl : true
        }
    })

    if(!project?.githubUrl) throw new Error("Project has no github url.")

    return {project, githubUrl : project?.githubUrl}
}

const getCommitHashes = async(githubUrl : string): Promise<CommitResponse[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo) {
        throw new Error("Invalid Github url.")
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    })

    const sortedCommits = data.sort((a:any, b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author?.date).getTime()) as any

    console.log(sortedCommits)
    
    return sortedCommits.slice(0, process.env.NO_OF_COMMITS).map((commit : any) => ({
        commitHash : commit.sha as string,
        commitMessage : commit.commit?.message ?? "",
        commitAuthorName : commit.commit?.author?.name ?? "",
        commitAuthorAvatar : commit?.author?.avatar_url ?? "",
        commitDate : commit.commit?.author?.date ?? ""
    }))
}

const pollCommits = async(projectId: string) => {
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterunprocessedCommits(projectId, commitHashes)
    
    const summaryResponse = await Promise.allSettled(unprocessedCommits.map((commit)=> {
        return summariseCommit(githubUrl, commit.commitHash)
    }))

    const summaries = summaryResponse.map((response) => {
        if(response.status === 'fulfilled') {
            return response.value as string
        }
        return ""
    })

    const commits = await prismaDb.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log("Processing commit : ", index)
            return {
                projectId: projectId,
                commitHash : unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary,
            }
        })
    })
    

    return commits
}

const filterunprocessedCommits = async(projectId: string, commitHashes: CommitResponse[]) => {
    const processedCommit = await prismaDb.commit.findMany({
        where : {projectId}
    })

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommit.some((processedCommit) => processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}

const summariseCommit = async(githubUrl: string, commitHash: string) => {
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers : {
            Accept : 'application/vnd.github.v3.diff'
        }
    })

    return aiSummarise(data) || ""
}

export {
    pollCommits
}