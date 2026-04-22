"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";

export function MemberDetailTabs() {
  const completedContributions = [1,2,3]; // Set to [] to see empty state
  const pendingContributions = []; // Set to [] to see empty state
  const outstandingDues = []; // Set to [] to see empty state

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden group">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" />

        <div className="flex items-center gap-8 relative z-10">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white duration-500">
            <Image
              src="/member_avatar.png"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-medium text-[#1A1C21]">John Banda</h2>
              <Badge className="bg-[#DCFCE7] text-[#22C55E] hover:bg-[#DCFCE7] border-none px-4 py-1.5 rounded-sm text-xs font-normal flex items-center gap-1.5">
                <CheckCircle2 className="w-2 h-2 text-green-500" /> Active
              </Badge>
            </div>
            <p className="text-lg text-gray-400 font-normal">john.banda@example.com</p>
          </div>
        </div>

        <div className="bg-[#E5D5C9]/30 rounded-xl flex items-center border border-gray-100 self-stretch xl:self-auto">
          <div className="px-8 py-4 flex items-center gap-6 border-r border-[#E5D5C9]/50">
            <span className="text-gray-500 font-normal text-lg whitespace-nowrap">Contributed Events</span>
            <span className="text-2xl font-normal text-[#8B2F0E]">{completedContributions.length}</span>
          </div>
          <div className="px-8 py-4 flex items-center gap-6">
            <span className="text-gray-500 font-normal text-lg whitespace-nowrap">Contributed Balance</span>
            <span className="text-2xl font-normal text-[#8B2F0E]">$ 1,234</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="completed" className="w-full mt-12 pb-24">
        <TabsList className="bg-transparent border-none p-0 h-auto gap-12 mb-8 flex-wrap">
          <TabsTrigger
            value="completed"
            className="data-[state=active]:border-b-3 data-[state=active]:border-primary rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-primary text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
          >
            Completed Contributions
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:border-b-3 data-[state=active]:border-[#8B2F0E] rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-[#8B2F0E] text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
          >
            Pending Contributions
          </TabsTrigger>
          <TabsTrigger
            value="total-dues"
            className="data-[state=active]:border-b-3 data-[state=active]:border-[#8B2F0E] rounded-none bg-transparent px-0 pb-2.5 pt-0 text-base font-normal data-[state=active]:text-[#8B2F0E] text-gray-400 !shadow-none !border-x-0 !border-t-0 cursor-pointer"
          >
            Total Dues (included penalty)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-6 outline-none">
          {completedContributions.length > 0 ? (
            completedContributions.map((i) => (
              <div key={i} className="bg-white/80 border border-gray-100 p-4 rounded-xl flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all duration-200">
                <div className="flex gap-6">
                  <div className="mt-1 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-normal text-gray-800">Chirwa Legal Support</h4>
                    <p className="text-base text-gray-500 font-normal">Legal Fees</p>
                    <p className="text-sm text-gray-400 mt-3 font-normal">Completed on Apr 1, 2026</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <span className="text-2xl font-normal text-gray-800 tracking-tighter">$ 50.00</span>
                  <span className="bg-[#DCFCE7] text-[#22C55E] px-4 py-1 rounded text-xs font-normal">Paid</span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              image="/images/notFound/success.png"
              title="No Completed Contributions"
              description="This user has not registered any payment. Nothing is completed at the moment."
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="outline-none">
          {pendingContributions.length > 0 ? (
            <div className="bg-white/80 border border-gray-100 p-4 rounded-xl flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="flex gap-6">
                <div className="mt-1 w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-normal text-gray-800">Chirwa Legal Support</h4>
                  <p className="text-base text-gray-500 font-normal">Legal Fees</p>
                  <p className="text-sm text-gray-400 mt-3 font-normal">Deadline Apr 28, 2026</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-4">
                <span className="text-2xl font-bold text-gray-800 tracking-tighter">$ 50.00</span>
                <span className="bg-[#FEF9C3] text-[#A16207] px-4 py-1 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm">Unpaid</span>
              </div>
            </div>
          ) : (
            <EmptyState 
              image="/images/notFound/warning.png"
              title="No Pending Contributions"
              description="This user has completed all required contributions. Nothing is pending at the moment."
            />
          )}
        </TabsContent>

        <TabsContent value="total-dues" className="outline-none">
          {outstandingDues.length > 0 ? (
            <div className="bg-white/80 border border-gray-100 p-4 rounded-xl space-y-10 group hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="flex gap-6">
                <div className="mt-1 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-normal text-gray-800 tracking-tight">Support for Banda Family</h4>
                  <p className="text-sm text-gray-400 mt-2 font-normal">Deadline Passed: April 10, 2026</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-dashed border-gray-200 pt-10">
                <div className="flex justify-between text-lg text-[#8B2F0E] font-normal opacity-80">
                  <span>Minimum contribution</span>
                  <span>$30.00</span>
                </div>
                <div className="flex justify-between text-lg text-[#8B2F0E] font-normal opacity-80">
                  <span>Penalty fee</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
                  <span className="text-xl font-normal text-gray-500">Total Due</span>
                  <span className="text-2xl font-normal text-[#8B2F0E] tracking-tighter drop-shadow-sm">$ 35.00</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState 
              image="/images/notFound/error.png"
              title="No Outstanding Dues"
              description="All dues have been cleared. The user has no remaining balance."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center  text-center animate-in fade-in zoom-in duration-500">
      <div className="relative w-64 h-64 mb-6">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-2xl font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mt-3 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}

