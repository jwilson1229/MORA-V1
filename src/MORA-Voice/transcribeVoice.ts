// app/voice/transcribeVoice.ts

type TranscribeCallback = (text: string) => void;
type ErrorCallback = (error: string) => void;

type SpeechRecognitionEvent = any;
type SpeechRecognitionErrorEvent = any;

// Add a type declaration for SpeechRecognition if it doesn't exist
type SpeechRecognition = typeof window.SpeechRecognition;

let recognition: InstanceType<SpeechRecognition> | null = null;
let fullTranscript = '';

export function initializeTranscription(onResult: TranscribeCallback, onError: ErrorCallback) {
  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true;

  fullTranscript = '';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcriptPiece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        fullTranscript += transcriptPiece + ' ';
      } else {
        interim += transcriptPiece;
      }
    }

    // Final callback fires after brief pause
    clearTimeout((recognition as any)._finalTimeout);
    (recognition as any)._finalTimeout = setTimeout(() => {
      if (fullTranscript.trim()) {
        onResult(fullTranscript.trim());
        fullTranscript = '';
      } else {
        onError('No speech detected. Try again.');
      }
    }, 1000);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    const errorType = event?.error;
    if (errorType === 'no-speech' || errorType === 'audio-capture') {
      onError('Couldn’t hear anything clearly. Try again.');
    } else if (errorType === 'network') {
      onError('Network issue interrupted recognition.');
    } else {
      onError(`Speech recognition error: ${event.error}`);
    }
  };

  recognition.onend = () => {
    // Automatically restart if we want to keep it going (future expansion)
  };
}

export function startListening() {
  if (!recognition) {
    console.error('Recognition not initialized. Call initializeTranscription first.');
    return;
  }
  fullTranscript = '';
  recognition.start();
}

export function stopListening() {
  recognition?.stop();
}
