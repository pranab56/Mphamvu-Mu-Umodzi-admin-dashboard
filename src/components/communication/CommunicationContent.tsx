"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BroadcastView } from "./BroadcastView";
import { DirectMessageView } from "./DirectMessageView";
import { Tab, Conversation, Message } from "./types";

// --- Dummy Data ---
const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "sarah", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: false },
      { id: "m2", senderId: "me", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: true },
      { id: "m3", senderId: "me", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: true },
      { id: "m4", senderId: "sarah", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: false },
      { id: "m5", senderId: "sarah", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: false },
      { id: "m7", senderId: "me", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: true },
      { id: "m8", senderId: "me", text: "Thank you for the session today! The meditation techniques really helped.", timestamp: "02:13 AM", isMe: true },
    ]
  },
  {
    id: "2",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
  {
    id: "3",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah3",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
  {
    id: "4",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah4",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
  {
    id: "5",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah5",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
  {
    id: "6",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah6",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
  {
    id: "7",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah7",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
  {
    id: "8",
    name: "Sarah Amilla",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah8",
    lastMessage: "Thank you for reaching out",
    timestamp: "2 hours ago",
    messages: []
  },
];

export default function CommunicationContent() {
  const [activeTab, setActiveTab] = useState<Tab>("broadcast");
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [selectedChatId, setSelectedChatId] = useState<string>(DUMMY_CONVERSATIONS[0].id);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const selectedChat = conversations.find(c => c.id === selectedChatId) || conversations[0];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: "me",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setConversations(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText,
          timestamp: "Just now"
        };
      }
      return chat;
    }));

    setMessageText("");
  };

  const handleToggleChat = (chat: Conversation) => {
    setSelectedChatId(chat.id);
    setMobileShowChat(true);
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header */}
      {!mobileShowChat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-medium tracking-tight text-[#1A1C21]">Communication</h1>
          <p className="text-[#64748B] text-base">Manage announcements and communicate seamlessly with members and admins in one place</p>
        </motion.div>
      )}

      {/* Tab Switcher */}
      {!mobileShowChat && (
        <div className="flex bg-[#E2E4E7] p-1.5 rounded-lg w-fit ">
          <button
            onClick={() => setActiveTab("broadcast")}
            className={cn(
              "px-6 md:px-10 py-2 md:py-2 rounded-sm text-base font-medium cursor-pointer",
              activeTab === "broadcast"
                ? "bg-[#8B2C02] text-white shadow-md transform scale-[1.02]"
                : "text-[#1A1C21] hover:bg-white/50"
            )}
          >
            Broadcast
          </button>
          <button
            onClick={() => setActiveTab("direct-message")}
            className={cn(
              "px-6 md:px-10 py-2 md:py-2 rounded-sm cursor-pointer text-base font-medium",
              activeTab === "direct-message"
                ? "bg-[#8B2C02] text-white shadow-md transform scale-[1.02]"
                : "text-[#1A1C21] hover:bg-white/50"
            )}
          >
            Direct Message
          </button>
        </div>
      )}


      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {activeTab === "broadcast" ? (
            <BroadcastView />
          ) : (
            <DirectMessageView
              conversations={conversations}
              selectedChat={selectedChat}
              onSelectChat={handleToggleChat}
              messageText={messageText}
              setMessageText={setMessageText}
              onSend={handleSendMessage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              mobileShowChat={mobileShowChat}
              setMobileShowChat={setMobileShowChat}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
