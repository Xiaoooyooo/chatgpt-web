import { createContext } from "react";

export type Theme = "light" | "dark" | "auto";
type ChangeThemeHandler = (theme: Theme) => void;
type ThemeContext = {
  theme: Theme;
  changeTheme: ChangeThemeHandler;
}
const themeContext = createContext<ThemeContext>({} as ThemeContext);

export default themeContext;
