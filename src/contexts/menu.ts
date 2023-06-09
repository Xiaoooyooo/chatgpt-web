import { MouseEvent, createContext } from "react";

type NormalMenuItemType = {
  type?: undefined;
  title: string;
  onClick: () => void;
}

type MenuSeparator = {
  type: "separator";
};

export type MenuItemType = NormalMenuItemType | MenuSeparator;

type MenuContext = {
  showMenu(menus: MenuItemType[], e: MouseEvent): void;
}

// @ts-ignore
const menuContext = createContext<MenuContext>();

export default menuContext;
