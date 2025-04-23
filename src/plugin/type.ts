// 플러그인 액션 타입
export type PluginAction =
  | "selectionChange"
  | "unselectionChange"
  | "translate";

// 플러그인 메시지 타입
export type PluginMessagePayload = {
  type: PluginAction;
  text: string;
};
