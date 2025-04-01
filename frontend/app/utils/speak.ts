/**
 * 플랫폼별 TTS 통합 시스템 (SSR 호환 버전)
 * - Apple (iOS/macOS), Android, Windows 완벽 지원
 * - 독일어 음성 최적화
 * - 서버 사이드 렌더링(SSR) 완벽 지원
 * - 강력한 오류 처리 및 디버깅 기능
 */

type TTSPlatform = 'apple' | 'android' | 'windows' | 'other';

interface IVoiceDebugInfo {
  name: string;
  lang: string;
  default: boolean;
  voiceURI: string;
}

interface IDebugInfo {
  platform: TTSPlatform | 'server';
  userAgent: string | null;
  isSecureContext: boolean | null;
  voices: IVoiceDebugInfo[];
  selectedVoice?: IVoiceDebugInfo;
  error?: any;
}

class TextToSpeech {
  private static instance: TextToSpeech | null = null;
  private voicesLoaded = false;
  private isSpeaking = false;
  private pendingQueue: string[] = [];
  private debugInfo: IDebugInfo;
  private retryCount = 0;
  private readonly MAX_RETRY = 3;

  private readonly PREFERRED_VOICES = {
    apple: ['Anna', 'Markus', 'Petra', 'Yannick'],
    android: ['Google Deutsch', 'de-DE', 'German'],
    windows: ['Microsoft Hedda Desktop', 'Microsoft Katja Desktop', 'David Desktop', 'Hedda'],
    other: ['Google Deutsch', 'Microsoft Hedda', 'de-DE', 'German Female']
  };

  private constructor() {
    this.debugInfo = this.initializeDebugInfo();
  }

