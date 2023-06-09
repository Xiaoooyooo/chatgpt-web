import { useCallback, useState, useContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import Conversations from "@/components/Conversations";
import { Conversation } from "@/database";
import databaseContext from "@/contexts/database";
import conversationContext from "@/contexts/conversation";
import NewIcon from "@/assets/svg/plus.svg";
import SettingIcon from "@/assets/svg/setting.svg";

export default function Layout() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const db = useContext(databaseContext);
  useEffect(() => {
    db.table("conversations")
      .findAll<Conversation>({ orderBy: "createdAt", order: "desc" })
      .then((res) => {
        setConversations(res);
      });
  }, []);
  const handleNewConversation = useCallback((conversation: Conversation) => {
    setConversations((p) => [conversation, ...p]);
  }, []);
  const handleRenameConversation = useCallback(
    async (id: string, name: string) => {
      await db
        .table("conversations")
        .update({ where: IDBKeyRange.only(id), value: { title: name } });
      setConversations((p) =>
        p.map((_c) => {
          if (_c.id === id) return { ..._c, title: name };
          return _c;
        })
      );
    },
    []
  );
  const handleDeleteConversation = useCallback(
    async (conversation: Conversation) => {
      await db
        .table("conversations")
        .delete({ where: IDBKeyRange.only(conversation.id) });
      await db.table("messages").deleteAll({
        where: IDBKeyRange.only(conversation.id),
        key: "conversationId",
      });
      setConversations((p) => p.filter((_c) => _c.id !== conversation.id));
    },
    []
  );
  return (
    <>
      <Header />
      <div className="h-[calc(100vh_-_64px)] flex bg-[--background-color]">
        <Aside className="h-full flex-none flex flex-col overflow-x-hidden">
          <>
            <div className="shadow-light p-3">
              <button
                className="w-full p-2 border-2 rounded flex justify-center items-center gap-x-1"
                onClick={() => navigate("/chat")}
              >
                <NewIcon />
                NEW Conversation
              </button>
            </div>
            <Conversations
              conversations={conversations}
              className="flex-auto min-h-0 overflow-auto"
              onDeleteConversation={handleDeleteConversation}
              onRenameConversation={handleRenameConversation}
            />
            <div className="flex-none py-4 shadow-light">
              <Link
                className="flex-none text-center flex items-center justify-center gap-x-1"
                to="/settings"
              >
                <SettingIcon />
                Settings
              </Link>
            </div>
          </>
        </Aside>
        <div className="flex-auto h-full min-w-0">
          <conversationContext.Provider value={{ add: handleNewConversation }}>
            <Outlet />
          </conversationContext.Provider>
        </div>
      </div>
    </>
  );
}
