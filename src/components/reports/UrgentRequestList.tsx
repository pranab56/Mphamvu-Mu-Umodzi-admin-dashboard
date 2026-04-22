"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, FileText, Phone, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Request {
  id: number;
  title: string;
  description: string;
  category: string;
  createdOn: string;
  deadline: string;
  member: {
    name: string;
    role: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
  };
}

const requests: Request[] = [
  {
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
  },
  {
    id: 2,
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
  }
];

export function UrgentRequestList() {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-red-600 tracking-tight">Urgent Event Request List</h3>
        <button
          onClick={() => router.push("/reports/urgent-requests")}
          className="text-gray-400 cursor-pointer text-sm font-medium hover:text-[#8B2F0E] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-[#F3EBE5]/30 border border-[#F3EBE5] gap-4"
          >
            <div className="flex-1 space-y-1">
              <h4 className="text-base font-medium text-gray-900">{request.title}</h4>
              <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-1">
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
  );
}

export function UrgentRequestDrawer({ request, children }: { request: Request, children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px] p-0 bg-white border-l-0">
        <ScrollArea className="h-full px-8 py-10">
          <SheetHeader className="mb-10 p-0 text-left">
            <SheetTitle className="text-2xl font-medium text-gray-900 tracking-tight">Event Details</SheetTitle>
          </SheetHeader>

          <div className="space-y-10">
            {/* Event Info */}
            <section className="space-y-6">
              <h3 className="text-sm font-medium text-orange-800 tracking-wide uppercase">Event Details</h3>
              <div className="bg-[#F3EBE5]/40 rounded-2xl p-6 border border-[#F3EBE5]/50 space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-xl font-medium text-gray-900">{request.title}</h4>
                  <Badge className="bg-[#FFF7ED] text-[#9A3412] hover:bg-[#FFF7ED] shadow-none border-none px-3 py-1 rounded-sm text-xs font-normal">
                    {request.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-normal">
                  Our fellow member&apos;s family is going through a difficult time. We are coming together to provide support during this period of mourning.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Created on", value: request.createdOn },
                    { label: "Deadline", value: request.deadline }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/80 p-4 rounded-xl border border-white space-y-1.5 shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-normal">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {item.label}
                      </div>
                      <div className="text-sm font-medium text-gray-800">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[11px] text-gray-400 font-normal">Documents</div>
                  <div className="flex flex-wrap gap-2">
                    {["NID.pdf", "NID.pdf"].map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white cursor-pointer hover:bg-white transition-colors">
                        <FileText className="w-3.5 h-3.5 text-red-500 fill-red-50" />
                        <span className="text-xs text-gray-600 font-medium">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Member Info */}
            <section className="space-y-6">
              <h3 className="text-sm font-medium text-orange-800 tracking-wide uppercase">Member Details</h3>
              <div className="bg-neutral-50/50 rounded-2xl p-6 border border-neutral-100 flex items-start gap-5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                  <Image
                    src={request.member.avatar}
                    alt="Member"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-gray-900">{request.member.name}</span>
                      <span className="text-[10px] text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                        {request.member.role}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-normal">{request.member.email}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-normal">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {request.member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-normal">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {request.member.address}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Message Input */}
            <section className="bg-[#F3EBE5]/40 rounded-2xl p-6 border border-[#F3EBE5]/50 space-y-4">
              <div className="text-[11px] text-gray-400 font-normal">Support Message</div>
              <Textarea
                placeholder="Send message to the member about this urgent event..."
                className="min-h-[100px] bg-white border-white rounded-xl py-4 resize-none shadow-sm focus-visible:ring-primary/20"
              />
              <div className="flex justify-end">
                <Button className="bg-[#8B2F0E] hover:bg-[#70260B] text-white px-8 h-10 rounded-lg text-sm font-medium shadow-md transition-all active:scale-95">
                  Send
                </Button>
              </div>
            </section>

            <div className="text-center">
              <button className="text-gray-500 text-xs font-normal underline hover:text-[#8B2F0E]">
                Use these information to create a new EVENT
              </button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