  private initializeDebugInfo(): IDebugInfo {
    // SSR 환경 감지
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        platform: 'server',
        userAgent: null,
        isSecureContext: null,
        voices: []
      };
    }

    return {
      platform: this.detectPlatform(),
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      voices: []
    };
  }

  private detectPlatform(): TTSPlatform {
    if (!navigator) return 'other';
    
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod|Macintosh/i.test(ua)) return 'apple';
    if (/Android/i.test(ua)) return 'android';
    if (/Windows/i.test(ua)) return 'windows';
    return 'other';
  }

  public static getInstance(): TextToSpeech | null {
    // 클라이언트 사이드에서만 인스턴스 생성
    if (typeof window === 'undefined' || typeof speechSynthesis === 'undefined') {
      return null;
    }

    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech();
    }
    return TextToSpeech.instance;
  }

  private logDebugInfo(message: string, data?: Partial<IDebugInfo>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[TTS 디버그] ${message}`, data);
    }
    this.debugInfo = { ...this.debugInfo, ...data };
  }

  private async initializeVoices(): Promise<void> {
    if (typeof speechSynthesis === 'undefined') {
      throw new Error('SpeechSynthesis API not available');
    }

    if (this.voicesLoaded) return;

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
      this.logDebugInfo('음성 초기화 완료', { voices: this.mapVoices(voices) });
      return;
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        speechSynthesis.onvoiceschanged = null;
        this.voicesLoaded = true;
        resolve();
      }, 3000);

      speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timeoutId);
        this.voicesLoaded = true;
        speechSynthesis.onvoiceschanged = null;
        resolve();
      };
    });
  }

  private mapVoices(voices: SpeechSynthesisVoice[]): IVoiceDebugInfo[] {
    return voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      voiceURI: voice.voiceURI
    }));
  }

  private selectVoice(lang: string): SpeechSynthesisVoice | null {
    if (typeof speechSynthesis === 'undefined') return null;

    const voices = speechSynthesis.getVoices();
    this.debugInfo.voices = this.mapVoices(voices);

    const targetLang = lang.toLowerCase();
    const platform = this.debugInfo.platform;
    const preferredVoices = this.PREFERRED_VOICES[platform];

    this.logDebugInfo('플랫폼별 우선 음성', {
      platform,
      preferredVoices,
      targetLang
    });

    // 음성 선택 로직 (이전과 동일)
    let voice = voices.find(v => v.lang.toLowerCase() === targetLang && 
                               preferredVoices.some(name => v.name.includes(name)));

    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().includes('de') && 
                             preferredVoices.some(name => v.name.includes(name)));
    }

    if (!voice) {
      voice = voices.find(v => preferredVoices.some(name => v.name.includes(name)));
    }

    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase() === targetLang);
    }

    if (!voice) {
      voice = voices.find(v => v.lang.toLowerCase().includes('de'));
    }

    if (voice) {
      this.logDebugInfo('선택된 음성', {
        selectedVoice: {
          name: voice.name,
          lang: voice.lang,
          default: voice.default,
          voiceURI: voice.voiceURI
        }
      });
    } else {
      this.logDebugInfo('적합한 음성을 찾지 못함');
    }

    return voice || null;
  }

  private async speakInternal(text: string, lang: string): Promise<void> {
    if (this.isSpeaking) {
      this.pendingQueue.push(text);
      this.logDebugInfo('현재 재생 중. 대기열에 추가', { queueLength: this.pendingQueue.length });
      return;
    }

    try {
      await this.initializeVoices();

      if (!window.isSecureContext) {
        throw new Error('TTS 기능은 HTTPS 환경에서만 사용 가능합니다.');
      }

      const voice = this.selectVoice(lang);
      if (!voice) {
        throw new Error(this.getPlatformSpecificGuide());
      }

      this.isSpeaking = true;
      this.retryCount = 0;

      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = lang;

        utterance.onstart = () => {
          this.logDebugInfo('음성 출력 시작');
        };

        utterance.onend = () => {
          this.logDebugInfo('음성 출력 완료');
          this.isSpeaking = false;
          this.processNextInQueue();
          resolve();
        };

        utterance.onerror = (event) => {
          this.logDebugInfo('음성 출력 오류', { error: event.error });
          this.isSpeaking = false;

          if (event.error === 'interrupted' && this.retryCount < this.MAX_RETRY) {
            this.retryCount++;
            setTimeout(() => this.speakInternal(text, lang), 300 * this.retryCount);
            return;
          }

          reject(event.error);
          this.processNextInQueue();
        };

        speechSynthesis.speak(utterance);
      });
    } catch (error) {
      this.logDebugInfo('TTS 실행 중 오류 발생', { error });
      throw error;
    }
  }

  private processNextInQueue() {
    if (this.pendingQueue.length > 0) {
      const nextText = this.pendingQueue.shift();
      if (nextText) {
        setTimeout(() => this.speak(nextText), 100);
      }
    }
  }

  private getPlatformSpecificGuide(): string {
    const guides = {
      apple: `
        Apple 기기에서 독일어 음성 설정 방법:
        1. 설정 > 손쉬운 사용 > 음성 콘텐츠 이동
        2. '독일어' 음성 다운로드
        3. 지원되는 음성: Anna, Markus, Petra
        4. 기기 재시작 후 다시 시도
      `,
      android: `
        Android 기기에서 독일어 음성 설정 방법:
        1. 설정 > 시스템 > 언어 및 입력 > 텍스트 음성 변환
        2. Google TTS 또는 Samsung TTS 선택
        3. '독일어' 언어 팩 설치
        4. 기본 엔진으로 설정 후 앱 재시작
      `,
      windows: `
        Windows에서 독일어 음성 설정 방법:
        1. 설정 > 시간 및 언어 > 언어 > 독일어 추가
        2. 옵션 > 음성 팩 설치
        3. 지원되는 음성: Microsoft Hedda, Microsoft Katja
        4. 제어판 > 음성 인식 > 텍스트 음성 변환 설정 확인
        5. PC 재시작 후 브라우저 재실행
      `,
      other: `
        시스템에서 독일어 음성 설정이 필요합니다:
        1. 시스템 설정에서 독일어 언어 팩 설치
        2. 텍스트 음성 변환(TTS) 엔진 확인
        3. 브라우저를 최신 버전으로 업데이트
        4. HTTPS 연결에서만 작동함을 유의
      `
    };

    return guides[this.debugInfo.platform];
  }

  public async speak(text: string, lang = 'de-DE'): Promise<void> {
    try {
      if (!text) {
        throw new Error('텍스트 입력이 필요합니다.');
      }

      this.logDebugInfo('TTS 호출 시작', { text, lang });

      if (typeof speechSynthesis === 'undefined') {
        throw new Error('이 브라우저는 음성 합성을 지원하지 않습니다.');
      }

      return await this.speakInternal(text, lang);
    } catch (error) {
      this.logDebugInfo('TTS 실행 실패', { error });
      throw error;
    }
  }

  public stop(): void {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.pendingQueue = [];
    this.logDebugInfo('TTS 강제 중지');
  }

  public getDebugInfo(): IDebugInfo {
    return this.debugInfo;
  }
}

// 클라이언트 사이드에서만 인스턴스 생성
const ttsInstance = typeof window !== 'undefined' ? TextToSpeech.getInstance() : null;

export const speak = (text: string, lang = 'de-DE') => {
  return ttsInstance?.speak(text, lang) || Promise.resolve();
};

export const stopSpeaking = () => {
  ttsInstance?.stop();
};

export const getTTSDebugInfo = (): IDebugInfo => {
  return ttsInstance?.getDebugInfo() || {
    platform: 'server',
    userAgent: null,
    isSecureContext: null,
    voices: []
  };
};