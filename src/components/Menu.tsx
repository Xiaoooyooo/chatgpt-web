import {
  useState,
  PropsWithChildren,
  useEffect,
  useCallback,
  useMemo,
  MouseEvent,
  forwardRef,
  useRef,
  useLayoutEffect,
} from "react";
import menuContext, { MenuItemType } from "@/contexts/menu";
import { createPortal } from "react-dom";

function MenuProvider({ children }: PropsWithChildren) {
  const [menus, setMenus] = useState<MenuItemType[]>();
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const menuDomRef = useRef<HTMLDivElement>(null);
  const handleShowMenu = useCallback((menus: MenuItemType[], e: MouseEvent) => {
    const { top, left, bottom, right } = (
      e.target as HTMLElement
    ).getBoundingClientRect();
    setPosition({ top, left, bottom, right });
    setMenus(menus);
    e.stopPropagation();
  }, []);
  useLayoutEffect(() => {
    if (!menus) return;
    const { left, right } = position;
    const dom = menuDomRef.current!;
    // include boxshadow
    if (left + dom.clientWidth + 10 > window.innerWidth) {
      setPosition((p) => ({
        ...p,
        left: left - dom.clientWidth + (right - left),
      }));
    }
  }, [menus]);
  useEffect(() => {
    document.addEventListener("click", function () {
      setMenus(undefined);
    });
  }, []);
  return (
    <menuContext.Provider value={{ showMenu: handleShowMenu }}>
      {children}
      {menus && <Menu menus={menus} position={position} ref={menuDomRef} />}
    </menuContext.Provider>
  );
}

type MenuProps = {
  menus: MenuItemType[];
  position: { top: number; left: number; bottom: number; right: number };
};
const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(props, ref) {
  const { menus, position } = props;
  const content = useMemo(() => {
    return (
      <div
        className="text-sm absolute z-50 py-1 rounded shadow-light bg-[--menu-background-color] min-w-[150px]"
        style={{ left: position.left, top: position.bottom }}
        ref={ref}
      >
        {menus.map((menu, i) => (
          <MenuItem menu={menu} key={i} />
        ))}
      </div>
    );
  }, [menus]);
  return createPortal(content, document.body);
});

type MenuItemProps = {
  menu: MenuItemType;
};
function MenuItem(props: MenuItemProps) {
  const { menu } = props;
  if (menu.type === "separator") {
    return (
      <div className="h-px bg-[--menu-separator-background-color] my-1"></div>
    );
  }
  return (
    <div
      className="py-1 px-2 cursor-pointer bg-transparent hover:bg-[--menu-item-hover-background-color] transition-colors duration-150"
      onClick={menu.onClick}
    >
      {menu.title}
    </div>
  );
}

export default MenuProvider;
