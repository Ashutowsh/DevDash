import { diffAnalyzerMediumPrompt } from "@/constants";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const aiSummarise = async (diff: string) => {

    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: diffAnalyzerMediumPrompt + diff,
  });

  // console.log("AI Response:", response.text);
  return response.text
}