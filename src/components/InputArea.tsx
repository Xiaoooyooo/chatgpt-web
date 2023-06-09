import { KeyboardEventHandler, memo, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import SendIcon from "@/assets/svg/send.svg";

type InputAreaProps = {
  className: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
  pending: boolean;
};

function InputArea(props: InputAreaProps) {
  const { className, onSubmit, placeholder, pending } = props;
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleKeyDown: KeyboardEventHandler = function handleKeyDown(e) {
    const { key, shiftKey } = e;
    if (!shiftKey && key === "Enter" && !pending) {
      e.preventDefault();
      if (!input) return;
      handleSubmit();
    }
  };
  function handleSubmit() {
    if (pending) return;
    onSubmit(input);
    setInput("");
  }
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  return (
    <div className={classNames(className, "flex")}>
      <div className="flex-auto min-w-0 leading-tight grid grid-cols-1 grid-rows-1">
        <div className="col-span-full row-span-full p-2 whitespace-break-spaces break-all max-h-80 overflow-auto">
          {input}&nbsp;
        </div>
        <textarea
          placeholder={placeholder}
          className="col-span-full row-span-full grid resize-none bg-[--input-background-color] rounded outline-none p-2 outline-2 outline-offset-0 focus:outline-[--input-outline-color] transition-[outline] duration-200"
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
        ></textarea>
      </div>
      <button
        className="flex-none p-4 flex items-center justify-center gap-x-1"
        onClick={handleSubmit}
      >
        <SendIcon />
        Send
      </button>
    </div>
  );
}

export default memo(InputArea);
