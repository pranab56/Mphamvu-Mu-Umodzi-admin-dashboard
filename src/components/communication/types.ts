// src/components/communication/types.ts

export type Tab = "broadcast" | "direct-message";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  messages: Message[];
}
