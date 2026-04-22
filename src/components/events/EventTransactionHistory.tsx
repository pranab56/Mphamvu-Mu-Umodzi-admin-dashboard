"use client";

import { Search, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const transactions = Array(10).fill({
  id: "#2024-0234",
  memberName: "John Banda",
  memberId: "MMU-2024-0234",
  amount: "$ 30",
  date: "Apr 10, 2026",
  status: "Completed",
});

export function EventTransactionHistory() {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full">
        <Input
          placeholder="Search by member name, ID or event name..."
          className="h-14 pl-12 rounded-xl bg-neutral-100 border-none text-sm placeholder:text-gray-400 focus-visible:ring-0"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table Container */}
      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#E5D5C9]/40 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-normal text-sm">Tnx ID</th>
              <th className="px-6 py-4 font-normal text-sm">Member</th>
              <th className="px-6 py-4 font-normal text-sm">Amount</th>
              <th className="px-6 py-4 font-normal text-sm">Date</th>
              <th className="px-6 py-4 font-normal text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {transactions.map((tnx, index) => (
              <tr key={index} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-5 text-sm text-gray-500 font-normal">
                  {tnx.id}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-normal">{tnx.memberName}</span>
                    <span className="text-xs text-gray-400">{tnx.memberId}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-900 font-normal">
                  {tnx.amount}
                </td>
                <td className="px-6 py-5 text-sm text-gray-500 font-normal">
                  {tnx.date}
                </td>
                <td className="px-6 py-5">
                  <Badge className="bg-[#DCFCE7] text-[#219653] hover:bg-[#DCFCE7] border-none px-3 py-1 rounded-full gap-1.5 font-normal text-xs flex items-center w-fit shadow-none">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {tnx.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="bg-[#E5D5C9]/40 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-normal tracking-tight">
            Showing 1 - 10 of 50 histories
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-white/50 hover:bg-white text-gray-400">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button className="h-8 w-8 p-0 rounded-full bg-[#8B2F0E] text-white hover:bg-[#70260B] font-medium text-sm">
              1
            </Button>
            {[2, 3, "...", 10].map((page, i) => (
              <Button
                key={i}
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full text-gray-400 hover:bg-white/50 text-sm font-normal"
              >
                {page}
              </Button>
            ))}
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-white/50 hover:bg-white text-gray-400">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
