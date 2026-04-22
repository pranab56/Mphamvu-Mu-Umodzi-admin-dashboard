"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EventDetailsContent } from "./EventDetailsContent";
import { EventTransactionHistory } from "./EventTransactionHistory";

export function EventDetailsTabs() {
  return (
    <Tabs defaultValue="details" className="w-full bg-white p-6 rounded-xl">
      <TabsList className="bg-transparent h-auto p-0 border-b border-gray-200 lg:w-4/12 justify-start rounded-none mb-8 gap-12">
        <TabsTrigger
          value="details"
          className="data-[state=active]:border-b-3 data-[state=active]:border-primary rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-primary text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
        >
          Event Details
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="data-[state=active]:border-b-3 data-[state=active]:border-[#8B2F0E] rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-[#8B2F0E] text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
        >
          Transactions History
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mt-0 outline-none ring-0">
        <EventDetailsContent />
      </TabsContent>
      <TabsContent value="history" className="mt-0 outline-none ring-0">
        <EventTransactionHistory />
      </TabsContent>
    </Tabs>
  );
}
