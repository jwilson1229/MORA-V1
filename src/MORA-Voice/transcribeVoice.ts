type TranscribeCallback = (text: string) => void;
type ErrorCallback = (error: string) => void;

// Explicit cross-browser fallback with correct TS handling
export function transcribeVoice(onTranscribed: TranscribeCallback, onError: ErrorCallback) {
  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    onError('Speech recognition not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognitionClass();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onTranscribed(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error || 'Unknown error');
  };

  recognition.start();
}
