"use client";

import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UrgentRequestDrawer } from "@/components/reports/UrgentRequestList";

const requests = Array(7).fill({
  id: 1,
  title: "Support for Banda Family",
  description: "This fund is being raised to support funeral expenses and assist the family during this difficult time. Contributions will help cover burial costs...",
  category: "Member Funeral",
  createdOn: "April 1, 2026",
  deadline: "April 10, 2026",
  member: {
    name: "John Banda",
    role: "Member",
    email: "john.banda@email.com",
    phone: "+265 999 123 456",
    address: "Lilongwe, Malawi",
    avatar: "https://avatar.iran.liara.run/public/boy?username=John"
  }
});

export default function UrgentRequestsPage() {
  const router = useRouter();

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <button 
          onClick={() => router.back()}
          className="mt-1 p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors active:scale-95 text-gray-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight leading-none">Urgent Event Request List</h1>
          <p className="text-sm text-gray-500 mt-2 font-normal">12 items</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] p-8 space-y-8">
        {/* Search Bar */}
        <div className="relative w-full">
          <Input 
            placeholder="Search here..." 
            className="h-14 pl-12 rounded-xl bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request, i) => (
            <div 
              key={i} 
              className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-[#F3EBE5]/30 border border-[#F3EBE5] gap-4"
            >
              <div className="flex-1 space-y-1">
                <h4 className="text-base font-medium text-gray-900">{request.title}</h4>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                  {request.description}
                </p>
              </div>
              
              <UrgentRequestDrawer request={request}>
                <Button className="h-10 px-8 rounded-lg bg-[#8B2F0E] hover:bg-[#70260B] text-white font-medium text-sm transition-all active:scale-95 shrink-0">
                  view
                </Button>
              </UrgentRequestDrawer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
