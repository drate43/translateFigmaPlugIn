import { createAPIProvider } from "../ui/lib/apiClient";
import { createOpenAIProvider } from "../ui/lib/openaiClient";

export type PluginAction =
  | "selectionChange"
  | "unselectionChange"
  | "translate";

export type PluginMessagePayload = {
  type: PluginAction;
  text: string;
};

export type ProviderType = "openAI" | "api";
export type TranslateLanguageType = "korean" | "japanese";

// 번역 프로바이더 타입 정의
export type TranslateFunction = (
  text: string,
  targetLanguage: TranslateLanguageType
) => Promise<string>;

// 번역 프로바이더 타입
export type TranslationProvider = {
  translate: TranslateFunction;
};

// 번역 프로바이더 팩토리 함수
export const getTranslationProvider = (
  provider: ProviderType
): TranslationProvider => {
  switch (provider) {
    case "openAI":
      return createOpenAIProvider();
    case "api":
      return createAPIProvider();
    default:
      return createOpenAIProvider(); // 기본값
  }
};
