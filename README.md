# translateFigmaPlugIn

Figma에서 선택한 텍스트를 한/일 번역하는 Figma 플러그인입니다. React, TypeScript, Webpack 기반으로 개발되었으며, OpenAI 및 외부 API를 번역 엔진으로 사용합니다.

https://github.com/hseoy/figma-plugin-react-boilerplate 기반으로 개발되었습니다.

# Figma 번역 플러그인 구조 분석

이 글에서는 `translateFigmaPlugIn` 프로젝트의 전체 구조와 핵심 동작 방식을 집중적으로 살펴봅니다.

---

## 1. Window Message로 작동하는 Figma 플러그인

1. **UI 표시**
   ```ts
   figma.showUI(__html__, { width: 240, height: 260, themeColors: true });
   ```
2. **선택 텍스트 감지 → UI 전송**
   ```ts
   figma.on('selectionchange', () => sendSelectedTextToUI());
   async function sendSelectedTextToUI() {
     // TextNode만 필터링
     // 폰트 로드 후
     // figma.ui.postMessage({ type: 'selectionChange', text });
   }
   ```
3. **UI → 플러그인 메시지 수신**
   ```ts
   figma.ui.onmessage = async (msg) => {
     if (!msg.text) return;
     translateText(msg.text);
   };
   ```
4. **텍스트 번역 결과 반영**
   ```ts
   async function translateText(translatedText: string) {
     // 선택된 TextNode.characters를 translatedText로 업데이트
     figma.notify('번역이 완료되었습니다.');
   }
   ```

이처럼 `figma.ui.postMessage`와 `figma.ui.onmessage`를 통해 UI(React)와 플러그인(main thread)가 메시지를 주고받아 동작합니다.

---

## 2. 폴더 구조

```
translateFigmaPlugIn/
├─ manifest.json
├─ package.json
├─ tsconfig.json
├─ webpack.config.js
├─ webpack-configs/
├─ src/
│  ├─ plugin/
│  │   ├─ index.ts      # Figma API 상호작용 및 메시징
│  │   └─ type.ts       # UI↔플러그인 메시지 타입 정의
│  ├─ shared/
│  │   ├─ type.ts       # ProviderType, TranslateFunction 등 타입 정의
│  │   └─ index.ts      # provider 팩토리 함수
│  └─ ui/
│      ├─ index.html    # React 빌드 결과 삽입
│      ├─ index.tsx     # React 진입점
│      ├─ App.tsx       # UI 컴포넌트
│      ├─ hooks/
│      │   └─ useTranslate.ts  # 커스텀 훅
│      └─ lib/
│          ├─ apiClient.ts     # API 서버 provider
│          └─ openaiClient.ts  # OpenAI provider
├─ dist/                   # 빌드 산출물
└─ node_modules/
```

---

## 3. 빌드 방법

1. **의존성 설치**
   ```bash
   yarn install
   ```
2. **프로덕션 빌드**
   ```bash
   yarn run build
   ```
3. **결과 확인**
   - `dist/` 폴더에 `plugin.js`, `ui.html` 생성
   - Figma 플러그인으로 로드하여 동작 확인

> **참고**: `OPENAI_API_KEY`는 `.env`에 설정 필요

---

## 4. 함수형 Provider 패턴

클래스 상속 없이 **함수형 팩토리**를 통해 provider를 분기·주입합니다.

1. **타입 정의** (`src/shared/type.ts`)
   ```ts
   export type ProviderType = 'openAI' | 'api';
   export type TranslateFunction = (text: string, targetLanguage: string) => Promise<string>;
   export type TranslationProvider = { translate: TranslateFunction };
   ```
2. **팩토리 함수** (`src/shared/index.ts`)
   ```ts
   export const getTranslationProvider = (provider: ProviderType): TranslationProvider => {
     switch(provider) {
       case 'openAI': return createOpenAIProvider();
       case 'api':    return createAPIProvider();
       default:       return createOpenAIProvider();
     }
   };
   ```
3. **구현체 (함수형)**
   - `createOpenAIProvider()`
   - `createAPIProvider()`
   둘 다 내부에 `translate` 함수를 정의하고 `{ translate }` 객체를 반환합니다.

4. **훅에서 사용** (`useTranslate.ts`)
   ```ts
   const translate = async (text, lang) => {
     const provider = getTranslationProvider(selectedProvider);
     return await provider.translate(text, lang);
   }
   ```
   
5. Figma에서 플러그인 등록
   - Figma Desktop 앱 → 우측 상단 프로필 → Plugins → In development → + 버튼
   - manifest.json 선택해 등록


---

## 번역 기능 개요

- 선택한 텍스트를 UI에서 한글/일본어/영어로 번역 요청
- 번역 provider(OpenAI, 외부 API) 중 선택 가능(설정/코드에서)
- 유연하게 provider를 통하여 다른 API 쉽게 적용 가능
