// 번역 프로바이더 타입 정의
export type ProviderType = "openAI" | "api";

// 번역 언어 타입 정의
export type TranslateLanguageType = "korean" | "japanese" | "english";

// 번역 프로바이더 타입 함수 정의
export type TranslateFunction = (
  text: string,
  targetLanguage: TranslateLanguageType
) => Promise<string>;

// 번역 프로바이더 타입
export type TranslationProvider = {
  translate: TranslateFunction;
};
