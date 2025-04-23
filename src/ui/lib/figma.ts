import { PluginMessagePayload } from "../../plugin/type";

export const requestToPlugin = <T>(payload: T) => {
  parent.postMessage({ pluginMessage: payload }, "*");
};

export const requestTranslateToPlugin = (text: string) => {
  requestToPlugin<PluginMessagePayload>({
    type: "translate",
    text,
  } as PluginMessagePayload);
};
