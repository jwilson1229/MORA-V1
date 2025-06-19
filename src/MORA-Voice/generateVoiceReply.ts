// app/voice/generateVoiceReply.ts
import { speakWithMora } from '../MORA-Voice/textToSpeech';

export async function speakMoraResponse(userName: string, industry: string) {
  const message = `Hi ${userName}, I’m MORA — your ${industry} partner. I’ve helped build stores in this space and now, I’m ready to help you. Together, we’ll scan demand, create a smart site, and fill it with winning products. You just tell me what kind of store you’re dreaming of… I’ll handle the rest. Ready to build something incredible?`;
  await speakWithMora(message);
}

export async function speakConfirmation(response: string) {
  await speakWithMora(response);
}
