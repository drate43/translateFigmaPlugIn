import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock openAiClient
jest.mock('./lib/openaiClient', () => ({
  getTranslateText: jest.fn().mockResolvedValue('번역된 텍스트'),
}));

// Mock useTranslation hook
jest.mock('./hooks/useTranslate', () => ({
  useTranslation: () => ({
    translate: jest.fn().mockResolvedValue('일본어 번역'),
  }),
}));

describe('App 컴포넌트 렌더링 테스트', () => {
  it("'피그마 번역기' 타이틀을 렌더링해야 합니다.", () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '피그마 번역기',
    );
  });
});
