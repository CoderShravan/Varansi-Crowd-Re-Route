import { GoogleGenAI } from "@google/genai";
import { LocationData } from "../types";

// Initialize Gemini
// Note: In a production app, the key should come from a secure backend or environment variable.
// For this demo, we assume process.env.API_KEY is available.
let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateHindiAlert = async (location: LocationData): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Unable to generate alert.";
  }

  try {
    const prompt = `
      You are an AI assistant for the Varanasi Crowd Management System.
      Generate a short, urgent, and clear safety alert in HINDI for the following situation:
      
      Location: ${location.name}
      Current Crowd: ${location.currentCrowd}
      Risk Score: ${location.riskScore}/100
      Scenario: ${location.scenario}
      
      The message should be suitable for a public address system or SMS alert.
      Include an emoji at the start.
      Do not include English translation.
      Keep it under 30 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "अलर्ट जनरेट करने में असमर्थ।";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "त्रुटि: अलर्ट जनरेट नहीं किया जा सका।";
  }
};
