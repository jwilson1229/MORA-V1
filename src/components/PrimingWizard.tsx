import React, { useState } from 'react';
import { speakWithMora } from '../MORA-Voice/textToSpeech';
import { usePrimingStore } from '../stores/usePrimingStore';

const industryOptions = ['Beauty', 'Electronics', 'Agriculture', 'Medical', 'Solar'];

export default function PrimingWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState(industryOptions[0]);
  const [transcript, setTranscript] = useState('');

  const { setUserName, setIndustryKey, setTargetRegion, setBrandTone, setStyleNotes } = usePrimingStore();

  const steps = [
    <div key="step-0">
      <h2>What should MORA call you?</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />

      <h3>Choose your industry:</h3>
      <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
        {industryOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <button onClick={() => {
        setUserName(name);
        setIndustryKey(industry);
        setStep(1);
      }}>Next</button>
    </div>,

    <div key="step-1">
      <h2>Tap below to meet MORA</h2>
      <button onClick={() => {
        const intro = `Hi ${name}, I’m MORA — your ${industry} partner. I’ve helped build stores in this space and now, I’m ready to help you. Together, we’ll scan demand, create a smart site, and fill it with winning products. You just tell me what kind of store you’re dreaming of… I’ll handle the rest. Ready to build something incredible?`;
        speakWithMora(intro);
      }}>Meet MORA</button>

      <p>🎙️ Voice control is managed by MORA. Say "Hey MORA" to begin.</p>
      <p><strong>Transcript:</strong> {transcript || 'Voice captured via carousel flow'}</p>
    </div>,

    <div key="step-2">
      <h2>You're all set!</h2>
      <p>MORA is ready to run your first report or build your storefront.</p>
      <pre>{JSON.stringify(usePrimingStore.getState(), null, 2)}</pre>
    </div>
  ];

  return (
    <div style={{ padding: '2rem', background: '#111', color: '#eee', minHeight: '100vh' }}>
      {steps[step]}
    </div>
  );
}