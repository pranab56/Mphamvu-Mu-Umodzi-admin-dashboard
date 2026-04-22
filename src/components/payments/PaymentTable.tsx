"use client";

import { Search, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const payments = [
  ...Array(7).fill({
    id: "#2024-02-034",
    memberName: "John Banda",
    memberId: "MMU-2024-0234",
    eventName: "Support for Banda Family",
    amount: "$ 50",
    date: "Apr 10, 2026",
    status: "Completed",
  }),
  {
    id: "#2024-02-034",
    memberName: "John Banda",
    memberId: "MMU-2024-0234",
    eventName: "Support for Banda Family",
    amount: "$ 30",
    date: "Apr 10, 2026",
    status: "Failed",
  },
  ...Array(2).fill({
    id: "#2024-02-034",
    memberName: "John Banda",
    memberId: "MMU-2024-0234",
    eventName: "Support for Banda Family",
    amount: "$ 50",
    date: "Apr 10, 2026",
    status: "Completed",
  }),
];

export function PaymentTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.01)] p-8">
      {/* Search Bar */}
      <div className="relative mb-8 w-full">
        <Input 
          placeholder="Search by member name, ID or event name..." 
          className="h-14 pl-12 rounded-sm bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#E5D5C9]/40 text-gray-500 font-normal text-sm">
            <tr>
              <th className="px-6 py-4 font-normal rounded-l-xl">Txn ID</th>
              <th className="px-6 py-4 font-normal">Member</th>
              <th className="px-6 py-4 font-normal">Event</th>
              <th className="px-6 py-4 font-normal">Amount</th>
              <th className="px-6 py-4 font-normal">Date</th>
              <th className="px-6 py-4 font-normal rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {payments.map((tnx, index) => (
              <tr key={index} className="group hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-6 text-sm text-gray-500 font-normal">
                  {tnx.id}
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-normal text-base">{tnx.memberName}</span>
                    <span className="text-xs text-gray-400 mt-1">{tnx.memberId}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-gray-500 text-sm font-normal">
                  {tnx.eventName}
                </td>
                <td className="px-6 py-6 font-normal text-gray-900 text-base">
                  {tnx.amount}
                </td>
                <td className="px-6 py-6 text-sm text-gray-400 font-normal">
                  {tnx.date}
                </td>
                <td className="px-6 py-6">
                  {tnx.status === "Completed" ? (
                    <Badge className="bg-[#DCFCE7] text-[#219653] hover:bg-[#DCFCE7] border-none px-4 py-1.5 rounded-full gap-1.5 font-normal text-xs flex items-center w-fit shadow-none">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEF2F2] border-none px-4 py-1.5 rounded-full gap-1.5 font-normal text-xs flex items-center w-fit shadow-none">
                      <XCircle className="w-3.5 h-3.5" />
                      Failed
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-[#E5D5C9]/40 mt-10 rounded-xl px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 font-normal">Showing 1 - 4 of 50 events</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-white">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </Button>
          <Button className="h-10 w-10 p-0 rounded-full bg-[#8B2F0E] text-white hover:bg-[#70260B] font-medium text-base">
            1
          </Button>
          {[2, 3, "...", 15].map((page, i) => (
            <Button 
                key={i} 
                variant="ghost" 
                className="h-10 w-10 p-0 rounded-full text-gray-400 hover:bg-white/50 text-base"
             >
              {page}
            </Button>
          ))}
          <Button variant="ghost" className="h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-white">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}
