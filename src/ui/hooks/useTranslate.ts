import { useState } from "react";
import { getTranslationProvider } from "../../shared";
import { ProviderType, TranslateLanguageType } from "../../shared/type";

type TranslateProps = {
  provider: ProviderType;
};

export const useTranslation = ({ provider }: TranslateProps) => {
  const [translatedText, setTranslatedText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const translate = async (
    text: string,
    targetLanguage: TranslateLanguageType
  ) => {
    setLoading(true);
    const translationProvider = getTranslationProvider(provider);
    const result = await translationProvider.translate(text, targetLanguage);
    setTranslatedText(result);
    setLoading(false);
    return result;
  };

  return { translatedText, translate, loading };
};
