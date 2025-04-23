import { PluginMessagePayload } from '../shared';

figma.showUI(__html__, {
  width: 240,
  height: 280,
  themeColors: true,
});

// 텍스트 노드에서 사용된 폰트를 추출하는 헬퍼 함수
const getFontsFromNode = (node: TextNode): FontName[] =>
  node.getRangeAllFontNames(0, node.characters.length);

// 폰트를 안전하게 로드하는 헬퍼 함수
const loadFontFromFigma = async (font: FontName): Promise<void> => {
  try {
    await figma.loadFontAsync(font);
  } catch (error) {
    console.error('폰트 로딩 실패:', font, error);
    figma.notify(`폰트 로딩 실패: ${font.family}`);
  }
};

// const figmaFontNames = [{ family: 'Pretendard', style: 'Bold' }];
// 선택된 텍스트 정보를 UI로 전송하는 함수
async function sendSelectedTextToUI() {
  const { selection } = figma.currentPage;
  const textNodes = selection.filter(
    (node): node is TextNode => node.type === 'TEXT',
  );

  if (textNodes.length > 0) {
    // 모든 텍스트 노드에 대해 폰트 로딩 Promise 생성
    const fontLoadingPromises = textNodes.flatMap((node) => {
      const fonts = getFontsFromNode(node);
      return fonts.map(loadFontFromFigma);
    });

    // 모든 폰트를 병렬로 로드
    await Promise.all(fontLoadingPromises);

    const texts = textNodes.map((node) => node.characters);
    figma.ui.postMessage({
      type: 'selectionChange',
      text: texts.join('\n'),
    } as PluginMessagePayload);
  } else {
    figma.ui.postMessage({
      type: 'unselectionChange',
      text: '',
    } as PluginMessagePayload);
  }
}

// 선택 변경 시 이벤트 처리
figma.on('selectionchange', () => {
  sendSelectedTextToUI();
});

const translateText = async (translatedText: string) => {
  const { selection } = figma.currentPage;

  // 선택된 텍스트 노드들 필터링
  const textNodes = selection.filter(
    (node): node is TextNode => node.type === 'TEXT',
  );

  if (textNodes.length === 0) {
    figma.notify('텍스트를 선택해주세요.');
    return;
  }

  try {
    // 폰트가 로드된 후 텍스트 업데이트
    textNodes.forEach((node) => {
      // 직접 속성을 수정하는 대신 복사본을 만들어 수정
      const updatedNode = node;
      updatedNode.characters = translatedText;
    });

    figma.notify('번역이 완료되었습니다.');
  } catch (error) {
    console.error('텍스트 업데이트 실패:', error);
    figma.notify('텍스트 업데이트에 실패했습니다.');
  }
};

// UI로부터 메시지 수신
figma.ui.onmessage = async (msg) => {
  if (msg.text === undefined) return;
  translateText(msg.text);
};
