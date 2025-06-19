import React, { useState } from 'react';
import { usePrimingStore } from '../stores/usePrimingStore';
import { speakWithMora } from '../MORA-Voice/textToSpeech';
import VoiceInput from './VoiceInput';
import { analyzeSpeechInput } from '../MORA-Voice/analyzeSpeechInput';
import moraIcon from '../assets/MORA.png';
import userIcon from '../assets/USER-mora.png';
import '../styles/PrimingCarouselWeb.css';

const industryOptions = [
  'Home & Kitchen',
  'Consumer Electronics',
  'Fashion & Apparel',
  'Beauty & Health',
  'Toys & Hobbies',
  'Mobile Accessories',
  'Pet Supplies',
  'Smart Home',
];

export default function PrimingCarouselWeb() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState(industryOptions[0]);
  const [transcript, setTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    setUserName,
    setIndustryKey,
    setTargetRegion,
    setBrandTone,
    setStyleNotes,
  } = usePrimingStore();

  const prompts = [
    {
      label: 'Name & Industry',
      content: (
        <>
          <h2>🚀 Welcome to MORA</h2>
          <p>What should MORA call you?</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
          <p style={{ marginTop: '1rem' }}>Choose your industry:</p>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            {industryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setUserName(name);
              setIndustryKey(industry);
              setStep(1);
            }}
          >
            Next →
          </button>
        </>
      ),
    },
    {
      label: 'Define Your Vision',
      content: (
        <>
          <h2>🧠 Define Your Brand Vision</h2>
          <p>Tell MORA how your site should feel. Click her to hear guidance:</p>

          <div className="speaker-stack-wrapper">
            <div className="speaker-stack">
              <img
                src={moraIcon}
                alt="MORA"
                title="Click to hear MORA's prompt"
                className="mora-icon"
                onClick={() => {
                  const guidance = `Now that I know your name is ${name}, and you're entering the ${industry} space — tell me your vision. Say something like: 'North American customer base, bold, playful and mobile-first design'. I’ll remember it all. You can also type it in. Ready when you are.`;
                  speakWithMora(guidance);
                }}
              />
              <img
                src={userIcon}
                alt="You"
                className="user-icon"
              />
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
            Sample: <br />
            <strong>"United States, sleek, techy, futuristic design"</strong>
          </p>

          <VoiceInput onCommand={setTranscript} />

          <input
            style={{ marginTop: '1rem' }}
            placeholder="Or type your answer..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={async () => {
              const input = manualInput || transcript;
              if (!input.trim()) return;
              setLoading(true);
              const result = await analyzeSpeechInput(input);
              setLoading(false);

              if (!result) {
                speakWithMora(
                  "Hmm, I couldn’t quite catch that. Try speaking a bit more clearly or typing it in."
                );
                return;
              }

              setTargetRegion(result.region);
              setBrandTone(result.tone);
              setStyleNotes(result.styleNotes);
              speakWithMora(result.moraReply);
              setStep(2);
            }}
          >
            Confirm →
          </button>
        </>
      ),
    },
    {
      label: 'Preview Ready',
      content: (
        <>
          <h2>🎉 All Set!</h2>
          <p>MORA is now ready to begin your journey.</p>
          <button onClick={() => console.log(usePrimingStore.getState())}>
            🔍 View Primed Data
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="priming-wrapper">
      <div className="priming-card">{prompts[step].content}</div>
    </div>
  );
}
