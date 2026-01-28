
import { GoogleGenAI } from "@google/genai";
import { LocationData } from "../types";

// Initialize Gemini
let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

// --- EXISTING FUNCTIONS ---

export const generateHindiAlert = async (location: LocationData, isEmergency: boolean = false): Promise<string> => {
  if (!ai) return "API Key not configured. Unable to generate alert.";

  try {
    const prompt = `
      You are an AI assistant for the Varanasi Crowd Management System.
      Generate a ${isEmergency ? "CRITICAL EMERGENCY BROADCAST" : "short, urgent, and clear safety alert"} in HINDI for the following situation:
      
      Location: ${location.name}
      Current Crowd: ${location.currentCrowd}
      Risk Score: ${location.riskScore}/100
      Scenario: ${location.scenario}
      
      The message should be suitable for a public address system or SMS alert.
      ${isEmergency ? "TONE: EXTREMELY URGENT, COMMANDING. Start with 'सावधान!' (Attention!). Use short sentences." : "Include an emoji at the start."}
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

export const checkTrafficForLocation = async (locationName: string, userLocation?: {lat: number, lon: number}): Promise<{status: string, details: string}> => {
  if (!ai) return { status: 'Unknown', details: 'API Key missing' };

  try {
      const toolConfig: any = {};
      if (userLocation) {
          toolConfig.retrievalConfig = {
              latLng: {
                  latitude: userLocation.lat,
                  longitude: userLocation.lon
              }
          };
      }
    
    const prompt = `Check current real-time traffic conditions for ${locationName} in Varanasi using Google Maps. 
    Classify traffic as one of: 'High Congestion', 'Moderate Traffic', 'Light Traffic'.
    Provide a very brief 1-sentence detail (e.g., "15 min delay expected").
    Output format: "Status | Details"
    IMPORTANT: Use the tool to get the data. If the tool fails or data is missing, make a reasonable estimate based on typical Varanasi traffic patterns for this time. Do NOT return an error or say "I can't check".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
      }
    });

    const text = response.text || "";
    const parts = text.split('|');
    if (parts.length >= 2) {
        return { status: parts[0].trim(), details: parts[1].trim() };
    }
    return { status: 'Traffic Update', details: text };
  } catch (error) {
    console.error("Traffic Check Error:", error);
    return { status: 'Error', details: 'Could not fetch live traffic data' };
  }
};

export const getSmartGuideResponse = async (query: string, userLocation?: {lat: number, lon: number}): Promise<string> => {
    if (!ai) return "API Key not configured.";

    try {
        const toolConfig: any = {};
        if (userLocation) {
            toolConfig.retrievalConfig = {
                latLng: {
                    latitude: userLocation.lat,
                    longitude: userLocation.lon
                }
            };
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: query,
            config: {
                tools: [{ googleMaps: {} }, { googleSearch: {} }],
                toolConfig: toolConfig,
                systemInstruction: `You are an expert local guide for Varanasi, focused on safety and enjoyment.
                YOUR RESPONSIBILITIES:
                1. **Real-Time Traffic**: When asked about traffic, use Google Maps to find current congestion.
                2. **Smart Routing**: Suggest routes that avoid crowds.
                3. **Recommendations**: When asked for cafes, clubs, housing spots, or "best places", suggest specific, highly-rated locations.
                IMPORTANT FORMATTING RULES:
                - Keep answers concise (under 150 words).
                - **MANDATORY**: When you mention a specific place (e.g., "Blue Lassi", "Assi Ghat", "Kashi Cafe"), you MUST format it as a clickable Markdown link that opens Google Maps Search.
                  Format: [Place Name](https://www.google.com/maps/search/?api=1&query=Place+Name+Varanasi)
                - Use bold text for emphasis.`
            }
        });

        let text = response.text || "";
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            text += "\n\n**Sources & Map Links:**\n";
            chunks.forEach((chunk: any) => {
                if (chunk.web?.uri) {
                    text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
                }
            });
        }
        return text;

    } catch (error) {
        console.error("Smart Guide Error:", error);
        return "Sorry, I encountered an error connecting to the Maps service. Please try again in a moment.";
    }
};

// --- NEW FEATURES ---

/**
 * Transcribes audio using Gemini 3 Flash
 */
export const transcribeUserAudio = async (base64Audio: string): Promise<string | null> => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: 'audio/webm', // Assuming standard browser recording format
              data: base64Audio 
            } 
          },
          { text: "Transcribe the spoken audio exactly. Return only the transcription text." }
        ]
      }
    });
    return response.text || null;
  } catch (error) {
    console.error("Transcription Error:", error);
    return null;
  }
};

// --- AUDIO HELPERS ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generateSpeechFromText = async (text: string): Promise<string | null> => {
   if (!ai) return null;
   try {
       const response = await ai.models.generateContent({
           model: "gemini-2.5-flash-preview-tts",
           contents: [{ parts: [{ text: text }] }],
           config: {
               responseModalities: ["AUDIO"],
               speechConfig: {
                   voiceConfig: {
                       prebuiltVoiceConfig: { voiceName: 'Kore' },
                   },
               },
           },
       });
       return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
   } catch (e) {
       console.error("TTS Error", e);
       return null;
   }
};

export const playAudioContent = async (base64Audio: string) => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({sampleRate: 24000});
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContext,
            24000,
            1
        );
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        return source; 
    } catch (e) {
        console.error("Error playing audio:", e);
    }
};
