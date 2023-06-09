import ThemeCtl from "./ThemeCtl";
import classNames from "classnames";

type HeaderProps = {
  className?: string;
};

export default function Header(props: HeaderProps) {
  const { className } = props;
  return (
    <header
      className={classNames(
        className,
        "h-16 bg-[--header-background-color] flex shadow-light relative z-50"
      )}
    >
      <ThemeCtl className="ml-auto h-16 w-16" />
    </header>
  );
}
