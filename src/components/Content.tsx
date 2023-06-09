import classNames from "classnames";

type ContentProps = {
  className?: string;
};

export default function Content(props: ContentProps) {
  const { className } = props;
  return <div className={classNames(className)}>Content</div>;
}
