import classNames from "classnames";
import {
  MouseEvent,
  memo,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Link, useParams } from "react-router-dom";
import { Conversation } from "@/database";
import menuContext from "@/contexts/menu";
import MoreIcon from "@/assets/svg/more.svg";
import CheckIcon from "@/assets/svg/check.svg";
import CancelIcon from "@/assets/svg/cancel.svg";

type ConversationsProps = {
  className: string;
  conversations: Conversation[];
  onDeleteConversation: (conversation: Conversation) => void;
  onRenameConversation: (id: string, name: string) => Promise<void>;
};

function Conversations(props: ConversationsProps) {
  const {
    className,
    conversations,
    onDeleteConversation: handleDeleteConversation,
    onRenameConversation: handleRenameConversation,
  } = props;
  const params = useParams();
  const { showMenu } = useContext(menuContext);
  const [renameRecord, setRenameRecord] = useState<{
    id: string | undefined;
    name: string | undefined;
  }>({ name: undefined, id: undefined });
  const renameInputRef = useRef<HTMLInputElement>(null);
  function handleShowMenu(conversation: Conversation, e: MouseEvent) {
    showMenu(
      [
        {
          title: "Rename",
          onClick: function () {
            __DEV__ && console.log("Rename", conversation);
            setRenameRecord({ id: conversation.id, name: conversation.title });
          },
        },
        { type: "separator" },
        {
          title: "Delete",
          onClick: function () {
            __DEV__ && console.log("delete", conversation);
            handleDeleteConversation(conversation);
          },
        },
      ],
      e
    );
  }
  useEffect(() => {
    if (renameRecord.id) {
      renameInputRef.current!.focus();
    }
  }, [renameRecord.id]);
  return (
    <ul className={classNames(className)}>
      {conversations.map((conversation) => (
        <li
          className={classNames(
            "leading-7 flex cursor-pointer hover:bg-[--aside-item-hover-background-color] transition-colors duration-100 ease-in-out",
            params.id === conversation.id &&
              "bg-[--aside-item-active-background-color]"
          )}
          key={conversation.id}
        >
          {renameRecord.id === conversation.id ? (
            <div className="flex-auto min-w-0 py-2 px-6 flex">
              <input
                type="text"
                className="px-2 flex-auto min-w-0 bg-[--input-background-color] rounded outline-none outline-2 outline-offset-0 focus:outline-[--input-outline-color] transition-[outline] duration-200"
                value={renameRecord.name}
                onInput={(e) =>
                  setRenameRecord((p) => ({
                    ...p,
                    name: (e.target as HTMLInputElement).value,
                  }))
                }
                ref={renameInputRef}
              />
              <button
                className="flex-none px-1 ml-2 rounded bg-[--button-cancel-background-color] hover:bg-[--button-cancel-hover-background-color]"
                onClick={() =>
                  setRenameRecord({ id: undefined, name: undefined })
                }
              >
                <CancelIcon />
              </button>
              <button
                className="flex-none px-1 ml-1 rounded bg-[--button-confirm-background-color] hover:bg-[--button-confirm-hover-background-color]"
                onClick={() =>
                  handleRenameConversation(
                    renameRecord.id as string,
                    renameRecord.name as string
                  ).then(() =>
                    setRenameRecord({ id: undefined, name: undefined })
                  )
                }
              >
                <CheckIcon />
              </button>
            </div>
          ) : (
            <>
              <Link
                to={`/chat/${conversation.id}`}
                className="flex-auto min-w-0 py-2 px-6"
              >
                {conversation.title}
              </Link>
              <div
                className="p-2"
                onClick={(e) => handleShowMenu(conversation, e)}
              >
                <MoreIcon className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default memo(Conversations);
