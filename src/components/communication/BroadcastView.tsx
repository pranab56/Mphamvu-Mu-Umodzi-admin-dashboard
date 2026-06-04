"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendBroadcastMutation } from "@/features/broadcast/broadcastApi";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function BroadcastView() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendBroadcast, { isLoading }] = useSendBroadcastMutation();

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    try {
      await sendBroadcast({ 
        data: { title, message } 
      }).unwrap();
      
      toast.success("Broadcast message sent successfully");
      setTitle("");
      setMessage("");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to send broadcast message");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-medium text-[#1A1C21]">Broadcast Message</h2>
        <p className="text-[#64748B] text-base">Send announcements to all members instantly</p>
      </div>

      <Card className="border-none bg-white rounded-lg overflow-hidden shadow-sm">
        <CardContent className="p-8 md:p-10 bg-white space-y-6">
          <div className="space-y-3">
            <label className="text-lg font-medium text-[#1A1C21]">Message Title</label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title..."
              className="h-14 bg-[#F9FAFB] border-gray-100 rounded-lg text-lg focus:ring-2 focus:ring-[#8B2F0E]/10"
            />
          </div>

          <div className="space-y-3">
            <label className="text-lg font-medium text-[#1A1C21]">Message Content</label>
            <div className="relative">
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message for all members here..."
                className="w-full min-h-[250px] md:min-h-[320px] p-4 md:p-6 bg-[#F9FAFB] border-gray-100 rounded-lg focus:ring-2 focus:ring-[#8B2F0E]/10 resize-none text-[#1A1C21] placeholder:text-[#94A3B8] text-lg font-normal leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-12 h-14 rounded-xl text-lg font-bold shadow-lg shadow-[#8B2F0E]/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send to All Members"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
