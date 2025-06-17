import { diffAnalyzerMediumPrompt } from "@/constants";
import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const aiSummarise = async (diff: string) => {

    const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: diffAnalyzerMediumPrompt + diff,
  });

  // console.log("AI Response:", response.text);
  return response.text
}

export const summariseCode = async(doc: Document) => {
  console.log("Getting summary for", doc.metadata.source)

  try {
    const code = doc.pageContent.slice(0, 10000);
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects. So, you are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file . Here is the code : 
    -----
    ${code}
    ------

    Give a summary no more than 100 words of the abbove code.
    `
    })

    return response.text
  } catch (error) {
    // console.log(error)
    return ' '
  }
}

export const generateEmbedding = async(summary: string) => {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: summary,
    config:{
      taskType: 'SEMANTIC_SIMILARITY'
    }
  });

  return response.embeddings
}

export async function streamGeminiResponse({
  prompt,
  onChunk,
}: {
  prompt: string;
  onChunk: (chunk: string) => void;
}) {
  const response = await ai.models.generateContentStream({
    model: "gemini-1.5-flash",
    contents: prompt,
  });

  for await (const chunk of response) {
    onChunk(chunk.text || ""); // ensure safe string
  }
}
