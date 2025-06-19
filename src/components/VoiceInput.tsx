import React, { useState } from 'react';

interface VoiceInputProps {
  onCommand: (text: string) => void;
}

export default function VoiceInput({ onCommand }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState('');

  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setStatus('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setStatus('Listening...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      setStatus(`Heard: "${transcript}"`);
      onCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      setStatus('Recognition failed. Please try again.');
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ marginTop: 20, textAlign: 'center' }}>
      <button onClick={handleVoiceCommand} disabled={listening}>
        {listening ? 'Listening...' : '🎤 Speak to MORA'}
      </button>
      {status && <p style={{ marginTop: 10, color: '#AAA' }}>{status}</p>}
    </div>
  );
}
