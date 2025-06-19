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

export async function analyzeSpeechInput(input: string): Promise<AnalysisResult | null> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: GROQ_MODEL_ID,
        messages: [
          {
            role: 'system',
            content: `
You are MORA, the intelligent eCommerce assistant embedded inside a startup tool that helps users launch stores instantly.

The user will speak naturally — your job is to understand what they want. Extract these fields from their speech:
1. "region" — Where is their target market?
2. "tone" — What brand tone do they want (e.g. bold, clean, warm)?
3. "styleNotes" — What extra adjectives or concepts should define their site's visual feeling?
4. "moraReply" — Respond like MORA. Friendly, confident, brief, and charming.

Always return pure JSON.
If the user is vague, take your best guess and default to modern tone.
If unsure about a field, leave it out **only if absolutely necessary**.

Examples:
Input: "I want a fun site that’s for young people in Brazil — kinda colorful but not crazy."
Output:
{
  "region": "Brazil",
  "tone": "fun",
  "styleNotes": "colorful, youth-focused",
  "moraReply": "Great! A colorful and fun brand for Brazil sounds exciting. Let’s make it awesome."
}

Ready to extract. Always return JSON only.
            `.trim(),
          },
          {
            role: 'user',
            content: input,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    type GroqResponse = {
      choices?: { message?: { content?: string } }[];
    };

    const data = response.data as GroqResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ Failed to analyze speech input:', error);
    return null;
  }
}