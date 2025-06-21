import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github'
import { generateEmbedding, summariseCode } from './ai'
import { Document } from "@langchain/core/documents";
import prismaDb from './prisma';


const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles:['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.locknb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency: 5
    })

    const docs = await loader.load()
    return docs
}

const indexGithubRepo = async(projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`)
        if(!embedding) return

        try {
            const sourceCodeEmbedding = await prismaDb.sourceCodeEmbeddings.create({
            data: {
                summary: embedding.summary!,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId
            }
            })

            if (!embedding.embedding || !embedding.embedding[0] || !embedding.embedding[0].values) {
                throw new Error("Embedding is undefined or malformed.");
            }
            const vectorValues = embedding.embedding[0].values;

            if (!Array.isArray(vectorValues) || vectorValues.length !== 768) {
            throw new Error("Embedding must be a 768-dimensional float array.");
            }

            const vectorString = `[${vectorValues.join(',')}]`;

            await prismaDb.$executeRawUnsafe(
            `
            UPDATE "SourceCodeEmbeddings"
            SET "summaryEmbedding" = $1::vector
            WHERE "id" = $2
            `,
            vectorString,
            sourceCodeEmbedding.id
            );
        } catch (error) {
            console.log(error)
        }
    }))
}

const generateEmbeddings = async(docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary!)

        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source
        }
    }))
}

export {
    indexGithubRepo
}