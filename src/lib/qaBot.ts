'use server'

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
import { generateEmbedding, streamGeminiResponse } from "./ai";
import prismaDb from "./prisma";
import { createStreamableValue } from "ai/rsc";

type ResultRow = {
  fileName: string
  sourceCode: string
  summary: string
  similarity: number
}


export const askQuestion = async(question: string, projectId: string) => {
    const stream = createStreamableValue()

    const queryVector = await generateEmbedding(question)
    if(!queryVector || !queryVector[0] || !queryVector[0].values)
        throw new Error("Embedding is undefined or malformed.")
    
    const vectorQuery = `[${queryVector[0].values?.join(',')}]`

    const result = await prismaDb.$queryRaw<ResultRow[]>`
    SELECT 
    "fileName", 
    "sourceCode", 
    "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity 
    FROM "SourceCodeEmbeddings"
    WHERE 
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
    `

    let context = ''

    for(const doc of result) {
        context += `File: ${doc.fileName}\nSummary: ${doc.summary}\nCode: ${doc.sourceCode}\n\n`
    }

    // (async() => {
    //     const response = await ai.models.generateContentStream({
    //         model: "gemini-1.5-flash",
    //         contents: "",
    //     });

    //     for await (const chunk of response) {
    //         stream.update(chunk)
    //         // console.log(chunk.text);
    //     }

    //     stream.done()
    // })()

    (async () => {
        await streamGeminiResponse({
        prompt: `You are an AI code assistant designed to answer questions about a specific codebase. Your target audience is a technical intern, so your explanations should be accurate, detailed, and educational.

            Your core traits are:
            - Expert-level technical knowledge (especially in software engineering and AI)
            - Helpful and articulate communication
            - Friendly, kind, and inspiring attitude
            - Step-by-step, vivid, and clear breakdowns of technical details
            - Strict grounding in provided context — do not hallucinate

            When responding to a question, always check the provided context first. If the answer is not found in the context, respond with:

            > “I'm sorry, but I don't know the answer.”

            Do **not** fabricate any answers. Do **not** apologize for previous messages. Instead, say that new information was gained if needed.

            You always answer using **Markdown syntax**, with proper formatting for:
            - Code blocks
            - Step-by-step instructions
            - Tables (if comparing things)
            - Bullet points or numbered steps when explaining

            ---

            START OF CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            ---

            START OF QUESTION
            ${question}
            END OF QUESTION

        `,
        onChunk: (chunk) => stream.update(chunk),
        });

        stream.done();
    })();

    return {
        output: stream.value,
        filesReferenced: result
    }
}