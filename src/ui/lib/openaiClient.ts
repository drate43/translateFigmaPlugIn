import { OpenAI } from 'openai';
import { TranslateFunction, TranslationProvider } from '../../shared';

// OpenAI 번역 프로바이더
export const createOpenAIProvider = (): TranslationProvider => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // 브라우저에서 실행 허용
  });

  const translate: TranslateFunction = async (text, targetLanguage) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a translation bot. Translate the given text into ${targetLanguage}.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      });

      return response.choices[0]?.message?.content || 'Translation failed';
    } catch (error) {
      console.error('Translation error:', error);
      return 'Translation failed';
    }
  };

  return { translate };
};
