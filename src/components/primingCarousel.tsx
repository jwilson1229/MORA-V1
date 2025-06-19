import React, { useState, useEffect, useRef } from 'react';
import { usePrimingStore } from '../stores/usePrimingStore';
import { speakWithMora } from '../MORA-Voice/textToSpeech';
import VoiceInput from './VoiceInput';
import { analyzeSpeechInput } from '../MORA-Voice/analyzeSpeechInput';
import moraIcon from '../assets/MORA.png';
import userIcon from '../assets/USER-mora.png';
import '../styles/PrimingCarouselWeb.css';

const industryOptions = [
  'Home & Kitchen', 'Consumer Electronics', 'Fashion & Apparel',
  'Beauty & Health', 'Toys & Hobbies', 'Mobile Accessories',
  'Pet Supplies', 'Smart Home',
];

export default function PrimingCarouselWeb() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState(industryOptions[0]);
  const [isMoraSpeaking, setIsMoraSpeaking] = useState(false);
  const [isUserListening, setIsUserListening] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const heyMoraTriggeredRef = useRef(false); // ✅ Prevent double-trigger

  const {
    setUserName, setIndustryKey,
    setTargetRegion, setBrandTone, setStyleNotes
  } = usePrimingStore();

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        window.resumeVoiceInput?.();
      }, 800); // ✅ Allow mic time to warm up
    }
  }, [step]);

  async function handleSpokenInput(input: string) {
    if (hasFinished) return;
    setHasFinished(true);

    const cleaned = input
      .replace(/hey mora/gi, '')
      .replace(/all finished/gi, '')
      .trim();

    if (!cleaned) return;

    const result = await analyzeSpeechInput(cleaned);

    if (!result) {
      speakWithMora(
        "Hmm, I didn’t catch that. Try again or type it in.",
        () => setIsMoraSpeaking(true),
        () => {
          setIsMoraSpeaking(false);
          setHasFinished(false); // Allow retry
          setTimeout(() => {
            window.resumeVoiceInput?.();
          }, 600);
        }
      );
      return;
    }

    setTargetRegion(result.region);
    setBrandTone(result.tone);
    setStyleNotes(result.styleNotes);

    speakWithMora(
      result.moraReply,
      () => setIsMoraSpeaking(true),
      () => {
        setIsMoraSpeaking(false);
        setStep(2);
      }
    );
  }

  return (
    <div className="priming-wrapper">
      <div className="priming-card">
        {step === 0 && (
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
              {industryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button onClick={() => {
              setUserName(name);
              setIndustryKey(industry);
              setStep(1);
            }}>
              Next →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2>Define Your Vision</h2>
            <p>Say <strong>“Hey MORA”</strong> to begin. Then explain your vision and say <strong>“All finished”</strong> when done.</p>

            <div className="speaker-stack-wrapper">
              <div className="speaker-stack">
                <img src={moraIcon} alt="MORA" className={`mora-icon ${isMoraSpeaking ? 'speaking' : ''}`} />
                <img src={userIcon} alt="You" className={`user-icon ${isUserListening ? 'listening' : ''}`} />
              </div>
            </div>

            <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
              Sample: <strong>"United States, sleek, techy, futuristic design"</strong>
            </p>

            <VoiceInput
              onCommand={handleSpokenInput}
              onListeningStart={() => setIsUserListening(true)}
              onListeningEnd={() => setIsUserListening(false)}
              onHeyMora={() => {
                if (heyMoraTriggeredRef.current) return; // ⛔ debounce
                heyMoraTriggeredRef.current = true;

                setHasFinished(false);
                speakWithMora(
                 `Hey ${name}! I’m MORA — your personal assistant for building an incredible ${industry} store. — I’ve helped lots of founders craft powerful, profitable brands, — and I can’t wait to do the same for you! — Just tell me your vision — anything you’re imagining about your audience, style, or vibe — and when you're all set — just say "All finished." — Let's make something amazing together!`,
                  () => setIsMoraSpeaking(true),
                  () => {
                    setIsMoraSpeaking(false);
                    setTimeout(() => {
                      heyMoraTriggeredRef.current = false; // 🔁 Reset trigger
                      window.resumeVoiceInput?.();
                    }, 600);
                  }
                );
              }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2>🎉 All Set!</h2>
            <p>MORA is now ready to begin your journey.</p>
            <button onClick={() => console.log(usePrimingStore.getState())}>
              🔍 View Primed Data
            </button>
          </>
        )}
      </div>
    </div>
  );
}
