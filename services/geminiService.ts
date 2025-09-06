
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and creative conversational AI. Keep your responses concise and engaging.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    return "I'm sorry, I encountered an error. Please try again.";
  }
};
