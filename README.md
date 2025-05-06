# translateFigmaPlugIn

Figma에서 선택한 텍스트를 한/일 번역하는 Figma 플러그인입니다. React, TypeScript, Webpack 기반으로 개발되었으며, OpenAI 및 외부 API를 번역 엔진으로 사용합니다.

https://github.com/hseoy/figma-plugin-react-boilerplate 기반으로 개발되었습니다.

## 프로젝트 구조

```
translateFigmaPlugIn/
├── dist/                  # 빌드 결과물 (plugin.js, ui.html 등)
├── src/                   # 소스 코드
│   ├── plugin/            # Figma 플러그인 엔트리포인트 (index.ts)
│   ├── shared/            # 타입 및 번역 provider 팩토리 (index.ts)
│   └── ui/                # React 기반 UI 코드
│       ├── App.tsx        # 메인 UI 컴포넌트
│       ├── hooks/         # 커스텀 훅 (useTranslate 등)
│       ├── lib/           # 번역/피그마 API 클라이언트
│       └── ...            # 스타일, 테스트 등
├── manifest.json          # Figma 플러그인 메타데이터
├── package.json           # 프로젝트 메타/스크립트/의존성
├── tsconfig.json          # TypeScript 설정
├── webpack.config.js      # Webpack 설정
├── README.md              # 이 문서
└── 기타 설정/잠금 파일 등
```

## 주요 기능

- **Figma 텍스트 선택 → 번역 → 적용**: 선택한 텍스트를 한/일 번역 후, 결과를 다시 Figma에 반영
- **OpenAI/외부 API 번역 엔진 지원**: 플러그인 내부에서 번역 provider 선택 가능
- **React 기반 UI**: 직관적이고 반응형 UI 제공
- **테스트 및 타입 안정성**: Jest, TypeScript 적용

## 주요 파일/디렉터리 설명

- `src/plugin/index.ts`: 플러그인 진입점. Figma API와 통신, 텍스트 추출/적용, 폰트 로딩 등 처리
- `src/shared/index.ts`: 타입, 번역 provider 팩토리 등 공용 로직
- `src/ui/App.tsx`: 플러그인 UI 메인 컴포넌트. 번역 요청 및 결과 표시
- `src/ui/hooks/useTranslate.ts`: 번역 provider 추상화 훅
- `src/ui/lib/apiClient.ts`, `openaiClient.ts`: 각 번역 API 연동 클라이언트
- `manifest.json`: 플러그인 메타데이터 및 엔트리 설정

## 설치 및 실행 방법

1. 의존성 설치
   ```bash
   yarn install
   ```
2. 빌드
   ```bash
   yarn build
   ```
3. Figma에서 플러그인 등록
   - Figma Desktop 앱 → 우측 상단 프로필 → Plugins → In development → + 버튼
   - manifest.json 선택해 등록

## 번역 기능 개요

- 선택한 텍스트를 UI에서 한글/일본어/영어로 번역 요청
- 번역 provider(OpenAI, 외부 API) 중 선택 가능(설정/코드에서)
