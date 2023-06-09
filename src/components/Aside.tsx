import classNames from "classnames";
import { MouseEventHandler, useCallback, useRef, useState } from "react";

type AsideProps = {
  className?: string;
  children: JSX.Element;
};

export default function Aside(props: AsideProps) {
  const { className, children } = props;
  const [width, setWidth] = useState(250);
  const clientXRef = useRef<number>();
  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    function handleMouseDown(e) {
      clientXRef.current = e.clientX;
      document.body.style.userSelect = "none";
      function onMouseMove(e: MouseEvent) {
        const dx = e.clientX - (clientXRef.current as number);
        clientXRef.current = e.clientX;
        setWidth((w) => w + dx);
      }
      function onMouseUp(e: MouseEvent) {
        window.removeEventListener("mousemove", onMouseMove);
        document.body.style.userSelect = "auto";
        __DEV__ && console.log("done");
      }
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp, { once: true });
    },
    []
  );
  return (
    <div
      className={classNames(className, "bg-[--aside-background-color] relative")}
      style={{ width }}
    >
      {children}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
}
