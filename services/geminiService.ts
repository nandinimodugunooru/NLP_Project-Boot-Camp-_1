
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CorrectionResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private static ai = new GoogleGenAI({ apiKey: API_KEY });

  static async correctAndTranslate(sentence: string): Promise<CorrectionResult> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Correct the following English sentence for grammar, punctuation, and style. 
      Also provide translations for the corrected version in Telugu and Hindi. 
      Sentence to process: "${sentence}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedSentence: { type: Type.STRING, description: "The final polished English sentence." },
            explanation: { type: Type.STRING, description: "A brief summary of what was improved." },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "The incorrect segment." },
                  fixed: { type: Type.STRING, description: "The corrected segment." },
                  reason: { type: Type.STRING, description: "Brief explanation of the rule." }
                },
                required: ["original", "fixed", "reason"]
              }
            },
            translations: {
              type: Type.OBJECT,
              properties: {
                telugu: { type: Type.STRING, description: "Translation in Telugu." },
                hindi: { type: Type.STRING, description: "Translation in Hindi." }
              },
              required: ["telugu", "hindi"]
            }
          },
          required: ["correctedSentence", "explanation", "corrections", "translations"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}") as CorrectionResult;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Failed to process your request. Please try again.");
    }
  }

  static async generateSpeech(text: string): Promise<ArrayBuffer> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio generation failed");

    return this.decodeBase64(base64Audio);
  }

  private static decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  static async playAudio(audioBuffer: Uint8Array, audioCtx: AudioContext) {
    const pcmData = new Int16Array(audioBuffer.buffer);
    const frameCount = pcmData.length;
    const buffer = audioCtx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = pcmData[i] / 32768.0;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  }
}
