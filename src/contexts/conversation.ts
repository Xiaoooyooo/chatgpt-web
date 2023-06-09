import { Conversation } from "@/database";
import { createContext } from "react";

type ConversationContextOptions = {
  add: (conversation: Conversation) => void;
}

const conversationContext = createContext({} as ConversationContextOptions);

export default conversationContext;
