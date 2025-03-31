let voicesLoaded = false;

export const speak = (text: string, lang = "de-DE") => {
  if (typeof window === "undefined" || typeof speechSynthesis === "undefined") {
    alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
    return;
  }

  const loadAndSpeak = () => {
    const voices = speechSynthesis.getVoices();

    // 디바이스가 애플인지 확인
    const isAppleDevice = /iPhone|iPad|Macintosh/.test(navigator.userAgent);

    // 음성 후보
    const preferredVoices = ["Anna", "Markus", "Petra"];

    const germanVoice = voices.find(
      (voice) =>
        voice.lang === lang &&
        preferredVoices.some((name) => voice.name.includes(name))
    );

    // 애플 디바이스에서 독일어 음성이 없을 때
    if (isAppleDevice && !germanVoice) {
      alert(
        `이 디바이스에 독일어 음성이 없습니다.\n\n설정 > 손쉬운 사용 > 음성 콘텐츠 > 받아쓰기 > 음성 > 독일어(German)\n에서 'Anna', 'Markus' 등의 음성을 다운로드해 주세요.`
      );
      return;
    }

    // 애플 디바이스가 아니고 독일어 음성도 없는 경우
    if (!isAppleDevice && !germanVoice) {
      alert(
        "기기에서 사용할 수 있는 독일어 음성이 없습니다.\n브라우저 또는 시스템 설정을 확인해주세요."
      );
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // iOS Safari에서는 getVoices()가 비어 있는 경우가 많음
  if (!voicesLoaded && speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true;
      loadAndSpeak();
    };
  } else {
    voicesLoaded = true;
    loadAndSpeak();
  }
};
