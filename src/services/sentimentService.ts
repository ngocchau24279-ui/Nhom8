import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SentimentResult {
  sentiment: "Positive" | "Negative" | "Neutral";
  score: number; // 0 to 100
  explanation: string;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hãy phân tích cảm xúc của đoạn phản hồi khách hàng sau đây bằng tiếng Việt: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            enum: ["Positive", "Negative", "Neutral"],
            description: "Cảm xúc tổng thể của văn bản (Tích cực, Tiêu cực, Trung lập).",
          },
          score: {
            type: Type.NUMBER,
            description: "Điểm số cảm xúc từ 0 (cực kỳ tiêu cực) đến 100 (cực kỳ tích cực).",
          },
          explanation: {
            type: Type.STRING,
            description: "Giải thích ngắn gọn lý do tại sao chọn cảm xúc này bằng tiếng Việt.",
          },
        },
        required: ["sentiment", "score", "explanation"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as SentimentResult;
  } catch (e) {
    console.error("Failed to parse sentiment analysis result", e);
    throw new Error("Failed to analyze sentiment. Please try again.");
  }
}
