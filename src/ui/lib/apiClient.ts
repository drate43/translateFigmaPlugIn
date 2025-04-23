import { TranslateFunction, TranslationProvider } from "../../shared/type";

// api 서버를 이용하는 번역 프로바이더
export const createAPIProvider = (): TranslationProvider => {
  const translate: TranslateFunction = async (text, targetLanguage) => {
    try {
      // 여기에 API 호출 로직 구현
      console.log(`번역 결과 ${targetLanguage}: ${text}`);
      return `Translation succeeded: ${text}`;
    } catch (error) {
      console.error("번역 실패:", error);
      return "Translation failed";
    }
  };

  return { translate };
};
