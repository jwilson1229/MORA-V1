import React, { useEffect, useState, useRef } from 'react';

interface VoiceInputProps {
  onCommand: (text: string) => void;
  onListeningStart: () => void;
  onListeningEnd: () => void;
  onHeyMora: () => void;
}

declare global {
  interface Window {
    resumeVoiceInput?: () => void;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export default function VoiceInput({
  onCommand,
  onListeningStart,
  onListeningEnd,
  onHeyMora,
}: VoiceInputProps) {
  const [status, setStatus] = useState('');
  const [hotMic, setHotMic] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const triggeredRef = useRef(false); // 🛡️ Persistent debounce
  const transcriptRef = useRef(''); // 📝 Stores ongoing transcript

  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setStatus('❌ Speech recognition not supported in this browser.');
      return;
    }

    const recog = new SpeechRecognitionClass();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onstart = () => {
      setStatus('🎤 Listening...');
      onListeningStart();
      triggeredRef.current = false; // ✅ Reset when mic restarts
    };

  recog.onresult = (event: any) => {
  let interim = '';
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    const transcript = event.results[i][0].transcript;
    interim += transcript + ' ';
  }

  const lower = interim.toLowerCase().trim();
  const normalized = lower.replace(/[.,!?]/g, '');

  transcriptRef.current += interim; // ✅ Append ongoing transcript

  const heyMoraVariants = [
    'hey mora', 'hey maura', 'hey morah', 'hey more', 'amora', 'hi mora', 'hey morra', 'whats up maura', 'whats good maura'
  ];

  if (heyMoraVariants.some(v => normalized.includes(v))) {
    setStatus('🎯 Trigger: "Hey MORA"');
    triggeredRef.current = true;
    setHotMic(false);
    recog.stop();
    onListeningEnd();
    onHeyMora();
    return;
  }

  if (normalized.includes('all finished')) {
    const finalTranscript = transcriptRef.current
      .replace(/hey mora/gi, '')
      .replace(/all finished/gi, '')
      .trim();

    if (!finalTranscript) {
      setStatus('❌ No usable input detected.');
    } else {
      console.log('🎙️ FINAL TRANSCRIPT:', finalTranscript);
      setStatus('✅ Finalizing input...');
      onCommand(finalTranscript);
    }

    triggeredRef.current = true;
    setHotMic(false);
    recog.stop();
    onListeningEnd();
    transcriptRef.current = ''; // ✅ Clear for next time
  }
};


    recog.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setStatus('❌ Mic access blocked. Please allow microphone access in browser settings.');
      } else {
        setStatus(`❌ Error: ${event.error}`);
      }
      onListeningEnd();
    };

    recog.onend = () => {
      if (hotMic) {
        try {
          recog.start();
        } catch (err) {
          console.warn('Mic restart error:', err);
        }
      }
    };

    setRecognition(recog);

    return () => {
      recog.stop();
    };
  }, []);

  useEffect(() => {
    window.resumeVoiceInput = () => {
      if (recognition) {
        setHotMic(true);
        try {
          recognition.start();
        } catch (err) {
          console.warn('Resume failed:', err);
        }
      }
    };
  }, [recognition]);

  return (
    <div style={{ marginTop: 20, textAlign: 'center' }}>
      <p style={{ color: '#AAA', fontSize: '0.9rem' }}>{status}</p>
    </div>
  );
}
