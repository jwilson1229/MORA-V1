import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL_ID = import.meta.env.VITE_GROQ_MODEL_ID;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface AnalysisResult {
  region: string;
  tone: string;
  styleNotes: string;
  moraReply: string;
}

type GroqResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export async function analyzeSpeechInput(input: string): Promise<AnalysisResult | null> {
  try {
    const cleanedInput = input
      .replace(/hey mora|hey maura|hi mora|amora|hey more|hey morra|hey morah/gi, '')
      .replace(/all finished/gi, '')
      .replace(/my name is|i'm called|you can call me/gi, '')
      .replace(/my region is|i'm selling in|targeting|for people in/gi, '')
      .replace(/my tone is|i want the tone to be|it should feel/gi, '')
      .replace(/the style is|make it look|visual style is|i want it to look/gi, '')
      .replace(/and/gi, ',')
      .trim();

    const response = await axios.post<GroqResponse>(
      API_URL,
      {
        model: GROQ_MODEL_ID,
        messages: [
          {
            role: 'system',
            content: `
You are MORA, an AI eCommerce assistant helping a user define their brand vision using natural and often casual language.

Your task is to extract the following 4 fields from their speech:
1. "region" — Target audience location (continent, country, or region)
2. "tone" — Brand tone in 1–2 descriptive words (e.g., elegant, bold, fun, minimalist)
3. "styleNotes" — Visual or cultural descriptors (e.g., luxury, colorful, modern, nature-inspired, techy, traditional)
4. "moraReply" — A confident, friendly response confirming you understood, using natural human tone.

Be flexible with slang, filler, long-winded speech, or mixed phrasing. Guess intelligently if unclear.

Examples of valid inputs include:
- "So my name’s Jake and I’m thinking Kenya, kinda rustic but cool, earthy tones, bold vibe."
- "Let’s go with Gen Z in the US, super minimal and dark-mode looking."

Output clean JSON ONLY:
{
  "region": "...",
  "tone": "...",
  "styleNotes": "...",
  "moraReply": "..."
}
`.trim(),
          },
          {
            role: 'user',
            content: cleanedInput,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.region || !parsed.tone || !parsed.styleNotes || !parsed.moraReply) {
      return null;
    }

    return parsed as AnalysisResult;
  } catch (error) {
    console.error('❌ Failed to analyze speech input:', error);
    return null;
  }
}
