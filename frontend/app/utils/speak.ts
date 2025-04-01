let voicesLoaded = false;

export const speak = (text: string, lang = "de-DE") => {
  if (typeof window === "undefined" || typeof speechSynthesis === "undefined") {
    alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
    return;
  }

  const loadAndSpeak = () => {
    const voices = speechSynthesis.getVoices();
    const userAgent = navigator.userAgent;

    // 디바이스 종류 확인
    const isAppleDevice = /iPhone|iPad|Macintosh/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isWindows = /Windows/i.test(userAgent);

    // 플랫폼별 우선 음성 목록
    const preferredVoices = {
      apple: ["Anna", "Markus", "Petra"],
      android: ["Google Deutsch", "de-DE"],
      windows: ["Microsoft Hedda Desktop"],
      default: ["Google Deutsch", "Microsoft Hedda"]
    };

    // 현재 디바이스에 맞는 음성 후보 선택
    const voiceCandidates = isAppleDevice ? preferredVoices.apple :
                              isAndroid ? preferredVoices.android :
                              isWindows ? preferredVoices.windows :
                              preferredVoices.default;

    const germanVoice = voices.find(voice =>
      voice.lang === lang &&
      voiceCandidates.some(name => voice.name.includes(name))
    );

    // 음성이 없을 경우 플랫폼별 안내 메시지
    if (!germanVoice) {
      const platformMessages = {
        apple: `이 디바이스에 독일어 음성이 없습니다.\n\n설정 > 손쉬운 사용 > 음성 콘텐츠 > 받아쓰기 > 음성 > 독일어(German)\n에서 'Anna', 'Markus' 등을 다운로드해 주세요.`,
        android: `안드로이드에서 독일어 음성을 활성화해주세요.\n\n1. 설정 > 시스템 > 언어 및 입력 > 텍스트 음성 변환 출력\n2. 기본 엔진으로 'Google TTS' 선택\n3. 언어 팩에서 독일어 다운로드`,
        windows: `Windows에서 독일어 음성을 설치해주세요.\n\n설정 > 시간 및 언어 > 언어 > 독일어 추가 > 음성 관리`,
        default: "기기에서 사용 가능한 독일어 음성이 없습니다.\n시스템 설정에서 언어 팩을 설치해주세요."
      };

      const message = isAppleDevice ? platformMessages.apple :
                     isAndroid ? platformMessages.android :
                     isWindows ? platformMessages.windows :
                     platformMessages.default;

      alert(message);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.voice = germanVoice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  // iOS/Android에서 음성 목록 비동기 로딩 대응
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