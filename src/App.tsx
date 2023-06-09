import { useLayoutEffect, useState, useReducer, Reducer } from "react";
import { RouterProvider } from "react-router-dom";
import themeContext, { Theme } from "@/contexts/theme";
import settingContext, {
  SettingState,
  SettingReducerAction,
} from "@/contexts/setting";
import databaseContext from "@/contexts/database";
import db from "@/database";
import MenuProvider from "./components/Menu";
import router from "@/router";
import "@/assets/css/highlight.css";

const settingReducer: Reducer<SettingState, SettingReducerAction> =
  function settingReducer(state, action) {
    switch (action.type) {
      case "modify-apikey": {
        state = { ...state, openaiApiKey: action.payload };
        break;
      }
    }
    localStorage.setItem("settings", JSON.stringify(state));
    return state;
  };
const defaultSetting: SettingState = {
  openaiApiKey: "",
  openaiModel: "gpt-3.5-turbo",
};
export default function App() {
  const [theme, changeTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme | null) || "auto"
  );
  const [settings, settingDispatch] = useReducer(
    settingReducer,
    defaultSetting,
    function (state) {
      const storage = localStorage.getItem("settings");
      if (storage) {
        return JSON.parse(storage) as SettingState;
      }
      return state;
    }
  );
  useLayoutEffect(() => {
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
    return () => {
      document.body.classList.remove(`theme-${theme}`);
    };
  }, [theme]);
  return (
    <databaseContext.Provider value={db}>
      <themeContext.Provider value={{ theme, changeTheme }}>
        <settingContext.Provider
          value={{ settings, dispatch: settingDispatch }}
        >
          <MenuProvider>
            <RouterProvider router={router} />
          </MenuProvider>
        </settingContext.Provider>
      </themeContext.Provider>
    </databaseContext.Provider>
  );
}
