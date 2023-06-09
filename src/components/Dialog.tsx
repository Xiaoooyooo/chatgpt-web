import { useEffect, useRef } from "react";
import classNames from "classnames";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { Message } from "@/database";

// class Renderer extends marked.Renderer {}

marked.use(
  markedHighlight({
    highlight: (code, language) => {
      language = hljs.getLanguage(language) ? language : "plaintext";
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    },
    langPrefix: "hljs language-",
  })
);

marked.setOptions({
  // renderer: new Renderer(),
  mangle: false,
  headerIds: false,
});

export default function Dialog(
  props: Pick<Message, "content" | "role" | "createdAt"> & { pending?: true }
) {
  const { content, role, createdAt, pending } = props;
  const markedElRef = useRef<HTMLDivElement>(null);
  const html = marked.parse(content);
  useEffect(() => {
    if (!pending) {
      const codeEls = markedElRef.current!.querySelectorAll("pre:has(.hljs)");
      codeEls.forEach((el) => {
        appendActionNodes(el);
      });
      markedElRef.current!.addEventListener("click", onClickAction);
    }
  }, [pending]);
  return (
    <div className="p-4 flex">
      <div
        className={classNames(
          "basis-auto max-w-[50%]",
          role === "user" ? "ml-auto text-right" : "mr-auto text-left"
        )}
      >
        <div className="text-xs">{new Date(createdAt).toLocaleString()}</div>
        <div dangerouslySetInnerHTML={{ __html: html }} ref={markedElRef}></div>
      </div>
    </div>
  );
}

function appendActionNodes(target: Element) {
  const actions = document.createElement("div");
  actions.classList.add(
    "code-action-wrapper",
    "h-0",
    "relative",
    "text-[--code-action-color]"
  );
  const button = document.createElement("button");
  button.classList.add(
    "copy-code",
    "absolute",
    "top-4",
    "right-2",
    "hover:text-[--code-action-hover-color]"
  );
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
  </svg>`;
  button.setAttribute("data-code", target.textContent as string);
  actions.appendChild(button);
  target.insertAdjacentElement("beforebegin", actions);
}

const copyMap = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
function onClickAction(e: MouseEvent) {
  let target: HTMLElement | null = e.target as HTMLElement;
  while (target) {
    if (target.matches(".copy-code")) {
      try {
        __DEV__ && console.log(target.getAttribute("data-code"));
        navigator.clipboard.writeText(
          target.getAttribute("data-code") as string
        );
        target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>`;
        if (copyMap.has(target)) {
          clearTimeout(copyMap.get(target));
        }
        const timeout = setTimeout(
          (target) => {
            target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>`;
            copyMap.delete(target);
          },
          2000,
          target
        );
        copyMap.set(target, timeout);
      } catch (err) {
        console.log(err);
      }
      return;
    }
    target = target.parentElement;
  }
}
