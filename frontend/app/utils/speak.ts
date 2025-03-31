// app/utils/speak.ts
export const speak = (text: string, lang = "de-DE") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.cancel(); // 이전 발화 멈춤
    speechSynthesis.speak(utterance);
  };