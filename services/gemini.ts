
import { GoogleGenAI, Type } from "@google/genai";
import { VideoSegment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeVideo = async (videoBase64: string, mimeType: string): Promise<VideoSegment[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: videoBase64,
                mimeType: mimeType,
              },
            },
            {
              text: `Analyze this gaming video. 
              1. Find the best 60s viral segment.
              2. Generate subtitles with timing.
              3. IMPORTANT: Identify the region of the "Gameplay" and the "Facecam/Webcam" of the gamer.
              4. Return the coordinates as normalized percentages (0-100) for 'gameplayCrop' and 'faceCamCrop' (x, y, width, height).
              If no facecam is detected, only return gameplayCrop.`
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              startTime: { type: Type.NUMBER },
              endTime: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              gameplayCrop: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER }
                }
              },
              faceCamCrop: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER }
                }
              },
              subtitles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    startTime: { type: Type.NUMBER },
                    endTime: { type: Type.NUMBER },
                    text: { type: Type.STRING },
                  },
                  required: ["id", "startTime", "endTime", "text"]
                }
              }
            },
            required: ["startTime", "endTime", "summary", "subtitles"]
          }
        }
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
};
