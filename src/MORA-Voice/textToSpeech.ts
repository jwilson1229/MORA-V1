import axios from 'axios';

const VOICE_ID = import.meta.env.VITE_MORA_VOICE_ID!;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export async function speakWithMora(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  try {
    const response = await axios.post<ArrayBuffer>(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text,
        voice_settings: {
          stability: 0.2,
          similarity_boost: 0.95,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Attach event listeners
    audio.onplay = () => {
      onStart?.();
    };

    audio.onended = () => {
      onEnd?.();
    };

    await audio.play();
  } catch (error) {
    console.error('❌ Failed to speak with MORA:', error);
    onEnd?.(); // Ensure fallback disables glow on failure
  }
}
