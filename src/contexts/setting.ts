import { Dispatch, createContext } from "react";

export type SettingState = {
  openaiApiKey: string;
  openaiModel: string;
};
type ModifyKeyAction = {
  type: "modify-apikey";
  payload: string;
};
export type SettingReducerAction = ModifyKeyAction;
export type SettingContext = {
  settings: SettingState;
  dispatch: Dispatch<SettingReducerAction>;
}

const settingContext = createContext<SettingContext>({} as SettingContext);

export default settingContext;
