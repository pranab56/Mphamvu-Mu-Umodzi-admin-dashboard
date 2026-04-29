"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BroadcastView() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div className="space-y-2">
        <h2 className="text-2xl font-medium text-[#1A1C21]">Broadcast Message</h2>
        <p className="text-[#64748B] text-base">Send announcements to all members instantly</p>
      </div>

      <Card className="border-none bg-white rounded-lg overflow-hidden">
        <CardContent className=" bg-white">
          <div className="flex flex-col gap-3">
            <label className="text-lg font-normal text-[#1A1C21]">Message Title</label>
            <div className="relative">
              <textarea 
                placeholder="Enter message for all members |"
                className="w-full min-h-[200px] md:min-h-[280px] p-4 md:p-6 bg-[#EFEFEF] border-none rounded-sm focus:ring-2 focus:ring-[#8B2C02]/20 resize-none text-[#1A1C21] placeholder:text-[#64748B] text-base font-normal leading-relaxed"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 md:px-10 py-2 md:py-6 rounded-sm text-base font-normal">
              Send to All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
