import { createAPIProvider } from "../ui/lib/apiClient";
import { createOpenAIProvider } from "../ui/lib/openaiClient";
import { ProviderType, TranslationProvider } from "./type";

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
