
import { GoogleGenAI } from "@google/genai";

/**
 * Service to handle communications with the Google Gemini API.
 */
export const getGeminiResponse = async (prompt: string) => {
  try {
    // Correctly initializing GoogleGenAI with the API key from environment variables.
    // Named parameter 'apiKey' is required.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using ai.models.generateContent to fetch a response with the Gemini 3 Flash model.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional, empathetic, and culturally aware Ramadan Assistant for Bengali-speaking users. Provide accurate Islamic information based on general consensus, healthy eating tips for fasting, and motivational content. Always respond in clear and polite Bengali (Bangla). If the user asks for quotes, keep them brief. If they ask about health, recommend consulting a doctor for medical issues.",
        temperature: 0.7,
      },
    });

    // The text output is obtained directly through the .text property (not a method call).
    return response.text || "আমি কোনো সঠিক উত্তর খুঁজে পাইনি। অনুগ্রহ করে অন্যভাবে প্রশ্ন করুন।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "দুঃখিত, এআই সংযোগে সমস্যা হয়েছে। দয়া করে ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।";
  }
};
