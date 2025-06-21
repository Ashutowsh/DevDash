import {Octokit} from "octokit";
import prismaDb from "./prisma";
import axios from "axios";
import { aiCheckSecurity, aiSummarise } from "./ai";

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
    
    return sortedCommits.slice(0, process.env.NO_OF_COMMITS).map((commit : any) => ({
        commitHash : commit.sha as string,
        commitMessage : commit.commit?.message ?? "",
        commitAuthorName : commit.commit?.author?.name ?? "",
        commitAuthorAvatar : commit?.author?.avatar_url ?? "",
        commitDate : commit.commit?.author?.date ?? ""
    }))
}

export const pollCommits = async (projectId: string) => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId)
  const commitHashes = await getCommitHashes(githubUrl)
  const unprocessedCommits = await filterunprocessedCommits(projectId, commitHashes)

  const summaryResponse = await Promise.allSettled(
    unprocessedCommits.map(commit => summariseCommit(githubUrl, commit.commitHash))
  )

  const scanResponse = await Promise.allSettled(
    unprocessedCommits.map(commit => securityChecks(githubUrl, commit.commitHash))
  )

  const createdCommits = await Promise.all(
    summaryResponse.map((res, index) => {
      const summary = res.status === "fulfilled" ? res.value : ""

      return prismaDb.commit.create({
        data: {
          projectId,
          commitHash: unprocessedCommits[index].commitHash,
          commitMessage: unprocessedCommits[index].commitMessage,
          commitAuthorAvatar: unprocessedCommits[index].commitAuthorAvatar,
          commitAuthorName: unprocessedCommits[index].commitAuthorName,
          commitDate: unprocessedCommits[index].commitDate,
          summary: summary ?? "",
        },
      })
    })
  )

    const scanInsertData = scanResponse
    .map((res, index) => {
      if (res.status === "fulfilled") {
        const security = res.value
        return {
          commitId: createdCommits[index].id,
          projectId,
          suggestions: security.suggestions,
          severity: security.severity,
          fileNames: security.fileNames,
        }
      }
      return null
    })
    .filter((item): item is {
      commitId: string;
      userId: string;
      projectId: string;
      suggestions: string;
      severity: "CRITICAL" | "IMPORTANT" | "OK";
      fileNames: string[];
    } => item !== null)

  if (scanInsertData.length > 0) {
    await prismaDb.commitSecurityScan.createMany({
      data: scanInsertData,
      skipDuplicates: true,
    })
  }

  return {
    insertedCommits: createdCommits.length,
    insertedScans: scanInsertData.length,
  }
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

const securityChecks = async(githubUrl: string, commitHash: string) => {
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers : {
            Accept : 'application/vnd.github.v3.diff'
        }
    })

    return aiCheckSecurity(data) || ""
}