import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";

import { requestTranslateToPlugin } from "./lib/figma";
import { useTranslation } from "./hooks/useTranslate";
import { PluginMessagePayload } from "../plugin/type";
import { TranslateLanguageType } from "../shared/type";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const { translate } = useTranslation({
    provider: "openAI",
  });

  useEffect(() => {
    // 피그마에서 플러그인으로 보내는 메세지 수신
    window.onmessage = (event) => {
      const message = event.data.pluginMessage as PluginMessagePayload;
      if (message.type === "selectionChange") {
        setSelectedText(message.text);
      } else {
        setIsLoading(false);
        setSelectedText("");
      }
    };
  }, []);

  const handleTranslate = async (targetLanguage: TranslateLanguageType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await translate(selectedText, targetLanguage);
      requestTranslateToPlugin(result);
    } catch (error) {
      console.error("번역 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>피그마 번역기</h1>
      <div className={styles.buttonContainer}>
        <button
          type="button"
          className={styles.button}
          onClick={() => handleTranslate("japanese")}
          disabled={isLoading || !selectedText}
        >
          {isLoading ? "번역 중..." : "일본어"}
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => handleTranslate("korean")}
          disabled={isLoading || !selectedText}
        >
          {isLoading ? "번역 중..." : "한국어"}
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => handleTranslate("english")}
          disabled={isLoading || !selectedText}
        >
          {isLoading ? "번역 중..." : "영어"}
        </button>
      </div>
      {selectedText && (
        <div className={styles.selectedText}>
          <div>선택된 텍스트</div>
          <div className={styles.selectedTextContent}>{selectedText}</div>
        </div>
      )}
    </div>
  );
}

export default App;
