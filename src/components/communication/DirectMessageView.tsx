"use client";

import React, { useRef, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Send,
  ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "./types";

interface DirectMessageViewProps {
  conversations: Conversation[];
  selectedChat: Conversation;
  onSelectChat: (chat: Conversation) => void;
  messageText: string;
  setMessageText: (text: string) => void;
  onSend: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  mobileShowChat: boolean;
  setMobileShowChat: (show: boolean) => void;
}

export function DirectMessageView({
  conversations,
  selectedChat,
  onSelectChat,
  messageText,
  setMessageText,
  onSend,
  searchQuery,
  setSearchQuery,
  mobileShowChat,
  setMobileShowChat
}: DirectMessageViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat?.messages, mobileShowChat]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-medium text-[#1A1C21]">Direct Message</h2>
        <p className="text-[#64748B] text-base">Communicate one-on-one with individual members</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px] max-h-[800px] overflow-hidden">
        {/* Sidebar - Conversations List */}

        <div className={cn(
          "lg:col-span-4 flex flex-col h-full min-h-0",
          mobileShowChat ? "hidden lg:flex" : "flex"
        )}>
          <Card className="flex-1 rounded-sm overflow-hidden flex flex-col bg-white p-0 min-h-0">
            <div className="p-6 pb-0 space-y-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-6 h-6 text-[#1A1C21]" />
                <h3 className="text-lg font-bold text-[#1A1C21]">Conversations</h3>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#8B2C02] transition-colors" />

                <Input
                  placeholder="Search conversations"
                  className="pl-12 border-2 border-gray-300 h-12 rounded-lg text-base placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>


            </div>

            <ScrollArea className="flex-1 p-6 min-h-0">
              <div className="space-y-3 pb-4">
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={cn(
                      "p-4 rounded-2xl cursor-pointer border border-gray-200 flex items-center gap-4 relative",
                      selectedChat?.id === chat.id
                        ? "bg-[#F3F4F6] shadow-sm "
                        : "bg-white hover:bg-[#F8F9FA] "
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className="bg-gray-100 text-[#1A1C21]">{chat.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-base text-[#1A1C21] truncate">{chat.name}</span>
                        {chat.unreadCount && (
                          <div className="bg-[#DC3545] text-white text-[11px] font-bold h-6 w-6 flex items-center justify-center rounded-full shadow-lg shadow-[#DC3545]/20">
                            {chat.unreadCount.toString().padStart(2, '0')}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className={cn(
                          "truncate max-w-[180px]",
                          chat.unreadCount ? "text-[#1A1C21] font-bold" : "text-[#64748B]"
                        )}>
                          {chat.lastMessage}
                        </p>
                        <span className="text-gray-400 text-xs shrink-0">{chat.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Chat Window */}
        <div className={cn(
          "lg:col-span-8 h-full flex flex-col min-h-0",
          mobileShowChat ? "flex" : "hidden lg:flex"
        )}>
          <Card className="flex-1 flex flex-col border-none rounded-sm overflow-hidden min-h-0 h-full p-0">
            {/* Chat Header */}
            <div className="h-[80px] px-4 md:px-8 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileShowChat(false)}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-[#F3F4F6]">
                  <AvatarImage src={selectedChat?.avatar} />
                  <AvatarFallback>{selectedChat?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1A1C21] text-base md:text-lg">{selectedChat?.name}</span>
                  <span className="text-[10px] md:text-[12px] text-[#2B9724] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#2B9724]" /> Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 relative overflow-hidden">
              <ScrollArea className="h-full w-full" viewportRef={scrollRef}>
                <div className="p-4 md:p-8 space-y-6 md:space-y-8 pb-4">
                  {selectedChat?.messages.length > 0 ? (
                    selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex flex-col max-w-[85%] md:max-w-[70%]",
                          message.isMe ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={cn(
                            "px-4 md:px-5 py-3 md:py-4 rounded-[18px] text-sm md:text-[15px] leading-[1.6] shadow-sm",
                            message.isMe
                              ? "bg-[#0084FF] text-white rounded-tr-none shadow-[#0084FF]/10"
                              : "bg-[#E2F0E0] text-[#1A1C21] rounded-tl-none shadow-black/5"
                          )}
                        >
                          {message.text}
                        </motion.div>
                        <span className="text-[10px] md:text-[11px] text-gray-400 mt-2 font-medium px-1">
                          {message.timestamp}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
                      <div className="p-6 bg-gray-50 rounded-full">
                        <MessageSquare className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-50 flex items-center gap-3 md:gap-4 shrink-0">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type here your message"
                  className="w-full bg-white border border-gray-200 h-12 rounded-sm px-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-gray-200"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSend()}
                />
              </div>
              <Button
                className="bg-[#0084FF] hover:bg-[#0073E6] text-white h-12 px-5 rounded-sm font-medium transition-all  active:scale-95 flex items-center gap-2"
                onClick={onSend}
              >
                <span className="hidden md:inline">Send</span>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
