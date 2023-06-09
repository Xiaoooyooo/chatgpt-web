import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputArea from "@/components/InputArea";
import databaseContext from "@/contexts/database";
import { Conversation, Message } from "@/database";
import Dialog from "@/components/Dialog";
import completionApi, { CompletionMessage } from "@/api/completion";
import settingContext from "@/contexts/setting";
import conversationContext from "@/contexts/conversation";

type CompletionData = {
  messages: CompletionMessage[];
};

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [completion, setCompletion] = useState({
    pending: false,
    createdAt: 0,
    content: "",
  });
  const errorRef = useRef<Error | null>(null);
  const completingContentRef = useRef("");
  const justCreatedRef = useRef(false);
  const { settings } = useContext(settingContext);
  const { add: addConversation } = useContext(conversationContext);
  const params = useParams();
  const currentChatRef = useRef<string>();
  const db = useContext(databaseContext);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async function (value: string) {
    __DEV__ && console.log(currentChatRef.current, value);
    if (currentChatRef.current) {
      const message: Message = {
        id: crypto.randomUUID(),
        conversationId: currentChatRef.current,
        role: "user",
        createdAt: Date.now(),
        content: value,
      };
      await db.table("messages").insert<Message>(message);
      setMessages((messages) => [...messages, message]);
      // handleComplete({ messages });
      handleComplete({ messages: [message] });
    } else {
      const conversationId = crypto.randomUUID();
      const conversation = {
        id: conversationId,
        createdAt: Date.now(),
        title: value.slice(0, 10),
      };
      await db.table("conversations").insert<Conversation>(conversation);
      addConversation(conversation);
      await db.table("messages").insert<Message>({
        id: crypto.randomUUID(),
        conversationId,
        role: "user",
        createdAt: Date.now(),
        content: value,
      });
      justCreatedRef.current = true;
      navigate(`/chat/${conversationId}`);
    }
  }, []);
  const handleComplete = useCallback((data: CompletionData) => {
    const now = Date.now();
    setCompletion({ pending: true, createdAt: now, content: "" });
    completingContentRef.current = "";
    completionApi({
      authKey: settings.openaiApiKey,
      model: settings.openaiModel,
      messages: data.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      onProgress: function (value) {
        // __DEV__ && console.log(value);
        const data = value.choices[0];
        if (data.finish_reason === null) {
          completingContentRef.current += data.delta.content || "";
          setCompletion((p) => ({
            ...p,
            content: p.content + (data.delta.content || ""),
          }));
        } else if (data.finish_reason === "stop") {
          const message: Message = {
            id: crypto.randomUUID(),
            conversationId: currentChatRef.current as string,
            role: "assistant",
            createdAt: now,
            content: completingContentRef.current,
          };
          completingContentRef.current = "";
          db.table("messages")
            .insert<Message>(message)
            .then(() => {
              setMessages((p) => [...p, message]);
              setCompletion((p) => ({ ...p, pending: false }));
            });
          // API returned complete model output
        } else if (data.finish_reason === "length") {
          // Incomplete model output due to max_tokens parameter or token limit
        } else if (data.finish_reason === "content_filter") {
          // Omitted content due to a flag from our content filters
        }
      },
    }).then(() => {
      __DEV__ && console.log("done");
    });
  }, []);
  useEffect(() => {
    if (params.id) {
      setLoading(true);
      errorRef.current = null;
      db.table("conversations")
        .findOne({ where: IDBKeyRange.only(params.id) })
        .then((conversation) => {
          if (!conversation)
            return Promise.reject(new Error("Conversation not found"));
          return conversation.id;
        })
        .then(() => {
          return db.table("messages").find({
            where: IDBKeyRange.only(params.id),
            key: "conversationId",
            offset: 0,
            orderBy: "createdAt",
            order: "asc",
          });
        })
        .then((messages) => {
          setMessages(messages);
          if (justCreatedRef.current) {
            handleComplete({ messages });
          }
        })
        .catch((err) => {
          errorRef.current = err;
        })
        .finally(() => {
          setLoading(false);
          justCreatedRef.current = false;
        });
    }
    currentChatRef.current = params.id;
    return () => {
      setMessages([]);
    };
  }, [params.id]);
  return (
    <div className="h-full flex flex-col">
      <div className="flex-auto min-h-0 overflow-auto">
        {params.id ? (
          messages.map((message) => <Dialog {...message} key={message.id} />)
        ) : (
          <div className="text-center mt-20">Start a conversation below</div>
        )}
        {errorRef.current && (
          <div className="text-center mt-20">{errorRef.current.message}</div>
        )}
        {completion.pending && (
          <Dialog
            role="assistant"
            content={completion.content}
            createdAt={completion.createdAt}
            pending={true}
          />
        )}
      </div>
      <InputArea
        className="flex-none px-8 py-4 shadow-light"
        placeholder="Ask a question..."
        onSubmit={handleSubmit}
        pending={completion.pending || loading || !!errorRef.current}
      />
    </div>
  );
}
