import { memo, useContext, useEffect, useState } from "react";
import MoonIcon from "@/assets/svg/moon.svg";
import SunIcon from "@/assets/svg/sun.svg";
import AutoIcon from "@/assets/svg/circle-half.svg";
import classNames from "classnames";
import themeContext from "@/contexts/theme";
import Transition from "./Transition";

type ThemeCtlProps = {
  className: string;
};

function ThemeCtl(props: ThemeCtlProps) {
  const { className } = props;
  const { theme, changeTheme } = useContext(themeContext);
  const [visible, changeVisible] = useState(false);
  useEffect(() => {
    changeVisible(false);
  }, [theme]);
  return (
    <>
      <div
        className={classNames(
          className,
          "cursor-pointer flex items-center justify-center"
        )}
        onClick={() => changeVisible((v) => !v)}
      >
        {theme === "light" && <SunIcon />}
        {theme === "dark" && <MoonIcon />}
        {theme === "auto" && <AutoIcon />}
      </div>
      <Transition
        visible={visible}
        beforeEnterClass="opacity-0"
        enterActiveClass="transition-opacity duration-300 ease opacity-100"
        beforeLeaveClass="opacity-100"
        leaveActiveClass="transition-opacity duration-300 ease opacity-0"
      >
        <ul className="absolute z-50 bg-[--background-color] top-16 right-0 w-16 shadow-xl cursor-pointer">
          <li
            className="py-4 hover:[--item-hover-background-color]"
            onClick={() => changeTheme("light")}
          >
            <SunIcon className="m-auto" height="16" width="16" />
          </li>
          <li
            className="py-4 hover:[--item-hover-background-color]"
            onClick={() => changeTheme("dark")}
          >
            <MoonIcon className="m-auto" height="16" width="16" />
          </li>
          <li
            className="py-4 hover:[--item-hover-background-color]"
            onClick={() => changeTheme("auto")}
          >
            <AutoIcon className="m-auto" height="16" width="16" />
          </li>
        </ul>
      </Transition>
    </>
  );
}

export default memo(ThemeCtl);
