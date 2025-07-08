import { diffAnalyzerMediumPrompt, security_analysisPrompt } from "@/constants";
import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const aiSummarise = async (diff: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: diffAnalyzerMediumPrompt + diff,
    });

    // console.log("AI Response:", response.text);
    return response.text;
  } catch (error) {
    console.error("❌ Error generating AI summary:", error);
    return "AI summary generation failed due to model overload or error.";
  }
};

type SecurityResult = {
  severity: "CRITICAL" | "IMPORTANT" | "OK";
  suggestions: string;
  fileNames: string[];
};

export const aiCheckSecurity = async (diff: string): Promise<SecurityResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: security_analysisPrompt + diff,
    });

    const cleanText = (response.text ?? "")
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(cleanText);

    if (
      parsed &&
      ["CRITICAL", "IMPORTANT", "OK"].includes(parsed.severity) &&
      typeof parsed.suggestions === "string" &&
      Array.isArray(parsed.fileNames)
    ) {
      return parsed;
    }

    throw new Error("Parsed AI response format is invalid.");
  } catch (error) {
    console.warn("⚠️ Failed to parse AI security response:", error);

    return {
      severity: "OK",
      suggestions: "Could not parse AI response. Defaulted to OK.",
      fileNames: [],
    };
  }
};

export const summariseCode = async (doc: Document) => {
  console.log("📄 Summarizing:", doc.metadata.source);
  try {
    const code = doc.pageContent.slice(0, 10000);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an intelligent senior software engineer who specializes in onboarding junior software engineers onto projects. So, you are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file . Here is the code : 
      -----
      ${code}
      ------

      Give a summary no more than 100 words of the above code.
      `,
    });

    return response.text ?? "No summary returned.";
  } catch (error) {
    console.error("❌ Error summarizing code:", error);
    return "Failed to generate summary.";
  }
};

export const generateEmbedding = async (summary: string) => {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: summary,
      config: {
        taskType: "SEMANTIC_SIMILARITY",
      },
    });

    return response.embeddings;
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    return [];
  }
};

export async function streamGeminiResponse({
  prompt,
  onChunk,
}: {
  prompt: string;
  onChunk: (chunk: string) => void;
}) {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    for await (const chunk of response) {
      onChunk(chunk.text || "");
    }
  } catch (error) {
    console.error("❌ Error streaming Gemini response:", error);
    onChunk("⚠️ AI response stream failed. Please try again later.");
  }
}
