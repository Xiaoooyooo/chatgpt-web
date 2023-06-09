import Database from "./db";

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
}
export type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system",
  content: string;
  createdAt: number;
}

const db = new Database("data");

db.defineTable("conversations", (database) => {
  const store = database.createObjectStore("conversations", { keyPath: "id" });
  store.createIndex("title", "title", { unique: false });
  store.createIndex("createdAt", "createdAt", { unique: false });
});

db.defineTable("messages", (database) => {
  const store = database.createObjectStore("messages", { keyPath: "id" });
  store.createIndex("conversationId", "conversationId", { unique: false });
  store.createIndex("content", "content", { unique: false });
  store.createIndex("createdAt", "createdAt", { unique: false });
});

export default db;
