"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BroadcastView } from "./BroadcastView";
import { DirectMessageView } from "./DirectMessageView";
import { Tab, Conversation, Message } from "./types";
import { useGetChatQuery, useDeleteChatMutation } from "@/features/chat/chatApi";
import { useGetMessageQuery, useSendMessageMutation } from "@/features/message/messageApi";
import { useGetMyProfileQuery } from "@/features/profile/profileApi";
import { format } from "date-fns";

interface ChatParticipant {
  _id: string;
  name?: string;
  image?: string;
}

interface ChatData {
  _id: string;
  participants: ChatParticipant[];
  lastMessage?: { message?: string; type?: string };
  lastMessageAt?: string;
  unreadCount?: number;
}

interface MessageData {
  _id: string;
  sender?: { _id: string } | string;
  message?: string;
  images?: string[];
  createdAt?: string;
}

export default function CommunicationContent() {
  const [activeTab, setActiveTab] = useState<Tab>("broadcast");
  const { data: profileData } = useGetMyProfileQuery({});
  const userId = profileData?.data?._id;

  const { data: chatsData, isLoading: isChatsLoading, refetch: refetchChats } = useGetChatQuery(
    { userId },
    { skip: !userId, pollingInterval: 3000 }
  );

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const { data: messagesData } = useGetMessageQuery(
    { chatId: selectedChatId as string, userId },
    { skip: !selectedChatId || !userId, pollingInterval: 3000 }
  );

  // When new messages arrive, immediately sync the chat list too
  const prevMessageCountRef = useRef<number>(0);
  useEffect(() => {
    const count = messagesData?.data?.messages?.length ?? 0;
    if (prevMessageCountRef.current > 0 && count > prevMessageCountRef.current) {
      refetchChats();
    }
    prevMessageCountRef.current = count;
  }, [messagesData, refetchChats]);

  const [sendMessage] = useSendMessageMutation();
  const [deleteChat] = useDeleteChatMutation();

  // Map API chats to UI conversations, always sorted by latest activity
  const conversations: Conversation[] = useMemo(() => {
    if (!chatsData?.data?.chats) return [];

    const sorted = [...chatsData.data.chats].sort((a: ChatData, b: ChatData) => {
      if (!a.lastMessageAt && !b.lastMessageAt) return 0;
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });

    const mapped = sorted.map((chat: ChatData) => {
      const participants = chat.participants ?? [];
      const otherParticipant = participants[0];

      return {
        id: chat._id,
        name: otherParticipant?.name || "Unknown",
        avatar: otherParticipant?.image ? `http://10.10.7.39:5005${otherParticipant.image}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherParticipant?.name}`,
        lastMessage: chat.lastMessage?.message || (chat.lastMessage?.type === 'image' ? "Sent an image" : "No messages yet"),
        timestamp: chat.lastMessageAt ? format(new Date(chat.lastMessageAt), "hh:mm a") : "",
        unreadCount: chat._id === selectedChatId ? 0 : (chat.unreadCount ?? 0),
        messages: []
      };
    });

    if (!searchQuery) return mapped;

    return mapped.filter((chat: Conversation) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatsData, userId, searchQuery, selectedChatId]);

  // Set initial selected chat
  useEffect(() => {
    if (conversations.length > 0 && !selectedChatId) {
      setSelectedChatId(conversations[0].id);
    }
  }, [conversations, selectedChatId]);

  // Map selected chat messages
  const selectedChatMessages: Message[] = useMemo(() => {
    if (!messagesData?.data?.messages) return [];
    
    // API returns newest first, UI needs oldest first for bottom-to-top flow
    const reversedMessages = [...messagesData.data.messages].reverse();
    
    return reversedMessages.map((msg: MessageData) => ({
      id: msg._id,
      senderId: (typeof msg.sender === 'object' ? msg.sender?._id : msg.sender) || '',
      text: msg.message || "",
      image: msg.images?.[0] || undefined,
      timestamp: msg.createdAt ? format(new Date(msg.createdAt), "hh:mm a") : "",
      isMe: (typeof msg.sender === 'object' ? msg.sender?._id : msg.sender) === userId
    }));
  }, [messagesData, userId]);

  const selectedChat = useMemo(() => {
    const chat = conversations.find(c => c.id === selectedChatId);
    if (chat) {
      return { ...chat, messages: selectedChatMessages };
    }
    return null;
  }, [conversations, selectedChatId, selectedChatMessages]);

  const handleSendMessage = async (text: string = messageText, file?: File) => {
    if ((!text.trim() && !file) || !selectedChatId) return;

    try {
      const formData = new FormData();
      if (text.trim()) formData.append("message", text);
      if (file) {
        formData.append("images", file);
        formData.append("type", "image");
      } else {
        formData.append("type", "text");
      }

      await sendMessage({ data: formData, chatId: selectedChatId }).unwrap();
      if (!file) setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };



  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat({ chatId }).unwrap();
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleToggleChat = (chat: Conversation) => {
    setSelectedChatId(chat.id);
    setMobileShowChat(true);
  };

  if (isChatsLoading && activeTab === "direct-message") {
    return <div className="flex h-[400px] items-center justify-center">Loading chats...</div>;
  }

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
              selectedChat={selectedChat as Conversation}
              onSelectChatAction={handleToggleChat}
              messageText={messageText}
              setMessageTextAction={setMessageText}
              onSendAction={(file) => handleSendMessage(messageText, file)}
              onDeleteChatAction={handleDeleteChat}
              searchQuery={searchQuery}
              setSearchQueryAction={setSearchQuery}
              mobileShowChat={mobileShowChat}
              setMobileShowChatAction={setMobileShowChat}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
